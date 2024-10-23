import request from '@/plugins/axios'

/* 获取数据列表 */
export const $_get_data_list = (sid, tid, page, size) => {
    return request({
        url: '/get-data-list/?sid=' + sid + '&tid=' + tid + '&page=' + page + '&size=' + size,
        method: 'get',
    })
}

/* 添加数据信息 */
export const $_add_data_info = (sid, tid, param) => {
    return request({
        url: '/add-data-info/?sid=' + sid + '&tid=' + tid,
        method: 'post',
        headers: 'Content-Type: application/x-www-form-urlencoded',
        data: param,
    })
}

/* 获取数据信息 */
export const $_get_data_info = (sid, tid, id) => {
    return request({
        url: '/get-data-info/?sid=' + sid + '&tid=' + tid + '&id=' + id,
        method: 'get',
    })
}

/* 获取关联数据信息 */
export const $_get_relate_data = (sid, cid) => {
    return request({
        url: '/get-relate-data/?sid=' + sid + '&cid=' + cid,
        method: 'get',
    })
}



/* 修改数据信息 */
export const $_edit_data_info = (sid, tid, id, param) => {
    return request({
        url: '/edit-data-info/?sid=' + sid + '&tid=' + tid + '&id=' + id,
        method: 'put',
        headers: 'Content-Type: application/x-www-form-urlencoded',
        data: param,
    })
}

/* 删除数据信息 */
export const $_remove_data_info = (sid, tid, id) => {
    return request({
        url: '/remove-data-info/?sid=' + sid + '&tid=' + tid + '&id=' + id,
        method: 'delete',
        headers: 'Content-Type: application/x-www-form-urlencoded'
    })
}
