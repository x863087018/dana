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
            },
            {
                path: '/person',
                name: 'person',
                meta: {
                    title: "个人信息"
                },
                component: () => import('@/view/Person/change.vue'),
                redirect: '/operation/requestRecord',
                children: [
                    {
                        path: '/person/change',
                        name: 'change',
                        meta: {
                            title: "资料修改"
                        },
                        component: () => import('@/view/Person/change.vue'),
                    }
                ]
            },
            {
                path: '/operation',
                name: 'operation',
                meta: {
                    title: "运维"
                },
                component: () => import('@/view/Operation/requestRecord.vue'),
                redirect: '/operation/requestRecord',
                children: [
                    {
                        path: '/operation/requestRecord',
                        name: 'requestRecord',
                        meta: {
                            title: "请求记录"
                        },
                        component: () => import('@/view/Operation/requestRecord.vue'),
                    }
                ]
            },
            {
                path: '/websocket',
                name: 'websocket',
                meta: {
                    title: "WebSocket"
                },
                component: () => import('@/view/WebSocket/index.vue'),
                redirect: '/websocket/chat',
                children: [
                    {
                        path: '/websocket/chat',
                        name: 'chat',
                        meta: {
                            title: "聊天室"
                        },
                        component: () => import('@/view/WebSocket/ChatRoom.vue'),
                    }
                ]
            },
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