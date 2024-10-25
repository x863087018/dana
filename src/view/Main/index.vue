<template>
    <div class="main">
        <!-- 结构：1.首页介绍项目内容框架 2.地图 3.抽奖轮盘类似 4.系统日志接口调用监控 5.接口文档 6.系统信息（登录人员查看）7.ip封禁系统 8.账号封禁系统 9.博客论坛系统 10.自定义生成pdf系统 -->
        <div class="header" style="margin-bottom: 5px;">
            <div class="header-left" style="display: flex;justify-content: space-between;">
                <h1 class="site-title">Dana空间</h1>
                <div class="quote-container">
                    <p class="inspiring-quote">成功是努力的结果，愿你勇往直前。</p>
                </div>
            </div>
            <div class="header-right">
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
    console.log(userStore.info)
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

        .header-left {
            width: 60%;
            height: 100%;
        }

        .header-right {
            width: 40%;
            height: 100%;
        }
    }


}

.site-title {
    margin-left: 10px;
    font-family: 'Arial', sans-serif;
    /* 使用清晰的字体 */
    font-size: 1.5rem;
    /* 字体大小 */
    font-weight: bold;
    color: #333;
    /* 文字颜色 */
    text-align: center;
    /* 居中显示 */
    height: 51px;
    /* 固定高度 */
    line-height: 51px;
    /* 行高与高度相同，垂直居中 */
    letter-spacing: 1px;
    /* 增加字间距 */
    background: linear-gradient(45deg, #f54ea2, #ff7676);
    /* 渐变背景 */
    background-clip: text;
    /* 文字填充渐变 */
    -webkit-background-clip: text;
    /* 支持 WebKit 内核的渐变 */
    color: transparent;
    /* 隐藏文字颜色以显示渐变 */
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    /* 添加阴影 */
    display: inline-block;
    /* 使盒子适应内容 */
    transition: transform 0.3s ease;
    /* 动画效果 */
}

.site-title:hover {
    transform: scale(1.05);
    /* 鼠标悬停时轻微放大 */
}

.quote-container {
    height: 51px;
    /* 盒子高度 */
    display: flex;
    /* 使用 flexbox 居中内容 */
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    overflow: hidden;
    /* 隐藏溢出内容 */
}

.inspiring-quote {
    font-family: 'Arial', sans-serif;
    /* 使用清晰的字体 */
    font-size: 1.2rem;
    /* 字体大小 */
    color: #333;
    /* 文字颜色 */
    text-align: center;
    /* 居中显示 */
    opacity: 0;
    /* 初始透明度 */
    transform: translateY(20px);
    /* 初始位移 */
    animation: fadeInUp 2s forwards infinite;
    /* 无限循环动画 */
    /* 添加动画 */
    animation-delay: 0.5s;
    /* 动画延迟 */
}

@keyframes fadeInUp {
    0% {
        opacity: 0;
        /* 初始透明 */
        transform: translateY(20px);
        /* 初始向下位移 */
    }

    50% {
        opacity: 1;
        /* 中间时完全可见 */
        transform: translateY(0);
        /* 中间时回到原位 */
    }

    100% {
        opacity: 0;
        /* 结束时完全透明 */
        transform: translateY(-20px);
        /* 结束时向上位移 */
    }
}
</style>