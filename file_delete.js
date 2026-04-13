const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 3000;
const FILE_PATH = path.join(process.cwd(), 'data.json');

const server = http.createServer((req, res) => {
  const segments = req.url.split('/').filter(s => s !== '');

  // Обробка DELETE /data/:id
  if (req.method === 'DELETE' && segments[0] === 'data' && segments[1]) {
    const id = parseInt(segments[1]);

    // 1. Читаємо файл
    fs.readFile(FILE_PATH, 'utf8', (err, content) => {
      // Якщо файл не існує — 500
      if (err) {
        res.writeHead(500);
        return res.end();
      }

      let items;
      try {
        items = JSON.parse(content);
      } catch (parseErr) {
        // Якщо JSON у файлі пошкоджений — 400
        res.writeHead(400);
        return res.end();
      }

      // 2. Перевіряємо наявність ID
      const exists = items.some(item => item.id === id);
      if (!exists) {
        res.writeHead(404);
        return res.end();
      }

      // 3. Видаляємо елемент (фільтруємо масив)
      const filteredItems = items.filter(item => item.id !== id);

      // 4. Записуємо оновлений масив назад у файл
      fs.writeFile(FILE_PATH, JSON.stringify(filteredItems, null, 2), (writeErr) => {
        if (writeErr) {
          res.writeHead(500);
          return res.end();
        }
        res.writeHead(200);
        res.end();
      });
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT);