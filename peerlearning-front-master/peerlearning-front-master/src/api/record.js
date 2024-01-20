import request from '@/utils/request'

//获取学生选课信息接口
export function getCourses(params) {
    return request({
        url: 'selecting/info',
        method: 'get',
        params,
        baseURL: '/domain'
    })
}
//根据课程id获取作业信息
export function getHomeworksByCourse(params) {
    return request({
        url: 'homework/getHomeworkByCourseForStu',
        method: 'get',
        params,
        baseURL: '/domain'
    })
}
//获取批改过的作业详情
export function getHomeworkScore(params){
    return request({
        url: '/answer/getAnsDetail',
        method: 'get',
        params,
        baseURL: '/domain'
    })
}
//申诉接口
export function postAppeal(data) {
    return request({
        url: 'homework/complaint',
        method: 'post',
        data,
        baseURL: '/domain'
    })
}
//AI询问接口
export function postQuestion(data){
    return request({
        url: 'ai/queryAi',
        method:'post',
        timeout: 100000,
        data,
        baseURL: '/domain'
    })
}

//成绩分布接口
export function getGradeGraph(params){
    return request({
        url: 'homework/grade',
        method: 'get',
        params,
        baseURL: '/domain'
    })
}