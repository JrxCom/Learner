import request from '@/plugins/axios'

/* 获取网站列表 */
export const $_get_web_list = () => {
    return request({
        url: '/get-sitoweb-list',
        method: 'get',
    })
}

/* 添加网站信息 */
export const $_add_web_info = param => {
    return request({
        url: '/add-sitoweb-info',
        method: 'post',
        headers:'Content-Type: application/x-www-form-urlencoded',
        data:param,
    })
}

/* 获取网站信息 */
export const $_get_web_info = id => {
    return request({
        url: '/get-sitoweb-info/?id=' + id,
        method: 'get',
    })
}

/* 修改网站信息 */
export const $_edit_web_info = (id,param) => {
    return request({
        url: '/edit-sitoweb-info/?id=' + id,
        method: 'put',
        headers:'Content-Type: application/x-www-form-urlencoded',
        data:param,
    })
}

/* 删除网站信息 */
export const $_remove_web_info = id => {
    return request({
        url: '/remove-sitoweb-info/?id=' + id,
        method: 'delete',
    })
}
/* 获取网站树信息 */
export const $_get_sitoweb_tree = () => {
    return request({
        url: '/get-sitoweb-tree',
        method: 'get',
    })
}
