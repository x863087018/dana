import http from '@/api/index'
import { getListReq, getListRes } from './type'

enum Api {
    GET_LIST = '/api-record/get-list'
}


export const getList = (data: getListReq) =>
    http.post<getListRes>({
        url: Api.GET_LIST, data
    })