import request from '@/plugins/axios'

/* 获取字段列表 */
export const $_get_field_list = tid => {
    return request({
        url: '/get-campi-list/?tid=' + tid,
        method: 'get',
    })
}

/* 获取关联表信息 */
export const $_get_select_table = (sid, id) => {
    return request({
        url: '/get-relate-tabella/?sid=' + sid + '&id=' + id,
        method: 'get',
    })
}

/* 获取关联字段信息 */
export const $_get_select_field = tid => {
    return request({
        url: '/get-relate-campi/?tid=' + tid,
        method: 'get',
    })
}

/* 添加字段信息 */
export const $_add_field_info = param => {
    return request({
        url: '/add-campi-info',
        method: 'post',
        headers: 'Content-Type: application/x-www-form-urlencoded',
        data: param,
    })
}

/* 获取字段信息 */
export const $_get_field_info = id => {
    return request({
        url: '/get-campi-info/?id=' + id,
        method: 'get',
    })
}
/* 获关联信息 */
export const $_get_relate_info = id => {
    return request({
        url: '/get-relate-info/?id=' + id,
        method: 'get',
    })
}

/* 修改字段信息 */
export const $_edit_field_info = (id, param) => {
    return request({
        url: '/edit-campi-info/?id=' + id,
        method: 'put',
        headers: 'Content-Type: application/x-www-form-urlencoded',
        data: param,
    })
}

/* 删除字段信息 */
export const $_remove_field_info = (id, tid, sid) => {
    return request({
        url: '/remove-campi-info/?id=' + id + '&tid=' + tid + '&sid=' + sid,
        method: 'delete',
    })
}
