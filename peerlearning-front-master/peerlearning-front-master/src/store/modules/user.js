import { login, logout, getSingleInfo } from '@/api/user'
import { send } from '@/api/form'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    userName: '',
    enable: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_PASSWORD: (state, password) => {
    state.password = password
  },
  SET_ENABLE: (state, enable) => {
    state.enable = enable
    console.log("enable" + enable)
  },
  SET_NAME: (state, name) => {
    state.userName = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_ID: (state, userId) => {
    state.userId = userId
  },
  SET_CLASS: (state, banji) => {
    state.class = banji
  },
  SET_ROLETYPE: (state, rotype) => {
    state.roleType = rotype
  },
  SET_TOKEN: (state, session) => {
    state.session = session
  }
}


// localhost:9999
const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userId, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userId: userId.trim(), password: password }).then(response => {
        const {status} = response
        if(status){
          const { data } = response
          commit('SET_PASSWORD', data[0].password)
          commit('SET_NAME', data[0].userName)
          commit('SET_AVATAR', data[0].userFace)
          commit('SET_EMAIL', data[0].email)
          commit('SET_CLASS', data[0].class)
          commit('SET_ROLETYPE', data[0].roleType)
          commit('SET_ID', data[0].userId)
          commit('SET_TOKEN', data[0].session)
          console.log(data[0].userId, data[0].userFace, data[0].email, data[0].class, data[0].roleType, data[0].userName)
          setToken(data[0].session)
          console.log("session",data[0].session)
          localStorage.setItem("userId",data[0].userId)
          resolve({'status':status,'roleType':data[0].roleType})
        }else{
          const {description} = response
          reject(new Error(description));
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getSingleInfo ({ commit }, userId) {
    return new Promise((resolve, reject) => {
      getSingleInfo({'userId':userId}).then(response => {
        const { status } = response
        if (!status)
        {
          return reject('Verification failed, please Login again.')
        }
        const { data } = response
        commit('SET_PASSWORD', data[0].password)
        commit('SET_NAME', data[0].userName)
        commit('SET_AVATAR', data[0].userFace)
        commit('SET_EMAIL', data[0].email)
        commit('SET_CLASS', data[0].class)
        commit('SET_ROLETYPE', data[0].roleType)
        commit('SET_ID', data[0].userId)
        commit('SET_TOKEN', data[0].session)
        console.log(data[0].userId, data[0].userFace, data[0].email, data[0].class, data[0].roleType, data[0].userName)
        setToken(data[0].session)
        console.log("session", data[0].session)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

