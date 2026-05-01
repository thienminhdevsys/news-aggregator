# Hướng dẫn Setup Chi tiết - News Aggregator

## 📋 Mục lục

1. [Cài đặt n8n](#1-cài-đặt-n8n)
2. [Tạo Workflow Thu thập Tin](#2-tạo-workflow-thu-thập-tin)
3. [Tạo Workflow Gửi Báo cáo](#3-tạo-workflow-gửi-báo-cáo)
4. [Cấu hình Gmail](#4-cấu-hình-gmail)
5. [Test và Debug](#5-test-và-debug)

---

## 1. Cài đặt n8n

### Cách 1: Docker (Khuyến nghị)

```bash
# Pull image
docker pull n8nio/n8n

# Chạy container
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v C:\Users\admin\projects\news-aggregator:/data \
  n8nio/n8n
```

### Cách 2: npm

```bash
# Cài đặt global
npm install n8n -g

# Chạy n8n
n8n start

# Hoặc chạy với custom data folder
n8n start --data C:\Users\admin\projects\news-aggregator
```

### Kiểm tra

Truy cập: http://localhost:5678

Nếu thấy giao diện n8n → Thành công!

---

## 2. Tạo Workflow Thu thập Tin

### Bước 1: Tạo Workflow Mới

1. Click **"Add Workflow"**
2. Đặt tên: **"News Collector"**
3. Click **"Save"**

### Bước 2: Thêm Schedule Trigger

1. Click **"+"** → Search **"Schedule Trigger"**
2. Cấu hình:
   - **Trigger Interval**: `Hours`
   - **Hours Between Triggers**: `1`
3. Click **"Execute Node"** để test

### Bước 3: Thêm HTTP Request (RSS Reader)

1. Click **"+"** → Search **"HTTP Request"**
2. Cấu hình:
   - **Method**: `GET`
   - **URL**: `https://vnexpress.net/rss/tin-moi-nhat.rss`
   - **Response Format**: `String`
3. Click **"Execute Node"**

### Bước 4: Thêm XML Node (Parse RSS)

1. Click **"+"** → Search **"XML"**
2. Cấu hình:
   - **Mode**: `XML to JSON`
   - **Property Name**: `data`
3. Click **"Execute Node"**

### Bước 5: Thêm Function Node (Extract Items)

1. Click **"+"** → Search **"Function"**
2. Paste code:

```javascript
// Extract items from RSS feed
const rss = items[0].json.rss.channel[0];
const articles = rss.item || [];

// Transform to our format
const results = articles.map(article => {
  return {
    json: {
      id: `vnexpress-${Date.now()}-${Math.random()}`,
      title: article.title[0],
      link: article.link[0],
      description: article.description[0],
      source: 'VnExpress',
      category: 'Tin tức tổng hợp',
      pubDate: new Date(article.pubDate[0]).toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      collectedAt: new Date().toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  };
});

return results;
```

3. Click **"Execute Node"**

### Bước 6: Thêm Function Node (Filter by Keywords)

1. Click **"+"** → Search **"Function"**
2. Paste code:

```javascript
// Load keywords config
const fs = require('fs');
const configPath = 'C:\\Users\\admin\\projects\\news-aggregator\\config\\keywords.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const includeKeywords = config.keywords.include;
const excludeKeywords = config.keywords.exclude;

// Filter articles
const filtered = items.filter(item => {
  const text = (item.json.title + ' ' + item.json.description).toLowerCase();
  
  // Check exclude keywords first
  const hasExclude = excludeKeywords.some(keyword => 
    text.includes(keyword.toLowerCase())
  );
  if (hasExclude) return false;
  
  // Check include keywords
  const hasInclude = includeKeywords.some(keyword => 
    text.includes(keyword.toLowerCase())
  );
  
  return hasInclude;
});

return filtered;
```

3. Click **"Execute Node"**

### Bước 7: Thêm Function Node (Save to JSON)

1. Click **"+"** → Search **"Function"**
2. Paste code:

```javascript
const fs = require('fs');
const path = require('path');

// Get today's date
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const dataDir = 'C:\\Users\\admin\\projects\\news-aggregator\\data\\news';
const filePath = path.join(dataDir, `${today}.json`);

// Load existing data or create new
let existingData = [];
if (fs.existsSync(filePath)) {
  existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Add new articles (avoid duplicates)
const newArticles = items.map(item => item.json);
const existingIds = existingData.map(a => a.id);
const uniqueArticles = newArticles.filter(a => !existingIds.includes(a.id));

// Merge and save
const allArticles = [...existingData, ...uniqueArticles];
fs.writeFileSync(filePath, JSON.stringify(allArticles, null, 2), 'utf8');

return [{
  json: {
    message: `Saved ${uniqueArticles.length} new articles`,
    total: allArticles.length,
    file: filePath
  }
}];
```

3. Click **"Execute Node"**

### Bước 8: Kích hoạt Workflow

1. Click **"Active"** (toggle ở góc trên)
2. Workflow sẽ tự động chạy mỗi giờ

---

## 3. Tạo Workflow Gửi Báo cáo

### Bước 1: Tạo Workflow Mới

1. Click **"Add Workflow"**
2. Đặt tên: **"Daily Report"**
3. Click **"Save"**

### Bước 2: Thêm Schedule Trigger

1. Click **"+"** → Search **"Schedule Trigger"**
2. Cấu hình:
   - **Trigger Times**: `Custom`
   - **Cron Expression**: `0 8 * * *` (8 giờ sáng mỗi ngày)

### Bước 3: Thêm Function Node (Load Data)

1. Click **"+"** → Search **"Function"**
2. Paste code:

```javascript
const fs = require('fs');
const path = require('path');

// Get today's date
const today = new Date().toISOString().split('T')[0];
const dataDir = 'C:\\Users\\admin\\projects\\news-aggregator\\data\\news';
const filePath = path.join(dataDir, `${today}.json`);

// Load data
if (!fs.existsSync(filePath)) {
  return [{
    json: {
      articles: [],
      message: 'No data for today'
    }
  }];
}

const articles = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Group by category
const categories = {};
articles.forEach(article => {
  const cat = article.category || 'Khác';
  if (!categories[cat]) {
    categories[cat] = [];
  }
  categories[cat].push(article);
});

// Transform to array
const categoryArray = Object.keys(categories).map(name => ({
  name,
  articles: categories[name]
}));

return [{
  json: {
    date: new Date().toLocaleDateString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }),
    totalArticles: articles.length,
    totalSources: [...new Set(articles.map(a => a.source))].length,
    totalCategories: categoryArray.length,
    categories: categoryArray
  }
}];
```

3. Click **"Execute Node"**

### Bước 4: Thêm Function Node (Generate HTML)

1. Click **"+"** → Search **"Function"**
2. Paste code:

```javascript
const fs = require('fs');
const Handlebars = require('handlebars');

// Load template
const templatePath = 'C:\\Users\\admin\\projects\\news-aggregator\\templates\\email-report.html';
const templateContent = fs.readFileSync(templatePath, 'utf8');

// Compile template
const template = Handlebars.compile(templateContent);

// Generate HTML
const data = items[0].json;
const html = template(data);

return [{
  json: {
    html,
    subject: `📰 Báo cáo Tin tức - ${data.date}`,
    ...data
  }
}];
```

3. Click **"Execute Node"**

### Bước 5: Thêm Gmail Node

1. Click **"+"** → Search **"Gmail"**
2. Cấu hình:
   - **Resource**: `Message`
   - **Operation**: `Send`
   - **To**: `your-email@gmail.com`
   - **Subject**: `={{$json.subject}}`
   - **Email Type**: `HTML`
   - **Message**: `={{$json.html}}`
3. Click **"Create New Credential"** (xem phần 4)

### Bước 6: Kích hoạt Workflow

1. Click **"Active"**
2. Workflow sẽ tự động chạy lúc 8h sáng mỗi ngày

---

## 4. Cấu hình Gmail

### Bước 1: Tạo App Password

1. Truy cập: https://myaccount.google.com/security
2. Bật **"2-Step Verification"**
3. Scroll xuống **"App passwords"**
4. Click **"Generate"**
5. Chọn:
   - App: **Mail**
   - Device: **Windows Computer**
6. Click **"Generate"**
7. Copy mật khẩu 16 ký tự (ví dụ: `abcd efgh ijkl mnop`)

### Bước 2: Thêm Credential vào n8n

1. Trong Gmail node, click **"Create New Credential"**
2. Chọn **"Gmail OAuth2"**
3. Nhập:
   - **Email**: `your-email@gmail.com`
   - **Client ID**: (để trống nếu dùng App Password)
   - **Client Secret**: (để trống)
4. Hoặc chọn **"SMTP"**:
   - **User**: `your-email@gmail.com`
   - **Password**: `abcd efgh ijkl mnop` (App Password)
   - **Host**: `smtp.gmail.com`
   - **Port**: `587`
   - **SSL/TLS**: Enabled
5. Click **"Save"**

### Bước 3: Test Gửi Email

1. Trong Gmail node, click **"Execute Node"**
2. Kiểm tra email inbox
3. Nếu không nhận được, check spam folder

---

## 5. Test và Debug

### Test Workflow Thu thập Tin

```bash
# Kiểm tra file đã tạo
ls C:\Users\admin\projects\news-aggregator\data\news\

# Xem nội dung
cat C:\Users\admin\projects\news-aggregator\data\news\2026-05-01.json

# Đếm số tin
cat C:\Users\admin\projects\news-aggregator\data\news\2026-05-01.json | jq '. | length'
```

### Test Workflow Gửi Báo cáo

1. Mở workflow **"Daily Report"**
2. Click **"Execute Workflow"**
3. Xem execution log
4. Kiểm tra email

### Debug Lỗi Thường gặp

**Lỗi: "Cannot read file"**
```javascript
// Kiểm tra đường dẫn
const fs = require('fs');
console.log(fs.existsSync('C:\\Users\\admin\\projects\\news-aggregator\\config\\keywords.json'));
```

**Lỗi: "Handlebars is not defined"**
```bash
# Cài đặt Handlebars trong n8n
cd ~/.n8n
npm install handlebars
```

**Lỗi: "Gmail authentication failed"**
- Kiểm tra App Password đã đúng chưa
- Thử tạo App Password mới
- Kiểm tra 2-Step Verification đã bật

### Xem Execution History

1. Trong n8n, click **"Executions"**
2. Xem danh sách các lần chạy
3. Click vào execution để xem chi tiết
4. Xem output của từng node

---

## 🎉 Hoàn thành!

Bây giờ bạn đã có:
- ✅ Workflow thu thập tin tự động mỗi giờ
- ✅ Workflow gửi báo cáo email mỗi sáng 8h
- ✅ Dữ liệu được lưu trữ có cấu trúc
- ✅ Email template đẹp mắt

**Bước tiếp theo:**
1. Thêm nhiều nguồn RSS vào `config/sources.json`
2. Tùy chỉnh từ khóa trong `config/keywords.json`
3. Chỉnh sửa email template theo ý thích
4. Mở rộng thêm tính năng mới

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra n8n execution logs
2. Xem file README.md phần "Xử lý Lỗi"
3. Tạo issue trên GitHub
4. Email: thienminhdev@example.com
