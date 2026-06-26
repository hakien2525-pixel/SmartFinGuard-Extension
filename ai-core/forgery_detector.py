import cv2
import numpy as np
from PIL import Image, ImageChops
import io
import datetime

class ImageForgeryDetector:
    def __init__(self):
        # Known software signatures often found in tampered images
        self.suspicious_software = ['adobe', 'photoshop', 'canva', 'picsart', 'gimp', 'corel']

    def analyze_ela(self, pil_image, quality=95):
        """
        Kỹ thuật 1: Error Level Analysis (ELA - Phân tích mức độ lỗi nén)
        """
        try:
            # Save the image at a specific quality
            temp_io = io.BytesIO()
            if pil_image.mode != 'RGB':
                pil_image = pil_image.convert('RGB')
                
            pil_image.save(temp_io, 'JPEG', quality=quality)
            temp_io.seek(0)
            compressed_image = Image.open(temp_io)
            
            # Calculate absolute difference
            ela_image = ImageChops.difference(pil_image, compressed_image)
            
            # Enhance the difference
            extrema = ela_image.getextrema()
            max_diff = max([ex[1] for ex in extrema])
            if max_diff == 0:
                max_diff = 1
            scale = 255.0 / max_diff
            ela_image = ImageChops.multiply(ela_image.point(lambda x: x * scale), ela_image)
            
            # Convert to OpenCV format to find anomalous regions
            ela_cv = np.array(ela_image)
            gray = cv2.cvtColor(ela_cv, cv2.COLOR_RGB2GRAY)
            _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
            
            # Use morphological operations to group nearby noise
            kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
            dilated = cv2.dilate(thresh, kernel, iterations=1)
            
            contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            anomalies = []
            score = 0.0
            
            # Find significant ELA spikes (indicative of local tampering like inserted text)
            for cnt in contours:
                area = cv2.contourArea(cnt)
                if area > 150:  # Threshold for noise
                    x, y, w, h = cv2.boundingRect(cnt)
                    anomalies.append({
                        "reason": "Mức độ nén ELA chênh lệch (Dấu vết cắt ghép/chèn thêm chữ)",
                        "box": [int(x), int(y), int(w), int(h)]
                    })
                    score += 0.25 # Tăng rủi ro
                    
            return min(score, 1.0), anomalies
        except Exception as e:
            print(f"ELA Error: {e}")
            return 0.0, []

    def check_metadata(self, pil_image):
        """
        Kỹ thuật 2: Metadata & EXIF Checking
        Tìm dấu vết phần mềm chỉnh sửa và sự bất nhất về thời gian.
        """
        try:
            anomalies = []
            score = 0.0
            info = pil_image.getexif()
            if not info:
                return score, anomalies
                
            # TAG 305 is "Software", TAG 306 is "DateTime" (Last modified), TAG 36867 is "DateTimeOriginal"
            software = info.get(305, "").lower()
            date_time = info.get(306, "")
            date_original = info.get(36867, "")
            
            if software:
                for suspicious in self.suspicious_software:
                    if suspicious in software:
                        anomalies.append({
                            "reason": f"Dấu vết chỉnh sửa kỹ thuật số: Phát hiện phần mềm {software.title()} trong EXIF",
                            "box": [0, 0, 0, 0] # Lỗi toàn cục
                        })
                        score += 0.6
                        break
                        
            # Kiểm tra sự bất nhất giữa ngày chụp gốc và ngày chỉnh sửa cuối (nếu có cả hai)
            if date_time and date_original and date_time != date_original:
                anomalies.append({
                    "reason": f"Ngày tạo ({date_original}) và Ngày sửa đổi ({date_time}) không khớp. Khả năng cao tệp đã bị can thiệp.",
                    "box": [0, 0, 0, 0]
                })
                score += 0.4

            return min(score, 1.0), anomalies
        except Exception as e:
            print(f"Metadata check error: {e}")
            return 0.0, []

    def analyze_pixel_alignment(self, cv_image):
        """
        Kỹ thuật 3: Pixel & Alignment Analysis
        Phép toán hình thái học (Morphological) tìm trục tọa độ và độ lệch dòng.
        """
        try:
            anomalies = []
            score = 0.0
            
            if len(cv_image.shape) == 3:
                gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
            else:
                gray = cv_image
                
            # Binarize using adaptive thresholding
            thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                           cv2.THRESH_BINARY_INV, 11, 2)
            
            # Kẻ đường trục ngang (Horizontal projection) để tìm các hàng chữ tự nhiên
            horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (40, 1))
            detect_horizontal = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, horizontal_kernel, iterations=2)
            
            # Tìm các contours (chữ hoặc số) không nằm trên các trục ngang này (bị lệch dòng)
            # Dùng viền chữ
            edges = cv2.Canny(gray, 50, 150)
            char_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (10, 5))
            dilated_chars = cv2.dilate(edges, char_kernel, iterations=1)
            
            contours, _ = cv2.findContours(dilated_chars, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            for cnt in contours:
                x, y, w, h = cv2.boundingRect(cnt)
                # Chỉ check các khối text kích thước vừa (số tiền, ngày tháng)
                if 20 < w < 400 and 10 < h < 100:
                    roi_edges = edges[y:y+h, x:x+w]
                    density = np.sum(roi_edges) / (w * h * 255.0)
                    
                    # Bắt lỗi: 1. Nhiễu pixel quanh viền quá bất thường
                    if density > 0.45:
                        anomalies.append({
                            "reason": "Mật độ nhiễu Pixel cao bất thường (Nghi ngờ tẩy xóa/chèn số)",
                            "box": [int(x), int(y), int(w), int(h)]
                        })
                        score += 0.3
                    
                    # Bắt lỗi: 2. Lệch trục (Khoảng cách từ y đến đường kẻ trục ngang gần nhất)
                    roi_horiz = detect_horizontal[max(0, y-10):min(detect_horizontal.shape[0], y+h+10), x:x+w]
                    if np.sum(roi_horiz) == 0:
                        # Vùng này hoàn toàn bị trơ trọi, không thẳng hàng với bất kỳ trục văn bản nào
                        anomalies.append({
                            "reason": "Lệch trục tọa độ siêu nhỏ (Sai lệch căn dòng so với văn bản gốc)",
                            "box": [int(x), int(y), int(w), int(h)]
                        })
                        score += 0.35
            
            return min(score, 1.0), anomalies
        except Exception as e:
            print(f"Alignment analysis error: {e}")
            return 0.0, []

    def detect(self, pil_image):
        """
        Kỹ thuật 4: Định dạng Đầu ra (Bounding Box JSON Pipeline)
        Tích hợp và trả về JSON chuẩn xác
        """
        all_anomalies = []
        total_risk = 0.0
        
        # 1. ELA Analysis
        ela_risk, ela_anomalies = self.analyze_ela(pil_image)
        total_risk += ela_risk * 0.4 
        all_anomalies.extend(ela_anomalies)
        
        # 2. Metadata / EXIF
        exif_risk, exif_anomalies = self.check_metadata(pil_image)
        total_risk += exif_risk * 0.3
        all_anomalies.extend(exif_anomalies)
        
        # Convert to OpenCV format
        cv_image = cv2.cvtColor(np.array(pil_image.convert('RGB')), cv2.COLOR_RGB2BGR)
        
        # 3. Pixel & Alignment Analysis
        align_risk, align_anomalies = self.analyze_pixel_alignment(cv_image)
        total_risk += align_risk * 0.3 
        all_anomalies.extend(align_anomalies)
        
        total_risk = min(total_risk, 1.0)
        
        # Confidence score (Độ tin cậy của hóa đơn = 1 - rủi ro giả mạo)
        confidence_score = round(1.0 - total_risk, 2)
        
        # Ngưỡng giả mạo: Rủi ro > 0.4 (hoặc độ tin cậy < 0.6)
        is_forged = bool(confidence_score < 0.6)
        
        return {
            "is_forged": is_forged,
            "confidence_score": confidence_score,
            "anomalies": all_anomalies
        }
