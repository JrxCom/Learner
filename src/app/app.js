/* 引入express服务器模块 */
const express = require('express')
/* 引入cookie模块 */
const cookieParser = require('cookie-parser')
/* 引入env模块 */
const dotenv = require('dotenv')
/* 初始化express服务器模块 */
const app = express()
/* 初始化env */
dotenv.config();
/* 初始化api路由 */
const router = express.Router()
/* 配置解析表单数据 */
app.use(express.urlencoded({ extended: false }))
/* 配置静态访问路径 */
app.use('/uploads',express.static('../../uploads'))
/* 配置cookie模块 */
app.use(cookieParser())
/* 打包验证码所需要的字体 */
if (process.env.NODE_ENV === 'production') {
    require('../font/Comismsh.ttf')
}
/* 共享服务器模块与路由 */
module.exports = {
    app,
    router
}