# Hướng Dẫn Deploy Hệ Thống Lên Vercel 🚀

Hệ thống đã được tối ưu hóa hoàn toàn để hỗ trợ deployment trên **Vercel** dưới dạng ứng dụng Full-stack (Vite React Frontend + Vercel Serverless Express API).

---

## Các Cấu Hình Đã Được Tối Ưu Tự Động:

1. **`vercel.json`**:
   - Tự động điều hướng các request `/api/*` tới Vercel Serverless Function.
   - Hỗ trợ Single Page Application (SPA routing) cho sinh viên truy cập qua link `/submit/:token`.
2. **`api/index.ts`**:
   - Entry point Serverless function tự động chạy Express API backend trên hạ tầng Cloud của Vercel mà không cần cấu hình port tĩnh.
3. **`server.ts`**:
   - Tương thích song song cả môi trường Vercel Serverless và môi trường Node.js local / Cloud Run.

---

## 🛠️ Các Bước Deploy Lên Vercel:

### Cách 1: Đưa lên Vercel qua GitHub (Khuyên dùng)

1. **Push source code lên repository GitHub** của bạn.
2. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard) và chọn **"Add New"** > **"Project"**.
3. Import repository GitHub vừa push.
4. Tại mục **Environment Variables** (Biến môi trường), thêm khóa sau:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: *(Nhập Gemini API Key của bạn từ Google AI Studio)*
5. Giữ nguyên các thông số mặc định:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Nhấn **Deploy**. Vercel sẽ tự động build frontend và kích hoạt API Serverless function.

---

### Cách 2: Deploy trực tiếp bằng Vercel CLI

1. Cài đặt Vercel CLI trên máy cá nhân:
   ```bash
   npm i -g vercel
   ```
2. Đăng nhập Vercel:
   ```bash
   vercel login
   ```
3. Chạy lệnh deploy:
   ```bash
   vercel
   ```
4. Khi deploy thành công bản Production:
   ```bash
   vercel --prod
   ```

---

## 🔒 Thêm GEMINI_API_KEY trên Vercel:

Nếu quên chưa thêm API Key lúc Import:
1. Vào **Project Settings** trên Vercel.
2. Chọn **Environment Variables**.
3. Thêm `GEMINI_API_KEY` với API key lấy tại [Google AI Studio](https://aistudio.google.com/app/apikey).
4. Vào mục **Deployments** > bấm dấu 3 chấm `...` ở bản deploy mới nhất > Chọn **Redeploy**.

---

## 🛠️ Khắc phục lỗi "No Output Directory named 'dist' found":

Lỗi này xảy ra khi Vercel đang build một commit cũ (chưa có file cấu hình Node/Vite mới):

1. **Kiểm tra Commit trên GitHub**:
   - Đảm bảo bạn đã **push toàn bộ code mới** (bao gồm `package.json`, `vite.config.ts`, `vercel.json`, `api/index.ts`) lên nhánh `main` của repository GitHub.
   - Nhìn vào hình ảnh log Vercel: Nếu thấy commit tên `ba625d5 Initial commit: Laravel...` nghĩa là Vercel đang lấy bản Laravel cũ chưa update code Node/React.
2. **Cấu hình lại Project Settings trên Vercel**:
   - Vào **Project Settings** > **General**
   - **Framework Preset**: Chọn **Vite**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Kích hoạt Redeploy**:
   - Sau khi push code mới lên GitHub, Vercel sẽ tự động trigger build mới.
   - Hoặc bạn vào tab **Deployments** trên Vercel > Bấm dấu `...` > **Redeploy**.
