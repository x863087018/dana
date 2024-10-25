export interface testReq {
    test: string
}
export interface captchaGetImgRes {
    imageBase64: string
    id: string
}
export interface User {
    _id: string,
    name: string,
    uid: string,
    updatedAt: number,
    createdAt: number,
    ataver?: any
}
export interface loginReq {
    uid: string
    password: string
    id: string
    answer: string

}
export interface loginRes {
    token: string
    user: User
}