import axios from 'axios'
export function getUploadToken(params) {
    return axios({
        url: 'user/get-upload-token',
        method: 'get',
        params,
        withCredentials: true,
    })
}