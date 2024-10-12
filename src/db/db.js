/* 引入数据库模块 */
const mysql = require('mysql')
/* 连接数据库 */
const db = mysql.createPool({
    host: '111.231.15.219',
    port: '3306',
    user: 'root',
    password: 'jiangruxu.mysql.123',
    database: 'learner',
    connectionLimit: 1000,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
})

/* 共享数据库连接 */
module.exports = db