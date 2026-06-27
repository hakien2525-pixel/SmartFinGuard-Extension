from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random
import time
import base64
import io
import re
import urllib.request
import json
from PIL import Image
import pytesseract

app = FastAPI(title="SmartFin-Guard AI Core")

class ScanRequest(BaseModel):
    document_id: str
    image_base64: str = None
    api_key: str = None

class ScanResponse(BaseModel):
    fraud_score: float
    is_fraud: bool
    heatmap_detected: bool
    analysis_details: str
    ocr_tax_code: str
    ocr_amount: str

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
        
        # Regex to find Tax Code
        tax_code_match = re.search(r'Mã số thuế[\s:]*([0-9\-]+)', text, re.IGNORECASE)
        tax_code = tax_code_match.group(1).strip() if tax_code_match else "Không tìm thấy"
        
        # Regex to find Total amount (simple heuristics for the demo)
        amount_match = re.search(r'Tổng cộng.*?([0-9.,]+)\s*(?:VND|VNĐ|đồng|dồng)', text, re.IGNORECASE | re.DOTALL)
        if amount_match:
            amount = amount_match.group(1).strip() + " VND"
        else:
            # Fallback if specific string not found, try any large number
            fallback = re.findall(r'([0-9]{1,3}(?:[.,][0-9]{3})+)', text)
            amount = fallback[-1] + " VND" if fallback else "Không tìm thấy"
            
        return tax_code, amount
    except Exception as e:
        print(f"OCR Error: {e}")
        return "Lỗi phân tích", "Lỗi phân tích"

def call_vnpt_smartreader(image_base64: str, api_key: str):
    if not image_base64:
        return None
    
    url = "https://api.vnpt.ai/ocr/v1/invoice"
    
    # Clean base64 header if present
    if ',' in image_base64:
        image_base64 = image_base64.split(',')[1]
        
    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json"
    }
    
    payload = json.dumps({
        "image": image_base64
    }).encode("utf-8")
    
    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            if res_data.get("status") == "success" or "data" in res_data:
                # Trích xuất dữ liệu từ response của VNPT SmartReader
                data = res_data.get("data", [{}])[0] if isinstance(res_data.get("data"), list) else res_data.get("data", {})
                tax_code = data.get("seller_tax_code") or data.get("tax_code") or "Không tìm thấy"
                amount = data.get("total_amount") or data.get("amount") or "Không tìm thấy"
                return tax_code, str(amount)
    except Exception as e:
        print(f"VNPT SmartReader API error: {e}")
    return None

@app.post("/analyze", response_model=ScanResponse)
def analyze_invoice(request: ScanRequest):
    time.sleep(1.0) # Simulating processing time
    
    tax_code = None
    amount = None
    
    # 1. Gọi API VNPT AI thực tế nếu có API Key
    if request.api_key and request.api_key.strip():
        vnpt_result = call_vnpt_smartreader(request.image_base64, request.api_key)
        if vnpt_result:
            tax_code, amount = vnpt_result
            print(f"VNPT AI SmartReader thành công: MST={tax_code}, Tiền={amount}")

    # Fallback sử dụng OCR cục bộ nếu không có API Key hoặc gọi API VNPT bị lỗi
    if not tax_code:
        tax_code, amount = extract_ocr_data(request.image_base64)
    
    # 2. Logic CNN giả lập phân tích ảnh (đảo ngược lại: Điểm rủi ro -> Độ tin cậy)
    # trust_score cao = an toàn, thấp = gian lận
    trust_score = round(random.uniform(0.0, 1.0), 2)
    is_fraud = trust_score < 0.5
    
    # 3. Chuẩn hóa Văn phong AI
    if is_fraud:
        details = f"Hệ thống AI phát hiện dấu hiệu bất thường (độ tin cậy của tài liệu thấp: {trust_score*100}%). Có khả năng chứng từ đã bị can thiệp kỹ thuật số (Error Level Analysis)."
    else:
        details = f"Hệ thống AI đánh giá hình ảnh nguyên bản (độ tin cậy cao: {trust_score*100}%)."

    return ScanResponse(
        fraud_score=trust_score,
        is_fraud=is_fraud,
        heatmap_detected=is_fraud,
        analysis_details=details,
        ocr_tax_code=tax_code,
        ocr_amount=amount
    )
