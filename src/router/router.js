/* 引入app文件路由路由模块 */
const { router } = require('../app/app')
/* 引入登录api路径与方法 */
const $_log_router = {
    path: require('./log/path'),
    handler: require('./log/handler'),
}
$_log_router['path']['$_log_path'].forEach(item => {
    router[item['method']](item['path'], $_log_router['handler'][item['handler']])
})
/* 引入网站api路径与方法 */
const $_sitoweb_router = {
    path: require('./sitoweb/path'),
    handler: require('./sitoweb/handler'),
}
$_sitoweb_router['path']['$_sitoweb_path'].forEach(item => {
    router[item['method']](item['path'], $_sitoweb_router['handler'][item['handler']])
})
/* 引入表api路径与方法 */
const $_tabella_router = {
    path: require('./tabella/path'),
    handler: require('./tabella/handler'),
}
$_tabella_router['path']['$_tabella_path'].forEach(item => {
    router[item['method']](item['path'], $_tabella_router['handler'][item['handler']])
})
/* 引入字段api路径与方法 */
const $_campi_router = {
    path: require('./campi/path'),
    handler: require('./campi/handler'),
}
$_campi_router['path']['$_campi_path'].forEach(item => {
    router[item['method']](item['path'], $_campi_router['handler'][item['handler']])
})
/* 引入上传api路径与方法 */
const $_upload_router = {
    path: require('./upload/path'),
    handler: require('./upload/handler'),
}
$_upload_router['path']['$_upload_path'].forEach(item => {
    router[item['method']](item['path'], $_upload_router['handler'][item['handler']])
})
/* 引入数据api路径与方法 */
const $_data_router = {
    path: require('./data/path'),
    handler: require('./data/handler'),
}
$_data_router['path']['$_data_path'].forEach(item => {
    router[item['method']](item['path'], $_data_router['handler'][item['handler']])
})
/* 共享路由 */
module.exports = router