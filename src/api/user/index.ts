import http from '@/api/index'
import { GetUserListReq, GetUserListRes } from './type'

enum Api {
  LIST_WITH_PASSWORD = '/user/list-with-password'
}

export const getUserListWithPassword = (data: GetUserListReq) =>
  http.post<GetUserListRes>({
    url: Api.LIST_WITH_PASSWORD,
    data
  })

