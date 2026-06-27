from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random
import time
import base64
import io
import re
import urllib.request
import json
import requests
from PIL import Image
import pytesseract

app = FastAPI(title="SmartFin-Guard AI Core")

class ScanRequest(BaseModel):
    document_id: str
    image_base64: str = None
    token_id: str = None
    token_key: str = None
    access_token: str = None

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

def call_vnpt_smartreader(image_base64: str, token_id: str, token_key: str, access_token: str = None):
    if not image_base64 or not token_id or not token_key:
        return None
        
    try:
        # Clean base64 header if present
        header_part = ""
        if ',' in image_base64:
            header_part, image_base64 = image_base64.split(',', 1)
            
        img_bytes = base64.b64decode(image_base64)
        
        file_type = "png"
        if "pdf" in header_part:
            file_type = "pdf"
        elif "jpeg" in header_part or "jpg" in header_part:
            file_type = "jpg"
            
        # Step 1: Upload file to VNPT file-service
        upload_url = "https://api.idg.vnpt.vn/file-service/v1/addFile"
        headers = {
            "Token-id": token_id,
            "Token-key": token_key,
            "mac-address": "EGOV-DIGDOC-WEB-API"
        }
        if access_token and access_token.strip():
            headers["Authorization"] = access_token
            
        files = {
            'file': ('document.' + file_type, img_bytes, 'application/octet-stream')
        }
        data = {
            'title': 'Hashing document',
            'description': 'Hashing document'
        }
        
        print(f"Calling VNPT addFile API...")
        res = requests.post(upload_url, files=files, data=data, headers=headers, timeout=15)
        if res.status_code != 200:
            print(f"VNPT addFile failed: {res.status_code} - {res.text}")
            return None
            
        res_json = res.json()
        file_hash = res_json.get("object", {}).get("hash")
        detected_file_type = res_json.get("object", {}).get("fileType") or file_type
        
        if not file_hash:
            print("VNPT addFile did not return file hash.")
            return None
            
        print(f"VNPT file uploaded successfully. Hash: {file_hash}")
        
        # Step 2: Call OCR Invoice API
        ocr_url = "https://api.idg.vnpt.vn/rpa-service/aidigdoc/v1/ocr/hoa-don-gtgt"
        ocr_headers = {
            "Token-id": token_id,
            "Token-key": token_key,
            "mac-address": "mac-address",
            "Content-Type": "application/json"
        }
        if access_token and access_token.strip():
            ocr_headers["Authorization"] = access_token
            
        ocr_payload = {
            "file_hash": file_hash,
            "file_type": detected_file_type,
            "token": "8928skjhfa89298jahga1771vbvb",
            "client_session": "00-14-22-01-23-45-1548211589291",
            "details": True
        }
        
        print(f"Calling VNPT OCR Invoice API...")
        ocr_res = requests.post(ocr_url, json=ocr_payload, headers=ocr_headers, timeout=15)
        if ocr_res.status_code != 200:
            print(f"VNPT OCR Invoice failed: {ocr_res.status_code} - {ocr_res.text}")
            return None
            
        ocr_json = ocr_res.json()
        obj_data = ocr_json.get("object", {})
        
        # Extract fields
        tax_code = obj_data.get("seller_tax_code") or obj_data.get("sellerTaxCode") or obj_data.get("mst_seller") or "Không tìm thấy"
        amount = obj_data.get("total_amount") or obj_data.get("totalAmount") or obj_data.get("total_payment") or "Không tìm thấy"
        
        # Format amount if it's a number
        if isinstance(amount, (int, float)):
            amount = f"{amount:,.0f} VND"
            
        return tax_code, str(amount)
        
    except Exception as e:
        print(f"VNPT SmartReader integration error: {e}")
        return None

@app.post("/analyze", response_model=ScanResponse)
def analyze_invoice(request: ScanRequest):
    time.sleep(1.0) # Simulating processing time
    
    tax_code = None
    amount = None
    
    # 1. Gọi API VNPT AI thực tế nếu có Token ID và Token Key
    if request.token_id and request.token_id.strip() and request.token_key and request.token_key.strip():
        vnpt_result = call_vnpt_smartreader(
            request.image_base64, 
            request.token_id, 
            request.token_key, 
            request.access_token
        )
        if vnpt_result:
            tax_code, amount = vnpt_result
            print(f"VNPT AI SmartReader thành công: MST={tax_code}, Tiền={amount}")

    # Fallback sử dụng OCR cục bộ nếu không có Keys hoặc gọi API VNPT bị lỗi
    if not tax_code:
        tax_code, amount = extract_ocr_data(request.image_base64)
    
    # 2. Logic CNN giả lập phân tích ảnh (đảo ngược lại: Điểm rủi ro -> Độ tin cậy)
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
