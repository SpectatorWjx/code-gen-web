import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../components/layout/MainLayout.vue'

// 路由配置
const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/basic-config',
    children: [
      {
        path: '/basic-config',
        name: 'BasicConfig',
        component: () => import('../views/BasicConfig.vue'),
        meta: { title: '基础配置' }
      },
      {
        path: '/data-management',
        name: 'DataManagement',
        component: () => import('../views/DataManagement.vue'),
        meta: { title: '数据管理' }
      },
      {
        path: '/template-management',
        name: 'TemplateManagement',
        component: () => import('../views/TemplateManagement.vue'),
        meta: { title: '模板管理' }
      },
      {
        path: '/system-config',
        name: 'SystemConfig',
        component: () => import('../views/SystemConfig.vue'),
        meta: { title: '系统配置' }
      }
    ]
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 代码生成系统` : '代码生成系统'
  next()
})

export default router