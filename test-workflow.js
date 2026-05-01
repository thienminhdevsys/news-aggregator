const fs = require('fs');
const https = require('https');

console.log('🚀 Testing News Collector...\n');

// Test 1: Load config
console.log('1️⃣ Loading config files...');
try {
  const sources = JSON.parse(fs.readFileSync('./config/sources.json', 'utf8'));
  const keywords = JSON.parse(fs.readFileSync('./config/keywords.json', 'utf8'));
  console.log(`✅ Loaded ${sources.sources.length} RSS sources`);
  console.log(`✅ Loaded ${keywords.keywords.include.length} include keywords\n`);
} catch (error) {
  console.error('❌ Error loading config:', error.message);
  process.exit(1);
}

// Test 2: Fetch RSS feed
console.log('2️⃣ Testing RSS feed fetch...');
const testUrl = 'https://vnexpress.net/rss/tin-moi-nhat.rss';

https.get(testUrl, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (data.includes('<rss')) {
      console.log('✅ RSS feed fetched successfully');
      console.log(`✅ Response size: ${(data.length / 1024).toFixed(2)} KB\n`);

      // Test 3: Check data directory
      console.log('3️⃣ Checking data directory...');
      if (!fs.existsSync('./data/news')) {
        fs.mkdirSync('./data/news', { recursive: true });
        console.log('✅ Created data/news directory');
      } else {
        console.log('✅ data/news directory exists');
      }

      // Test 4: Write test file
      console.log('\n4️⃣ Testing file write...');
      const today = new Date().toISOString().split('T')[0];
      const testData = [{
        id: 'test-1',
        title: 'Test Article',
        source: 'Test',
        collectedAt: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
      }];

      fs.writeFileSync(`./data/news/${today}.json`, JSON.stringify(testData, null, 2));
      console.log(`✅ Test file created: data/news/${today}.json`);

      console.log('\n🎉 All tests passed! Workflow should work in n8n.');
      console.log('\n📝 Next steps:');
      console.log('1. Import workflows/news-collector.json into n8n');
      console.log('2. Click "Execute Workflow" to run');
      console.log('3. Check data/news/ for results');

    } else {
      console.error('❌ Invalid RSS response');
    }
  });
}).on('error', (error) => {
  console.error('❌ Error fetching RSS:', error.message);
});
