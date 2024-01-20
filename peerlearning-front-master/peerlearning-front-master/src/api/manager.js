import request from '@/utils/request'

export function getAllTeachers(){
    return request({
        url: 'manager/getAllTeachers',
        method: 'get',
        baseURL: '/domain'
    })
}

export function getAllStudents(){
    return request({
        url: 'manager/getAllStudents',
        method: 'get',
        baseURL: '/domain'
    })
}

export function getAllAssistants() {
    return request({
        url: 'manager/getAllAssistants',
        method: 'get',
        baseURL: '/domain'
    })
}
export function deleteUser(data){
    return request({
        url: 'user/delete',
        method: 'post',
        baseURL: '/domain',
        data
    })
}