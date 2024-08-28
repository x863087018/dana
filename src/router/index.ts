import { h } from 'vue'
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { useRouterCheck } from './useRouterCheck'
import CommonView from '@/components/CommonView.vue'
import { title } from 'process'

const importCommonView = (path = '') => h(CommonView, { path })

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('@/view/Main/index.vue'),
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {
                    title: "首页"
                },
                component: () => import('@/view/Home/home.vue'),
                redirect: '/home/dsc',
                children: [
                    {
                        path: '/home/dsc',
                        name: 'dsc',
                        meta: {
                            title: "介绍"
                        },
                        component: () => import('@/view/Home/home.vue'),
                    }
                ]
            },
            {
                path: '/map',
                name: 'map',
                meta: {
                    title: "Openlayers"
                },
                component: () => import('@/view/Map/index.vue'),
            }
        ]
    },
    {
        path: '/error',
        component: () => import('../view/Error/index.vue')
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