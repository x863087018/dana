import { h } from 'vue'
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { useRouterCheck } from './useRouterCheck'
import CommonView from '@/components/CommonView.vue'

const importCommonView = (path = '') => h(CommonView, { path })

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('@/view/Main/index.vue'),
    },
    {
        path: '/login',
        component: () => import('../view/Login/index.vue')
    },
    {
        path: '/test',
        component: () => import('../view/Test/index.vue')
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
router.beforeEach(useRouterCheck)
export default router