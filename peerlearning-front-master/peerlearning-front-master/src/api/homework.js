import request from '@/utils/request'

export function getHomework(data) {
    return request({
        url: 'homework/search',
        method: 'get',
        data,
        baseURL: '/domain'
    })
}

//教师通过homeworkId查询已发布作业信息
export function getHomeworkByHomeworkId(params){
    return request({
        url: 'homework/info',
        method: 'get',
        params,
        baseURL: '/domain'
    })
}

//修改作业信息
export function updateHomework(data){
    return request({
        url: 'homework/update',
        method:'post',
        data,
        baseURL:'/domain'
    })
}
//删除作业信息
export function TeachDeleteHomework(data){
    return request({
        url: 'homework/delete',
        method: 'post',
        data,
        baseURL: '/domain'
    })
}


export function addHomework(data) {
    return request({
        url: 'homework/add',
        method: 'post',
        baseURL: '/domain',
        data
    })
}

export function addAnswer(data) {
    return request({
        url: 'answer/add',
        method: 'post',
        baseURL: '/domain',
        data
    })
}

export function getUndistributedHomework(data) {
    return request({
        url: 'assignment/undistributedHomework',
        method: 'post',
        data,
        baseURL: '/domain'
    })
}

export function deleteHomework(data){
    return request({
        url: 'answer/delete',
        method: 'post',
        data,
        baseURL: '/domain'
    })
}

export function details(data){
    return request({
        url: 'assignment/getDetailGrade',
        method: 'post',
        data,
        baseURL: '/domain'
    })
}

