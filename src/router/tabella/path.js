/* 表api访问路径 */
exports.$_tabella_path = [
    /* 获取栏目列表 */
    { path: '/get-tabella-list', method: 'get', handler: 'getTabellaList' },
    /* 添加栏目信息 */
    { path: '/add-tabella-info', method: 'post', handler: 'addTabellaInfo' },
    /* 获取栏目信息 */
    { path: '/get-tabella-info', method: 'get', handler: 'getTabellaInfo' },
    /* 修改栏目信息 */
    { path: '/edit-tabella-info', method: 'put', handler: 'editTabellaInfo' },
    /* 删除栏目信息 */
    { path: '/remove-tabella-info', method: 'delete', handler: 'removeTabellaInfo' }
]