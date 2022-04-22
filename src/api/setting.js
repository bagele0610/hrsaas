import request from '@/utils/request'

// 获取角色列表
export function getRoleList(params) {
	return request({
		url: '/sys/role',
		params
	})
}

// 根据id获取企业信息
export function getCompanyInfo(companyId) {
	return request({
		url:`/company/${companyId}`
	})
}

// 删除角色
export function deleteRole(id) {
	return request({
		method: 'delete',
		url:`/sys/role/${id}`
	})
}

// 读取角色详情
export function getRoleDetail(id) {
	return request({
		url:`/sys/role/${id}`
	})
}

// 编辑角色详情
export function updateRole(data) {
	return request({
		method:'put',
		url: `/sys/role/${data.id}`,
		data
	})
}

// 新增角色
export function addRole(data) {
	return request({
		data,
		method: 'post',
		url:'/sys/role'
	})
}