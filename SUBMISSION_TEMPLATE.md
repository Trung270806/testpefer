# Hướng dẫn nộp bài & Cấu hình khi bạn sẵn sàng (Vercel & Supabase)

Khi bạn giải phóng hoặc tạo mới Supabase và Vercel cho dự án này, bạn chỉ cần thực hiện các bước đơn giản sau:

---

### Bước 1: Thiết lập Supabase

1. **Tạo dự án mới** trên Supabase.
2. Vào **SQL Editor**, mở file [supabase/expenses.sql](file:///d:/fer/testpefer/testpefer/supabase/expenses.sql) trong dự án này, copy toàn bộ nội dung và ấn **Run** để tạo bảng `expenses` và các chính sách bảo mật RLS.
3. Vào **Authentication -> Providers -> Email**:
   - **Tắt** tùy chọn **"Confirm email"** (để tài khoản đăng ký có hiệu lực ngay lập tức không cần bấm link xác nhận qua mail).
4. Vào **Authentication -> Users**:
   - Bấm **Add user** tạo tài khoản test cho người chấm thi:
     - **Email:** `grader.<MãSV>@example.com` (ví dụ: `grader.qe200012@example.com`)
     - **Password:** `Test1234!` (hoặc mật khẩu theo yêu cầu của bạn)
5. Vào **Project Settings -> API**:
   - Lấy `Project URL` và `anon (public) key`.
   - Cập nhật vào file `.env.local` của bạn:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
     ```

---

### Bước 2: Deploy lên Vercel

1. Đẩy code lên GitHub repository (chế độ Public theo yêu cầu của đề).
2. Import repository vào Vercel.
3. Trong phần **Environment Variables** trên Vercel, cấu hình 2 biến duy nhất:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy! Sau khi deploy xong, truy cập production URL và đăng nhập thử 1 lần bằng tài khoản test trước khi nộp.

---

### Bước 3: Chuẩn bị 2 file nộp bài (Đặt tên theo Mã số sinh viên của bạn)

Theo quy định của đề thi (Mục 4 - Submission):
1. `<MãSV>.docx`: File Word theo mẫu:
   ```text
   Student Code: <MãSV>
   Full Name: <Họ và tên>
   GitHub Repository URL: https://github.com/username/repo-name
   Vercel Production URL: https://your-project.vercel.app
   Supabase Project URL: https://xxxxxxxxxxxx.supabase.co
   Supabase anon (public) key: eyJhbGciOi...
   Test account email: grader.<MãSV>@example.com
   Test account password: Test1234!
   ```
2. `<MãSV>.zip`: Nén toàn bộ mã nguồn của dự án:
   - `package.json` nằm ngay ở tầng root của file zip (không nằm lồng trong thư mục con khác).
   - Bao gồm: `package.json`, `package-lock.json`, `app/`, `components/`, `public/`, `components.json`, `supabase/expenses.sql`, `.env.example`.
   - **TUYỆT ĐỐI KHÔNG GỒM:** `node_modules`, `.next`, `.git`, hoặc bất kỳ file `.env` chứa key thật.
