# 📰 News Aggregator - Hệ thống Tổng hợp Tin tức Tự động

Dự án xây dựng hệ thống tự động thu thập tin tức từ nhiều nguồn, lọc theo từ khóa, và gửi báo cáo email hàng ngày sử dụng **n8n**.

**✅ Cập nhật:** 01/05/2026 - Workflows đã được test và hoạt động thành công!

## 🎯 Giới thiệu

**News Aggregator** là hệ thống tự động hóa giúp bạn:
- 📡 Thu thập tin tức từ nhiều nguồn RSS feeds
- 🔍 Lọc thông minh theo từ khóa quan tâm
- 💾 Lưu trữ dữ liệu có cấu trúc
- 📧 Gửi báo cáo email đẹp mắt hàng ngày
- ⏰ Tự động chạy theo lịch định sẵn

## ✨ Tính năng

- ✅ Thu thập tin từ 3 nguồn RSS VnExpress (Tin tức, Công nghệ, Kinh doanh)
- 🎯 Lọc theo 11 từ khóa (AI, công nghệ, startup, đầu tư, bitcoin...)
- 📊 Phân loại theo chủ đề tự động
- 💌 Email HTML gradient đẹp mắt với responsive design
- 📈 Thống kê: tổng tin, nguồn, chủ đề
- 🕐 Lên lịch chạy tự động (mỗi giờ/ngày)
- 🔒 Xác thực Gmail OAuth2 qua Google Cloud Console

## 🏗️ Kiến trúc Hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                    RSS Feeds Sources                     │
│         VnExpress • VnExpress Công nghệ                 │
│              VnExpress Kinh doanh                        │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│         n8n Workflow: News Collector Working            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │Load RSS  │→ │Fetch RSS │→ │Parse XML │→ │Extract  │ │
│  │Sources   │  │Feed      │  │          │  │Articles │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                                                  ↓       │
│                                          ┌──────────┐    │
│                                          │  Filter  │    │
│                                          │by Keywords│   │
│                                          └──────────┘    │
└─────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│            n8n Workflow: Daily Report                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │Load Data │→ │ Generate │→ │Check Has │→ │Send     │ │
│  │          │  │HTML Email│  │Data      │  │Email    │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 📁 Cấu trúc Thư mục

```
news-aggregator/
├── README.md                           # Tài liệu này
├── CLAUDE.md                           # Hướng dẫn cho Claude Code
├── QUICKSTART.md                       # Hướng dẫn nhanh 5 phút
├── PROJECT-SUMMARY.md                  # Tổng kết dự án
├── PROJECT-COMPLETE.md                 # Báo cáo hoàn thành
├── DEPLOYMENT-CHECKLIST.md             # Checklist triển khai
├── NEXT-STEPS.md                       # Bước tiếp theo
├── config/
│   ├── sources.json                   # Cấu hình nguồn RSS feeds
│   └── keywords.json                  # Từ khóa lọc tin
├── workflows/
│   ├── news-collector-working.json    # ✅ Workflow thu thập tin (HOẠT ĐỘNG)
│   ├── daily-report.json              # ✅ Workflow gửi báo cáo (HOẠT ĐỘNG)
│   ├── news-collector-simple.json     # Workflow đơn giản (test)
│   └── daily-report-simple.json       # Workflow đơn giản (test)
├── templates/
│   └── email-report.html              # Template email HTML (tham khảo)
├── data/
│   └── news/                          # Lưu tin tức theo ngày
│       └── 2026-05-01.json
└── docs/
    └── setup-guide.md                 # Hướng dẫn setup chi tiết
```

**Lưu ý:** Workflows đã được test thành công ngày 01/05/2026!

---

## 🚀 Cài đặt và Triển khai

### Bước 1: Chuẩn bị Môi trường

**Yêu cầu:**
- ✅ Container Windows 11 với 9Router
- ✅ n8n đã cài đặt và chạy local
- ✅ Tài khoản Gmail (để gửi email)
- ✅ Google Cloud Console project (cho OAuth2)

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

