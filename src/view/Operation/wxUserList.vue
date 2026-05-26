<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="tableData"
      :loading="loading"
      row-key="_id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'avatar'">
          <a-image
            v-if="record.avatar"
            :width="40"
            :src="record.avatar"
          />
          <span v-else>-</span>
        </template>

        <template v-else-if="column.dataIndex === 'wxOpenid'">
          {{ maskId(record.wxOpenid) }}
        </template>

        <template v-else-if="column.dataIndex === 'wxUnionid'">
          {{ maskId(record.wxUnionid) }}
        </template>

        <template v-else-if="column.dataIndex === 'lastLoginAt'">
          {{ formatTime(record.lastLoginAt) }}
        </template>

        <template v-else-if="column.dataIndex === 'createdAt'">
          {{ formatTime(record.createdAt) }}
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { getWxLoginUsers } from '@/api/user'
import type { WxLoginUserItem } from '@/api/user/type'

const columns = ref([
  { title: '昵称', dataIndex: 'name', key: 'name' },
  { title: '头像', dataIndex: 'avatar', key: 'avatar' },
  { title: 'OpenID', dataIndex: 'wxOpenid', key: 'wxOpenid' },
  { title: 'UnionID', dataIndex: 'wxUnionid', key: 'wxUnionid' },
  { title: '登录次数', dataIndex: 'loginCount', key: 'loginCount' },
  { title: '最近登录时间', dataIndex: 'lastLoginAt', key: 'lastLoginAt' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' }
])

const tableData = ref<WxLoginUserItem[]>([])
const loading = ref(false)

const formatTime = (val: any) => {
  if (!val) return '-'
  const ts = typeof val === 'number' ? val : Number(val)
  return isNaN(ts) ? String(val) : dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
}

const maskId = (val: any) => {
  if (!val) return '-'
  const s = String(val)
  if (s.length <= 10) return s
  return `${s.slice(0, 4)}****${s.slice(-4)}`
}

const fetchList = async () => {
  loading.value = true
  try {
    const { code, data } = await getWxLoginUsers()
    if (code === '0') {
      tableData.value = data || []
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchList)
</script>

