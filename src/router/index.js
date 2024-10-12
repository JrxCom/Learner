import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui';

Vue.use(VueRouter)

/* 路由参数 */
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/login.vue')
  },
  {
    path: '/',
    name: 'index',
    redirect: '/home',
    component: () => import('@/views/Index/index.vue'),
    children: [{
      path: '/home',
      name: 'home',
      component: () => import('../views/Home/home.vue')
    },
    {
      path: '/web',
      name: 'web',
      component: () => import('../views/Web/web.vue')
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/Manage/library/library.vue')
    },

    {
      path: '/table',
      name: 'table',
      component: () => import('../views/Manage/table/table.vue')
    },
    {
      path: '/field',
      name: 'field',
      component: () => import('../views/Manage/field/field.vue')
    }]
  }
]

/* 进入同一个路由清除报错 */
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

/* 路由配置 */
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

/* 检查用户是否登录，跳转对应页面 */
router.beforeEach((to, from, next) => {
  if (document.cookie.indexOf('cookieCode') === -1 && to.path != '/login') {
    Message.error({
      duration: 2000,
      message: '登录失效，即将跳转登录页面！',
    })
    setTimeout(() => {
      next('/login');
    }, 2000)
  } else if (document.cookie.indexOf('cookieCode') != -1 && to.path === '/login') {
    next('/');
  } else {
    next()
  }
});

export default router
