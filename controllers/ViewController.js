const fs = require('fs');
const path = require('path');

function serveHome(req, res) {
    const filePath = path.join(__dirname,  '..', 'views', 'index.html');

    fs.readFile(filePath, (err, content) => {
        if(err) {
            res.writeHead(500, {'Cotnent-Type': 'text/plain'});
            return res.end('Error loading home page');
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(content);
    });
}

function serveStatic(req, res) {
    const filePath = path.join(__dirname, '..', req.url);
    const ext = path.extname(filePath);

    const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.ico': 'image/x-icon'
    }[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if(err) {
            console.error('File not found:', filePath);
            res.writeHead(404);
            return res.end('404 Not Found');
        }

        res.writeHead(200, {'Content-Type': contentType});
        res.end(content);
    })
}

module.exports = {serveStatic, serveHome};