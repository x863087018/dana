<template>
    <div class="login" >
        <div class="login-center">
            <div class="login-header"></div>
            <div class="login-content"><LoginContent></LoginContent></div>
            <div class="login-foot"></div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import LoginContent from "./LoginContent.vue";
//:style="{ backgroundImage: backImg }"
// const backImg = ref('url(/api/img/login/yest.jpg)')
onMounted(()=>{

})
</script>
<style scoped lang="scss">
    .login{
        width: 100vw;
        height: 100vh;
        background-image: url('@/assets/img/login/yest.jpg');
        /* 背景图片的重复方式，可选值：repeat（默认，水平和垂直重复）、repeat-x（水平重复）、repeat-y（垂直重复）、no-repeat（不重复） */
        background-repeat: no-repeat;
        /* 背景图片的位置，可使用具体的像素值、百分比或关键字（如 top、bottom、left、right、center 等） */
        background-position: bottom;
        /* 背景图片的固定方式，fixed（固定）或 scroll（随页面滚动） */
        background-attachment: fixed;
        /* 背景图片的大小，可使用具体的像素值、百分比或 cover（等比缩放填充整个元素）、contain（等比缩放使图片完整显示在元素内） */
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;
        .login-center{
            width: 400px;
            height: 500px;
            background-color: rgba(0, 0, 0, 0.5);
            .login-header,.login-header{
                width: 100%;
                height: 20%;
            }
            .login-content{
                width: 100%;
                height: 60%;
                background-color: white;
            }
        }

    }
</style>