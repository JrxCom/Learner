/* 登录api访问路径 */
exports.$_log_path = [
    /* 获取验证码 */
    { path: '/get-code', method: 'get', handler: 'getCode' },
    /* 登录 */
    { path: '/login', method: 'post', handler: 'login' },
    /* 判断是否为登录状态 */
    { path: '/logis', method: 'get', handler: 'logis' },
    /* 退出 */
    { path: '/logout', method: 'get', handler: 'logout' },
]
