# 🚀 Quick Start Guide

## Bắt đầu nhanh trong 5 phút

### 1. Kiểm tra n8n đang chạy

```bash
# Truy cập n8n
http://localhost:5678
```

### 2. Import Workflows

1. Mở n8n web interface
2. Click **"Workflows"** → **"Import from File"**
3. Import 2 files:
   - `workflows/news-collector.json`
   - `workflows/daily-report.json`

### 3. Cấu hình Gmail

**Tạo App Password:**
1. https://myaccount.google.com/security
2. Bật **"2-Step Verification"**
3. **"App passwords"** → Generate
4. Copy mật khẩu 16 ký tự

**Thêm vào n8n:**
1. Mở workflow **"Daily Report"**
2. Click node **"Send Email"**
3. Sửa email: `your-email@gmail.com` → email của bạn
4. Click **"Create Credential"**
5. Nhập App Password
6. Save

### 4. Test thử

**Test thu thập tin:**
```bash
# Mở workflow "News Collector"
# Click "Execute Workflow"
# Kiểm tra file
cat data/news/2026-05-01.json
```

**Test gửi email:**
```bash
# Mở workflow "Daily Report"
# Click "Execute Workflow"
# Kiểm tra email inbox
```

### 5. Kích hoạt tự động

1. Workflow **"News Collector"**: Click **"Active"** (chạy mỗi giờ)
2. Workflow **"Daily Report"**: Click **"Active"** (chạy 8h sáng)

## ✅ Xong!

Hệ thống sẽ tự động:
- Thu thập tin mỗi giờ
- Gửi báo cáo lúc 8h sáng
- Lưu dữ liệu vào `data/news/`

## 🔧 Tùy chỉnh

**Thay đổi từ khóa:**
```bash
# Sửa file
notepad config/keywords.json
```

**Thêm nguồn RSS:**
```bash
# Sửa file
notepad config/sources.json
```

**Thay đổi giờ gửi email:**
```bash
# Trong workflow "Daily Report"
# Node "Schedule Daily 8AM"
# Cron: "0 8 * * *" → "0 18 * * *" (6h chiều)
```

## 📚 Tài liệu đầy đủ

- [README.md](README.md) - Tài liệu chi tiết
- [docs/setup-guide.md](docs/setup-guide.md) - Hướng dẫn setup từng bước

## ❓ Gặp vấn đề?

**Không thu thập được tin:**
- Kiểm tra workflow "News Collector" đã Active chưa
- Xem Executions log trong n8n
- Test URL RSS: `curl https://vnexpress.net/rss/tin-moi-nhat.rss`

**Không nhận được email:**
- Kiểm tra Gmail App Password
- Xem spam folder
- Test gửi email thủ công trong workflow

**File không tạo được:**
- Kiểm tra đường dẫn trong Function nodes
- Đảm bảo thư mục `data/news/` tồn tại
- Kiểm tra quyền ghi file

---

💡 **Tip:** Chạy thử workflow thủ công trước khi kích hoạt tự động!
