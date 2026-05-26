<template>
  <div class="json-parse">
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card class="header-card" :bordered="false">
          <div class="header">
            <div>
              <a-typography-title :level="3" style="margin: 0">JSON 解析</a-typography-title>
              <a-typography-text type="secondary">
                输入 JSON → 解析/格式化 → 树形查看（支持展开/收起）→ 一键复制
              </a-typography-text>
            </div>
            <div class="header-actions">
              <a-space>
                <a-button @click="handleClear">清空</a-button>
                <a-button @click="handleReset">重置</a-button>
                <a-button type="primary" @click="handleConvert">转换</a-button>
              </a-space>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="12">
        <a-card title="输入 JSON" :bordered="false">
          <a-textarea
            v-model:value="inputText"
            :auto-size="{ minRows: 18, maxRows: 28 }"
            placeholder='例如：{"name":"dana","list":[1,2,3]}'
          />
          <div style="margin-top: 12px">
            <a-alert
              v-if="parseError"
              type="error"
              show-icon
              :message="parseError"
            />
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="12">
        <a-card title="解析结果" :bordered="false">
          <template #extra>
            <a-space>
              <a-button :disabled="!parsedOk" @click="handleFormat">格式化</a-button>
              <a-button :disabled="!parsedOk" @click="handleCopy">复制</a-button>
              <a-divider type="vertical" />
              <a-button :disabled="!parsedOk" @click="expandAll">展开</a-button>
              <a-button :disabled="!parsedOk" @click="collapseAll">收起</a-button>
            </a-space>
          </template>

          <!-- 注意：在 DOM 模板里属性名大小写可能被折叠，使用 kebab-case 更稳 -->
          <a-tabs v-model:active-key="activeTab">
            <a-tab-pane key="tree" tab="树形视图">
              <div v-if="!parsedOk" class="empty">
                <a-typography-text type="secondary">点击“转换”后在这里查看解析结果</a-typography-text>
              </div>
              <a-tree
                v-else
                :tree-data="treeData"
                :expanded-keys="expandedKeys"
                :auto-expand-parent="autoExpandParent"
                @expand="onExpand"
              />
            </a-tab-pane>

            <a-tab-pane key="json" tab="JSON 文本">
              <div v-if="!parsedOk" class="empty">
                <a-typography-text type="secondary">点击“转换”后在这里查看解析结果</a-typography-text>
              </div>
              <pre v-else class="json-pre">{{ formattedText || rawText }}</pre>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { message } from 'ant-design-vue'
import type { TreeDataNode } from 'ant-design-vue'

const demoJson = `{
  "name": "dana",
  "success": true,
  "count": 3,
  "list": [1, 2, 3],
  "obj": { "a": 1, "b": { "c": "hello" } }
}`

const inputText = ref<string>(demoJson)
const parseError = ref<string>('')

const parsedObj = ref<any>(null)
const rawText = ref<string>('')
const formattedText = ref<string>('')

const activeTab = ref<'tree' | 'json'>('tree')

const treeData = ref<TreeDataNode[]>([])
const expandedKeys = ref<string[]>([])
const autoExpandParent = ref<boolean>(true)
const allNodeKeys = ref<string[]>([])

const parsedOk = computed(() => parsedObj.value !== null)

function isPlainObject(val: any) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

function buildTree(value: any) {
  const keys: string[] = []

  const formatPrimitive = (v: any) => {
    if (typeof v === 'string') return `"${v}"`
    if (v === null) return 'null'
    if (typeof v === 'undefined') return 'undefined'
    return String(v)
  }

  const makeNode = (keyLabel: string, v: any, path: string): TreeDataNode => {
    keys.push(path)
    const isArray = Array.isArray(v)
    const isObj = isPlainObject(v)

    if (isArray || isObj) {
      const children: TreeDataNode[] = []
      const entries = isArray ? v.map((x: any, i: number) => [String(i), x]) : Object.entries(v)
      for (const [k, child] of entries) {
        const childPath = isArray ? `${path}[${k}]` : `${path}.${k}`
        const childLabel = isArray ? `[${k}]` : k
        children.push(makeNode(childLabel, child, childPath))
      }
      const count = isArray ? v.length : Object.keys(v || {}).length
      const title = `${keyLabel}: ${isArray ? `Array(${count})` : `Object(${count})`}`
      return { key: path, title, children }
    }

    return { key: path, title: `${keyLabel}: ${formatPrimitive(v)}` }
  }

  const root = makeNode('root', value, 'root')
  allNodeKeys.value = keys
  treeData.value = [root]
  expandedKeys.value = ['root']
  autoExpandParent.value = true
}

