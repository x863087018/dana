<template>
    <a-button @click="getSecretKeys">测试获取jwt secretKey</a-button>
    <a-button @click="getJwt">测试获取jwt token</a-button>
</template>
<script setup lang="ts">
import { getSecretKey, getJwt } from '@/api/config';

const getSecretKeys = () => {
    getSecretKey()
}

</script>