const http = require('http');

const data = JSON.stringify({
  sequence: ['A', 'B', 'C', 'D', 'E']
});

const port = process.argv[2] || 3003;

const options = {
  hostname: 'localhost',
  port: port,
  path: '/api/game/calculate-time',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Sending request to /api/game/calculate-time...');
const startTime = Date.now();

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);

  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    const elapsed = Date.now() - startTime;
    console.log(`Response received in ${elapsed}ms`);
    try {
      const parsed = JSON.parse(responseData);
      console.log('Response:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Raw response:', responseData);
    }
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

req.write(data);
req.end();

setTimeout(() => {
  console.error('Request timeout after 30 seconds');
  process.exit(1);
}, 30000);
