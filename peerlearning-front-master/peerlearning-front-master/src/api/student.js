import request from '@/utils/request'
export function getCourses(params){
    return request({
        url: 'teaching/info',
        method: 'get',
        params,
        baseURL: '/domain'
    })
}

export function getStuCourses(params){
    return request({
        url: 'selecting/info',
        method: 'get',
        params,
        baseURL: '/domain'
    })
}

export function getStuHomework(params){
    return request({
        url: 'homework/getHomeworkByCourse',
        method: 'get',
        params,
        baseURL: '/domain'
    })
}

export function getHomeworkInfo(params){
    return request({
        url: 'homework/showHomework',
        method: 'get',
        params,
        baseURL: '/domain'
    })
}

export function submitHomework(data){
    return request({
        url: 'answer/add',
        method: 'post',
        baseURL: '/domain',
        data
    })
}