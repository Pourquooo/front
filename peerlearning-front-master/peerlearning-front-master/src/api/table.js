// import request from '@/utils/request'

// export function getList(titles) {
//   var con = {};
//   con['title'] = titles;
//   con = JSON.stringify(con);
//   return request({
//     url: 'http://8.140.192.225:9999/domain/article/search',
//     method: 'get',
//     params: { title: titles }
//   })
// }

// export function getAll() {
//   return request({
//     url: 'http://8.140.192.225:9999/domain/article/all',
//     method: 'get'
//   })
// }

// export function getMySelf(name) {
//   return request({
//     url: 'http://8.140.192.225:9999/domain/article/myself',
//     method: 'get',
//     params: { name: name }
//   })
// }

// export function artiInform(data){
//   return request({
//     url: 'http://8.140.192.225:9999/domain/collectArt/getUserCollect',
//     method: 'get',
//     params: data
//   })
// }

// export function artiRemove(data) {
//   return request({
//     url: 'http://8.140.192.225:9999/domain/collectArt/removeRelation',
//     method: 'post',
//     data
//   })
// }
