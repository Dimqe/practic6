const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 3000;
const FILE_PATH = path.join(process.cwd(), 'data.json');

const server = http.createServer((req, res) => {
  const segments = req.url.split('/');
  const id = parseInt(segments[2]);

  if (req.method === 'PUT' && segments[1] === 'data' && !isNaN(id)) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const updateData = JSON.parse(body);

        fs.readFile(FILE_PATH, 'utf8', (err, data) => {
          if (err) {
            res.writeHead(500);
            return res.end('File missing');
          }

          let items = JSON.parse(data);
          const index = items.findIndex(item => item.id === id);

          if (index === -1) {
            res.writeHead(404);
            return res.end('Not Found');
          }

          items[index] = { ...items[index], ...updateData, id };

          fs.writeFile(FILE_PATH, JSON.stringify(items, null, 2), (err) => {
            if (err) {
              res.writeHead(500);
              return res.end();
            }
            console.log(`ID ${id} успішно оновлено!`);
            res.writeHead(200);
            res.end();
          });
        });
      } catch (e) {
        res.writeHead(400);
        res.end('Bad Request');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Route Not Found');
  }
});

server.listen(PORT, () => console.log(`Server on ${PORT}`));
