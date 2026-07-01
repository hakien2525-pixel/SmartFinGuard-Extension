import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export interface TamperedBox {
  x_pct: number;
  y_pct: number;
  width_pct: number;
  height_pct: number;
  reason: string;
  intensity: number;
}

export interface ElaResult {
  isTampered: boolean;
  tamperedBoxes: TamperedBox[];
  maxIntensity: number;
  thresholdUsed: number;
  maskPngBuffer?: Buffer;
}

@Injectable()
export class ForensicService {
  private readonly CELL_SIZE = 20; // px mỗi ô lưới
  private readonly JPEG_QUALITY = 90;
  private readonly MIN_REGION_CELLS = 2; // số ô liền kề tối thiểu để tính là 1 vùng nghi vấn (giảm nhẹ để nhạy vừa đủ)

  /**
   * Tính MD5 hash của buffer file — dùng để phát hiện trùng lặp THẬT
   */
  computeFileHash(buffer: Buffer): string {
    return crypto.createHash('md5').update(buffer).digest('hex');
  }

  /**
   * Kiểm tra trùng lặp dựa trên hash thật
   */
  checkDuplicate(
    fileHash: string,
    existingRecords: Array<{ id: string; fileHash?: string }>,
  ): { isDuplicate: boolean; matchedId: string | null } {
    const match = existingRecords.find((r) => r.fileHash === fileHash);
    return {
      isDuplicate: !!match,
      matchedId: match ? match.id : null,
    };
  }

  /**
   * Đảm bảo tệp đầu vào ở dạng ảnh raster (PNG). Nếu là PDF thì render trang đầu.
   */
  private async ensureRasterImage(inputBuffer: Buffer, isPdf: boolean): Promise<string> {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forensic-'));
    if (!isPdf) {
      const imgPath = path.join(tmpDir, 'input.png');
      await sharp(inputBuffer).png().toFile(imgPath);
      return imgPath;
    }

    const pdfPath = path.join(tmpDir, 'input.pdf');
    fs.writeFileSync(pdfPath, inputBuffer);
    const outPrefix = path.join(tmpDir, 'rendered');
    try {
      await execFileAsync('pdftoppm', ['-r', '150', '-png', '-singlefile', pdfPath, outPrefix]);
    } catch (err) {
      throw new Error(
        'Không thể render PDF sang ảnh. poppler-utils lỗi: ' + (err as Error).message,
      );
    }
    return `${outPrefix}.png`;
  }

