<template>
    <div class="main"></div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";

onMounted(()=>{
    console.log(1123);
    
})
</script>
<style scoped lang="scss">
    .main{
        background: red;
        width: 100vw;
        height: 100vh;
    }
</style>