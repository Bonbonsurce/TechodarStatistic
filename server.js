const http = require('node:http');
const fs = require("fs");
const hostname = '127.0.0.1';
const port = 3000;
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'technodarstatistic',
    password: 'com4ohCe',
    port: 5432, // порт по умолчанию для PostgreSQL
});

//Проверка подключения к бд
// Обработчик события "error" для отслеживания ошибок подключения
pool.on('error', (err) => {
    console.error('Ошибка подключения к базе данных:', err);
});

// Обработчик события "connect" для отслеживания успешного подключения
pool.on('connect', () => {
    console.log('Подключение к базе данных успешно!');
});

// Попытка подключения к базе данных
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Ошибка получения клиента из пула:', err);
    }
    console.log('Клиент успешно получен из пула');

    // Здесь можно выполнять запросы к базе данных

    // Освобождаем клиента обратно в пул
    release();
});


const server = http.createServer((req, res) => {
    let filePath = __dirname + '/public/index.html';

    console.log(req.url);

    switch(req.url) {
        case '/ship':
            filePath = __dirname + '/public/ship.html';
            break;
        case '/ship/add':
            filePath = __dirname + '/public/ship_add.html';
            break;
        case '/equipment':
            filePath = __dirname + '/public/equipment.html';
            break;
        case '/equipment/add':
            filePath = __dirname + '/public/equipment_add.html';
            break;
        case '/equipment/add_type':
            filePath = __dirname + '/public/add_type_eq.html';
            break;
        case '/projects':
            filePath = __dirname + '/public/projects.html';
            break;
        case '/projects/add':
            filePath = __dirname + '/public/projects_add.html';
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