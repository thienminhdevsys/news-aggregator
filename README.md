# 📰 News Aggregator - Hệ thống Tổng hợp Tin tức Tự động

Dự án xây dựng hệ thống tự động thu thập tin tức từ nhiều nguồn, lọc theo từ khóa, và gửi báo cáo email hàng ngày sử dụng **n8n**.

## 🎯 Giới thiệu

**News Aggregator** là hệ thống tự động hóa giúp bạn:
- 📡 Thu thập tin tức từ nhiều nguồn RSS feeds
- 🔍 Lọc thông minh theo từ khóa quan tâm
- 💾 Lưu trữ dữ liệu có cấu trúc
- 📧 Gửi báo cáo email đẹp mắt hàng ngày
- ⏰ Tự động chạy theo lịch định sẵn

## ✨ Tính năng

- ✅ Thu thập tin từ 5+ nguồn RSS tiếng Việt
- 🎯 Lọc theo từ khóa include/exclude
- 📊 Phân loại theo chủ đề tự động
- 💌 Email template responsive đẹp mắt
- 📈 Thống kê số lượng tin theo nguồn
- 🕐 Lên lịch chạy tự động (mỗi giờ/ngày)
- 💾 Lưu trữ lịch sử tin tức theo ngày

## 🏗️ Kiến trúc Hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                    RSS Feeds Sources                     │
│  VnExpress • Tuổi Trẻ • Thanh Niên • Dân Trí • Zing    │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│              n8n Workflow: News Collector                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │RSS Reader│→ │  Filter  │→ │Transform │→ │  Save   │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   JSON Storage                           │
│              data/news/YYYY-MM-DD.json                   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│            n8n Workflow: Daily Report                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │Load Data │→ │ Generate │→ │  Email   │→ │  Done   │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 📁 Cấu trúc Thư mục

```
news-aggregator/
├── README.md                    # Tài liệu này
├── CLAUDE.md                    # Hướng dẫn cho Claude Code
├── config/
│   ├── sources.json            # Cấu hình nguồn RSS feeds
│   └── keywords.json           # Từ khóa lọc tin
├── workflows/
│   ├── news-collector.json     # Workflow thu thập tin
│   └── daily-report.json       # Workflow gửi báo cáo
├── templates/
│   └── email-report.html       # Template email HTML
├── data/
│   └── news/                   # Lưu tin tức theo ngày
│       ├── 2026-05-01.json
│       └── 2026-05-02.json
└── docs/
    └── setup-guide.md          # Hướng dẫn setup chi tiết
```

## 🚀 Cài đặt và Triển khai

### Bước 1: Chuẩn bị Môi trường

**Yêu cầu:**
- ✅ Container Windows 11 với 9Router
- ✅ n8n đã cài đặt và chạy local
- ✅ Tài khoản Gmail (để gửi email)

**Kiểm tra n8n:**
```bash
# Truy cập n8n web interface
http://localhost:5678
```

### Bước 2: Clone Dự án

```bash
cd C:\Users\admin\projects
git clone <repository-url> news-aggregator
cd news-aggregator
```

### Bước 3: Cấu hình Nguồn Tin

**Chỉnh sửa `config/sources.json`:**

```json
{
  "sources": [
    {
      "name": "VnExpress",
      "url": "https://vnexpress.net/rss/tin-moi-nhat.rss",
      "category": "Tin tức tổng hợp",
      "enabled": true
    }
  ],
  "updateInterval": "1h",
  "maxArticlesPerSource": 10
}
```

**Các RSS feeds phổ biến:**
- VnExpress: `https://vnexpress.net/rss/tin-moi-nhat.rss`
- Tuổi Trẻ: `https://tuoitre.vn/rss/tin-moi-nhat.rss`
- Thanh Niên: `https://thanhnien.vn/rss/home.rss`
- Dân Trí: `https://dantri.com.vn/rss/trang-nhat.rss`

### Bước 4: Cấu hình Từ khóa Lọc

**Chỉnh sửa `config/keywords.json`:**

```json
{
  "keywords": {
    "include": [
      "AI",
      "công nghệ",
      "startup",
      "đầu tư"
    ],
    "exclude": [
      "tai nạn",
      "tử vong"
    ]
  },
  "filterMode": "any",
  "caseSensitive": false
}
```

**Giải thích:**
- `include`: Chỉ lấy tin có chứa ít nhất 1 từ khóa này
- `exclude`: Loại bỏ tin có chứa từ khóa này
- `filterMode`: `"any"` (có 1 từ) hoặc `"all"` (có tất cả từ)
- `caseSensitive`: `false` (không phân biệt hoa thường)

### Bước 5: Import Workflows vào n8n

**5.1. Mở n8n Web Interface:**
```
http://localhost:5678
```

