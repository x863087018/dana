import http from '@/api/index'
import { captchaGetImgRes, testReq, loginReq, loginRes } from './type'

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
    http.post<loginRes>({
        url: Api.LOGIN, data
    })