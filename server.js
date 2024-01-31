const http = require('node:http');
const fs = require("fs");
const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((req, res) => {
    let filePath = __dirname + '/public/index.html';

    console.log(req.url);

    switch(req.url) {
        case '/ship':
            filePath = __dirname + '/public/ship.html';
            break;
        case '/equipment':
            filePath = __dirname + '/public/equipment.html';
            break;
        case '/projects':
            filePath = __dirname + '/public/projects.html';
            break;
        default:
            filePath = __dirname + '/public/index.html';
            break;
    }

    fs.readFile(filePath, (err, data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write(data);
        res.end('<link rel="stylesheet" type="text/css" href="/css/main.css">', 'utf8');
        //res.end(data, 'utf8');
    })
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});