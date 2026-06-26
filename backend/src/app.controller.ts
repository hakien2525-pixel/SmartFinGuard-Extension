import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { GeminiService } from './gemini.service';
import * as fs from 'fs';
import * as path from 'path';

// Persistent Database for hackathon
const DB_FILE = path.join(process.cwd(), 'database.json');

const defaultData = [
  { id: 'DOC001', company: 'Công ty Cổ phần Alpha', time: '10:05', riskScore: 0.95, status: 'Phê duyệt', amount: '500,000,000 VND', taxCode: '0101234567', aiHeatmap: false, details: "Hệ thống AI đánh giá hình ảnh nguyên bản (độ tin cậy cao: 95%)." },
  { id: 'DOC002', company: 'Công ty TNHH Beta', time: '10:15', riskScore: 0.12, status: 'Cảnh báo', amount: '1,200,000,000 VND', taxCode: '0309876543', aiHeatmap: true, details: "Hệ thống AI phát hiện dấu hiệu bất thường (độ tin cậy thấp: 12%)." },
];

function getDatabase(): any[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (error) {
    console.error("Failed to read database", error);
    return [...defaultData];
  }
}

function saveDatabase(data: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to save database", error);
  }
}

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly geminiService: GeminiService
  ) {}

  @Get('documents')
  getAllDocuments() {
    const db = getDatabase();
    return {
      status: 'success',
      data: db.sort((a, b) => b.id.localeCompare(a.id)) // newest first
    };
  }

  @Post('documents/:id/action')
  updateDocumentStatus(@Body() body: { action: string }, @Param('id') id: string) {
    const db = getDatabase();
    const docIndex = db.findIndex(d => d.id === id);
    if (docIndex === -1) return { status: 'error', message: 'Document not found' };

    if (body.action === 'approve') db[docIndex].status = 'Đã duyệt';
    else if (body.action === 'block') db[docIndex].status = 'Đã chặn';
    else if (body.action === 'review') db[docIndex].status = 'Chờ xử lý';

    saveDatabase(db);
    return { status: 'success', data: db[docIndex] };
  }

  @Post('ekyc')
  mockEkyc(@Body() body: any) {
    return {
      status: 'success',
      message: 'VNPT eKYC: Face verified successfully',
      livenessScore: 0.98,
      matchScore: 0.99
    };
  }

  @Post('scan')
  async mockScanInvoice(@Body() body: any) {
    const docId = 'DOC-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    // 1. Send to AI Core (Python FastAPI)
    let aiResponse;
    try {
      // Calls the python service named 'ai-core' in docker-compose
      const response = await fetch('http://ai-core:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_id: docId, image_base64: body.image || "" })
      });
      aiResponse = await response.json();
    } catch (error) {
      console.error("AI Core is unreachable, falling back to mock logic.", error);
      // Fallback if AI core is not running (e.g. running backend outside docker)
      const trustScore = Math.random();
      aiResponse = {
        fraud_score: parseFloat(trustScore.toFixed(2)),
        is_fraud: trustScore < 0.5,
        heatmap_detected: trustScore < 0.5,
        analysis_details: trustScore < 0.5 ? `Hệ thống AI phát hiện dấu hiệu bất thường (độ tin cậy thấp: ${(trustScore*100).toFixed(0)}%).` : `Hệ thống AI đánh giá hình ảnh nguyên bản (độ tin cậy cao: ${(trustScore*100).toFixed(0)}%).`,
        ocr_tax_code: "Không tìm thấy",
        ocr_amount: "Không tìm thấy",
        ocr_invoice_type: "Khác"
      };
    }

    // 2. Call Groq AI for Deep Reasoning and Data Extraction
    let geminiResult;
    try {
        geminiResult = await this.geminiService.analyzeInvoice(body.image || "", aiResponse.raw_text || "");
    } catch (e) {
        console.warn("⚠️ Groq API Failed. Falling back to offline AI (Tesseract/Python). Error:", e.message);
        geminiResult = {
            invoice_name: aiResponse.ocr_invoice_type,
            tax_id: aiResponse.ocr_tax_code === "Không tìm thấy" ? null : aiResponse.ocr_tax_code,
            total_amount: aiResponse.ocr_amount,
            conclusion: aiResponse.analysis_details,
            trust_score: Math.round(aiResponse.fraud_score * 100)
        };
    }

    // Determine values based on Gemini
    const trustScore = geminiResult.trust_score / 100;
    let isFraud = trustScore < 0.5;
    let analysisDetails = geminiResult.conclusion;
    const requestTaxCode = geminiResult.tax_id;
    const amount = geminiResult.total_amount;

    // 3. Cross-check logic (Duplicate Tax Code)
    const db = getDatabase();
    const isDuplicate = db.some(doc => doc.taxCode === requestTaxCode && requestTaxCode !== "Không tìm thấy" && requestTaxCode !== "Lỗi kết nối OCR" && requestTaxCode !== "Lỗi kết nối AI");
    
    if (isDuplicate) {
      isFraud = true;
      analysisDetails = `${analysisDetails} | HỆ THỐNG ĐỐI CHIẾU CẢNH BÁO: Hóa đơn có mã số thuế trùng lặp (đã từng giải ngân).`;
    }

    // 4. Save to In-Memory DB
    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const newDoc = {
      id: docId,
      company: body.company || 'Doanh nghiệp ' + docId,
      time: formattedTime,
      riskScore: isDuplicate ? Math.min(trustScore, 0.2) : trustScore,
      status: isFraud ? 'Cảnh báo' : 'Phê duyệt',
      amount: amount,
      taxCode: requestTaxCode,
      invoiceName: geminiResult.invoice_name || aiResponse.ocr_invoice_type || "Khác",
      aiHeatmap: aiResponse.heatmap_detected,
      details: analysisDetails,
      imageUrl: body.image
    };
    
    db.push(newDoc);
    saveDatabase(db);

    return {
      status: 'success',
      data: newDoc
    };
  }
}
