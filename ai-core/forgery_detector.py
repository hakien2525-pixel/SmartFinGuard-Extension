import cv2
import numpy as np
from PIL import Image, ImageChops
import io
import re

class ImageForgeryDetector:
    def __init__(self):
        # Known software signatures often found in tampered images
        self.suspicious_software = ['adobe', 'photoshop', 'canva', 'picsart', 'gimp', 'corel']

    def analyze_ela(self, pil_image, quality=95):
        """
        Kỹ thuật 1: Error Level Analysis (ELA)
        Lưu lại ảnh ở tỷ lệ nén 95% và tính toán độ chênh lệch pixel.
        """
        try:
            # Save the image at a specific quality
            temp_io = io.BytesIO()
            # Convert to RGB if necessary (e.g. RGBA)
            if pil_image.mode != 'RGB':
                pil_image = pil_image.convert('RGB')
                
            pil_image.save(temp_io, 'JPEG', quality=quality)
            temp_io.seek(0)
            compressed_image = Image.open(temp_io)
            
            # Calculate absolute difference
            ela_image = ImageChops.difference(pil_image, compressed_image)
            
            # Enhance the difference (scale it up to make it visible/analyzable)
            extrema = ela_image.getextrema()
            max_diff = max([ex[1] for ex in extrema])
            if max_diff == 0:
                max_diff = 1
            scale = 255.0 / max_diff
            ela_image = ImageChops.multiply(ela_image.point(lambda x: x * scale), ela_image)
            
            # Convert to OpenCV format to find anomalous regions (bounding boxes)
            ela_cv = np.array(ela_image)
            gray = cv2.cvtColor(ela_cv, cv2.COLOR_RGB2GRAY)
            _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            anomalies = []
            score = 0.0
            
            # Find significant ELA spikes
            for cnt in contours:
                area = cv2.contourArea(cnt)
                if area > 100:  # Threshold for noise
                    x, y, w, h = cv2.boundingRect(cnt)
                    anomalies.append({
                        "reason": "Mức độ nén ELA bất thường (dấu vết cắt ghép pixel)",
                        "box": [int(x), int(y), int(w), int(h)]
                    })
                    score += 0.2 # Tăng rủi ro
                    
            return min(score, 1.0), anomalies
        except Exception as e:
            print(f"ELA Error: {e}")
            return 0.0, []

    def check_metadata(self, pil_image):
        """
        Kỹ thuật 2: Metadata & EXIF Checking
        Đọc thẻ EXIF phát hiện phần mềm chỉnh sửa hoặc ngày sửa đổi không hợp lệ.
        """
        try:
            anomalies = []
            score = 0.0
            info = pil_image.getexif()
            if not info:
                return score, anomalies
                
            # TAG 305 is "Software" in standard EXIF
            software = info.get(305, "").lower()
            if software:
                for suspicious in self.suspicious_software:
                    if suspicious in software:
                        anomalies.append({
                            "reason": f"Phát hiện dấu vết phần mềm chỉnh sửa ảnh trong EXIF: {software.title()}",
                            "box": [0, 0, 0, 0] # Lỗi toàn cục
                        })
                        score += 0.5
                        break
                        
            # Cân nhắc thêm việc kiểm tra DateTimeOriginal vs DateTimeDigitized nếu cần
            return min(score, 1.0), anomalies
        except Exception as e:
            print(f"Metadata check error: {e}")
            return 0.0, []

    def analyze_font_and_alignment(self, cv_image):
        """
        Kỹ thuật 3: Font & Alignment Analysis bằng OpenCV
        Phát hiện nhiễu xung quanh viền ký tự và độ lệch dòng (Alignment).
        """
        try:
            anomalies = []
            score = 0.0
            
            # Convert to grayscale
            if len(cv_image.shape) == 3:
                gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
            else:
                gray = cv_image
                
            # Dùng Canny Edge Detection để tìm nhiễu biên (Text Edge Discontinuity)
            edges = cv2.Canny(gray, 50, 150)
            
            # Dùng Morphological operations (Dilate) để gộp các block chữ
            kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 5))
            dilated = cv2.dilate(edges, kernel, iterations=2)
            
            contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # Giả lập logic tìm ra các dòng chữ bị lệch trục (y variance > threshold)
            # Hoặc các vùng nhiễu (mật độ cạnh (edges) quá dày đặc so với phần còn lại)
            for cnt in contours:
                x, y, w, h = cv2.boundingRect(cnt)
                # Chỉ check các vùng nhỏ/vừa nghi ngờ bị sửa đổi số tiền (ví dụ)
                if 20 < w < 300 and 10 < h < 100:
                    roi = edges[y:y+h, x:x+w]
                    density = np.sum(roi) / (w * h * 255.0)
                    if density > 0.4: # Bất thường: nhiễu pixel quá cao
                        anomalies.append({
                            "reason": "Phát hiện nhiễu pixel viền ký tự (Khả năng chèn/sửa text)",
                            "box": [int(x), int(y), int(w), int(h)]
                        })
                        score += 0.3
            
            return min(score, 1.0), anomalies
        except Exception as e:
            print(f"Font analysis error: {e}")
            return 0.0, []

    def cnn_feature_extraction(self, cv_image):
        """
        Kỹ thuật 4: CNN Feature Extraction Pipeline
        Chuẩn hóa ảnh (resize 224x224, normalize) để đưa vào mạng CNN.
        Vì Hackathon không chạy CNN thật, đây là Pipeline mô phỏng quá trình đó.
        """
        try:
            # 1. Resize về kích thước chuẩn của mạng CNN (ví dụ ResNet50, VGG16)
            resized_img = cv2.resize(cv_image, (224, 224))
            
            # 2. Normalize (0-1)
            normalized_img = resized_img.astype(np.float32) / 255.0
            
            # 3. Trừ Mean & chia Std (ImageNet standards)
            mean = np.array([0.485, 0.456, 0.406])
            std = np.array([0.229, 0.224, 0.225])
            normalized_img = (normalized_img - mean) / std
            
            # CNN Mocking: Trong thực tế ta sẽ pass normalized_img vào model.predict()
            # Ở đây mô phỏng bằng cách tạo ngẫu nhiên nhưng có tỷ lệ dựa trên nhiễu ảnh
            noise_level = np.std(normalized_img)
            mock_cnn_risk = min(noise_level / 2.0, 1.0)
            
            # Tinh chỉnh cho có tính ngẫu nhiên nhẹ nhàng
            mock_cnn_risk = max(0.0, mock_cnn_risk - 0.2) 
            
            return mock_cnn_risk
        except Exception as e:
            print(f"CNN pipeline error: {e}")
            return 0.0

    def detect(self, pil_image):
        """
        Hàm chính điều phối toàn bộ 4 kỹ thuật.
        Trả về JSON: { "is_forged": bool, "confidence_score": float, "anomalies": list }
        """
        all_anomalies = []
        total_risk = 0.0
        
        # Kỹ thuật 1: ELA
        ela_risk, ela_anomalies = self.analyze_ela(pil_image)
        total_risk += ela_risk * 0.3 # ELA chiếm 30% trọng số
        all_anomalies.extend(ela_anomalies)
        
        # Kỹ thuật 2: EXIF
        exif_risk, exif_anomalies = self.check_metadata(pil_image)
        total_risk += exif_risk * 0.2 # EXIF chiếm 20%
        all_anomalies.extend(exif_anomalies)
        
        # Convert to OpenCV format cho Kỹ thuật 3 & 4
        cv_image = cv2.cvtColor(np.array(pil_image.convert('RGB')), cv2.COLOR_RGB2BGR)
        
        # Kỹ thuật 3: OpenCV Font/Alignment
        font_risk, font_anomalies = self.analyze_font_and_alignment(cv_image)
        total_risk += font_risk * 0.2 # Font chiếm 20%
        all_anomalies.extend(font_anomalies)
        
        # Kỹ thuật 4: CNN
        cnn_risk = self.cnn_feature_extraction(cv_image)
        total_risk += cnn_risk * 0.3 # CNN chiếm 30%
        
        # Nếu có bằng chứng mạnh từ ELA hoặc EXIF thì đẩy risk lên cao
        if exif_risk > 0 or ela_risk > 0.5 or font_risk > 0.5:
            total_risk += 0.3
            
        total_risk = min(total_risk, 1.0)
        
        # Trust score là nghịch đảo của Fraud Risk
        confidence_score = round(1.0 - total_risk, 2)
        is_forged = confidence_score < 0.5 # Dưới 50% độ tin cậy -> Bị giả mạo
        
        return {
            "is_forged": is_forged,
            "confidence_score": confidence_score,
            "anomalies": all_anomalies
        }
