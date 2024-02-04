/*
const http = require('node:http');
const fs = require("fs");
const hostname = '127.0.0.1';
const port = 3000;
const { Pool } = require('pg');
const express = require('express');
const router = express.Router();


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

/!*router.get('/equipment', (req, res) => {
pool.query('SELECT * FROM equipment', (err, result) => {
    if (err) {
        console.error('Ошибка выполнения запроса:', err);
        res.status(500).send('Ошибка выполнения запроса');
    } else {
        res.json(result.rows);
    }
});
});

module.exports = router;*!/

const server = http.createServer((req, res) => {
    let filePath = __dirname + '/public/index.html';

    switch(req.url) {
        case '/ship':
            filePath = __dirname + '/public/ship.html';
            break;
        case '/ship_show': // Изменяем путь для получения данных об оборудовании
            // Обработка запроса на получение данных об оборудовании
            pool.query('SELECT * FROM ship', (err, result) => {
                if (err) {
                    console.error('Ошибка выполнения запроса:', err);
                    res.statusCode = 500;
                    res.end('Ошибка выполнения запроса');
                } else {
                    // Отправляем данные в формате JSON
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(result.rows));
                    console.log(result);
                }
            });
            return;
        case '/ship/add':
            filePath = __dirname + '/public/ship_add.html';
            break;
        case '/ship/edit':
            filePath = __dirname + '/public/ship_edit.html';
            break;
        case '/ship/delete':
            filePath = __dirname + '/public/ship_del.html';
            break;
        case '/ship/:id_ship':
            // Обработка запроса для отображения информации о конкретном оборудовании
            const shipId = req.params.id_ship;
            // Здесь можно выполнить запрос к базе данных для получения информации о конкретном оборудовании по его ID
            // Затем отобразить соответствующую страницу с информацией о конкретном оборудовании
            break;
        case '/equipment':
            filePath = __dirname + '/public/equipment.html';
            break;
        case '/type_equipment':
            pool.query('SELECT * FROM typeequipment', (err, result) => {
                if (err) {
                    console.error('Ошибка выполнения запроса:', err);
                    res.statusCode = 500;
                    res.end('Ошибка выполнения запроса');
                } else {
                    // Отправляем данные в формате JSON
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(result.rows));
                    console.log(result);
                }
            });
            return;
        case '/feature_vars':
            pool.query('SELECT * FROM feature_var', (err, result) => {
                if (err) {
                    console.error('Ошибка выполнения запроса:', err);
                    res.statusCode = 500;
                    res.end('Ошибка выполнения запроса');
                } else {
                    // Отправляем данные в формате JSON
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(result.rows));
                    console.log(result);
                }
            });
            return;
        case '/equipment/feature_show/:id_equipment?id_equipment=${id_equipment}':
            const equipment_id = req.params.id_equipment;
            // Выполнение запроса к базе данных
            pool.query(`
        SELECT DISTINCT e.name, ef.norm_value, ef.norm_deviation, ef.critical_deviation, ef.value, f.name AS feature_name, fv.variable
        FROM equipment AS e
        JOIN equipmentfeature AS ef ON e.id_equipment = ef.id_equipment
        JOIN feature AS f ON ef.id_feature = f.id_feature
        JOIN feature_var AS fv ON f.id_var = fv.id_var
        WHERE e.id_equipment = ?;
    `, [equipment_id], (err, result) => {
                if (err) {
                    console.error('Ошибка выполнения запроса:', err);
                    res.status(500).json({ error: 'Ошибка сервера' });
                    return;
                }
                // Отправка результата обратно клиенту
                res.json(result.rows);
            });
            return;
        case '/equipment/this':
            const id_equipment = req.query.id_equipment;
            if (id_equipment) {
                const filePath = __dirname + '/public/equip_this.html';
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        console.error('Ошибка чтения файла:', err);
                        res.statusCode = 500;
                        res.end('Ошибка чтения файла');
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/html');
                        res.end(data);
                    }
                });
            } else {
                res.statusCode = 400;
                res.end('Не указан идентификатор оборудования');
            }
            break;

            /!*case '/equipment/:id_equipment':
            // Обработка запроса для отображения информации о конкретном оборудовании
            const equipmentId = req.params.id_equipment;
            filePath = __dirname + `/public/equip_this.html?id_equipment=${equipmentId}`;
            break;*!/

        case '/equipment/edit':
            filePath = __dirname + '/public/equip_edit.html';
            break;
        case '/equipment/delete':
            filePath = __dirname + '/public/equip_del.html';
            break;
        case '/equipment_show': // Изменяем путь для получения данных об оборудовании
            // Обработка запроса на получение данных об оборудовании
            pool.query('SELECT * FROM equipment', (err, result) => {
                if (err) {
                    console.error('Ошибка выполнения запроса:', err);
                    res.statusCode = 500;
                    res.end('Ошибка выполнения запроса');
                } else {
                    // Отправляем данные в формате JSON
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(result.rows));
                    console.log(result);
                }
            });
            return; // Завершаем выполнение, чтобы не отправить HTML ниже
        case '/equipment/add':
            filePath = __dirname + '/public/equipment_add.html';
            break;
        case '/equipment/add_type':
            filePath = __dirname + '/public/add_type_eq.html';
            break;
        case '/projects':
            filePath = __dirname + '/public/projects.html';
            break;
        case '/projects/add_equipment':
            filePath = __dirname + '/public/project_add_equip.html';
            break;
        case '/project_show': // Изменяем путь для получения данных об оборудовании
            // Обработка запроса на получение данных об оборудовании
            pool.query('SELECT * FROM project', (err, result) => {
                if (err) {
                    console.error('Ошибка выполнения запроса:', err);
                    res.statusCode = 500;
                    res.end('Ошибка выполнения запроса');
                } else {
                    // Отправляем данные в формате JSON
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(result.rows));
                    console.log(result);
                }
            });
            return;
        case '/projects/:id_project':
            // Обработка запроса для отображения информации о конкретном оборудовании
            const projectId = req.params.id_project;
            // Здесь можно выполнить запрос к базе данных для получения информации о конкретном оборудовании по его ID
            // Затем отобразить соответствующую страницу с информацией о конкретном оборудовании
            break;
        case '/projects/delete':
            filePath = __dirname + '/public/project_del.html';
            break;
        case '/projects/add':
            filePath = __dirname + '/public/projects_add.html';
            break;
        default:
            filePath = __dirname + '/public/index.html';
            break;
    }
    const cleanUrl = filePath.split('?')[0];
    fs.readFile(cleanUrl, (err, data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        // Отправка HTML-страницы клиенту
        res.write(data);
        res.end();
        //res.end(data, 'utf8');
    })
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});*/
