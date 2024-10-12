import request from '@/plugins/axios'

/* 获取验证码 */
export const $_get_code = () => {
    return request({
        url: '/get-code',
        method: 'get',
    })
}

/* 登录 */
export const $_login = param => {
    return request({
        url: '/login',
        method: 'post',
        headers:'Content-Type: application/x-www-form-urlencoded',
        data:param,
    })
}

/* 判断登录状态 */
export const $_logis = () => {
    return request({
        url: '/logis',
        method: 'get'
    })
}

/* 退出 */
export const $_logout = () => {
    return request({
        url: '/logout',
        method: 'get',
    })
}