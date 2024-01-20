const getters = {
  baseApi: state => state.api.baseApi,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  sname: state => state.user.name,
  user: state => state.user.user,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  menuLoaded: state => state.permission.menuLoaded,
  cachedViews: state => state.tabbar.cachedViews,
  id: state => state.article.id,
  enable: state => state.user.enable,
  name:state => state.user.userName
}


export default getters
