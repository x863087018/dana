import http from '@/api/index'
import { captchaGetImgRes, testReq } from './type'

enum Api {
    TEST = '/captcha/getImg',
    CAPTCHA_GETIMG = '/captcha/getImg'
}
export const test = (data: testReq) =>
    http.post<null>({
        url: Api.TEST, data
    })
export const captchaGetImg = () =>
    http.post<captchaGetImgRes>({
        url: Api.CAPTCHA_GETIMG
    })