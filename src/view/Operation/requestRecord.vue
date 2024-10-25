<template>
    <div>
        1123
    </div>
</template>
<script setup lang="ts">
import { getList } from "@/api/api-record";
import { onMounted } from "vue";

onMounted(async () => {
    const { code, data } = await getList()
})
</script>
