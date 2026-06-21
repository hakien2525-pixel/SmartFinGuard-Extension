<div align="center">
  <h1>🛡️ SmartFin-Guard Extension</h1>
  <p><b>Hệ thống Giám định Tài chính & Tự động hóa Phê duyệt Hồ sơ bằng Trí tuệ Nhân tạo</b></p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](#)
  [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](#)
  [![Gemini API](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](#)
  [![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](#)
</div>

<br/>

**SmartFin-Guard** là nền tảng quản lý và tự động hóa quy trình thẩm định Hồ sơ giải ngân (hóa đơn, chứng từ). Bằng việc ứng dụng **Trí tuệ Nhân tạo (Gemini 3.5 API)** kết hợp với các **Thuật toán Giám định Kỹ thuật số sâu (Image Forensics)**, hệ thống giúp phát hiện gian lận và tối ưu hóa tốc độ ra quyết định cho các Tổ chức Tài chính.

---

## ✨ Điểm nổi bật (Core Features)

- 🧠 **Tích hợp Google Gemini 3.5 Flash:** Thay thế OCR truyền thống bằng khả năng đọc hiểu ngữ cảnh sâu sắc của LLM. Tự động bóc tách chính xác 100% "Mã số thuế", "Tổng tiền" (kể cả trên hóa đơn bán lẻ) và tự sinh ra các câu **Kết luận giám định chuyên môn** sắc bén.
- 🔍 **Image Forensics (Giám định hình ảnh):** Phân tích hình thái ảnh ở cấp độ pixel. Tự động phát hiện các vết chỉnh sửa kỹ thuật số, cắt ghép, nén sai lệch thông qua ELA (Error Level Analysis), kiểm tra nhiễu Pixel và phân tích siêu dữ liệu EXIF.
- ⚡ **Hệ thống Cross-check Thông minh:** Backend (NestJS) tự động rà soát Mã số thuế với cơ sở dữ liệu để ngay lập tức chặn đứng các hóa đơn nộp trùng lặp (đã từng được giải ngân).
- 🧩 **Microservices Architecture:** Kiến trúc tách biệt hoàn toàn giữa Frontend (Vite/React), Backend (NestJS) và AI Core (Python/FastAPI) giúp hệ thống dễ dàng mở rộng và chịu tải cao.
- 💻 **UI/UX Chuyên nghiệp:** Giao diện Dashboard được tối ưu hiển thị mượt mà với Material UI + Tailwind CSS, tự động xử lý responsive, text overflow và conditional rendering.

---

## 🚀 Hướng dẫn Cài đặt & Triển khai

Hệ thống được đóng gói hoàn chỉnh bằng **Docker**, giúp việc chạy dự án trở nên cực kỳ đơn giản mà không cần cài đặt môi trường rườm rà.

### 📋 Yêu cầu hệ thống:
- [Docker Desktop](https://www.docker.com/products/docker-desktop) và Docker Compose.
- Một API Key của Google Gemini Studio (hỗ trợ các model đời mới).

### ⚙️ Các bước chạy:

1. **Clone dự án về máy:**
   ```bash
   git clone https://github.com/hakien2525-pixel/SmartFinGuard-Extension.git
   cd SmartFinGuard-Extension
   ```

2. **Cấu hình Biến Môi Trường (.env):**
   Mở file `backend/.env` (hoặc tự tạo nếu chưa có) và dán API Key Gemini của bạn vào:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

3. **Build và khởi động hệ thống (Docker):**
   ```bash
   docker-compose up -d --build
   ```

4. **Truy cập Hệ thống:**
   - 🌐 **Frontend (Giao diện Quản trị):** [http://localhost:5173](http://localhost:5173)
   - ⚙️ **Backend API (NestJS):** [http://localhost:3000](http://localhost:3000)
   - 🤖 **AI Core API (Python Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📁 Cấu trúc Dự án (Microservices)

```plaintext
SmartFinGuard-Extension/
├── frontend/          # React + Vite + MUI + Tailwind CSS (Port: 5173)
├── backend/           # NestJS RESTful API + Gemini Integration (Port: 3000)
├── ai-core/           # Python FastAPI + Image Forensics + OpenCV (Port: 8000)
└── docker-compose.yml # File cấu hình Orchestration khởi chạy toàn hệ thống
```

---

## 🛠 Công nghệ sử dụng
- **Frontend:** React, TypeScript, Material-UI (MUI), Tailwind CSS, Vite.
- **Backend:** NestJS, Node.js, TypeScript, Google Generative AI SDK.
- **AI Core:** Python, FastAPI, OpenCV, Pillow, Numpy.
- **Triển khai:** Docker, Docker Compose.

<div align="center">
  <br/>
  <i>Được thiết kế cho tính bảo mật, chính xác và hiệu suất cao.</i>
</div>
