const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/data') {
    const filePath = path.join(__dirname, 'data.json');

    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        console.error('Помилка при читанні:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: "Could not read file", details: err.message }));
      }

      try {
        const data = JSON.parse(content);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      } catch (parseError) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid JSON format" }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Looking for file at: ${path.join(__dirname, 'data.json')}`);
});