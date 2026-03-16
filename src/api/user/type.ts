export interface GetUserListReq {
  pageSize: number
  pageNumber: number
}

export interface UserItem {
  _id?: string
  id?: string
  username?: string
  nickname?: string
  role?: string
  email?: string
  createdAt?: number | string
  password?: string
}

export interface GetUserListRes {
  list: UserItem[]
  total: number
}
