import Axios from './axios'
import axios, { AxiosResponse } from 'axios'
import { Interceptors, CreateAxiosOptions } from '@/types/axios'
import { message } from 'ant-design-vue'
// import { fixOauthUrl } from '@/utils/util'

enum ResCode {
    'SUCCESS' = '0',
    'NOT_LOGIN' = '401',
    'NOT_SUCCESS' = '500',
    'NOT_AUTH' = '4030000'
}

const pendingRequest = new Map()
const generateRequestKey = (config: CreateAxiosOptions) => {
    const { url } = config
    return url
}
const addPendingRequest = (config: CreateAxiosOptions) => {
    if (!config.customOptions?.limitRepeat) return

    const key = generateRequestKey(config)
    if (!pendingRequest.has(key)) {
        config.cancelToken = new axios.CancelToken(cancel => {
            pendingRequest.set(key, cancel)
        })
    }
}
const removePendingRequest = (config: CreateAxiosOptions) => {
    const key = generateRequestKey(config)
    if (pendingRequest.has(key)) {
        pendingRequest.get(key)(`cancel due to repeated request ${key}`)
        pendingRequest.delete(key)
    }
}

const interceptors: Interceptors = {
    reqInterceptors: (config: CreateAxiosOptions) => {
        removePendingRequest(config)
        addPendingRequest(config)
        // 假设您的 token 存储在一个变量 token 中
        const token = sessionStorage.getItem('spaceToken')
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`
        };
        return config
    },

    reqInterceptorsCatch: (err: any) => {
        pendingRequest.clear()
        return Promise.reject(err)
    },

    resInterceptors: (res: AxiosResponse<any>) => {
        const { data, config } = res
        const { code, msg } = data

        removePendingRequest(config)

        if (code === ResCode.NOT_LOGIN
        ) {
            sessionStorage.removeItem('spaceToken')
            sessionStorage.removeItem('isLogin')
            window.location.replace('/login')

        } else if (code === ResCode.NOT_SUCCESS) {
            message.error(`${data.data}`)
        }
        return res
    },

    resInterceptorsCatch: (err: any) => {
        // 重复请求引发的错误
        if (err.message.indexOf('cancel due to repeated request') > -1) return Promise.reject(err)

        if (err.response) {
            const { config, status, statusText, data }: AxiosResponse = err.response
            const errMsgMode = (config as CreateAxiosOptions).customOptions?.errMsgMode || 'message'

            if (status) {
                if (status !== 502) {
                    if (errMsgMode === 'message') message.error(`${data?.msg || statusText || '接口异常'}，状态码${status}`)
                }
            }
        } else {
            message.error(
                err.message.includes('timeout')
                    ? '请求超时'
                    : '请求异常'
            )
        }

        pendingRequest.clear()
        return Promise.reject(err)
    }
}
export default new Axios({
    baseURL: '/api',
    timeout: 1000 * 30,
    interceptors
})