  /**
   * Thực hiện phân tích ELA (Error Level Analysis) chuẩn hóa thang độ xám (grayscale)
   * và tính toán ngưỡng động dựa trên Median * 2.5.
   * Tạo tệp Mask PNG lưu vào MinIO để đối chứng.
   */
  async runELA(fileBuffer: Buffer, isPdf: boolean): Promise<ElaResult> {
    const imagePath = await this.ensureRasterImage(fileBuffer, isPdf);

    try {
      const meta = await sharp(imagePath).metadata();
      const width = meta.width!;
      const height = meta.height!;

      // 1. CHUẨN HÓA THÀNH GRAYSCALE
      const originalRaw = await sharp(imagePath).grayscale().raw().toBuffer({ resolveWithObject: true });
      
      // Nén ảnh lại ở mức chất lượng cố định 90% chất lượng JPEG
      const resavedBuffer = await sharp(imagePath).grayscale().jpeg({ quality: this.JPEG_QUALITY }).toBuffer();
      const resavedRaw = await sharp(resavedBuffer).raw().toBuffer({ resolveWithObject: true });

      const orig = originalRaw.data;
      const res = resavedRaw.data;

      // 2. TÍNH ĐỘ SAI LỆCH PIXEL TRỰC TIẾP (Absolute Difference)
      const pixelDiff = new Uint8Array(width * height);
      for (let i = 0; i < width * height; i++) {
        pixelDiff[i] = Math.abs(orig[i] - res[i]);
      }

      // 3. TÍNH NGƯỠNG ĐỘNG (Dynamic Threshold) = Median * 2.5
      const sortedDiffs = [...pixelDiff].sort((a, b) => a - b);
      const median = sortedDiffs[Math.floor(sortedDiffs.length / 2)] || 1;
      const threshold = Math.max(median * 2.5, 6); // Đặt ngưỡng tối thiểu là 6 để tránh nhiễu do nén tự nhiên

      // 4. KHỞI TẠO MẶT NẠ MASK (Điểm nghi vấn = 255, Nền = 0)
      const maskBuffer = Buffer.alloc(width * height);
      for (let i = 0; i < width * height; i++) {
        maskBuffer[i] = pixelDiff[i] > threshold ? 255 : 0;
      }

      // Xuất mask sang PNG buffer
      const maskPngBuffer = await sharp(maskBuffer, {
        raw: { width, height, channels: 1 }
      }).png().toBuffer();

      // 5. PHÂN TÍCH THEO CÁC Ô LƯỚI & PHÂN CỤM ĐỂ TẠO BOUNDING BOXES THẬT
      const cols = Math.ceil(width / this.CELL_SIZE);
      const rows = Math.ceil(height / this.CELL_SIZE);
      const cellScores = new Float32Array(cols * rows);

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          let whiteCount = 0;
          let totalCount = 0;
          const startY = cy * this.CELL_SIZE;
          const endY = Math.min(startY + this.CELL_SIZE, height);
          const startX = cx * this.CELL_SIZE;
          const endX = Math.min(startX + this.CELL_SIZE, width);

          for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
              const idx = y * width + x;
              if (maskBuffer[idx] === 255) {
                whiteCount++;
              }
              totalCount++;
            }
          }
          cellScores[cy * cols + cx] = totalCount > 0 ? whiteCount / totalCount : 0;
        }
      }

      // Flood-fill gom cụm các ô có tỷ lệ sai lệch > 15%
      const visited = new Uint8Array(cols * rows);
      const tamperedBoxes: TamperedBox[] = [];

      const flood = (startIdx: number): number[] => {
        const stack = [startIdx];
        const cluster: number[] = [];
        while (stack.length) {
          const idx = stack.pop()!;
          if (visited[idx]) continue;
          visited[idx] = 1;
          if (cellScores[idx] < 0.15) continue;
          cluster.push(idx);

          const cx = idx % cols;
          const cy = Math.floor(idx / cols);
          const neighbors = [
            [cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]
          ];
          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
              const nIdx = ny * cols + nx;
              if (!visited[nIdx] && cellScores[nIdx] >= 0.15) {
                stack.push(nIdx);
              }
            }
          }
        }
        return cluster;
      };

      for (let i = 0; i < cellScores.length; i++) {
        if (visited[i] || cellScores[i] < 0.15) continue;
        const cluster = flood(i);
        if (cluster.length < this.MIN_REGION_CELLS) continue;

        const xs = cluster.map(c => c % cols);
        const ys = cluster.map(c => Math.floor(c / cols));
        const minX = Math.min(...xs) * this.CELL_SIZE;
        const maxX = (Math.max(...xs) + 1) * this.CELL_SIZE;
        const minY = Math.min(...ys) * this.CELL_SIZE;
        const maxY = (Math.max(...ys) + 1) * this.CELL_SIZE;

        const avgScore = cluster.reduce((sum, c) => sum + cellScores[c], 0) / cluster.length;

        tamperedBoxes.push({
          x_pct: (minX / width) * 100,
          y_pct: (minY / height) * 100,
          width_pct: ((maxX - minX) / width) * 100,
          height_pct: ((maxY - minY) / height) * 100,
          reason: `Phát hiện mật độ pixel nén ELA sai lệch đạt ${Math.round(avgScore * 100)}% (Ngưỡng động: ${threshold.toFixed(1)}).`,
          intensity: Math.round(avgScore * 100)
        });
      }

      tamperedBoxes.sort((a, b) => b.intensity - a.intensity);
      // Giới hạn tối đa 6 vùng đáng ngờ nhất
      const topBoxes = tamperedBoxes.slice(0, 6);
      const maxIntensity = topBoxes.length ? topBoxes[0].intensity : 0;

      return {
        isTampered: topBoxes.length > 0,
        tamperedBoxes: topBoxes,
        maxIntensity,
        thresholdUsed: threshold,
        maskPngBuffer
      };
    } finally {
      // Dọn file tạm
      try {
        fs.rmSync(path.dirname(imagePath), { recursive: true, force: true });
      } catch {
        /* ignore cleanup errors */
      }
    }
  }

  async checkPdfStructure(pdfBuffer: Buffer): Promise<{ applicable: boolean; suspicious: boolean; note: string }> {
    return {
      applicable: false,
      suspicious: false,
      note: 'Kiểm tra cấu trúc PDF chưa được kích hoạt — chỉ dùng kết quả ELA.',
    };
  }
}
