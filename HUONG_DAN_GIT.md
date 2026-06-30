# Hướng Dẫn Quy Trình Làm Việc Nhóm (Git Workflow)
Quy trình này được thiết kế để nhóm 4 người (Hoàng Anh, Huy, Phát, Kiên) làm việc chung trên một Repository mà **không bị xung đột code (conflict)**.

## 1. Phân chia cấu trúc thư mục (Tách biệt không gian làm việc)
Để tránh xung đột, mỗi thành viên/nhóm chỉ nên làm việc trong thư mục dự án được phân công:

- 📂 `frontend/` 👉 **Kiên (và bạn)**: Chuyên thiết kế UI/UX, React, giao diện.
- 📂 `backend/` 👉 **Hoàng Anh & Huy**: Chuyên xử lý API, Database, Logic server.
- 📂 `data/` (hoặc `ai/`) 👉 **Phát**: Chuyên xử lý dữ liệu, Python, mô hình AI.

> **Nguyên tắc Vàng**: Nếu Phát sửa code trong thư mục `data/` và Kiên sửa code trong thư mục `frontend/`, khi gộp lại sẽ **100% không bao giờ bị conflict**. Xung đột chỉ xảy ra khi 2 người cùng sửa chung 1 file ở cùng 1 dòng.

---

## 2. Chiến lược chia Nhánh (Branching Strategy)
Tuyệt đối **KHÔNG** ai được push code trực tiếp lên nhánh `main` (ngoại trừ người trưởng nhóm khi đã review xong). Thay vào đó, hãy làm theo luồng sau:

### Các nhánh chính:
- `main`: Chứa code hoàn chỉnh, chạy ổn định (Production). Không ai code thẳng lên đây.
- `dev`: Nhánh trung gian để ghép code của cả 4 người lại xem có chạy tốt với nhau không.

### Các nhánh cá nhân (Feature branches):
Mỗi khi làm tính năng mới, mỗi người phải tạo một nhánh riêng từ nhánh `main` (hoặc `dev`), và đặt tên theo cú pháp: `[mảng_làm_việc]/[tên_tính_năng]`

- **Backend (Hoàng Anh & Huy)**:
  - `git checkout -b backend/hoanganh-tao-api-login`
  - `git checkout -b backend/huy-ket-noi-database`
- **Data (Phát)**:
  - `git checkout -b data/phat-xu-ly-data-gian-lan`
- **Frontend (Kiên)**:
  - `git checkout -b frontend/kien-giao-dien-admin`

---

## 3. Quy Trình Push Code (Dành cho mỗi thành viên)

Mỗi khi code xong và muốn đẩy lên GitHub, hãy làm đúng 4 bước sau:

**Bước 1: Lưu code vào nhánh cá nhân**
```bash
git add .
git commit -m "Tính năng vừa làm"
```

**Bước 2: Cập nhật code mới nhất từ team về (CỰC KỲ QUAN TRỌNG)**
```bash
git pull origin main
```
*(Nếu có người khác vừa push code lên main, lệnh này sẽ kéo code đó về máy bạn và tự động gộp. Nếu có conflict, báo ngay cho người kia để cùng xử lý).*

**Bước 3: Đẩy nhánh cá nhân lên GitHub**
```bash
# Ví dụ Phát đẩy code:
git push origin data/phat-xu-ly-data-gian-lan
```

**Bước 4: Tạo Pull Request (PR)**
- Lên trang web GitHub.
- Bấm nút **"Compare & pull request"**.
- Chờ các thành viên khác (hoặc Leader) vào xem code. Nếu OK thì bấm **Merge pull request** để gộp vào nhánh `main`.

---

## 4. Cách Hoàng Anh & Huy làm việc chung ở Backend để không đụng nhau
Vì hai bạn này code chung thư mục `backend/`, nguy cơ đụng code cao nhất. Cách khắc phục:
1. **Chia file rõ ràng**: Hoàng Anh làm file `auth.controller.js`, Huy làm file `user.controller.js`. Không ai được sửa file của người kia mà chưa báo trước.
2. **Kéo code thường xuyên**: Mỗi sáng trước khi code, phải chạy `git pull origin main` để cập nhật code của người kia.
3. Nếu bắt buộc phải sửa chung 1 file (ví dụ file `routes.js`), thì sau khi Hoàng Anh push lên, Huy phải pull về **ngay lập tức** rồi mới viết tiếp.
