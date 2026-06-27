# SmartFin-Guard 🛡️ - Vòng 2 MVP Development

SmartFin-Guard là một nền tảng quản lý và tự động hóa quy trình thẩm định Hồ sơ giải ngân, ứng dụng Trí tuệ Nhân tạo (AI) và các thuật toán đối chiếu dữ liệu (Cross-check) nhằm phát hiện gian lận và tối ưu hóa thời gian ra quyết định cho các Tổ chức Tài chính.

Bản cập nhật này đánh dấu việc hoàn thành **Khung Website Portal đa phân hệ** và tích hợp **mô phỏng / kết nối thực tế API VNPT** cho Vòng 2.

---

## 🌟 Những Phần Việc Đã Hoàn Thành (Round 2 Checklist)

### 1. Website Portal Đa Phân Hệ (Thay cho Chrome Extension)
*   **Cổng SME (Doanh nghiệp):** 
    *   Tích hợp luồng xác thực danh tính **VNPT eKYC sinh trắc học** với hiệu ứng quét radar khuôn mặt động trực quan.
    *   Giao diện tải hóa đơn, hiển thị tên file và thông tin bóc tách OCR thời gian thực.
    *   Cảnh báo rủi ro tức thì trước khi gửi hồ sơ lên ngân hàng.
*   **Dashboard Thẩm Định (Ngân hàng):**
    *   Bảng chỉ số tổng quan (Overview Panel) phân tích hồ sơ an toàn và gian lận.
    *   Hàng chờ duyệt hồ sơ (Document Queue) hiển thị mức độ rủi ro trực quan theo màu sắc (Badge Xanh/Đỏ).
    *   Khung phân tích AI chi tiết (Analysis Panel) hiển thị ảnh hóa đơn và khoanh vùng chỉnh sửa (Heatmap).
*   **Lịch sử Hồ sơ:** Tra cứu toàn bộ chứng từ cũ đã xử lý.

### 2. Cơ Chế "Cắm và Chạy" (Plug & Play) với VNPT AI API
*   **API Console:** Giao diện quản lý cấu hình API Key, Client ID và Client Secret trực quan.
*   **Kết nối VNPT SmartReader thực tế:** Lõi Python AI Core đã được lập trình sẵn mã nguồn gọi API VNPT SmartReader thật tại địa chỉ `https://api.vnpt.ai/ocr/v1/invoice`. 
*   **Cơ chế Fallback (Dự phòng):** Nếu người dùng không nhập API Key (hoặc key lỗi), hệ thống sẽ tự động chuyển sang chế độ offline sử dụng OCR cục bộ và logic giả lập, đảm bảo giao diện luôn chạy mượt mà không bị sập.

### 3. Tích Hợp Cảnh Báo Cuộc Gọi VNPT SmartVoice
*   Khi Backend phát hiện hóa đơn có rủi ro trùng lặp cao (hồ sơ đỏ), hệ thống sẽ kích hoạt API cuộc gọi tự động bằng giọng nói nhân tạo AI để báo động trực tiếp tới số điện thoại của kiểm soát viên ngân hàng.

### 4. Đóng Gói Docker & Script Test Tự Động
*   Đóng gói hoàn chỉnh 3 Microservices độc lập (`frontend`, `backend`, `ai-core`) chạy bằng 1 lệnh duy nhất.
*   Viết thành công script kiểm thử tích hợp tự động [run_tests.js](run_tests.js) quét 3 lần liên tiếp để chứng minh hệ thống đạt chuẩn hoạt động ổn định cho Vòng 2.

---

## 📁 Hướng Dẫn Chi Tiết Từng File Trong Code

*   [run_tests.js](run_tests.js) *(Root)*: Script Node.js kiểm thử tích hợp tự động luồng eKYC và quét hóa đơn 3 lần liên tiếp.
*   [docker-compose.yml](docker-compose.yml) *(Root)*: Tệp cấu hình khởi chạy đồng bộ 3 container Frontend, Backend và AI Core.
*   [frontend/src/components/SMEPortal.tsx](frontend/src/components/SMEPortal.tsx): Giao diện Cổng doanh nghiệp, xử lý quét eKYC khuôn mặt và upload hóa đơn.
*   [frontend/src/components/APIConsole.tsx](frontend/src/components/APIConsole.tsx): Giao diện cấu hình API Key của VNPT và hiển thị code mẫu.
*   [frontend/src/App.tsx](frontend/src/App.tsx): File chính của React, quản lý các Tab/Portal và đồng bộ danh sách hóa đơn từ Backend.
*   [backend/src/app.controller.ts](backend/src/app.controller.ts): Gateway NestJS tiếp nhận thông tin từ client, điều phối API Key và xử lý thuật toán đối chiếu trùng lặp hóa đơn (Cross-checking).
*   [ai-core/main.py](ai-core/main.py): Lõi AI FastAPI Python xử lý OCR hóa đơn bằng pytesseract cục bộ hoặc tự động gọi VNPT SmartReader API thật khi có API Key.
*   [ai-core/Dockerfile](ai-core/Dockerfile): Đóng gói môi trường Python, tự động cài đặt các công cụ phụ trợ (Tesseract OCR tiếng Việt).

---

## 🚀 Hướng Dẫn Chạy Dự Án

### Yêu cầu:
*   [Docker Desktop](https://www.docker.com/products/docker-desktop) đang được mở trên máy tính.
*   Node.js (để chạy script test).

### Các bước chạy:
1.  **Build và khởi động toàn bộ Microservices:**
    ```bash
    docker compose up --build
    ```
2.  **Chạy kiểm thử tích hợp tự động (Integration Test):**
    Mở một Terminal mới và chạy:
    ```bash
    node run_tests.js
    ```
3.  **Truy cập giao diện Web:**
    *   **Website Portal:** [http://localhost:5173](http://localhost:5173)
    *   **Backend API:** [http://localhost:3000](http://localhost:3000)
    *   **AI Core API (FastAPI docs):** [http://localhost:8000/docs](http://localhost:8000/docs)
