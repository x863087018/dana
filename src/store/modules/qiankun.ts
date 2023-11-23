import { defineStore } from 'pinia'

interface QiankunState {
  hasInitCollapsed: boolean
  collapsed: boolean
}

export const useQiankunStore = defineStore({
  id: 'qiankun',
  state: (): QiankunState => ({
    hasInitCollapsed: false,
    collapsed: false
  }),
  actions: {
    /**
     * 是否初始化过侧边栏
     * @param state 初始化状态
     */
    setHasInitCollapsed (state: boolean) {
      this.hasInitCollapsed = state
    },

    /**
     * 设置侧边栏收缩状态
     * @param state 收缩状态
     */
    setCollapsed (state: boolean) {
      this.collapsed = state
    }
  }
})
