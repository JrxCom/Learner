/* 字段api访问路径 */
exports.$_campi_path = [
    /* 获取字段列表 */
    { path: '/get-campi-list', method: 'get', handler: 'getCampiList' },
    /* 获取关联表列表 */
    { path: '/get-relate-tabella', method: 'get', handler: 'getRelateTabella' },
    /* 获取关联字段列表 */
    { path: '/get-relate-campi', method: 'get', handler: 'getRelateCampi' },
    /* 添加字段信息 */
    { path: '/add-campi-info', method: 'post', handler: 'addCampiInfo' },
    /* 获取字段信息 */
    { path: '/get-campi-info', method: 'get', handler: 'getCampiInfo' },
    /* 获取关联表信息 */
    { path: '/get-relate-info', method: 'get', handler: 'getRelateInfo' },
    /* 修改字段信息 */
    { path: '/edit-campi-info', method: 'put', handler: 'editCampiInfo' },
    /* 删除字段信息 */
    { path: '/remove-campi-info', method: 'delete', handler: 'removeCampiInfo' }
]