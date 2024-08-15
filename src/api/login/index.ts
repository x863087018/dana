import http from '@/api/index'
import { captchaGetImgRes, testReq, loginReq } from './type'

enum Api {
    TEST = '/captcha/getImg',
    CAPTCHA_GETIMG = '/captcha/getImg',
    LOGIN = '/user/login'
}
export const test = (data: testReq) =>
    http.post<null>({
        url: Api.TEST, data
    })
export const captchaGetImg = () =>
    http.post<captchaGetImgRes>({
        url: Api.CAPTCHA_GETIMG
    })
export const login = (data: loginReq) =>
    http.post<any>({
        url: Api.LOGIN, data
    })