const handleConvert = () => {
  parseError.value = ''
  formattedText.value = ''
  rawText.value = ''
  parsedObj.value = null

  const text = (inputText.value || '').trim()
  if (!text) {
    parseError.value = '请输入 JSON 文本'
    message.error(parseError.value)
    return
  }

  try {
    let obj: any
    const trySecondParseIfJsonLike = (v: any) => {
      if (typeof v !== 'string') return v
      const s = v.trim()
      // 如果第一次解析出来是一个字符串，但字符串本身又是 JSON（常见于：后端把 JSON 当字符串下发）
      if (s.startsWith('{') || s.startsWith('[')) {
        try {
          return JSON.parse(s)
        } catch (_e) {
          return v
        }
      }
      return v
    }

    try {
      // 正常 JSON
      obj = JSON.parse(text)
    } catch (e) {
      /**
       * 兼容“转义过的 JSON，但外层引号被去掉”的情况，例如：
       * {\"a\":1}
       * 这种不是合法 JSON，但它是“JSON 字符串内容”，可先反转义再 parse。
       */
      const looksEscaped =
        (text.startsWith('{\\') || text.startsWith('[\\') || text.includes('\\"')) &&
        !text.startsWith('"')

      if (!looksEscaped) throw e

      // 先当作 JSON 字符串进行反转义，再 parse 成对象
      const unescapedText = JSON.parse('"' + text + '"')
      obj = JSON.parse(unescapedText)
      message.success('检测到转义 JSON，已自动反转义并解析')
    }

    // 兼容："...json string..." 这种，第一次 parse 后是 string，需要二次 parse 才是对象
    const before = obj
    obj = trySecondParseIfJsonLike(obj)
    if (before !== obj) {
      message.success('检测到 JSON 字符串，已自动二次解析')
    }

    parsedObj.value = obj
    rawText.value = JSON.stringify(obj)
    buildTree(obj)
    if (rawText.value) activeTab.value = 'tree'
  } catch (e: any) {
    const msg = e?.message ? `解析失败：${e.message}` : '解析失败：未知错误'
    parseError.value = msg
    message.error(msg)
  }
}

const handleFormat = () => {
  if (!parsedOk.value) return
  formattedText.value = JSON.stringify(parsedObj.value, null, 2)
  message.success('已格式化')
  activeTab.value = 'json'
}

const handleCopy = async () => {
  if (!parsedOk.value) return
  const text = formattedText.value || JSON.stringify(parsedObj.value, null, 2)
  try {
    await navigator.clipboard.writeText(text)
    message.success('已复制到剪贴板')
  } catch (e) {
    // 兼容不支持 clipboard 的情况
    try {
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message.success('已复制到剪贴板')
    } catch (err) {
      message.error('复制失败，请手动复制')
    }
  }
}

const handleClear = () => {
  inputText.value = ''
  parseError.value = ''
  parsedObj.value = null
  treeData.value = []
  expandedKeys.value = []
  rawText.value = ''
  formattedText.value = ''
}

const handleReset = () => {
  inputText.value = demoJson
  parseError.value = ''
  parsedObj.value = null
  treeData.value = []
  expandedKeys.value = []
  rawText.value = ''
  formattedText.value = ''
  activeTab.value = 'tree'
}

const onExpand = (keys: any) => {
  expandedKeys.value = keys as string[]
  autoExpandParent.value = false
}

const expandAll = () => {
  expandedKeys.value = [...allNodeKeys.value]
  autoExpandParent.value = false
}

const collapseAll = () => {
  expandedKeys.value = ['root']
  autoExpandParent.value = false
}
</script>

<style scoped lang="scss">
.json-parse {
  width: 100%;
}

.header-card {
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.14), rgba(82, 196, 26, 0.12));
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.header-actions {
  flex: 0 0 auto;
}

.json-pre {
  max-height: 520px;
  overflow: auto;
  background: #0b1021;
  color: #e6edf3;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  line-height: 1.5;
  font-size: 12px;
}

.empty {
  padding: 16px 0;
}
</style>
