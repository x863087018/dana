export interface getListReq {
    pageSize: number
    pageNumber: number
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