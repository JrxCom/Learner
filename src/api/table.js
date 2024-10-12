import request from '@/plugins/axios'

/* 获取表列表 */
export const $_get_table_list = sid => {
    return request({
        url: '/get-tabella-list/?sid=' + sid,
        method: 'get',
    })
}

/* 添加表信息 */
export const $_add_table_info = param => {
    return request({
        url: '/add-tabella-info',
        method: 'post',
        headers: 'Content-Type: application/x-www-form-urlencoded',
        data: param,
    })
}

/* 获取表信息 */
export const $_get_table_info = id => {
    return request({
        url: '/get-tabella-info/?id=' + id,
        method: 'get',
    })
}

/* 修改表信息 */
export const $_edit_table_info = (id, param) => {
    return request({
        url: '/edit-tabella-info/?id=' + id,
        method: 'put',
        headers: 'Content-Type: application/x-www-form-urlencoded',
        data: param,
    })
}

/* 删除表信息 */
export const $_remove_table_info = (id, sid) => {
    return request({
        url: '/remove-tabella-info/?id=' + id + '&sid=' + sid,
        method: 'delete',
    })
}
