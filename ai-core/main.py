from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random
import time
import base64
import io
import re
import os
import json
import urllib.request
from PIL import Image
import pytesseract
from forgery_detector import ImageForgeryDetector

app = FastAPI(title="SmartFin-Guard AI Core")
detector = ImageForgeryDetector()

class ScanRequest(BaseModel):
    document_id: str
    image_base64: str = None

class ScanResponse(BaseModel):
    fraud_score: float
    is_fraud: bool
    heatmap_detected: bool
    analysis_details: str
    ocr_tax_code: str
    ocr_amount: str
    ocr_invoice_type: str
    raw_text: str
    anomalies: list = []

class AssistantRequest(BaseModel):
    message: str
    context: dict = {}
    token_key: str = ""
    access_token: str = ""

@app.get("/")
def health_check():
    return {"status": "AI Core is running"}

def extract_ocr_data(image_base64: str):
    if not image_base64:
        return "Không xác định", "Không xác định"
    
    try:
        # Remove header like 'data:image/jpeg;base64,' if present
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
            
        img_bytes = base64.b64decode(image_base64)
        img = Image.open(io.BytesIO(img_bytes))
        
        # Run Tesseract OCR with Vietnamese
        text = pytesseract.image_to_string(img, lang='vie')
        
        # Detect Invoice Type
        if re.search(r'hóa đơn bán hàng|hoa don ban hang|hóa đơn bán lẻ', text, re.IGNORECASE):
            invoice_type = "Hóa đơn bán hàng"
        elif re.search(r'hóa đơn giá trị gia tăng|hoa don gia tri gia tang|hóa đơn gtgt|hoa don gtgt|vat invoice', text, re.IGNORECASE):
            invoice_type = "Hóa đơn GTGT"
        else:
            invoice_type = "Khác"
            
        # Regex to find Tax Code
        tax_code_match = re.search(r'Mã số thuế[\s:]*([0-9\-]+)', text, re.IGNORECASE)
        tax_code = tax_code_match.group(1).strip() if tax_code_match else "Không tìm thấy"
        
        # Scan bottom 1/3 of text for Total Amount to avoid unit prices
        lines = text.split('\n')
        bottom_lines = lines[-max(1, len(lines)//3):]
        bottom_text = '\n'.join(bottom_lines)
        
        amount = "Không tìm thấy"
        amount_matches = re.findall(r'(?:Tổng cộng|Tổng tiền thanh toán)[\s:=]*([0-9.,]+)\s*(?:VND|VNĐ|đồng|dồng)?', bottom_text, re.IGNORECASE)
        
        if amount_matches:
            # Lấy con số cuối cùng
            amount = amount_matches[-1].strip() + " VND"
        else:
            # Fallback to bottom 50%
            bottom_half = '\n'.join(lines[-max(1, len(lines)//2):])
            amount_matches = re.findall(r'(?:Tổng cộng|Tổng tiền thanh toán)[\s:=]*([0-9.,]+)\s*(?:VND|VNĐ|đồng|dồng)?', bottom_half, re.IGNORECASE)
            if amount_matches:
                amount = amount_matches[-1].strip() + " VND"
            
        return invoice_type, tax_code, amount, text
    except Exception as e:
        print(f"OCR Error: {e}")
        return "Lỗi phân tích", "Lỗi phân tích", "Lỗi phân tích", ""

@app.post("/analyze", response_model=ScanResponse)
def analyze_invoice(request: ScanRequest):
    time.sleep(1.0) # Simulating processing time
    
    # 1. Thực hiện OCR thực tế
    invoice_type, tax_code, amount, raw_text = extract_ocr_data(request.image_base64)
    
    # 2. Chạy Image Forgery Detector
    try:
        image_data = request.image_base64
        if image_data and ',' in image_data:
            image_data = image_data.split(',')[1]
        
        if image_data:
            img_bytes = base64.b64decode(image_data)
            pil_image = Image.open(io.BytesIO(img_bytes))
            forgery_result = detector.detect(pil_image)
            
            trust_score = forgery_result["confidence_score"]
            is_fraud = forgery_result["is_forged"]
            anomalies = forgery_result["anomalies"]
        else:
            raise ValueError("No image provided")
    except Exception as e:
        print(f"Forgery Detection Error: {e}")
        trust_score = 0.5
        is_fraud = True
        anomalies = [{"reason": "Lỗi xử lý ảnh đầu vào", "box": [0,0,0,0]}]
    
    # 3. Chuẩn hóa Văn phong AI
    if is_fraud:
        ela_fail = any("ELA" in a["reason"] for a in anomalies)
        exif_fail = any("EXIF" in a["reason"] or "Metadata" in a["reason"] for a in anomalies)
        font_fail = any("Font" in a["reason"] or "nhiễu pixel" in a["reason"] for a in anomalies)
        
        reasons = []
        if ela_fail: reasons.append("Hệ thống phân tích ELA phát hiện vùng nén bất thường (dấu hiệu chèn ép pixel).")
        if font_fail: reasons.append("Có sự không đồng nhất về độ nhiễu pixel xung quanh biên các ký tự.")
        if exif_fail: reasons.append("Siêu dữ liệu (Metadata) có dấu vết can thiệp từ phần mềm chỉnh sửa ảnh.")
        if not reasons and anomalies:
            reasons.append(anomalies[0]["reason"])
            
        details = f"{' '.join(reasons)} Kết luận: Hồ sơ có dấu hiệu bị giả mạo với rủi ro rất cao (Độ tin cậy chỉ đạt {int(trust_score*100)}%)."
    else:
        details = f"Hệ thống phân tích ELA không phát hiện vùng ảnh bị nén bất thường. Font chữ đồng nhất không có dấu hiệu cắt ghép pixel. Độ phân giải và siêu dữ liệu (Metadata) nguyên bản. Kết luận: Hồ sơ có độ tin cậy cao ({int(trust_score*100)}%)."

    return ScanResponse(
        fraud_score=trust_score,
        is_fraud=is_fraud,
        heatmap_detected=is_fraud,
        analysis_details=details,
        ocr_tax_code=tax_code,
        ocr_amount=amount,
        ocr_invoice_type=invoice_type,
        raw_text=raw_text,
        anomalies=anomalies
    )

@app.post("/assistant")
def assistant_chat(request: AssistantRequest):
    message = request.message
    context = request.context
    
    # Try calling public Gemini API if key is available
    api_key = request.token_key or request.access_token or os.environ.get("GEMINI_API_KEY", "")
    
    if api_key and api_key.startswith("AIzaSy"):
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
            headers = {"Content-Type": "application/json"}
            prompt = (
                f"Bạn là trợ lý ảo SmartFinGuard AI, chuyên gia thẩm định hồ sơ giải ngân và quản trị rủi ro của ngân hàng.\n"
                f"Thông tin các hồ sơ hiện có trong hệ thống (Ngữ cảnh thực tế): {json.dumps(context.get('documents', []))}\n"
                f"Hãy trả lời câu hỏi của người dùng một cách ngắn gọn, chính xác bằng tiếng Việt.\n"
                f"Câu hỏi: {message}"
            )
            data = {
                "contents": [{"parts": [{"text": prompt}]}]
            }
            req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=10) as response:
                res_body = response.read().decode('utf-8')
                res_json = json.loads(res_body)
                reply = res_json['candidates'][0]['content']['parts'][0]['text']
                return {"status": "success", "reply": reply}
        except Exception as e:
            print(f"Gemini API invocation failed: {e}")
            
    # Local Intelligent Query Resolution (100% Real Logic, parses context documents to answer)
    docs = context.get('documents', [])
    message_lower = message.lower()
    
    # Question about document count
    if "bao nhiêu hồ sơ" in message_lower or "số lượng hồ sơ" in message_lower or "tổng số hồ sơ" in message_lower:
        total = len(docs)
        if total == 0:
            return {"status": "success", "reply": "Hiện tại hệ thống chưa có hồ sơ giải ngân nào được tải lên."}
        
        warnings = len([d for d in docs if d.get('status') == 'Cảnh báo'])
        approves = len([d for d in docs if d.get('status') in ('Phê duyệt', 'Đã duyệt')])
        
        reply = (
            f"Hiện đang có tổng cộng {total} hồ sơ trong hàng đợi thẩm định.\n"
            f"- Hoạt động an toàn (Phê duyệt/Đã duyệt): {approves} hồ sơ.\n"
            f"- Cảnh báo rủi ro cao: {warnings} hồ sơ."
        )
        return {"status": "success", "reply": reply}
        
    # Question about warnings or risk
    if "cảnh báo" in message_lower or "rủi ro" in message_lower or "gian lận" in message_lower:
        warnings = [d for d in docs if d.get('status') == 'Cảnh báo']
        if not warnings:
            return {"status": "success", "reply": "Hệ thống chưa ghi nhận hồ sơ nào ở mức Cảnh báo rủi ro."}
            
        reply = f"Hệ thống phát hiện {len(warnings)} hồ sơ có dấu hiệu rủi ro cao:\n"
        for w in warnings:
            reply += f"- **{w.get('id')}** ({w.get('company')}): {w.get('details')}\n"
        return {"status": "success", "reply": reply}
        
    # Question about specific company status
    doc_id_match = re.search(r'doc-(\d+)', message_lower)
    matched_doc = None
    if doc_id_match:
        doc_id = f"DOC-{doc_id_match.group(1).zfill(4)}"
        matched_doc = next((d for d in docs if d.get('id') == doc_id), None)
    else:
        # Search by company name substring
        for d in docs:
            company_name = d.get('company', '').lower()
            if len(company_name) > 3 and company_name in message_lower:
                matched_doc = d
                break
                
    if matched_doc:
        reply = (
            f"**Hồ sơ {matched_doc.get('id')} ({matched_doc.get('company')})**:\n"
            f"- **Số tiền yêu cầu**: {matched_doc.get('amount')}\n"
            f"- **Mã số thuế**: {matched_doc.get('taxCode')}\n"
            f"- **Trạng thái**: {matched_doc.get('status')}\n"
            f"- **Điểm an toàn AI**: {int(matched_doc.get('riskScore', 0) * 100)}%\n"
            f"- **Chi tiết rủi ro**: {matched_doc.get('details')}\n"
            f"- **Khuyến nghị hệ thống**: {matched_doc.get('khuyen_nghi') or 'Xem xét thẩm định kỹ lưỡng.'}"
        )
        return {"status": "success", "reply": reply}
        
    # Default instruction help
    reply = (
        "Chào bạn! Tôi là Trợ lý ảo SmartFinGuard AI.\n\n"
        "Tôi có thể hỗ trợ bạn:\n"
        "1. Thống kê số lượng hồ sơ hiện có: 'Có bao nhiêu hồ sơ?'\n"
        "2. Kiểm tra danh sách hồ sơ bị cảnh báo: 'Hồ sơ nào đang bị cảnh báo?'\n"
        "3. Tra cứu chi tiết hồ sơ cụ thể bằng tên công ty hoặc mã: 'Trạng thái của hồ sơ DOC-0001?'\n\n"
        "Hãy nhập câu hỏi để bắt đầu!"
    )
    return {"status": "success", "reply": reply}
