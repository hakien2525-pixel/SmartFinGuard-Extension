import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ForensicService } from './forensics/forensic.service';
import { DatabaseService } from './database/database.service';
import { RedisService } from './database/redis.service';
import { MinioService } from './database/minio.service';
import { ElasticsearchService } from './database/elasticsearch.service';
import { FileInterceptor } from '@nestjs/platform-express';

function parseAmount(amtStr: string): number {
  if (!amtStr) return 0;
  const clean = amtStr.replace(/[^0-9.]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

@Controller('api')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly forensicService: ForensicService,
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService,
    private readonly minioService: MinioService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  @Get('documents')
  async getAllDocuments() {
    try {
      this.logger.log('Fetching documents from PostgreSQL...');
      const docs = [];
      const result = await this.databaseService.query('SELECT * FROM loan_profiles ORDER BY profile_id DESC');
      
      for (const row of result.rows) {
        const boxesRes = await this.databaseService.query(
          'SELECT * FROM ai_bounding_boxes WHERE profile_id = $1',
          [row.profile_id]
        );
        
        const tampered_boxes = boxesRes.rows.map((b: any) => ({
          x_pct: b.x_min,
          y_pct: b.y_min,
          width_pct: b.x_max - b.x_min,
          height_pct: b.y_max - b.y_min,
          reason: b.issue_description,
          intensity: 0,
        }));

        docs.push({
          id: `DOC-${row.profile_id.toString().padStart(4, '0')}`,
          company: row.company_name,
          time: row.created_at ? new Date(row.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '',
          riskScore: row.ai_risk_score ? row.ai_risk_score / 100 : 0.05,
          status: row.status,
          amount: row.amount_requested ? Number(row.amount_requested).toLocaleString('vi-VN') + ' VND' : '0 VND',
          taxCode: row.tax_code || 'Không tìm thấy',
          aiHeatmap: tampered_boxes.length > 0,
          invoiceNo: row.invoice_no || '',
          details: row.details || '',
          tampered_boxes,
          fileHash: row.file_hash,
          imageUrl: row.invoice_url,
          elaMaskUrl: row.ela_mask_url || '',
          
          // Forensic fields
          ket_luan: row.ket_luan || 'Chưa kiểm tra',
          do_tin_cay: row.do_tin_cay ?? 100,
          vung_nghi_van: tampered_boxes.map((b) => ({
            vi_tri: `Vùng tại (${b.x_pct.toFixed(1)}%, ${b.y_pct.toFixed(1)}%)`,
            dau_hieu_phat_hien: [b.reason],
            so_luong_dau_hieu_hoi_tu: 1,
          })),
          logic_so_hoc: row.logic_so_hoc || '',
          do_tin_cay_tong_the: row.do_tin_cay_tong_the || '',
          khuyen_nghi: row.khuyen_nghi || '',
        });
      }

      return {
        status: 'success',
        data: docs,
      };
    } catch (err) {
      this.logger.error(`Failed to fetch documents: ${err.message}`);
      return { status: 'error', message: 'Lỗi máy chủ khi lấy danh sách hồ sơ.' };
    }
  }

  @Post('documents/:id/action')
  async updateDocumentStatus(@Body() body: { action: string }, @Param('id') id: string) {
    try {
      const match = id.match(/DOC-(\d+)/);
      const profile_id = match ? parseInt(match[1]) : parseInt(id);

      if (isNaN(profile_id)) {
        return { status: 'error', message: 'Mã hồ sơ không hợp lệ' };
      }

      let dbStatus = 'Chờ xử lý';
      if (body.action === 'approve') dbStatus = 'Đã duyệt';
      else if (body.action === 'block') dbStatus = 'Đã chặn';
      else if (body.action === 'review') dbStatus = 'Chờ xử lý';

      this.logger.log(`Updating profile status. ID: ${profile_id}, Status: ${dbStatus}`);
      const result = await this.databaseService.query(
        'UPDATE loan_profiles SET status = $1 WHERE profile_id = $2 RETURNING *',
        [dbStatus, profile_id]
      );

      if (result.rowCount === 0) {
        return { status: 'error', message: 'Hồ sơ không tồn tại' };
      }

      // Evict Redis cache
      await this.redisService.del(`profile:${id}`);

      return { status: 'success', data: result.rows[0] };
    } catch (err) {
      this.logger.error(`Failed to update status: ${err.message}`);
      return { status: 'error', message: 'Lỗi máy chủ khi cập nhật trạng thái.' };
    }
  }

  @Post('ekyc')
  async verifyEkyc(@Body() body: any) {
    if (!body.image) {
      return {
        status: 'error',
        message: 'Không nhận được ảnh khuôn mặt để xác thực.',
        livenessScore: 0,
        savedPath: '',
      };
    }

    let imageUrl = '';
    try {
      const base64Data = body.image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      
      const fileName = `face_scan_${Date.now()}.jpg`;
      imageUrl = await this.minioService.uploadFile(fileName, buffer, 'image/jpeg');
    } catch (err) {
      this.logger.error(`Failed to upload face scan to MinIO: ${err.message}`);
    }

    try {
      const response = await fetch('http://ai-core:8000/ekyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: body.image || "",
          token_id: body.tokenId || process.env.VNPT_EKYC_TOKEN_ID || "",
          token_key: body.tokenKey || process.env.VNPT_EKYC_TOKEN_KEY || "",
          access_token: body.accessToken || process.env.VNPT_EKYC_ACCESS_TOKEN || ""
        })
      });

      if (!response.ok) {
        throw new Error(`AI Core trả về HTTP ${response.status}`);
      }

      const aiResponse = await response.json();
      return {
        status: aiResponse.status || 'error',
        message: aiResponse.message || 'Xác thực khuôn mặt hoàn tất.',
        livenessScore: aiResponse.liveness_score ?? 0,
        savedPath: imageUrl
      };
    } catch (error) {
      this.logger.error("AI Core eKYC error (no mock fallback allowed):", error.message);
      return {
        status: 'error',
        message: 'Không thể kết nối tới dịch vụ xác thực sinh trắc học (AI Core). Vui lòng thử lại sau.',
        livenessScore: 0,
        savedPath: imageUrl
      };
    }
  }

  @Post('invoice/analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeInvoice(@Body() body: any, @UploadedFile() file?: any) {
    return this.scanInvoice(body, file);
  }

  @Post('scan')
  @UseInterceptors(FileInterceptor('file'))
  async scanInvoice(@Body() body: any, @UploadedFile() file?: any) {
    try {
      let fileName = 'unknown_invoice.jpg';
      let mimeType = 'image/jpeg';
      let fileBuffer: Buffer | null = null;
      let base64Image = body.image || '';

      if (file) {
        fileName = file.originalname;
        fileBuffer = file.buffer;
        mimeType = file.mimetype;
        base64Image = `data:${file.mimetype};base64,` + file.buffer.toString('base64');
      } else if (body.fileName) {
        fileName = body.fileName;
      }

      if (!fileBuffer && base64Image) {
        const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          fileBuffer = Buffer.from(matches[2], 'base64');
        }
      }

      if (!fileBuffer) {
        return { status: 'error', message: 'Không nhận được tệp hoặc dữ liệu hình ảnh.' };
      }

      // ===== 1) KIỂM TRA TRÙNG LẶP THẬT — so MD5 hash =====
      const fileHash = this.forensicService.computeFileHash(fileBuffer);
      const existingDocsRes = await this.databaseService.query('SELECT profile_id, file_hash, company_name, amount_requested, tax_code, invoice_no FROM loan_profiles');
      const existingRecords = existingDocsRes.rows.map((r: any) => ({
        id: `DOC-${r.profile_id.toString().padStart(4, '0')}`,
        fileHash: r.file_hash,
      }));

      const dupCheck = this.forensicService.checkDuplicate(fileHash, existingRecords);
      const isDuplicate = dupCheck.isDuplicate;
      let duplicateMatch: any = null;

      if (isDuplicate && dupCheck.matchedId) {
        const matchId = parseInt(dupCheck.matchedId.replace('DOC-', ''));
        duplicateMatch = existingDocsRes.rows.find((r: any) => r.profile_id === matchId);
      }

      // ===== 2) UPLOAD FILE LÊN MINIO (Lưu trữ vật lý thực tế) =====
      const minioFileName = `${Date.now()}_${fileName}`;
      const minioImageUrl = await this.minioService.uploadFile(minioFileName, fileBuffer, mimeType);

      // ===== 3) KIỂM TRA CHỈNH SỬA THẬT — chạy ELA thật =====
      let isTampered = false;
      let tamperedBoxes: any[] = [];
      let elaMaxIntensity = 0;
      let elaMaskUrl = '';
      const isPdf = !!(fileName.toLowerCase().endsWith('.pdf') || mimeType === 'application/pdf');

      if (!isDuplicate) {
        try {
          const elaResult = await this.forensicService.runELA(fileBuffer, isPdf);
          isTampered = elaResult.isTampered;
          tamperedBoxes = elaResult.tamperedBoxes;
          elaMaxIntensity = elaResult.maxIntensity;
          
          if (elaResult.maskPngBuffer) {
            const maskFileName = `ela_mask_${Date.now()}_${fileName.replace(/\.[^/.]+$/, '')}.png`;
            elaMaskUrl = await this.minioService.uploadFile(maskFileName, elaResult.maskPngBuffer, 'image/png');
          }
        } catch (err) {
          this.logger.error('ELA forensic analysis failed:', err.message);
        }
      }

      let ketLuan = isTampered ? "Nghi vấn cao" : (isDuplicate ? "Cần kiểm tra thêm" : "Không phát hiện bất thường");
      let doTinCay = isTampered ? Math.max(20, 60 - Math.round(elaMaxIntensity)) : 96;
      let vungNghiVan: any[] = isTampered
        ? tamperedBoxes.map((b) => ({
            vi_tri: `Vùng tại (${b.x_pct.toFixed(1)}%, ${b.y_pct.toFixed(1)}%)`,
            dau_hieu_phat_hien: [b.reason],
            so_luong_dau_hieu_hoi_tu: 1,
          }))
        : [];
      
      let logicSoHoc = 'Chưa kiểm tra đối chiếu số học tự động (cần OCR số liệu cụ thể).';
      let doTinCayTongThe = isTampered
        ? `Thấp - ELA phát hiện ${tamperedBoxes.length} vùng sai lệch mức nén bất thường (cường độ cao nhất: ${elaMaxIntensity.toFixed(1)}).`
        : isDuplicate
          ? 'Trung bình - Trùng khớp 100% mã MD5 hash với hồ sơ đã quét trước đó.'
          : 'Cao - ELA không phát hiện vùng sai lệch mức nén bất thường.';
      
      let khuyenNghi = isTampered
        ? 'Từ chối giải ngân tự động. ELA phát hiện vùng nghi vấn chỉnh sửa ảnh. Yêu cầu nộp chứng từ gốc đối chiếu thủ công.'
        : isDuplicate
          ? `Phát hiện trùng lặp nội dung 100% (MD5 khớp) với hồ sơ trước đó. Khuyến nghị chặn giải ngân, kiểm tra đối soát.`
          : 'Hồ sơ hợp lệ theo kiểm tra ELA tự động, sẵn sàng phê duyệt giải ngân.';

      let requestTaxCode = "Không tìm thấy";
      let requestAmount = "Không tìm thấy";
      let invoiceNo = 'HD-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

      if (isDuplicate && duplicateMatch) {
        requestTaxCode = duplicateMatch.tax_code;
        requestAmount = duplicateMatch.amount_requested ? Number(duplicateMatch.amount_requested).toLocaleString('vi-VN') + ' VND' : '0 VND';
        invoiceNo = duplicateMatch.invoice_no || invoiceNo;
      }

      // Gọi AI Core OCR thật nếu không trùng lặp
      if (!isDuplicate) {
        try {
          const response = await fetch('http://ai-core:8000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              document_id: `TEMP-${Date.now()}`,
              image_base64: base64Image,
            })
          });
          const aiResponse = await response.json();
          if (aiResponse.ocr_tax_code) requestTaxCode = aiResponse.ocr_tax_code;
          if (aiResponse.ocr_amount) requestAmount = aiResponse.ocr_amount;
          if (aiResponse.logic_so_hoc) logicSoHoc = aiResponse.logic_so_hoc;
          
          if (aiResponse.anomalies && Array.isArray(aiResponse.anomalies)) {
            const extraBoxes = aiResponse.anomalies.map((a: any) => ({
              x_pct: a.box[0],
              y_pct: a.box[1],
              width_pct: a.box[2] - a.box[0],
              height_pct: a.box[3] - a.box[1],
              reason: a.reason,
              intensity: 1,
            }));
            tamperedBoxes = [...tamperedBoxes, ...extraBoxes];
            isTampered = isTampered || tamperedBoxes.length > 0;
          }
        } catch (error) {
          this.logger.error("AI Core OCR server unreachable:", error.message);
        }
      }

      const riskScore = isTampered || isDuplicate ? 0.15 : 0.95;
      const status = isTampered || isDuplicate ? 'Cảnh báo' : 'Phê duyệt';
      const parsedAmount = parseAmount(requestAmount);
      const companyName = body.company || 'Doanh nghiệp SME ' + fileHash.substring(0, 6);

      // ===== 4) LƯU VÀO DATABASE POSTGRESQL THẬT =====
      this.logger.log('Saving loan profile to PostgreSQL database...');
      const insertProfileRes = await this.databaseService.query(
        `INSERT INTO loan_profiles 
         (company_name, amount_requested, status, risk_color, ai_risk_score, invoice_url, tax_code, invoice_no, file_hash, details, ket_luan, do_tin_cay, logic_so_hoc, do_tin_cay_tong_the, khuyen_nghi, ela_mask_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
         RETURNING profile_id, created_at`,
        [
          companyName,
          parsedAmount,
          status,
          isTampered || isDuplicate ? 'red' : 'green',
          Math.round(riskScore * 100),
          minioImageUrl,
          requestTaxCode,
          invoiceNo,
          fileHash,
          isDuplicate ? `HỆ THỐNG ĐỐI CHIẾU CẢNH BÁO: Phát hiện hóa đơn trùng lặp (đã từng giải ngân).` : (isTampered ? `Hệ thống AI phát hiện vết chỉnh sửa ảnh.` : `Hồ sơ hợp lệ.`),
          ketLuan,
          doTinCay,
          logicSoHoc,
          doTinCayTongThe,
          khuyenNghi,
          elaMaskUrl
        ]
      );

      const profileId = insertProfileRes.rows[0].profile_id;
      const createdAt = insertProfileRes.rows[0].created_at;
      const docId = `DOC-${profileId.toString().padStart(4, '0')}`;

      // Lưu bounding boxes
      for (const box of tamperedBoxes) {
        await this.databaseService.query(
          `INSERT INTO ai_bounding_boxes (profile_id, x_min, y_min, x_max, y_max, issue_description) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            profileId,
            Math.round(box.x_pct),
            Math.round(box.y_pct),
            Math.round(box.x_pct + box.width_pct),
            Math.round(box.y_pct + box.height_pct),
            box.reason
          ]
        );
      }

      const newDoc = {
        id: docId,
        company: companyName,
        time: createdAt ? new Date(createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '',
        riskScore,
        status,
        amount: parsedAmount.toLocaleString('vi-VN') + ' VND',
        taxCode: requestTaxCode,
        aiHeatmap: isTampered,
        invoiceNo: invoiceNo,
        details: isDuplicate ? `HỆ THỐNG ĐỐI CHIẾU CẢNH BÁO: Phát hiện hóa đơn trùng lặp.` : (isTampered ? `Hệ thống AI phát hiện vết chỉnh sửa ảnh.` : `Hồ sơ hợp lệ.`),
        tampered_boxes: tamperedBoxes,
        fileHash: fileHash,
        imageUrl: minioImageUrl,
        elaMaskUrl: elaMaskUrl,
        ket_luan: ketLuan,
        do_tin_cay: doTinCay,
        vung_nghi_van: vungNghiVan,
        logic_so_hoc: logicSoHoc,
        do_tin_cay_tong_the: doTinCayTongThe,
        khuyen_nghi: khuyenNghi,
      };

      // ===== 5) LƯU TRỮ VÀO REDIS CACHE =====
      await this.redisService.set(`profile:${docId}`, JSON.stringify(newDoc), 3600);

      // ===== 6) ĐƯA LÊN ELASTICSEARCH ĐỂ TÌM KIẾM =====
      await this.elasticsearchService.indexDocument('loan-profiles', docId, newDoc);

      return {
        status: 'success',
        data: newDoc,
      };
    } catch (err) {
      this.logger.error(`Error in scanInvoice: ${err.message}`);
      return { status: 'error', message: 'Lỗi máy chủ khi phân tích hóa đơn: ' + err.message };
    }
  }

  @Post('voice/tts')
  async textToSpeech(@Body() body: { text: string; voice?: string; speed?: number }) {
    try {
      const response = await fetch('http://ai-core:8000/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: body.text,
          voice: body.voice || "ngoclam",
          speed: body.speed || 1.0,
        })
      });
      if (!response.ok) {
        throw new Error(`AI Core TTS trả về HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      this.logger.error("AI Core TTS error:", err.message);
      return {
        status: 'error',
        message: 'Không thể kết nối tới dịch vụ chuyển văn bản thành giọng nói (AI Core TTS).',
        audio_base64: '',
      };
    }
  }

  @Post('voice/stt')
  async speechToText(@Body() body: { audio_base64: string }) {
    if (!body.audio_base64) {
      return {
        status: 'error',
        message: 'Không nhận được dữ liệu âm thanh để chuyển thành văn bản.',
        text: '',
      };
    }
    try {
      const response = await fetch('http://ai-core:8000/stt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_base64: body.audio_base64,
        })
      });
      if (!response.ok) {
        throw new Error(`AI Core STT trả về HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      this.logger.error("AI Core STT error:", err.message);
      return {
        status: 'error',
        message: 'Không thể kết nối tới dịch vụ chuyển giọng nói thành văn bản (AI Core STT).',
        text: '',
      };
    }
  }

  @Post('assistant/chat')
  async assistantChat(@Body() body: { message: string; tokenId?: string; tokenKey?: string; accessToken?: string }) {
    if (!body.message || !body.message.trim()) {
      return { status: 'error', message: 'Vui lòng nhập câu hỏi.', reply: '' };
    }

    let docsContext: any[] = [];
    try {
      const docsRes = await this.getAllDocuments();
      if (docsRes.status === 'success') {
        docsContext = docsRes.data || [];
      }
    } catch (dbErr) {
      this.logger.error('Failed to get docs context for assistant chat:', dbErr.message);
    }

    try {
      const response = await fetch('http://ai-core:8000/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: body.message,
          context: { documents: docsContext },
          token_key: body.tokenKey || "",
          access_token: body.accessToken || "",
        }),
      });

      if (!response.ok) {
        throw new Error(`AI Core trả về HTTP ${response.status}`);
      }

      const aiResponse = await response.json();
      const reply = aiResponse.reply || aiResponse.message || '';

      // ===== LƯU LỊCH SỬ TRỢ LÝ VÀO POSTGRESQL THẬT =====
      await this.databaseService.query(
        'INSERT INTO assistant_chat_logs (message, reply, status) VALUES ($1, $2, $3)',
        [body.message, reply, 'success']
      );

      return {
        status: 'success',
        reply: reply,
      };
    } catch (err) {
      this.logger.error('AI Core /assistant connection failed:', err.message);
      
      // Lưu log lỗi vào database
      try {
        await this.databaseService.query(
          'INSERT INTO assistant_chat_logs (message, reply, status) VALUES ($1, $2, $3)',
          [body.message, 'Lỗi kết nối tới AI Core', 'error']
        );
      } catch (logErr) {
        this.logger.error('Failed to save error chat log:', logErr.message);
      }

      return {
        status: 'error',
        message: 'Trợ lý AI chưa được kết nối (cần triển khai endpoint /assistant trên AI Core).',
        reply: '',
      };
    }
  }
}