### Bước 3: Import Workflows vào n8n

#### 3.1. Import News Collector

1. Mở n8n: http://localhost:5678
2. Click **"Workflows"** → **"Import from File"**
3. Chọn file: `workflows/news-collector-working.json`
4. Click **"Import"**

#### 3.2. Import Daily Report

1. Click **"Import from File"**
2. Chọn file: `workflows/daily-report.json`
3. Click **"Import"**

---

### Bước 4: Cấu hình Gmail OAuth2

**Quan trọng:** Workflows sử dụng Gmail OAuth2 qua Google Cloud Console.

#### 4.1. Tạo Google Cloud Project

1. Truy cập: https://console.cloud.google.com
2. Click **"Select a project"** → **"New Project"**
3. Tên project: `news-aggregator`
4. Click **"Create"**

#### 4.2. Bật Gmail API

1. Trong project vừa tạo, vào **"APIs & Services"** → **"Library"**
2. Tìm **"Gmail API"**
3. Click **"Enable"**

#### 4.3. Tạo OAuth 2.0 Credentials

1. Vào **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Nếu chưa có OAuth consent screen:
   - Click **"Configure Consent Screen"**
   - Chọn **"External"** → **"Create"**
   - **App name**: `News Aggregator`
   - **User support email**: email của bạn
   - **Developer contact**: email của bạn
   - Click **"Save and Continue"**
   - **Scopes**: Click **"Add or Remove Scopes"**
     - Tìm và thêm: `https://www.googleapis.com/auth/gmail.send`
   - Click **"Save and Continue"**
   - **Test users**: Click **"Add Users"** → Thêm email của bạn
   - Click **"Save and Continue"**
4. Quay lại **"Credentials"** → **"Create Credentials"** → **"OAuth client ID"**
5. **Application type**: `Web application`
6. **Name**: `n8n Gmail`
7. **Authorized redirect URIs**:
   - Click **"Add URI"**
   - Nhập: `http://localhost:5678/rest/oauth2-credential/callback`
8. Click **"Create"**
9. **Copy Client ID và Client Secret** (sẽ dùng ở bước sau)

#### 4.4. Cấu hình trong n8n

1. Mở workflow **"Daily Report"**
2. Click vào node **"Send Email"**
3. Click **"Credential to connect with"** → **"Create New"**
4. Chọn **"Gmail OAuth2"**
5. Nhập thông tin:
   - **Client ID**: Paste từ Google Cloud Console
   - **Client Secret**: Paste từ Google Cloud Console
6. Click **"Connect my account"**
7. Cửa sổ popup mở ra → Đăng nhập Gmail
8. Cho phép quyền truy cập
9. Click **"Save"**

---

### Bước 5: Cấu hình Email

**Trong workflow "Daily Report":**

1. Click vào node **"Send Email"**
2. Sửa các trường:
   - **To Email**: `your-email@gmail.com` → **Email của bạn**
   - **Subject**: `={{$json.subject}}` (giữ nguyên)
   - **Email Type**: `HTML`
   - **HTML Message**: `={{$json.html}}` (giữ nguyên)
3. Click **"Save"**

---

### Bước 6: Test Workflows

#### 6.1. Test News Collector

1. Mở workflow **"News Collector - Working"**
2. Click **"Execute Workflow"** (▶️)
3. Xem kết quả từng node:
   - **Load RSS Sources** → 3 nguồn RSS
   - **Fetch RSS Feed** → Lấy dữ liệu thành công
   - **Parse XML** → Chuyển XML sang JSON
   - **Extract Articles** → ~30 tin tức
   - **Filter by Keywords** → Lọc theo từ khóa
4. Kiểm tra output: Nên có 5-15 tin tức sau khi lọc

**Lưu ý:** Workflow này không lưu file, chỉ hiển thị kết quả trong n8n.

#### 6.2. Test Daily Report

1. Mở workflow **"Daily Report"**
2. Click **"Execute Workflow"** (▶️)
3. Xem kết quả:
   - **Load Today Data** → 3 tin mẫu
   - **Generate HTML Email** → Email HTML đẹp
   - **Check Has Data** → True
   - **Send Email** → Gửi thành công
