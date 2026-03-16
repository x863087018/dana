<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="tableData"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      @change="handleChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'createdAt'">
          {{ formatTime(record.createdAt) }}
        </template>
      </template>
    </a-table>
  </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import dayjs from 'dayjs'
  import { getUserListWithPassword } from '@/api/user'
  import type { UserItem } from '@/api/user/type'
  
  const columns = ref([
    { title: '用户名', dataIndex: 'name', key: 'name' },
    { title: '账号', dataIndex: 'uid', key: 'uid' },
    { title: '密码', dataIndex: 'password', key: 'password' },
    { title: '头像', dataIndex: 'avatar', key: 'avatar' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  ])
  
  const tableData = ref<UserItem[]>([])
  const loading = ref(false)
  const current = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  
  const pagination = computed(() => ({
    total: total.value,
    current: current.value,
    pageSize: pageSize.value
  }))
  
  const formatTime = (val: any) => {
    if (!val) return '-'
    const ts = typeof val === 'number' ? val : Number(val)
    return isNaN(ts) ? String(val) : dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
  }
  
  const fetchList = async () => {
    loading.value = true
    const { code, data } = await getUserListWithPassword({
      pageSize: pagination.value.pageSize,
      pageNumber: pagination.value.current
    })
    if (code === '0') {
      tableData.value = data|| []
      total.value = data.length
    }
    loading.value = false
  }
  
  const handleChange = (p: any) => {
    current.value = p.current
    pageSize.value = p.pageSize
    fetchList()
  }
  
  onMounted(fetchList)
  </script>
  
