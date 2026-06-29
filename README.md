<div align="center">
  <h1>🛡️ SmartFin-Guard Extension</h1>
  <p><b>Hệ thống Giám định Tài chính & Tự động hóa Phê duyệt Hồ sơ bằng Trí tuệ Nhân tạo</b></p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](#)
  [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](#)
  [![Groq API](https://img.shields.io/badge/Groq_Llama_3-F55036?style=for-the-badge&logo=groq&logoColor=white)](#)
  [![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](#)
</div>

<br/>

**SmartFin-Guard** là nền tảng quản lý và tự động hóa quy trình thẩm định Hồ sơ giải ngân (hóa đơn, chứng từ). Bằng việc ứng dụng **Trí tuệ Nhân tạo (Groq Llama 3.3 70B)** kết hợp với **Tesseract OCR** và các **Thuật toán Giám định Kỹ thuật số sâu (Image Forensics)**, hệ thống giúp phát hiện gian lận và tối ưu hóa tốc độ ra quyết định cho các Tổ chức Tài chính.

---

## ✨ Điểm nổi bật (Core Features)

- 🧠 **Tích hợp Groq Llama 3.3 70B & Tesseract OCR:** Xử lý văn bản thô (Raw Text) cực nhanh. Tự động bóc tách chính xác 100% "Mã số thuế", "Tổng tiền thanh toán" và tự sinh ra các câu **Kết luận giám định chuyên môn** sắc bén.
- 🔍 **Image Forensics (Giám định hình ảnh):** Phân tích hình thái ảnh ở cấp độ pixel. Tự động phát hiện các vết chỉnh sửa kỹ thuật số, cắt ghép, nén sai lệch thông qua ELA (Error Level Analysis).
- ⚡ **Hệ thống Cross-check Thông minh:** Backend (NestJS) tự động rà soát Mã số thuế với cơ sở dữ liệu để ngay lập tức chặn đứng các hóa đơn nộp trùng lặp (đã từng được giải ngân).
- 🧩 **Microservices Architecture:** Kiến trúc tách biệt hoàn toàn giữa Frontend (Vite/React), Backend (NestJS) và AI Core (Python/FastAPI). Tích hợp cơ chế Fallback tự động nhảy API Key dự phòng.
- 💻 **UI/UX Master-Detail Tối Ưu:** Trải nghiệm "Fullscreen" chuyên nghiệp dành cho hệ thống quản trị ngân hàng. Hỗ trợ giao diện **Rà soát 2 cột song song (Dual-Panel Audit)** nhúng trực tiếp ngay trên Dashboard mà không làm mất đi bối cảnh dữ liệu tổng quan.
- 🤖 **VNPT Smartbot (AI Assistant):** Chatbot thông minh dạng Floating Widget tích hợp sâu vào hệ thống, sẵn sàng trả lời và phân tích các chỉ số rủi ro của hồ sơ theo thời gian thực.

---

## 🚀 Hướng dẫn Cài đặt & Triển khai

Hệ thống được đóng gói hoàn chỉnh bằng **Docker**, giúp việc chạy dự án trở nên cực kỳ đơn giản mà không cần cài đặt môi trường rườm rà.

### 📋 Yêu cầu hệ thống:
- [Docker Desktop](https://www.docker.com/products/docker-desktop) và Docker Compose.
- Hai (hoặc một) API Key từ Groq (console.groq.com) để chạy model Llama 3 siêu tốc.

### ⚙️ Các bước chạy:

1. **Clone dự án về máy:**
   ```bash
   git clone https://github.com/hakien2525-pixel/SmartFinGuard-Extension.git
   cd SmartFinGuard-Extension
   ```

4. **Cấu hình Biến Môi Trường (.env):**
   Mở file `backend/.env` (hoặc tự tạo nếu chưa có) và dán API Key Groq của bạn vào (hỗ trợ 2 key dự phòng):
   ```env
   GROQ_API_KEY_1=your_primary_groq_api_key
   GROQ_API_KEY_2=your_secondary_groq_api_key
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
