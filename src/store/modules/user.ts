import { defineStore } from 'pinia'
import { UserModel } from '@/api/user/types'
import { GetConfigMenuListRes } from '@/api/role/types'

type ConfigMenuList = GetConfigMenuListRes['list']
export interface UidName {
  name: string
  uid: string
}

interface UserState {
  info: UserModel
  configMenuList: ConfigMenuList
  uidName: UidName[]
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    info: {} as UserModel,
    configMenuList: [],
    uidName: []
  }),
  getters: {
    isLogin: (state) => Boolean(state.info?._id)
  },
  actions: {
    /**
     * 设置用户信息
     * @param info 用户信息
     */
    setUserInfo (info: UserModel) {
      this.info = info
    },

    /**
     * 设置基础配置菜单
     * @param list 基础配置菜单
     */
    setConfigMenuList (list: ConfigMenuList) {
      this.configMenuList = list
    },
    /**
     * 设置导入的表格中已经检查过并且uid转过name的数据
     */
    setUid2Name (uidName: UidName[]) {
      this.uidName = uidName
    }
  }
})
