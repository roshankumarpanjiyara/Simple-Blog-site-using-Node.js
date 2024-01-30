const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    port: 4000,
    database: 'myblog',
    user: 'root',
    password: 'roshan123@'
});

module.exports = pool;