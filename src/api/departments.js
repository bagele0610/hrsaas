import request from '@/utils/request'

// 获取组织架构数据

export function getDePartments() {
  return request({
    url: '/company/department'
  })
}

// 删除组织架构的部门
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'// 接口满足restful接口规范
    // 同样的地址 不同的方法 执行不同的业务
    // delete删除业务
    // get获取业务
    // post新增或者添加业务
    // put修改业务
  })
}

// 新增部门
export function addDepartments(data) {
  return request({
    url: '/company/department', // restful接口规范，，同样地址不同的请求方法
    method: 'post',
    data// axios的body参数
  })
}
