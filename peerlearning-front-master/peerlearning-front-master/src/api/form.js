import request from '@/utils/request'

export function sendComment(data) {
  return request({
    url: 'comment/add',
    method: 'post',
    baseURL: '/domain',
    data
  })
}

export function remove(data) {
  return request({
    url: 'comment/delete',
    method: 'post',
    baseURL: '/domain',
    data
  })
}



export function find(params) {
  return request({
    url: 'comment/info',
    method: 'get',
    params: params,
    baseURL: '/domain'
  })
}
