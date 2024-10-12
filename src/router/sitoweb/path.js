/* 网站api访问路径 */
exports.$_sitoweb_path = [
    /* 获取网站列表 */
    { path: '/get-sitoweb-list', method: 'get', handler: 'getSitowebList' },
    /* 添加网站信息 */
    { path: '/add-sitoweb-info', method: 'post', handler: 'addSitowebInfo' },
    /* 获取网站信息 */
    { path: '/get-sitoweb-info', method: 'get', handler: 'getSitowebInfo' },
    /* 修改网站信息 */
    { path: '/edit-sitoweb-info', method: 'put', handler: 'editSitowebInfo' },
    /* 删除网站信息 */
    { path: '/remove-sitoweb-info', method: 'delete', handler: 'removeSitowebInfo' },
    /* 获取网站树信息 */
    { path: '/get-sitoweb-tree', method: 'get', handler: 'getSitowebTree' },
]