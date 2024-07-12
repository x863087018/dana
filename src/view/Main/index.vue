<template>
    <div class="main">
        <a-button>测试</a-button>
    </div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";

onMounted(()=>{
    console.log(1123);
    
})
</script>
<style scoped lang="scss">
    .main{
        width: 100vw;
        height: 100vh;
    }
</style>