import http from '@/api/index'
import { GetUserListReq, GetUserListRes, WxLoginUserListRes } from './type'

enum Api {
  LIST_WITH_PASSWORD = '/user/list-with-password',
  WX_LOGIN_USERS = '/user/wx-login-users'
}

export const getUserListWithPassword = (data: GetUserListReq) =>
  http.post<GetUserListRes>({
    url: Api.LIST_WITH_PASSWORD,
    data
  })

/**
 * 查询登录过小程序的微信用户列表
 */
export const getWxLoginUsers = () =>
  http.post<WxLoginUserListRes>({
    url: Api.WX_LOGIN_USERS
  })