**5.2. Import Workflow Thu thập Tin:**
1. Click **"Workflows"** → **"Add Workflow"**
2. Click **"⋮"** (menu) → **"Import from File"**
3. Chọn file `workflows/news-collector.json`
4. Click **"Save"**

**5.3. Import Workflow Gửi Báo cáo:**
1. Lặp lại bước trên với file `workflows/daily-report.json`

### Bước 6: Cấu hình Gmail Credentials

**6.1. Tạo App Password cho Gmail:**
1. Truy cập: https://myaccount.google.com/security
2. Bật **"2-Step Verification"**
3. Vào **"App passwords"**
4. Chọn **"Mail"** và **"Windows Computer"**
5. Copy mật khẩu 16 ký tự

**6.2. Thêm Credentials vào n8n:**
1. Trong n8n, click **"Credentials"** → **"Add Credential"**
2. Chọn **"Gmail OAuth2"** hoặc **"SMTP"**
3. Nhập thông tin:
   - Email: `your-email@gmail.com`
   - Password: `<app-password-16-chars>`
4. Click **"Save"**

### Bước 7: Kích hoạt Workflows

**7.1. Workflow News Collector:**
1. Mở workflow **"News Collector"**
2. Click node **"Schedule Trigger"**
3. Cấu hình:
   - Mode: `Every Hour`
   - Hoặc: `Cron Expression: 0 * * * *`
4. Click **"Active"** để bật workflow

**7.2. Workflow Daily Report:**
1. Mở workflow **"Daily Report"**
2. Click node **"Schedule Trigger"**
3. Cấu hình:
   - Mode: `Every Day`
   - Time: `08:00` (8 giờ sáng UTC+7)
   - Hoặc: `Cron Expression: 0 8 * * *`
4. Cấu hình node **"Send Email"**:
   - To: `your-email@gmail.com`
   - Subject: `📰 Báo cáo Tin tức - {{$now.format('dd/MM/yyyy')}}`
5. Click **"Active"** để bật workflow

## 📖 Hướng dẫn Sử dụng

### Chạy Thủ công

**Thu thập tin ngay lập tức:**
1. Mở workflow **"News Collector"**
2. Click **"Execute Workflow"**
3. Xem kết quả trong `data/news/YYYY-MM-DD.json`

**Gửi báo cáo ngay:**
1. Mở workflow **"Daily Report"**
2. Click **"Execute Workflow"**
3. Kiểm tra email

### Xem Dữ liệu Thu thập

```bash
# Xem tin tức hôm nay
cat data/news/2026-05-01.json

# Đếm số tin
cat data/news/2026-05-01.json | jq '. | length'

# Lọc theo nguồn
cat data/news/2026-05-01.json | jq '.[] | select(.source=="VnExpress")'
```

### Tùy chỉnh Email Template

**Chỉnh sửa `templates/email-report.html`:**

```html
<!-- Thay đổi màu sắc -->
<style>
  .container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
</style>

<!-- Thêm logo -->
<div class="header">
  <img src="your-logo.png" alt="Logo" width="100">
  <h1>📰 Báo cáo Tin tức</h1>
</div>
```

## 🔧 Cấu hình Nâng cao

### Thêm Nguồn RSS Mới

**Thêm vào `config/sources.json`:**

```json
{
  "name": "Nguồn mới",
  "url": "https://example.com/rss",
  "category": "Chủ đề",
  "enabled": true
}
```

### Lọc Theo Nhiều Điều kiện

**Cập nhật `config/keywords.json`:**

```json
{
  "keywords": {
    "include": ["AI", "blockchain"],
    "exclude": ["quảng cáo", "PR"]
  },
  "filterMode": "all",
  "minWordCount": 50,
  "maxAge": "24h"
}
```

### Lưu vào Database

**Thay vì JSON, lưu vào PostgreSQL:**

1. Cài đặt PostgreSQL
2. Tạo database: `news_db`
3. Trong n8n workflow, thay node **"Write File"** bằng **"Postgres"**
4. Cấu hình connection string

## 🐛 Xử lý Lỗi Thường gặp

### Lỗi: "Cannot read RSS feed"

**Nguyên nhân:** URL RSS không hợp lệ hoặc website chặn

**Giải pháp:**
```bash
# Test RSS feed
curl -I https://vnexpress.net/rss/tin-moi-nhat.rss

# Nếu bị chặn, thêm User-Agent
curl -H "User-Agent: Mozilla/5.0" https://vnexpress.net/rss/tin-moi-nhat.rss
```

### Lỗi: "Email not sent"

**Nguyên nhân:** Sai Gmail credentials hoặc chưa bật App Password

