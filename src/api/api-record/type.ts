export interface getListReq {
    pageSize: number
    pageNumber: number
    uid?: string
    api?: string
    ip?: string
    startTime?: number
    endTime?: number
}
export interface ApiRecord {
    _id: string
    createdAt: number
    updatedAt: number
    rt: number
    ip: string
    result: unknown
    api: string,
    uid: string
}
export interface getListRes {
    list: ApiRecord[]
    total: number
}

export type getIpListRes = string[]
