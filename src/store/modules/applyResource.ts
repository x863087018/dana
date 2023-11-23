import { defineStore } from 'pinia'

export const useApplyResourceStore = defineStore({
  id: 'applyResource',
  state: () => ({
    selectedSN: [] as string[]
  }),
  actions: {
    /**
     * 添加SN
     * @param sn 序列号SN
     */
    addSN (sn: string) {
      this.selectedSN.push(sn)
    },
    /**
     * 删除SN
     * @param sn 序列号SN
     */
    deleteSN (sn: string) {
      this.selectedSN = this.selectedSN.filter(item => item !== sn)
    },
    /**
     * 清空SN数组
     */
    clearSN () {
      this.selectedSN = []
    }
  }
})
