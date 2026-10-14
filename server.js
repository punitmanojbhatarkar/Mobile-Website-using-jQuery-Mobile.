const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0];
    if (cleanUrl === '/' || cleanUrl === '') {
        cleanUrl = '/index.html';
    }

    const safePath = path.normalize(path.join(PUBLIC_DIR, decodeURIComponent(cleanUrl)));
    if (!safePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        return res.end('Forbidden');
    }

    fs.stat(safePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('404 Not Found');
        }

        const ext = path.extname(safePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Cache-Control': 'no-cache'
        });

        fs.createReadStream(safePath).pipe(res);
    });
});

function startServer(portToTry) {
    server.listen(portToTry, () => {
        console.log(`====================================================`);
        console.log(`📱 Assignment 6: jQuery Mobile Website Active!`);
        console.log(`🌐 Local URL: http://localhost:${portToTry}`);
        console.log(`📁 Directory: ${PUBLIC_DIR}`);
        console.log(`====================================================`);
    });
}

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        const nextPort = Number(server.address()?.port || PORT) + 1;
        console.log(`⚠️ Port ${err.port || PORT} is busy, trying port ${nextPort}...`);
        startServer(nextPort);
    } else {
        console.error('Server error:', err);
    }
});

startServer(PORT);
