import { defineStore } from 'pinia'
import { User } from '@/api/login/type'
export interface UidName {
  name: string
  uid: string
}

interface UserState {
  info: User
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    info: {} as User,
  }),
  getters: {
    isLogin: (state) => Boolean(state.info?._id)
  },
  actions: {
    /**
     * 设置用户信息
     * @param info 用户信息
     */
    setUserInfo(info: User) {
      this.info = info
    },
  }
})
