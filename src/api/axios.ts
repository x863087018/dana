import _ from 'lodash'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { CreateAxiosOptions, Interceptors, Result, CustomOptions } from '@/types/axios'

export default class Axios {
    private axiosInstance: AxiosInstance;
    private readonly options: CreateAxiosOptions;

    constructor(options: CreateAxiosOptions) {
        this.axiosInstance = axios.create(options)
        this.options = options
        this.initInterceptors()
    }

    /**
     * 初始化拦截器
     */
    private initInterceptors(): void {
        const interceptors = this.getInterceptors()
        if (!interceptors) return

        const {
            reqInterceptors,
            reqInterceptorsCatch,
            resInterceptors,
            resInterceptorsCatch
        } = interceptors

        // 请求拦截器
        this.axiosInstance.interceptors.request.use(reqInterceptors, reqInterceptorsCatch)

        // 响应拦截器
        this.axiosInstance.interceptors.response.use(resInterceptors, resInterceptorsCatch)
    }

    /**
     * 获取拦截器信息
     * @returns 拦截器配置
     */
    getInterceptors(): Interceptors | undefined {
        const { interceptors } = this.options
        return interceptors
    }

    /**
     * 发送请求
     * @param config 请求参数
     * @returns 响应结果
     */
    request<T = any>(config: AxiosRequestConfig, options?: CustomOptions): Promise<Result<T>> {
        const conf: CreateAxiosOptions = _.cloneDeep(config)
        conf.customOptions = _.assign(this.options.customOptions || {}, options)

        return new Promise((resolve, reject) => {
            this.axiosInstance.request<Result<T>, AxiosResponse<Result<T>>>(conf)
                .then((res: AxiosResponse<Result<T>>) => {
                    resolve(res.data)
                })
                .catch((err: AxiosError) => {
                    reject(err)
                })
        })
    }

    /**
     * POST请求
     * @param config 请求参数
     * @returns 响应结果
     */
    post<T = any>(config: AxiosRequestConfig, options?: CustomOptions): Promise<Result<T>> {
        return this.request<T>({ ...config, method: 'POST' }, options)
    }

    /**
     * 上传文件
     * @param config 请求参数
     * @returns 响应结果
     */
    upload<T = any>(config: AxiosRequestConfig, options?: CustomOptions) {
        _.assign(config, { headers: { 'Content-Type': 'multipart/form-data' } })
        return this.request<T>({ ...config, method: 'POST' }, options)
    }
}