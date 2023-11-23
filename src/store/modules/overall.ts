import { defineStore } from 'pinia'

interface OverallState {
  env: string
}

export const useOverallStore = defineStore({
  id: 'overall',
  state: (): OverallState => ({
    env: ''
  }),
  actions: {
    /**
     * 设置当前环境信息
     * @param env 当前环境信息
     */
    setEnv (env: string) {
      this.env = env
    }
  }
})
