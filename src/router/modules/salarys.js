import Layout from '@/layout'

// 导出员工的路由规则
export default {
  // 路由规则
  path: '/salarys', // 路由地址
  name: 'salarys', // 给模块的一级路由加一个name属性   这个属性   后面会在做权限的时候用到
  component: Layout,
  children: [{
    //   二级路由的path什么都不屑，，此时表示是二级路由的默认路由
    path: '', // 这里不用写   什么都不屑表示 /employees不但有布局layout=>员工主页
    component: () => import('@/views/salarys'),
    //   路由元信息  其实就是一个储存数据的地方，可以放任何内容
    meta: {
      title: '工资'// 这里title，因为左侧导航读取了这里的title组件
    }
  }]
}
