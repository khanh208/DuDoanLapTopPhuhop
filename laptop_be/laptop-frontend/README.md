# Laptop Frontend (React + Vite)

Frontend này được dựng theo file **Chức năng.docx** cho các nhóm chức năng **A -> F**:
- A. Auth & Users
- B. Brands
- C. Laptops
- D. Import Excel Laptop
- E. AHP Criteria
- F. Evaluation Session

## 1) Cài đặt
```bash
npm install
cp .env.example .env
```

## 2) Cấu hình API
Trong file `.env`:
```env
VITE_API_BASE_URL=http://127.0.0.1:5000/api
```

## 3) Chạy project
```bash
npm run dev
```

## 4) Ghi chú quan trọng
Project backend Flask trong repo hiện có dấu hiệu một số route path viết với tham số động nhưng khi xem raw web bị ẩn mất ký hiệu `<id>` trong phần hiển thị HTML. Frontend này dùng các endpoint REST theo đúng tài liệu chức năng, ví dụ:
- `/brands/:id`
- `/laptops/:id`
- `/admin/users/:id`
- `/evaluations/:sessionId`
- `/evaluations/:sessionId/filters`

Nếu trong code backend thực tế route khác tên, chỉ cần sửa lại đường dẫn trong các file page tương ứng.
