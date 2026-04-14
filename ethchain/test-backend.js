const http = require('http');

// Test data to send to our backend
const testData = JSON.stringify({
  tokens: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
});

// Options for the POST request
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/tokens',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': testData.length
  }
};

// Make the request
const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    console.log(`Response Body: ${chunk}`);
  });
  
  res.on('end', () => {
    console.log('Request completed successfully!');
  });
});

req.on('error', (error) => {
  console.error('Error with request:', error);
});

// Send the data
req.write(testData);
req.end();

console.log('Test request sent to backend...');