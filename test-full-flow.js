const http = require('http');

const port = process.argv[2] || 3003;

function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataStr.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);
    req.write(dataStr);
    req.end();
  });
}

async function testFullFlow() {
  console.log('=== Testing Full Game Flow ===\n');

  // Step 1: Calculate time for sequence
  console.log('Step 1: Calculate time for sequence [A, B, C, D, E]');
  const timeResult = await makeRequest('/api/game/calculate-time', {
    sequence: ['A', 'B', 'C', 'D', 'E']
  });
  console.log(`Status: ${timeResult.status}`);
  console.log(`Total Time: ${timeResult.data.totalTime}`);
  console.log();

  if (timeResult.status !== 200) {
    console.error('Failed to calculate time');
    process.exit(1);
  }

  // Step 2: Submit score with calculated time
  console.log('Step 2: Submit score with calculated time');
  const submitResult = await makeRequest('/api/game/submit', {
    playerName: 'Test Player',
    sequence: ['A', 'B', 'C', 'D', 'E'],
    totalTime: timeResult.data.totalTime,
    difficulty: 1,
    hintsUsed: 0
  });
  console.log(`Status: ${submitResult.status}`);
  console.log('Response:', JSON.stringify(submitResult.data, null, 2));
  console.log();

  if (submitResult.status === 200) {
    console.log('✅ Full flow test PASSED!');
    process.exit(0);
  } else {
    console.error('❌ Full flow test FAILED!');
    process.exit(1);
  }
}

testFullFlow().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