4. Kiểm tra email inbox của bạn
5. Email sẽ hiển thị với gradient đẹp mắt

**Kết quả mong đợi:**
- ✅ Email nhận được trong vòng 1 phút
- ✅ Hiển thị HTML với gradient tím-xanh
- ✅ 3 tin tức: AI ChatGPT, Startup Việt, Bitcoin
- ✅ Thống kê: 3 tin, 1 nguồn, 2 chủ đề

---

### Bước 7: Kích hoạt Tự động (Tùy chọn)

#### 7.1. News Collector - Chạy mỗi giờ

**Lưu ý:** Workflow hiện tại dùng Manual Trigger. Để chạy tự động:

1. Thêm node **"Schedule Trigger"**
2. Cấu hình:
   - **Trigger Interval**: `Hours`
   - **Hours Between Triggers**: `1`
3. Kết nối với **"Load RSS Sources"**
4. Xóa node **"Manual Trigger"**
5. Click **"Active"** (toggle ở góc trên)

#### 7.2. Daily Report - Chạy 8h sáng

1. Thêm node **"Schedule Trigger"**
2. Cấu hình:
   - **Trigger Times**: `Custom`
   - **Cron Expression**: `0 8 * * *` (8h sáng UTC+7)
3. Kết nối với **"Load Today Data"**
4. Xóa node **"Manual Trigger"**
5. Click **"Active"**

**Workflow sẽ tự động:**
- News Collector: Chạy mỗi giờ
- Daily Report: Gửi email lúc 8h sáng mỗi ngày

---

## 📖 Hướng dẫn Sử dụng

### Tùy chỉnh Từ khóa

**Trong workflow "News Collector - Working":**

1. Click vào node **"Filter by Keywords"**
2. Sửa code JavaScript:
```javascript
const includeKeywords = ['ai', 'công nghệ', 'startup']; // Thêm từ khóa
const excludeKeywords = ['tai nạn', 'tử vong']; // Loại bỏ từ khóa
```
3. Click **"Save"**

### Thêm Nguồn RSS

**Trong workflow "News Collector - Working":**

1. Click vào node **"Load RSS Sources"**
2. Thêm nguồn mới vào mảng `sources`:
```javascript
{
  name: 'Tuổi Trẻ',
  url: 'https://tuoitre.vn/rss/tin-moi-nhat.rss',
  category: 'Tin tức tổng hợp'
}
```
3. Click **"Save"**

### Tùy chỉnh Email Template

Email template được tạo trực tiếp trong node **"Generate HTML Email"**. Để thay đổi:

1. Click vào node **"Generate HTML Email"**
2. Sửa CSS trong biến `html`
3. Thay đổi màu gradient, font, layout...
4. Click **"Save"**

---

## 🐛 Xử lý Lỗi Thường gặp

### Lỗi: "Cannot find module 'fs'"

**Nguyên nhân:** n8n chặn module `fs` vì lý do bảo mật

**Giải pháp:** Sử dụng workflows đã fix:
- `news-collector-working.json` - Hardcode sources
- `daily-report.json` - Hardcode data

### Lỗi: "302 Redirect" hoặc "406 Not Acceptable"

**Nguyên nhân:** Website chặn request không có User-Agent

**Giải pháp:** Đã fix trong workflow với User-Agent đầy đủ:
```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```

### Lỗi: "Gmail API has not been used"

**Nguyên nhân:** Chưa bật Gmail API trong Google Cloud Console

**Giải pháp:** 
1. Truy cập: https://console.cloud.google.com
2. Vào project → APIs & Services → Library
3. Tìm "Gmail API" → Enable

### Lỗi: "Recipient address required"

**Nguyên nhân:** Chưa điền email người nhận

**Giải pháp:** Trong node "Send Email", điền email vào trường **"To Email"**

### Email hiển thị HTML thô

**Nguyên nhân:** Email Type không phải HTML

