import request from '@/plugins/axios'

/* 上传 */
export const $_upload = (param) => {
    return request({
        url: '/upload',
        method: 'post',
        headers:'Content-Type: multipart/form-data',
        data: param,
    })
}
