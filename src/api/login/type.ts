export interface testReq {
    test: string
}
export interface captchaGetImgRes {
    imageBase64: string
    id: string
}

export interface loginReq {
    uid: string
    password: string
    id: string
    answer: string

}