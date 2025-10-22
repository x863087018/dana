<template>
  <div class="chat-room">
    <div class="chat-header">
      <div>
        <h2>WebSocket 聊天室</h2>
        <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
          <span style="color: #666;">当前用户名:</span>
          <a-tag color="blue">{{ currentUsername }}</a-tag>
        </div>
      </div>
      <div class="status-info">
        <a-tag :color="connectionColor">
          {{ connectionStatus }}
        </a-tag>
        <span>在线用户: {{ onlineUserCount }}</span>
      </div>
    </div>
    
    <div class="chat-controls">
      <a-button 
        v-if="!isConnected" 
        type="primary" 
        @click="connect"
        :loading="connecting"
      >
        连接聊天室
      </a-button>
      <a-button 
        v-else 
        danger 
        @click="disconnect"
      >
        断开连接
      </a-button>
      <a-button @click="clearMessages" :disabled="!isConnected">
        清空消息
      </a-button>
    </div>
    
    <a-row :gutter="16" class="chat-content">
      <a-col :span="18">
        <div class="message-container">
          <div class="message-list" ref="messageListRef">
            <div v-for="msg in messages" :key="msg.id" :class="['message-item', getMessageClass(msg)]">
              <div class="message-avatar">
                <a-avatar :size="32">
                  {{ msg.username?.charAt(0)?.toUpperCase() || '?' }}
                </a-avatar>
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="username">{{ msg.username }}</span>
                  <span class="timestamp">{{ formatTime(msg.timestamp) }}</span>
                </div>
                <div class="message-text">{{ msg.content }}</div>
              </div>
            </div>
          </div>
          
          <div class="input-container">
            <a-input-group compact>
              <a-input 
                v-model:value="inputMessage" 
                placeholder="输入消息..." 
                @press-enter="sendMessage"
                :disabled="!isConnected"
                style="width: calc(100% - 80px)"
              />
              <a-button 
                type="primary" 
                @click="sendMessage"
                :disabled="!inputMessage.trim() || !isConnected"
                style="width: 80px"
              >
                发送
              </a-button>
            </a-input-group>
          </div>
        </div>
      </a-col>
      
      <a-col :span="6">
        <div class="online-users">
          <h3>在线用户 ({{ onlineUserCount }})</h3>
          <div class="user-list">
            <div v-for="user in onlineUsers" :key="user.id" class="user-item">
              <a-avatar :size="24">
                {{ user.username?.charAt(0)?.toUpperCase() || '?' }}
              </a-avatar>
              <span class="user-name">{{ user.username }}</span>
            </div>
            <div v-if="onlineUsers.length === 0" class="empty-users">
              暂无在线用户
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted, nextTick, computed, watch } from 'vue'
import { message } from 'ant-design-vue'

// 状态管理
const isConnected = ref(false)
const connecting = ref(false)
const connectionStatus = ref('已断开')
const inputMessage = ref('')
const currentUsername = ref('游客' + Math.random().toString(36).substr(2, 4))
const messages = ref<Array<{
  id: string
  username: string
  content: string
  timestamp: number
  type: string
  isSelf?: boolean
}>>([])
const onlineUsers = ref<Array<{
  id: string
  username: string
}>>([])
const ws = ref<WebSocket | null>(null)
const messageListRef = ref<HTMLElement>()
const heartbeatTimer = ref<any>(null)

// 计算属性
const connectionColor = computed(() => {
  if (isConnected.value) return 'green'
  return 'red'
})

const onlineUserCount = computed(() => onlineUsers.value.length)

