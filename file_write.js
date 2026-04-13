const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  // Логування для відладки
  console.log(`Отримано запит: ${req.method} ${req.url}`);

  // Очищуємо URL від зайвих параметрів для порівняння
  const url = req.url.split('?')[0];

  if (req.method === 'POST' && (url === '/data' || url === '/data/')) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        if (!body) {
          res.writeHead(400);
          return res.end('Empty body');
        }

        const parsedData = JSON.parse(body);
        const filePath = path.join(__dirname, 'data.json');

        fs.writeFile(filePath, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
            console.error('File Write Error:', err);
            res.writeHead(500);
            return res.end();
          }
          
          console.log('Дані успішно збережено у data.json');
          res.writeHead(200);
          res.end();
        });
      } catch (error) {
        console.error('JSON Parse Error:', error.message);
        res.writeHead(400);
        res.end();
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Сервер запису запущено на http://127.0.0.1:${PORT}`);
});