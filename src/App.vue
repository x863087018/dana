
<template>
  <a-config-provider prefix-cls="dana" :locale="locale">
    <router-view />
  </a-config-provider>
</template>



<script setup lang="ts">
import dayjs from 'dayjs'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { ref } from 'vue'
const locale = ref(zhCN)
dayjs.locale('zh-cn')
</script>


<style lang="scss" scoped>
</style>
