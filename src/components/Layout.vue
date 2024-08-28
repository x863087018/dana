<template>
    <a-layout style="min-height: 92vh">
        <a-layout-sider v-model:collapsed="collapsed" theme="light" collapsible>
            <a-menu v-model:selectedKeys="selectedKeys" :open-keys="openKey" theme="light" mode="inline"
                @click="menuClick">
                <div v-for="item in menu" :key="item.path">
                    <div v-if="!(item.children && item.children.length > 0)"> <a-menu-item :key="item.path">
                            <pie-chart-outlined />
                            <span>{{ item.meta.title }}</span>
                        </a-menu-item></div>

                    <div v-else> <a-sub-menu :key="item.path">
                            <template #title>
                                <span>
                                    <user-outlined />
                                    <span>{{ item.meta.title }}</span>
                                </span>
                            </template>
                            <div v-for="(i, j) in item.children" :key="j">
                                <a-menu-item :key="i.path">
                                    <pie-chart-outlined />
                                    <span>{{ i.meta.title }}</span>
                                </a-menu-item>
                            </div>
                        </a-sub-menu></div>

                </div>

            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-content style="margin: 0 16px">
                <a-breadcrumb style="margin: 16px 0">
                    <a-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">{{ item
                        }}</a-breadcrumb-item>
                </a-breadcrumb>
                <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
                    <router-view />
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script lang="ts" setup>
import {
    PieChartOutlined,
    DesktopOutlined,
    UserOutlined,
    TeamOutlined,
    FileOutlined,
} from '@ant-design/icons-vue';
import { onMounted, watch } from 'vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['1']);
const openKey = ref<string[]>([])
const menu = ref<any>([])
const breadcrumbList = ref<string[]>([])
onMounted(() => {
    menu.value = router.options?.routes?.find(it => it.path === '/')?.children
    if (!(menu.value && menu.value.length > 0)) {
        router.push('/error')
    }
})
const menuClick = (item: any) => {
    router.push(item.key)
}
watch(
    [() => router.options.routes, () => route.path],
    ([newRoutes, newPath]) => {
        if (newRoutes && newPath) {
            selectedKeys.value = []
            selectedKeys.value.push(newPath)
            setTimeout(() => {
                const paths = newPath.split('/')
                const base = newRoutes.find(it => it.path === '/')?.children
                breadcrumbList.value = []
                const res: any = base?.find(it => it.name === paths[1])
                breadcrumbList.value.push(res?.meta?.title)
                if (paths.length > 2) {
                    const res1 = res?.children.find((it: any) => it.name === paths[2])
                    breadcrumbList.value.push(res1?.meta?.title)
                }
                openKey.value = menu.value.filter((it: any) => it.children && it.children.length > 0).map((it: any) => it.path)
            }, 0)

        }

    },
    {
        immediate: true
    }
)
</script>
<style scoped>
#components-layout-demo-side .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}
</style>