// 连接 WebSocket
const connect = async () => {
  connecting.value = true
  try {
    const wsUrl = '/ws'
    
    // // 判断是否是穿透域名
    // if (window.location.host.includes('testjiutianda.cn')) {
    //   // 穿透访问：连接到后端的 HTTP 穿透地址 + /ws 路径
    //   wsUrl = 'wss://huangyingcan1123.testjiutianda.cn/ws'
    //   console.log('穿透模式 - WebSocket 连接地址:', wsUrl)
    // } else {
    //   // 本地开发：通过 Vite proxy 代理
    //   const protocol = 'ws:'
    //   const host = window.location.host
    //   wsUrl = `${protocol}//${host}/ws`
    //   console.log('本地模式 - WebSocket 连接地址:', wsUrl)
    // }
    
    ws.value = new WebSocket(wsUrl)
    
    ws.value.onopen = () => {
      isConnected.value = true
      connectionStatus.value = '已连接'
      connecting.value = false
      console.log('WebSocket 连接成功')
      message.success('连接成功！')
      
      // 添加系统消息
      messages.value.push({
        id: Date.now().toString(),
        username: '系统',
        content: '连接成功，欢迎进入聊天室！',
        timestamp: Date.now(),
        type: 'system'
      })
      
      // 发送加入消息
      if (ws.value) {
        ws.value.send(JSON.stringify({
          type: 'join',
          username: currentUsername.value
        }))
      }
      
      // 启动心跳
      startHeartbeat()
    }
    
    ws.value.onclose = () => {
      isConnected.value = false
      connectionStatus.value = '已断开'
      connecting.value = false
      console.log('WebSocket 连接断开')
      
      // 停止心跳
      stopHeartbeat()
      
      // 添加系统消息
      messages.value.push({
        id: Date.now().toString(),
        username: '系统',
        content: '连接已断开',
        timestamp: Date.now(),
        type: 'system'
      })
    }
    
    ws.value.onerror = (error) => {
      console.error('WebSocket 错误:', error)
      connecting.value = false
      message.error('连接失败，请检查服务器是否启动')
    }
    
    ws.value.onmessage = (event) => {
      console.log('收到原始消息:', event.data)
      
      // 过滤掉纯文本的 message 和 heartbeat
      if (event.data === 'message' || event.data === 'heartbeat') {
        console.log('忽略纯文本消息:', event.data)
        return
      }
      
      try {
        const data = JSON.parse(event.data)
        console.log('解析后的JSON:', data)
        handleMessage(data)
      } catch (error) {
        // 不是 JSON 格式的消息，记录但不显示
        console.log('收到非JSON消息（已忽略）:', event.data)
      }
    }
  } catch (error) {
    connecting.value = false
    console.error('连接失败:', error)
    message.error('连接失败')
  }
}

// 启动心跳
const startHeartbeat = () => {
  heartbeatTimer.value = setInterval(() => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }))
      console.log('发送心跳')
    }
  }, 30000) // 30秒
}

// 停止心跳
const stopHeartbeat = () => {
  if (heartbeatTimer.value) {
    clearInterval(heartbeatTimer.value)
    heartbeatTimer.value = null
  }
}

// 处理接收到的消息
const handleMessage = (data: any) => {
  // 如果消息在 data.message 里面，提取出来
  if (data.message && typeof data.message === 'object') {
    data = {
      ...data.message,
      from: data.from,
      serverTimestamp: data.timestamp
    }
  }
  
  console.log('处理消息:', data.type, data.username, data.content)
  
  // 如果消息没有 type 字段，尝试智能识别
  if (!data.type && data.content) {
    data.type = 'message'
  }
  
  switch (data.type) {
    case 'message':
      // 如果是自己发的消息且已经在本地显示了，就不再重复添加
      if (data.username !== currentUsername.value) {
        messages.value.push({
          id: data.id || Date.now().toString(),
          username: data.username || '未知用户',
          content: data.content,
          timestamp: data.timestamp || Date.now(),
          type: 'message',
          isSelf: false
        })
        
        // 滚动到底部
        nextTick(() => {
          scrollToBottom()
        })
      }
      break
      
    case 'system':
      messages.value.push({
        id: Date.now().toString(),
        username: '系统',
        content: data.content || data.message,
        timestamp: data.timestamp || Date.now(),
        type: 'system'
      })
      
      // 滚动到底部
      nextTick(() => {
        scrollToBottom()
      })
      break
      
    case 'online_users':
      onlineUsers.value = data.users || []
      console.log('在线用户:', onlineUsers.value)
      break
      
    case 'user_join':
    case 'join':
      // 检查是否是自己加入的消息，不显示自己的加入消息
      if (data.username && data.username !== currentUsername.value) {
        messages.value.push({
          id: Date.now().toString(),
          username: '系统',
          content: `${data.username} 加入了聊天室`,
          timestamp: Date.now(),
          type: 'system'
        })
        
        // 滚动到底部
        nextTick(() => {
          scrollToBottom()
        })
      }
      break
      
    case 'user_leave':
    case 'leave':
      messages.value.push({
        id: Date.now().toString(),
        username: '系统',
        content: `${data.username} 离开了聊天室`,
        timestamp: Date.now(),
        type: 'system'
      })
      
      // 滚动到底部
      nextTick(() => {
        scrollToBottom()
      })
      break
      
    case 'heartbeat':
      // 心跳消息不显示
      console.log('收到心跳响应')
      break
      
    default:
      // 未知类型的消息，只在控制台记录
      console.log('未知消息类型（已忽略）:', data.type, data)
      break
  }
}

