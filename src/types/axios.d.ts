import { AxiosRequestConfig, AxiosResponse } from 'axios'

export abstract class Interceptors {
    /**
     * 请求之前拦截
     */
    reqInterceptors: (config: AxiosRequestConfig) => AxiosRequestConfig

    /**
     * 请求之前错误拦截
     */
    reqInterceptorsCatch: (err: any) => Promise<any>

    /**
     * 请求之后拦截
     */
    resInterceptors: (res: AxiosResponse<any>) => AxiosResponse<any>

    /**
     * 请求之后错误拦截
     */
    resInterceptorsCatch: (err: any) => Promise<any>
}

export interface SucMsgMode {
    msg?: string
    mode?: 'none' | 'message' | undefined
    useResponseMsg?: boolean
}

export type ErrMsgMode = 'none' | 'message' | undefined

export interface CustomOptions {
    sucMsgMode?: SucMsgMode
    errMsgMode?: ErrMsgMode
    limitRepeat?: boolean
}

export interface CreateAxiosOptions extends AxiosRequestConfig {
    interceptors?: Interceptors
    customOptions?: CustomOptions
}

export interface Result<T = any> {
    code: string
    msg: string
    data: T
}