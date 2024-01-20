import request from '@/utils/request'
export function getCourses(params){
    return request({
        url: 'teaching/info',
        method: 'get',
        params,
        baseURL: '/domain'
    })
}
//教师获取作业列表
export function getWorks(params){
    return request({
        url: 'homework/getHomeworkByCourse',
        method: 'get',
        params,
        baseURL: '/domain'
    })
}

export function getStudentInfo(params){
    return request({
        url: 'answer/getCourseAns',
        method: 'get',
        params,
        baseURL: '/domain'
    })
}
//获取教师教授的课程
export function getTeaching(params) {
    return request({
        url: 'teaching/info',
        method: 'get',
        params,
        baseURL:'/domain'
    })
}

export function addHomework(data){
    return request({
        url: 'homework/add',
        method: 'post',
        baseURL: '/domain',
        data
    })
}

export function getAnsDetail(params){
    return request({
        url: 'answer/getAnsDetail',
        method: 'get',
        baseURL: '/domain',
        params
    })
}

export function assignment(data){
    return request({
        url: 'assignment/start',
        method: 'post',
        baseURL: '/domain',
        data
    })
}

//教师使用智能预打分
export function preScored(params){
    return request({
        url: 'homework/preset',
        method: 'get',
        timeout: 100000,
        params,
        baseURL: '/domain',
    })
}

export function getDetailGrade(data) {
    return request({
        url: 'assignment/getDetailGrade',
        method: 'post',
        timeout: 100000,
        data,
        baseURL: '/domain',
    })
}