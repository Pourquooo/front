import request from '@/utils/request'

export function getAssignments(data) {
    return request({
        url: 'assignment/getWork',
        method: 'post',
        data,
        baseURL:'/domain'
    })
}

export function getAssignment(data){
    return request({
        url: 'assignment/info',
        method:'post',
        baseURL: '/domain',
        data
    })
}
export function setAssignment(data){
    return request({
        url: 'assignment/setAssignment',
        method: 'post',
        data,
        baseURL:'/domain'
    })
}
//GPT查重接口
export function getGptCheck(data){
    return request({
        url: 'check/checkGpt',
        method: 'post',
        data,
        baseURL: '/domain'
    })
}
//相似度查重接口
export function getSimilarCheck(data){
    return request({
        url: 'check/checkSim',
        method: 'post',
        data,
        baseURL: '/domain'
    })
}
//教师查看查重信息接口
export function getCheckInfo(data){
    return request({
        url: 'check/info',
        method: 'post',
        data,
        baseURL: '/domain'
    })
}
//教师查看申诉信息接口
export function getAppealInfo(data){
    return request({
        url: 'appeal/info_teacher',
        method: 'post',
        data,
        baseURL: '/domain'
    })
}
//教师处理申诉接口即修改成绩
export function dealAppealInfo(data){
    return request({
        url: 'answer/setGrade',
        method: 'post',
        data,
        baseURL: '/domain'
    })
}

//计算总分
export function calcuGrade(data){
    return request({
        url: 'answer/getAns',
        method: 'post',
        data,
        baseURL: '/domain'
    })
}