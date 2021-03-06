// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }

import { getToken, setToken, removeToken, getTimeStamp, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

// 状态
const state = {
  // 初始化vuex的时候，就先从缓存中读取
  token: getToken(), // 设置token为共享状态
  userInfo: {} // 这里定义一个空对象，而不是null，为什么呢？//*因为我们会在**`getters`**中引用userinfo的变量，如果设置为null，则会引起异常和报错

}

// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token// 将数据设置给vuex
    // 同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null// 将vuex的数据置空
    removeToken()// 同步到缓存
  },
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result // 这样是响应式
    // state.userInfo = { ...result }// 这样也是响应式 属于浅拷贝
    // state.userInfo['username'] = result // 这样不是响应式
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

// 执行异步
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data)// 拿到token
    // axios默认加了一层data
    // if (result.data.success) {
    //   // 如果为true，表示登陆成功
    //   context.commit('setToken', result.data.data)
    // }
    // 响应拦截器已经做过处理
    context.commit('setToken', result)// 设置token

    // 拿到token说明登录成功
    setTimeStamp()
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户的详情  用户的详情数据
    const baseInfo = await getUserDetailById(result.userId)

    // 将两个接口结果合并
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 提交到mutation
    return result // 这里return  是给后期做权限的时候留下伏笔
  },

  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('removeUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
