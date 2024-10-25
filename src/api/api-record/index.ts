import http from '@/api/index'

enum Api {
    GET_LIST = '/api-record/get-list'
}


export const getList = () =>
    http.post<null>({
        url: Api.GET_LIST,
    })