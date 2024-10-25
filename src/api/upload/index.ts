import http from '@/api/index'

enum Api {
    UPLOAD = '/file/upload-avatar'
}


export const uploadAvatar = (file: any) => {
    const formData = new FormData();
    formData.append('file', file); // 'file' 是服务器端接收文件时的字段名

    return http.post<any>({
        url: Api.UPLOAD,
        data: formData, // 将 FormData 作为请求体
        headers: {
            'Content-Type': 'multipart/form-data', // 设置请求头
        },
    });
};