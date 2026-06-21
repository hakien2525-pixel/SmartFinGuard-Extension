import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    // Requires GEMINI_API_KEY in .env file
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_API_KEY');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
  }

  async analyzeInvoice(base64Image: string) {
    if (!base64Image) {
      throw new Error('Image is required');
    }

    try {
      // Remove header if present
      const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

      const prompt = `Bạn là chuyên gia giám định tài chính số. Dựa vào dữ liệu hóa đơn này, hãy: 
1. Trích xuất chính xác Mã số thuế và Tổng tiền thanh toán cuối cùng. Ưu tiên tìm các dòng chứa từ khóa "Tổng tiền thanh toán:" hoặc "Tổng cộng:". Bỏ qua các con số đơn lẻ ở dòng tiêu đề bảng (như "3 = 1 x 2"). Mã số thuế sử dụng format Mã số thuế: [A-Z0-9-].
2. Kiểm tra tính hợp logic (VD: Thuế VAT 8% hay 10% có khớp tổng tiền không). 
3. Viết một kết luận giám định chuyên sâu (dưới 50 từ), chỉ ra điểm bất thường nếu có. 
4. Trả về JSON chuẩn xác định dạng (không bọc bằng markdown, chỉ trả về JSON raw): 
{ "tax_id": "...", "total_amount": "...", "conclusion": "...", "trust_score": 0-100 }`;

      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg' // or image/png, Gemini handles it generically
          }
        }
      ];

      const result = await this.model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      let text = response.text();
      
      // Clean markdown formatting if Gemini returns it
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        tax_id: "Lỗi kết nối AI",
        total_amount: "Lỗi kết nối AI",
        conclusion: `Gemini API Error: ${error.message}. Vui lòng kiểm tra lại API Key.`,
        trust_score: 50
      };
    }
  }
}
