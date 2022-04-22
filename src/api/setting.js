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