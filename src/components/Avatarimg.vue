<template>
    <div class="avatar-container">
        <a-popover placement="bottomRight" :overlay-style="{ width: '318px' }">
            <template #content>
                <div style="margin-bottom: 10px;">姓名：{{ userStore.info.name }}</div>
                <div style="margin-bottom: 10px;">账号：{{ userStore.info.uid }}</div>
                <a-button style="width:100%" @click="loginOut()">退出登录</a-button>
            </template>
            <template #title>
                <div>欢迎您！尊敬的用户</div>
            </template>
            <div style="display: flex;align-items: center;">
                <a-avatar size="small" :style="{ objectFit: 'cover' }">
                    <template #icon>
                        <AntDesignOutlined />
                    </template>
                </a-avatar>
                <div style="margin: 0 10px;">{{ userStore.info.name }}</div>
            </div>

        </a-popover>

    </div>
</template>
<script lang="ts" setup>
import { useUserStore } from "@/store/modules/user";
import { message } from "ant-design-vue";
import { onMounted } from "vue";
import { ref } from 'vue';
const userStore = useUserStore()
onMounted(() => {

})
const loginOut = () => {
    message.success('退出成功')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('spaceToken')
    sessionStorage.removeItem('isLogin')

    window.location.replace('/login')
}
</script>
<style scoped lang="scss">
.avatar-container {
    display: flex;
    justify-content: right;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    height: 100%;
    /* 让容器的高度填满父容器 */
}
</style>