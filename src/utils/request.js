// import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// // create an axios instance
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   timeout: 5000 // request timeout
// })

// // request interceptor
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

// // response interceptor
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data

//     // if the custom code is not 20000, it is judged as an error.
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

// export default service
import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'

const TimeOut = 3600// 定义事件
const service = axios.create({
  // 当执行 npm run dev => .evn.development => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API, // npm run dev => /api         npm run build => /prod-api

  timeout: 5000// 超时时间
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 注入token
  if (store.getters.token) {
    // 只有在有token的情况下   才有必要去检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果为true表示过期了
      // token没有用了 删除token
      store.dispatch('user/logout')// 登出操作
      router.push('/login')// 跳转到登录页
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }

  // config是请求的配置信息
  return config // 必须要返回的
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data

  // 要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务错误，不能进then，应该进catch
    Message.error(message)// 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  // error 信息里面 resonse的对象
  if (error.response && error.response.data && error.response.data.code === 10002) { // 接口文档中code=10002表示后端的token超时了
    store.dispatch('user/logout')// 登出action  删除token不然不能跳到login，因为做了免登录处理
    router.push('/login')
  } else {
    Message.error(error.message)// 提示错误新消息
  }
  return Promise.reject(error)// 返回执行错误  让当前的执行链跳出成功直接进入catch
})

// 是否超市
// 超时逻辑  当前时间 - 缓存时间  是否大于时间差
function IsCheckTimeOut() {
  var currentTime = Date.now()// 当前时间戳
  var timeStamp = getTimeStamp()// 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
