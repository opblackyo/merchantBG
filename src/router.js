import { createRouter, createWebHistory } from 'vue-router'

// 商家後台頁面
import Dashboard from '@/views/merchant/Dashboard.vue'
import Orders from '@/views/merchant/Orders.vue'
import Menu from '@/views/merchant/Menu.vue'

const routes = [
  {
    path: '/',
    redirect: '/merchant/dashboard'
  },
  {
    path: '/merchant',
    redirect: '/merchant/dashboard'
  },
  {
    path: '/merchant/dashboard',
    name: 'MerchantDashboard',
    component: Dashboard,
    meta: { title: '商家後台' }
  },
  {
    path: '/merchant/orders',
    name: 'MerchantOrders',
    component: Orders,
    meta: { title: '待處理訂單' }
  },
  {
    path: '/merchant/menu',
    name: 'MerchantMenu',
    component: Menu,
    meta: { title: '菜單管理' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守衛 - 更新頁面標題
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 外送平台` : '商家後台 - 外送平台'
  next()
})

export default router

