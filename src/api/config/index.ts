import http from '@/api/index'

enum Api {
    GET_SECRET_KEY = '/config/get-secretKey',
    GET_JWT = '/config/get-jwt'
}

export const getSecretKey = () =>
    http.post<null>({
        url: Api.GET_SECRET_KEY,
    })

export const getJwt = () =>
    http.post<null>({
        url: Api.GET_JWT,
    })