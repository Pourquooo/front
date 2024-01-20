import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'user/login',
    method: 'post',
    data,
    baseURL:'/domain'
  })
}


export function logout() {
  return request({
    url: 'user/logout',
    method: 'post',
    withCredentials: true,
    baseURL:'/domain'
  })
}


export function altInform(data) {
  return request({
    url: 'user/modify',
    method: 'post',
    data,
    baseURL:'/domain',
    withCredentials: true
  })
}

export function searchInfo(data) {
  return request({
    url: 'user/search',
    method: 'get',
    data,
    withCredentials: true
  })
}

export function getSingleInfo(param) {
  return request({
    url: 'user/info',
    method: 'get',
    withCredentials: true,
    params:param,
    baseURL:'/domain'
  })
}
