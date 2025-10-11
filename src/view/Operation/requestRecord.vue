<template>
    <div>
        <a-table :columns="columns" :data-source="tableData" :loading="loading" :pagination="pagination" @change="handleChange">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'createdAt'">
                    {{ dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template v-if="column.dataIndex === 'rt'">
                    {{ record.rt }}ms
                </template>
                <template v-if="column.dataIndex === 'result'">
                    {{ record.result?.msg }}
                </template>
            </template>
        </a-table>
    </div>
</template>
<script setup lang="ts">
import { getList } from "@/api/api-record";
import { computed, onMounted, ref } from "vue";
import { ApiRecord } from "@/api/api-record/type";
import dayjs from "dayjs";
const columns = ref([
    {
        title: '请求账号',
        dataIndex: 'uid',
        key: 'uid',
    },
    {
        title: '请求地址',
        dataIndex: 'api',
        key: 'api',
    },
    {
        title: '请求时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
    {
        title: '请求耗时',
        dataIndex: 'rt',
        key: 'rt',
    },
    {
        title: '请求结果',
        dataIndex: 'result',
        key: 'result',
    },
    {
        title: '请求IP',
        dataIndex: 'ip',
        key: 'ip',
    },

    
])
const tableData = ref<ApiRecord[]>([])
const loading = ref(false)
const current = ref(1)
const pageSize = ref(10)
const total = ref(0)
const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
}));
const getListData = async () => {
    loading.value = true
    const { code, data } = await getList({ pageSize: pagination.value.pageSize, pageNumber: pagination.value.current })
    if (code === '0') {
        tableData.value = data.list
        total.value = data.total
    }
    loading.value = false
}
const handleChange = (pagination: any) => {
    current.value = pagination.current
    pageSize.value = pagination.pageSize
    getListData()
}
onMounted(async () => {
    getListData()
})
</script>
