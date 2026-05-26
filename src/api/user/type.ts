export interface GetUserListReq {
  pageSize: number
  pageNumber: number
}

export interface UserItem {
  _id?: string
  id?: string
  uid?: string
  name?: string
  avatar?: string
  createdAt?: number | string
  updatedAt?: number | string
  password?: string
  wxOpenid?: string
  wxUnionid?: string
  loginCount?: number
  lastLoginAt?: number
}

// 后端实际返回的是数组（Result.OK(list)）
export type GetUserListRes = UserItem[]

export type WxLoginUserItem = UserItem
export type WxLoginUserListRes = WxLoginUserItem[]
