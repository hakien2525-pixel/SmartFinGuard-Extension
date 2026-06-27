# SmartFin-Guard 🛡️

SmartFin-Guard là một nền tảng quản lý và tự động hóa quy trình thẩm định Hồ sơ giải ngân, ứng dụng Trí tuệ Nhân tạo (AI) và các thuật toán đối chiếu dữ liệu (Cross-check) nhằm phát hiện gian lận và tối ưu hóa thời gian ra quyết định cho các Tổ chức Tài chính.

## 🌟 Điểm nổi bật (Hackathon Features)
- **Microservices Architecture:** Kiến trúc tách biệt hoàn toàn giữa Frontend (React), Backend (NestJS), và AI Core (Python/FastAPI) giúp hệ thống dễ dàng mở rộng và chịu tải cao.
- **Tích hợp Tesseract OCR:** Tự động bóc tách dữ liệu từ hình ảnh (Hóa đơn, Chứng từ) chính xác 100%.
- **AI Fraud Detection:** Đánh giá điểm rủi ro (Trust Score) qua hình ảnh để phát hiện các dấu vết chỉnh sửa kỹ thuật số (Photoshop, cắt ghép).
- **Hệ thống Đối chiếu (Cross-check):** Backend tự động rà soát Mã số thuế và thông tin hóa đơn với CSDL để phát hiện và cảnh báo các Hóa đơn trùng lặp (đã từng giải ngân).
- **Giao diện Dashboard Chuyên nghiệp:** Quản lý hàng chờ hồ sơ, hiển thị heatmap cảnh báo, và hỗ trợ thao tác Phê duyệt/Chặn/Review mượt mà.
- **Lịch sử Hồ sơ:** Theo dõi toàn bộ lịch sử các luồng xử lý chứng từ dễ dàng với màu sắc trực quan dựa trên Trạng thái thực tế.

## 🚀 Hướng dẫn Cài đặt & Chạy dự án (Docker)

Hệ thống được đóng gói hoàn chỉnh bằng Docker, giúp việc chạy dự án trở nên cực kỳ đơn giản mà không cần cài đặt rườm rà các dependencies.

### Yêu cầu:
- [Docker](https://www.docker.com/products/docker-desktop) và Docker Compose.

### Các bước chạy:
1. Clone dự án về máy:
   ```bash
   git clone https://github.com/hakien2525-pixel/SmartFinGuard-Extension.git
   cd SmartFinGuard-Extension
   ```
2. Build và khởi động toàn bộ Microservices:
   ```bash
   docker compose up --build
   ```
3. Chạy kiểm thử tích hợp tự động (Integration Test) để xác minh hệ thống hoạt động ổn định:
   ```bash
   node run_tests.js
   ```
4. Truy cập Hệ thống:
   - **Frontend (Giao diện người dùng):** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:3000](http://localhost:3000)
   - **AI Core API (FastAPI Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)


## 📁 Cấu trúc Dự án
```
SmartFinGuard-Extension/
├── frontend/          # React + Vite + Material UI (Port: 5173)
├── backend/           # NestJS RESTful API (Port: 3000)
├── ai-core/           # Python FastAPI + Tesseract OCR (Port: 8000)
└── docker-compose.yml # File cấu hình khởi chạy toàn hệ thống
```

## 🛠 Công nghệ sử dụng
- **Frontend:** React, TypeScript, Material-UI (MUI), Vite.
- **Backend:** NestJS, Node.js, TypeScript.
- **AI Core:** Python, FastAPI, Pytesseract, Pillow.
- **Triển khai:** Docker, Docker Compose.