**Giải pháp:**
1. Kiểm tra lại App Password
2. Thử gửi email test trong n8n
3. Kiểm tra Gmail settings: "Less secure app access"

### Lỗi: "Workflow not triggered"

**Nguyên nhân:** Cron expression sai hoặc workflow chưa active

**Giải pháp:**
1. Kiểm tra workflow status: phải là **"Active"**
2. Test cron expression: https://crontab.guru
3. Xem execution history trong n8n

## 💡 Tips và Best Practices

### Tối ưu Hiệu suất

1. **Giới hạn số tin:** Đặt `maxArticlesPerSource: 10`
2. **Cache RSS:** Lưu cache 15 phút để tránh spam
3. **Batch processing:** Xử lý nhiều nguồn song song

### Bảo mật

1. **Không commit credentials:** Thêm vào `.gitignore`
2. **Sử dụng App Password:** Không dùng mật khẩu Gmail chính
3. **Giới hạn quyền:** n8n chỉ cần quyền gửi email

### Monitoring

1. **Kiểm tra logs:** n8n → Executions → View logs
2. **Alert khi lỗi:** Thêm node Telegram/Discord để nhận thông báo
3. **Backup dữ liệu:** Tự động backup folder `data/` hàng tuần

## 📊 Ví dụ Dữ liệu

**File `data/news/2026-05-01.json`:**

```json
[
  {
    "id": "vnexpress-123456",
    "title": "AI ChatGPT ra mắt tính năng mới",
    "link": "https://vnexpress.net/...",
    "description": "OpenAI công bố...",
    "source": "VnExpress",
    "category": "Công nghệ",
    "pubDate": "01/05/2026 08:30",
    "keywords": ["AI", "ChatGPT"],
    "collectedAt": "01/05/2026 09:00"
  }
]
```

## 🎓 Kiến thức Học được

### Về n8n
- ✅ Tạo và quản lý workflows
- ✅ Sử dụng nodes: RSS, Filter, Transform, Email
- ✅ Lên lịch với Cron expressions
- ✅ Xử lý lỗi và retry logic

### Về RSS Feeds
- ✅ Cấu trúc XML của RSS
- ✅ Parse và extract dữ liệu
- ✅ Handle encoding tiếng Việt

### Về Automation
- ✅ Thiết kế workflow tự động
- ✅ Data transformation
- ✅ Error handling
- ✅ Monitoring và logging

## 🛠️ Công nghệ Sử dụng

- **n8n**: Workflow automation platform
- **RSS Parser**: Đọc và parse RSS feeds
- **JSON**: Lưu trữ dữ liệu
- **HTML/CSS**: Email template
- **Gmail SMTP**: Gửi email
- **Cron**: Lên lịch tự động

## 📚 Tài nguyên Tham khảo

### n8n
- Documentation: https://docs.n8n.io
- Community: https://community.n8n.io
- Templates: https://n8n.io/workflows

### RSS Feeds
- RSS Specification: https://www.rssboard.org/rss-specification
- Validator: https://validator.w3.org/feed/

### Cron
- Cron Expression Generator: https://crontab.guru
- Cron Syntax: https://en.wikipedia.org/wiki/Cron

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón!

1. Fork repository
2. Tạo branch: `git checkout -b feature/TenTinhNang`
3. Commit: `git commit -m 'Thêm tính năng X'`
4. Push: `git push origin feature/TenTinhNang`
5. Tạo Pull Request

## 📝 Roadmap

### Version 1.0 (Hiện tại)
- ✅ Thu thập từ RSS feeds
- ✅ Lọc theo từ khóa
- ✅ Gửi email hàng ngày

### Version 2.0 (Kế hoạch)
- ⏳ Lưu vào PostgreSQL
- ⏳ Web dashboard để xem tin
- ⏳ AI tóm tắt tin tức
- ⏳ Phân loại tự động bằng ML
- ⏳ Mobile app notifications

## 👨‍💻 Tác giả

**Thiên Minh Dev**
- GitHub: [@thienminhdevsys](https://github.com/thienminhdevsys)

## 📝 Giấy phép

Dự án này được phát hành dưới giấy phép MIT.

## 🎯 Kết luận

**News Aggregator** là giải pháp hoàn hảo để:
- ✅ Tiết kiệm thời gian đọc tin
- ✅ Tập trung vào nội dung quan tâm
- ✅ Học automation với n8n
- ✅ Áp dụng vào công việc thực tế

**Bước tiếp theo:**
1. Setup và chạy thử hệ thống
2. Tùy chỉnh theo nhu cầu riêng
3. Mở rộng thêm tính năng mới

---

⭐ Nếu bạn thấy dự án hữu ích, hãy cho một star!

💬 Có câu hỏi? Tạo issue trên GitHub.

📧 Email: thienminhdev@example.com
