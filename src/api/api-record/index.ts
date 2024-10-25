import http from '@/api/index'
import { getListReq } from './type'

enum Api {
    GET_LIST = '/api-record/get-list'
}


export const getList = (data: getListReq) =>
    http.post<null>({
        url: Api.GET_LIST, data
    })