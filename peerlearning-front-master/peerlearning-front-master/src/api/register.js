import request from '@/utils/request'

export function register(data) {
    return request({
        url: 'user/add',
        method: 'post',
        data,
        baseURL:'/domain'
    })
}

