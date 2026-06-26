import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class GeminiService {
  constructor() {}

  async analyzeInvoice(base64Image: string, rawText: string = "") {
    const prompt = `Bạn là chuyên gia kế toán kiểm toán. Dựa vào văn bản OCR thô của hóa đơn này, hãy trích xuất chính xác 100% các thông tin sau:
  + Tên hóa đơn (invoice_name): Ví dụ 'HÓA ĐƠN GIÁ TRỊ GIA TĂNG', 'HÓA ĐƠN BÁN HÀNG'...
  + Mã số thuế (tax_id): Lấy MST của ĐƠN VỊ BÁN HÀNG. Nếu là Hóa đơn bán lẻ không có MST, BẮT BUỘC trả về null.
  + Tổng tiền (total_amount): Lấy SỐ TIỀN TỔNG CỘNG CUỐI CÙNG PHẢI THANH TOÁN (thường nằm ở dưới cùng). Tuyệt đối loại trừ các con số đơn giá, tiền hàng lẻ, hoặc các số thứ tự/công thức (như 3 = 1 x 2).
  + Kết luận (conclusion): Nhận xét ngắn gọn về tính hợp lệ của các dữ liệu vừa đọc.
  Trả về JSON chuẩn xác định dạng (không bọc bằng markdown, chỉ trả về JSON raw):
  { "invoice_name": "...", "tax_id": "...", "total_amount": "...", "conclusion": "...", "trust_score": 0-100 }
  
  === VĂN BẢN OCR ===
  ${rawText}`;

    const keys = [process.env.GROQ_API_KEY_1, process.env.GROQ_API_KEY_2].filter(Boolean) as string[];
    if (keys.length === 0) {
        throw new Error('No Groq API keys found in .env');
    }

    const payload = {
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.1
    };

    let lastError = null;

    for (const key of keys) {
        try {
            console.log(`Trying Groq API with key ${key.substring(0, 8)}...`);
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${key}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorData}`);
            }

            const data = await response.json();
            let text = data.choices[0].message.content;
            
            // Clean markdown formatting
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            
            return JSON.parse(text);
        } catch (error) {
            lastError = error;
            console.error(`Groq API attempt failed:`, error.message);
            // If it fails (e.g. 429 Rate Limit, 401 Unauthorized), it will naturally continue to the next key in the array
        }
    }

    console.error(`All Groq API attempts failed. Last error: ${lastError?.message}`);
    throw new Error(`Groq API Error: ${lastError?.message || 'Unknown Error'}`);
  }
}
