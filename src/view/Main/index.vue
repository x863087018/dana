<template>
    <div class="main">
        <a-button>测试</a-button>
    </div>
</template>
<script lang="ts" setup>
import { test } from "@/api/login";
import { onMounted } from "vue";

onMounted(async ()=>{
    console.log(1123);
    const res = await test({test:'123'})
})
</script>
<style scoped lang="scss">
    .main{
        width: 100vw;
        height: 100vh;
    }
</style>