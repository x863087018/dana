import http from '@/api/index'
import { getIpListRes, getListReq, getListRes } from './type'

enum Api {
    GET_LIST = '/api-record/get-list',
    GET_IP_LIST = '/api-record/ip-list',
}


export const getList = (data: getListReq) =>
    http.post<getListRes>({
        url: Api.GET_LIST, data
    })

export const getIpList = () =>
    http.post<getIpListRes>({
        url: Api.GET_IP_LIST,
        data: {}
    })
