import http from '@/api/index'
import { testReq } from './type'

enum Api {
    TEST = '/test'
}
export const test = (data: testReq) =>
    http.post<null>({
        url: Api.TEST, data
    })