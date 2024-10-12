/* 1.引入文件 */
import router from '@/router';
import axios from 'axios'
import { Message } from 'element-ui';

/* 2.全局默认配置 */
const baseURL = process.env.VUE_APP_API
// 配置axios的属性
const request = axios.create({
    baseURL, 		      // 后台服务地址
    timeout: 60000, 		      // 请求超时时间1分钟
    responseType: "json",
    withCredentials: true    // 是否允许带cookie这些
});

/* 3.设置拦截器 */
request.interceptors.request.use(config => {
    /* 设置不需要校验的api路径 */
    const invalidUrls = ['/get-code', '/login', '/logis'];
    /* 当触发校验api时查看cookie是否存在 */
    if (!invalidUrls.includes(config.url)) {
        const axiosCookies = document.cookie
        if (!axiosCookies.includes('cookieCode=')) {
            Message.error({
                duration: 2000,
                message: '登录失效，即将跳转登录页面！',
            })
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        }
    }
    //发送请求前进行拦截
    return config;
}, error => {
    return Promise.reject(error)
})
request.interceptors.response.use(res => {
    //请求响应后拦截
    if (res.status == 200) {
        return Promise.resolve(res)
    }
    return res;
}, error => {
    return Promise.reject(error)
})
export default request 