// 断开连接
const disconnect = () => {
  if (ws.value) {
    ws.value.close()
    ws.value = null
  }
  message.info('已断开连接')
}

// 发送消息
const sendMessage = () => {
  if (ws.value && ws.value.readyState === WebSocket.OPEN && inputMessage.value.trim()) {
    const messageContent = inputMessage.value.trim()
    
    // 立即在本地显示消息
    messages.value.push({
      id: Date.now().toString(),
      username: currentUsername.value,
      content: messageContent,
      timestamp: Date.now(),
      type: 'message',
      isSelf: true
    })
    
    // 发送到服务器
    ws.value.send(JSON.stringify({
      type: 'message',
      content: messageContent,
      username: currentUsername.value
    }))
    
    console.log('发送消息:', messageContent)
    inputMessage.value = ''
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// 清空消息
const clearMessages = () => {
  messages.value = []
  message.info('消息已清空')
}

// 获取消息样式类
const getMessageClass = (msg: any) => {
  if (msg.type === 'system') return 'system-message'
  if (msg.isSelf || msg.username === currentUsername.value) return 'own-message'
  return 'normal-message'
}

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}

// 滚动到底部
const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

// 页面卸载时断开连接
onUnmounted(() => {
  if (ws.value) {
    ws.value.close()
  }
})

// 监听消息变化，自动滚动
watch(() => messages.value.length, () => {
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<style scoped>
.chat-room {
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 16px;
}

.chat-header h2 {
  margin: 0;
  color: #333;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.chat-controls {
  padding: 0 16px 16px;
  display: flex;
  gap: 8px;
}

.chat-content {
  flex: 1;
  padding: 0 16px;
}

.message-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.message-list {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 300px);
}

.message-item {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
}

.message-item.system-message {
  justify-content: center;
}

.message-item.system-message .message-content {
  background: #f0f0f0;
  color: #666;
  font-style: italic;
  text-align: center;
}

.message-item.own-message {
  flex-direction: row-reverse;
}

.message-item.own-message .message-avatar {
  margin-right: 0;
  margin-left: 12px;
}

.message-item.own-message .message-content {
  background: #1890ff;
  color: white;
  margin-left: 0;
}

.message-item.own-message .username {
  color: rgba(255, 255, 255, 0.9);
}

.message-item.own-message .timestamp {
  color: rgba(255, 255, 255, 0.7);
}

.message-avatar {
  margin-right: 12px;
}

.message-content {
  background: #f0f0f0;
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 60%;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 12px;
}

.username {
  font-weight: bold;
  color: #1890ff;
}

.timestamp {
  color: #999;
  font-size: 11px;
}

.message-text {
  word-break: break-word;
  line-height: 1.4;
}

.input-container {
  padding: 16px;
  border-top: 1px solid #e8e8e8;
  background: #fafafa;
}

.online-users {
  background: white;
  border-radius: 8px;
  padding: 16px;
  height: fit-content;
}

.online-users h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
}

.user-list {
  max-height: 400px;
  overflow-y: auto;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  gap: 8px;
}

.user-item:last-child {
  border-bottom: none;
}

.user-name {
  flex: 1;
  font-size: 14px;
}

.empty-users {
  text-align: center;
  color: #999;
  padding: 20px;
  font-style: italic;
}

/* 滚动条样式 */
.message-list::-webkit-scrollbar,
.user-list::-webkit-scrollbar {
  width: 6px;
}

.message-list::-webkit-scrollbar-track,
.user-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.message-list::-webkit-scrollbar-thumb,
.user-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.message-list::-webkit-scrollbar-thumb:hover,
.user-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>