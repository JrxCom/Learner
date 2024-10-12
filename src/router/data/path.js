/* 数据api访问路径 */
exports.$_data_path = [
    /* 获取数据列表 */
    { path: '/get-data-list', method: 'get', handler: 'getDataList' },
    /* 查询数据信息 */
    { path: '/get-search-data', method: 'get', handler: 'getSearchData' },
    /* 获取关联数据 */
    { path: '/get-relate-data', method: 'get', handler: 'getRelateData' },
    /* 添加数据信息 */
    { path: '/add-data-info', method: 'post', handler: 'addDataInfo' },
    /* 获取数据信息 */
    { path: '/get-data-info', method: 'get', handler: 'getDataInfo' },
    /* 修改数据信息 */
    { path: '/edit-data-info', method: 'put', handler: 'editDataInfo' },
    /* 删除数据信息 */
    { path: '/remove-data-info', method: 'delete', handler: 'removeDataInfo' }
]