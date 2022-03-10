// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })

// 权限拦截在路由跳转   导航首位

import router from '@/router'
import store from '@/store' // 引入store实例   和组件中的this.$store是一回事
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 不需要导出   因为main已经引入了这个文件,只需要让这个代码执行即可

// 前置守卫
// next是前置首位必须执行的钩子   next必须执行,如果不执行,页面就死了
// next()放过
// next(false)跳转终止
// next(地址)跳转到某个地址
const whiteList = ['/login', '/404']// 定义白名单
router.beforeEach(async(to, from, next) => {
  nprogress.start()// 开启进度条
  if (store.getters.token) {
    // 有token的情况下，才能获取资料
    // 如果有token
    if (to.path === '/login') { // 如果要访问的是登录页
      next('/')// 跳到主页  //有token不用处理
    } else {
      // 只有放过的时候才去获取用户资料
      // 是每次都获取吗
      // 如果当前vuex有用户资料的id  表示  已经有资料了 不需要获取了  如果没有id才需要获取
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    // 没有token的情况下
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址在白名单
      next()
    } else {
      next('/login')
    }
  }
  nprogress.done() // 手动强制关闭一次    为了解决手动切换地址时   进度条不关闭的问题
})

// 后置守卫
router.afterEach(() => {
  nprogress.done()// 关闭进度条
})
