/* 引入app文件服务器模块 */
const { app } = require('./app/app')
/* 引入跨域模块 */
const cors = require('cors')
/* 引入路由 */
const router = require('./router/router')
/* 配置跨域 */
app.use(cors())
/* 配置路由 */
app.use(router)
/* 启动服务器 */
app.listen(8002, () => {
    console.log(`服务器启动成功
访问地址:111.231.15.219
端口号:8002
启动时间:${new Date().toLocaleString()}`);
})