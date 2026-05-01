# ✅ Deployment Checklist - News Aggregator

## 📋 Danh sách Kiểm tra Triển khai

### Thời gian: 01/05/2026 14:11 (UTC+7)

---

## 🎯 Trước khi Triển khai

### 1. Môi trường
- [ ] Windows 11 container đang chạy
- [ ] 9Router đã cài đặt
- [ ] Claude Code đã cài đặt
- [ ] n8n container đang chạy (localhost:5678)

### 2. Kiểm tra Files
- [x] README.md (14KB)
- [x] QUICKSTART.md (2.5KB)
- [x] PROJECT-SUMMARY.md (7KB)
- [x] NEXT-STEPS.md (6.4KB)
- [x] CLAUDE.md (1.1KB)
- [x] config/sources.json
- [x] config/keywords.json
- [x] workflows/news-collector.json
- [x] workflows/daily-report.json
- [x] templates/email-report.html
- [x] docs/setup-guide.md

**Tổng: 11 files, 83KB**

---

## 🚀 Triển khai (15 phút)

### Bước 1: Khởi động n8n (2 phút)

```bash
# Kiểm tra n8n đang chạy
curl http://localhost:5678

# Nếu chưa chạy:
docker start n8n
# Hoặc:
n8n start
```

- [ ] n8n accessible tại http://localhost:5678

### Bước 2: Import Workflows (3 phút)

```bash
# Trong n8n web interface:
# 1. Workflows → Import from File
# 2. Chọn workflows/news-collector.json
# 3. Chọn workflows/daily-report.json
```

- [ ] Workflow "News Collector" đã import
- [ ] Workflow "Daily Report" đã import

### Bước 3: Cấu hình Gmail (5 phút)

**Tạo App Password:**
```
1. https://myaccount.google.com/security
2. 2-Step Verification → ON
3. App passwords → Generate
4. Copy 16-char password
```

**Trong n8n:**
```
1. Mở workflow "Daily Report"
2. Node "Send Email"
3. Sửa email: your-email@gmail.com
4. Create Credential → Nhập App Password
5. Save
```

- [ ] Gmail App Password đã tạo
- [ ] Credential đã thêm vào n8n
- [ ] Email address đã cập nhật

### Bước 4: Test Workflows (3 phút)

**Test News Collector:**
```bash
# Trong n8n:
# 1. Mở workflow "News Collector"
# 2. Click "Execute Workflow"
# 3. Xem output
```

- [ ] Workflow chạy thành công
- [ ] File data/news/2026-05-01.json đã tạo
- [ ] Có dữ liệu tin tức

**Test Daily Report:**
```bash
# Trong n8n:
# 1. Mở workflow "Daily Report"
# 2. Click "Execute Workflow"
# 3. Check email inbox
```

- [ ] Workflow chạy thành công
- [ ] Email đã nhận được
- [ ] Template hiển thị đúng

### Bước 5: Kích hoạt (2 phút)

```bash
# Trong n8n:
# 1. Workflow "News Collector" → Active ON
# 2. Workflow "Daily Report" → Active ON
```

- [ ] News Collector: Active (chạy mỗi giờ)
- [ ] Daily Report: Active (chạy 8h sáng)

---

## ✅ Sau Triển khai

### Kiểm tra Hoạt động

**Sau 1 giờ:**
- [ ] News Collector đã chạy tự động
- [ ] File data/news/ có dữ liệu mới
- [ ] Không có lỗi trong Executions log

**Ngày hôm sau (8h sáng):**
- [ ] Daily Report đã chạy tự động
- [ ] Email báo cáo đã nhận được
- [ ] Nội dung email chính xác

### Monitoring

```bash
# Xem execution history
# n8n → Executions → View logs

# Kiểm tra files
ls -lh data/news/

# Đếm số tin
cat data/news/2026-05-01.json | jq '. | length'
```

- [ ] Executions log không có lỗi
- [ ] Dữ liệu được lưu đều đặn
- [ ] Email gửi đúng giờ

---

## 🎨 Tùy chỉnh (Optional)

### Thay đổi Từ khóa

```bash
notepad config/keywords.json
```

- [ ] Thêm từ khóa quan tâm
- [ ] Loại bỏ từ khóa không cần

### Thêm Nguồn RSS

```bash
notepad config/sources.json
```

- [ ] Thêm nguồn RSS mới
- [ ] Test URL RSS hợp lệ

### Tùy chỉnh Email

```bash
notepad templates/email-report.html
```

- [ ] Thay đổi màu sắc
- [ ] Tùy chỉnh layout
- [ ] Thêm logo/branding

---

## 🐛 Troubleshooting

### Lỗi thường gặp

**1. Cannot connect to n8n**
```bash
# Kiểm tra n8n đang chạy
docker ps | grep n8n
# Hoặc
netstat -an | grep 5678
```

**2. RSS feed không load được**
```bash
# Test URL
curl -I https://vnexpress.net/rss/tin-moi-nhat.rss
```

**3. Email không gửi được**
```bash
# Kiểm tra Gmail App Password
# Xem spam folder
# Test credential trong n8n
```

**4. File không tạo được**
```bash
# Kiểm tra quyền ghi
ls -la data/news/
# Tạo thư mục nếu chưa có
mkdir -p data/news
```

---

## 📊 Metrics Theo dõi

### Hàng ngày
- Số tin thu thập được
- Số nguồn hoạt động
- Email gửi thành công
- Execution time

### Hàng tuần
- Tổng tin thu thập
- Từ khóa phổ biến
- Nguồn tin chất lượng
- Performance issues

### Hàng tháng
- Xu hướng tin tức
- Tối ưu từ khóa
- Thêm/bớt nguồn
- Cải tiến workflow

---

## 🎯 Success Criteria

Dự án thành công khi:

- ✅ Workflows chạy tự động không lỗi
- ✅ Thu thập được 50+ tin/ngày
- ✅ Email gửi đúng giờ mỗi sáng
- ✅ Nội dung email chính xác và đẹp
- ✅ Không cần can thiệp thủ công
- ✅ Tiết kiệm được thời gian đọc tin

---

## 📞 Support

### Tài liệu
- README.md - Tài liệu đầy đủ
- QUICKSTART.md - Hướng dẫn nhanh
- docs/setup-guide.md - Setup chi tiết
- NEXT-STEPS.md - Bước tiếp theo

### Liên hệ
- GitHub Issues
- Email: thienminhdev@example.com
- Claude Code AI

---

## 🎉 Hoàn thành!

Khi tất cả checkbox đã check:
- ✅ Dự án đã triển khai thành công
- ✅ Hệ thống đang chạy tự động
- ✅ Sẵn sàng sử dụng hàng ngày

**Chúc mừng! Bạn đã có hệ thống tự động hóa tin tức của riêng mình!**

---

📅 **Deployment Date:** 01/05/2026
⏰ **Deployment Time:** 14:11 UTC+7
✅ **Status:** Ready to Deploy
