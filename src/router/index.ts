import { h } from 'vue'
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { useRouterCheck } from './useRouterCheck'
import CommonView from '@/components/CommonView.vue'

const importCommonView = (path = '') => h(CommonView, { path })

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/product',
        component: () => import('@/view/Main/index.vue'),
        children: []
    },
    {
        path: '/login',
        component: () => import('../view/Login/index.vue')
      },
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
router.beforeEach(useRouterCheck)
export default router