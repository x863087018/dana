<template>
    <div>
        <a-form layout="inline" style="margin-bottom: 12px;">
            <a-form-item label="请求账号">
                <a-input v-model:value="queryForm.uid" allow-clear placeholder="请输入账号" style="width: 180px;" />
            </a-form-item>
            <a-form-item label="请求地址">
                <a-input v-model:value="queryForm.api" allow-clear placeholder="请输入地址" style="width: 240px;" />
            </a-form-item>
            <a-form-item label="请求时间">
                <a-range-picker
                    v-model:value="queryForm.timeRange"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    style="width: 360px;"
                />
            </a-form-item>
            <a-form-item label="请求IP">
                <a-select
                    v-model:value="queryForm.ip"
                    allow-clear
                    show-search
                    placeholder="请选择 IP"
                    :options="ipOptions"
                    :filter-option="filterIpOption"
                    style="width: 220px;"
                />
            </a-form-item>
            <a-form-item>
                <a-space>
                    <a-button type="primary" @click="handleQuery">查询</a-button>
                    <a-button @click="handleReset">重置</a-button>
                </a-space>
            </a-form-item>
        </a-form>

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
import { getIpList, getList } from "@/api/api-record";
import { computed, onMounted, reactive, ref } from "vue";
import { ApiRecord } from "@/api/api-record/type";
import dayjs from "dayjs";

type IpOption = { label: string; value: string };
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
const ipOptions = ref<IpOption[]>([])
const queryForm = reactive<{
    uid: string
    api: string
    ip?: string
    timeRange: any[]
}>({
    uid: '',
    api: '',
    ip: undefined,
    timeRange: []
})

const filterIpOption = (input: string, option: any) => {
    const v = (option?.value ?? '') as string
    return v.toLowerCase().includes((input || '').toLowerCase())
}

const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
}));
const getListData = async () => {
    loading.value = true
    const params: any = { pageSize: pagination.value.pageSize, pageNumber: pagination.value.current }
    if (queryForm.uid?.trim()) params.uid = queryForm.uid.trim()
    if (queryForm.api?.trim()) params.api = queryForm.api.trim()
    if (queryForm.ip) params.ip = queryForm.ip
    if (Array.isArray(queryForm.timeRange) && queryForm.timeRange.length === 2) {
        const [start, end] = queryForm.timeRange
        if (start) params.startTime = dayjs(start).valueOf()
        if (end) params.endTime = dayjs(end).valueOf()
    }

    const { code, data } = await getList(params)
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

const handleQuery = () => {
    current.value = 1
    getListData()
}

const handleReset = () => {
    queryForm.uid = ''
    queryForm.api = ''
    queryForm.ip = undefined
    queryForm.timeRange = []
    current.value = 1
    getListData()
}

const loadIpOptions = async () => {
    const { code, data } = await getIpList()
    if (code === '0' && Array.isArray(data)) {
        ipOptions.value = data.map((ip: string) => ({ label: ip, value: ip }))
    }
}

onMounted(async () => {
    loadIpOptions()
    getListData()
})
</script>