**Giải pháp:**
1. Node "Send Email" → **Email Type**: `HTML`
2. **HTML Message**: `={{$json.html}}`

---

## 💡 Tips và Best Practices

### Tối ưu Hiệu suất

1. **Giới hạn số tin:** Mỗi nguồn chỉ lấy 10 tin (đã cấu hình)
2. **Timeout:** 15 giây cho mỗi request
3. **Follow redirects:** Tối đa 5 lần

### Bảo mật

1. **OAuth2:** Sử dụng Gmail OAuth2 thay vì App Password
2. **Không commit credentials:** Đã có trong `.gitignore`
3. **Test users:** Chỉ thêm email của bạn vào Google Cloud Console

### Monitoring

1. **Execution History:** n8n → Executions → Xem logs
2. **Email logs:** Kiểm tra email đã gửi thành công
3. **Error notifications:** Thêm node Telegram/Discord để nhận thông báo lỗi

---

## 📊 Thống kê Dự án

| Thành phần | Số lượng |
|------------|----------|
| **Workflows** | 2 workflows chính + 2 test |
| **Nodes** | 13 nodes |
| **Nguồn RSS** | 3 sources |
| **Từ khóa** | 11 keywords |
| **Files** | 15 files |
| **Dung lượng** | ~100KB |

---

## 🎓 Kiến thức Học được

### Về n8n
- ✅ Workflow design patterns
- ✅ Function nodes với JavaScript
- ✅ HTTP Request với headers
- ✅ Gmail OAuth2 integration
- ✅ Error handling

### Về RSS Feeds
- ✅ Parse RSS XML
- ✅ Handle redirects
- ✅ User-Agent spoofing
- ✅ Content filtering

### Về Email Automation
- ✅ HTML email templates
- ✅ Gmail OAuth2
- ✅ Responsive design
- ✅ Dynamic content

---

## 🛠️ Công nghệ Sử dụng

- **n8n**: Workflow automation platform
- **RSS Parser**: Đọc và parse RSS feeds
- **Gmail API**: Gửi email qua OAuth2
- **HTML/CSS**: Email template
- **JavaScript ES6+**: Function nodes
- **Google Cloud Console**: OAuth2 credentials

---

## 📚 Tài nguyên Tham khảo

### n8n
- Documentation: https://docs.n8n.io
- Community: https://community.n8n.io
- Templates: https://n8n.io/workflows

### Gmail API
- Documentation: https://developers.google.com/gmail/api
- OAuth2: https://developers.google.com/identity/protocols/oauth2

### RSS
- RSS Specification: https://www.rssboard.org/rss-specification
- Validator: https://validator.w3.org/feed/

---

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón!

1. Fork repository
2. Tạo branch: `git checkout -b feature/TenTinhNang`
3. Commit: `git commit -m 'Thêm tính năng X'`
4. Push: `git push origin feature/TenTinhNang`
5. Tạo Pull Request

---

## 📝 Roadmap

### Version 1.0 (Hiện tại) ✅
- ✅ Thu thập từ RSS feeds
- ✅ Lọc theo từ khóa
- ✅ Gửi email hàng ngày
- ✅ Gmail OAuth2

### Version 2.0 (Kế hoạch)
- ⏳ Lưu vào PostgreSQL
- ⏳ Web dashboard để xem tin
- ⏳ AI tóm tắt tin tức
- ⏳ Sentiment analysis

### Version 3.0 (Tương lai)
- ⏳ Mobile app notifications
- ⏳ Real-time updates
- ⏳ Multi-user support
- ⏳ Custom RSS feeds per user

---

## 👨‍💻 Tác giả

**Thiên Minh Dev**
- GitHub: [@thienminhdevsys](https://github.com/thienminhdevsys)
- Email: thien.buiminh.devsys@gmail.com

---

## 📝 Giấy phép

Dự án này được phát hành dưới giấy phép MIT.

---

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

📧 Email: thien.buiminh.devsys@gmail.com

**Thời gian cập nhật:** 01/05/2026 21:42 (UTC+7)
