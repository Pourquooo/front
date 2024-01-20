import request from '@/utils/request'

//发布评论
export function addComment(data){
    return request({
        url: 'comment/add',
        method: 'post',
        data,
        baseURL: '/domain'
    })
}

//获取评论
export function getComment(params){
    return request({
        url: 'comment/info',
        method: 'get',
        params,
        baseURL: '/domain'
    })
}

//删除评论
export function deleteComment(data){
    return request({
        url: 'comment/delete',
        method: 'post',
        data,
        baseURL: '/domain'
    })
}