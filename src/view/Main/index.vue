<template>
    <div class="main">
        <!-- 结构：1.首页介绍项目内容框架 2.地图 3.抽奖轮盘类似 4.系统日志接口调用监控 5.接口文档 6.系统信息（登录人员查看）7.ip封禁系统 8.账号封禁系统 9.博客论坛系统 10.自定义生成pdf系统 -->
        <div class="header" style="margin-bottom: 5px;">
            <div class="header-son"></div>
            <div class="header-son">
                <avatar></avatar>
            </div>
        </div>
        <layout></layout>
    </div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import Layout from "@/components/Layout.vue";
import Avatar from "@/components/Avatarimg.vue";
import { useUserStore } from "@/store/modules/user";
import { message } from "ant-design-vue";
const userStore = useUserStore()
onMounted(async () => {
    console.log(1123123)
    const userString = sessionStorage.getItem('user')
    console.log(userString)
    if (userString) {
        try {
            userStore.setUserInfo(JSON.parse(userString))
        } catch (e) {
            message.error(`身份信息有误，请重新登录`)
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('spaceToken')
            sessionStorage.removeItem('isLogin')
            window.location.replace('/login')
        }

    } else {
        message.error('身份信息为空，请重新登录')
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('spaceToken')
        sessionStorage.removeItem('isLogin')
        window.location.replace('/login')
    }
})

</script>
<style scoped lang="scss">
.main {
    width: 100vw;
    height: 100vh;
    background-color: #f5f5f5;

    .header {
        height: 7vh;
        width: 100%;
        background-color: #fff;
        box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.14);
        padding: 0 0 0 0;
        display: flex;
        justify-content: space-evenly;

        .header-son {
            width: 50%;
            height: 100%;

        }
    }


}
</style>