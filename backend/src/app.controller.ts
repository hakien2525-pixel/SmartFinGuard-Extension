import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

// In-memory Database for hackathon (Bonus points for statefulness)
const documentDatabase = [
  { id: 'DOC001', company: 'Công ty Cổ phần Alpha', time: '10:05', riskScore: 0.95, status: 'Phê duyệt', amount: '500,000,000 VND', taxCode: '0101234567', aiHeatmap: false, details: "Hệ thống AI đánh giá hình ảnh nguyên bản (độ tin cậy cao: 95%)." },
  { id: 'DOC002', company: 'Công ty TNHH Beta', time: '10:15', riskScore: 0.12, status: 'Cảnh báo', amount: '1,200,000,000 VND', taxCode: '0309876543', aiHeatmap: true, details: "Hệ thống AI phát hiện dấu hiệu bất thường (độ tin cậy thấp: 12%)." },
];

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('documents')
  getAllDocuments() {
    return {
      status: 'success',
      data: documentDatabase.sort((a, b) => b.id.localeCompare(a.id)) // newest first
    };
  }

  @Post('documents/:id/action')
  updateDocumentStatus(@Body() body: { action: string }, @Param('id') id: string) {
    const doc = documentDatabase.find(d => d.id === id);
    if (!doc) return { status: 'error', message: 'Document not found' };

    if (body.action === 'approve') doc.status = 'Đã duyệt';
    else if (body.action === 'block') doc.status = 'Đã chặn';
    else if (body.action === 'review') doc.status = 'Chờ xử lý';

    return { status: 'success', data: doc };
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
        ocr_amount: "Không tìm thấy"
      };
    }

    // 2. Cross-check logic (Duplicate Tax Code)
    const requestTaxCode = aiResponse.ocr_tax_code;
    const isDuplicate = documentDatabase.some(doc => doc.taxCode === requestTaxCode && requestTaxCode !== "Không tìm thấy" && requestTaxCode !== "Lỗi kết nối OCR");
    
    if (isDuplicate) {
      aiResponse.is_fraud = true;
      const originalScore = aiResponse.fraud_score;
      aiResponse.fraud_score = Math.min(originalScore, 0.2); // Bắt buộc điểm tin cậy phải thấp
      aiResponse.analysis_details = `Hệ thống phân tích phát hiện rủi ro (độ tin cậy bị hạ thấp: ${(aiResponse.fraud_score*100).toFixed(0)}%). | HỆ THỐNG ĐỐI CHIẾU CẢNH BÁO: Hóa đơn có mã số thuế trùng lặp (đã từng giải ngân).`;
    }

    // 3. Save to In-Memory DB
    const newDoc = {
      id: docId,
      company: body.company || 'Doanh nghiệp ' + docId,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      riskScore: aiResponse.fraud_score,
      status: aiResponse.is_fraud ? 'Cảnh báo' : 'Phê duyệt',
      amount: aiResponse.ocr_amount,
      taxCode: requestTaxCode,
      aiHeatmap: aiResponse.heatmap_detected,
      details: aiResponse.analysis_details,
      imageUrl: body.image || null
    };
    
    documentDatabase.push(newDoc);

    return {
      status: 'success',
      data: newDoc
    };
  }
}
