<template>
  <router-view v-slot="{ Component, route }" :key="path">
    <keep-alive>
      <component v-if="route.meta.keepAlive" :is="Component" :key="route.fullPath" />
    </keep-alive>

    <component v-if="!route.meta.keepAlive" :is="Component" :key="route.fullPath" />
  </router-view>
</template>

<script lang="ts" setup>
defineProps<{
  path?: string
}>()
</script>

<style lang="scss" scoped>
</style>
