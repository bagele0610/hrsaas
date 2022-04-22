<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置内容 -->
      <el-card>
        <el-tabs>
          <el-tab-pane label='角色管理'>
            <!-- 左侧内容 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
              >
                新增角色
              </el-button>
            </el-row>
            <!-- 给表格绑定数据 -->
            <el-table
              border
              :data="list"
            >
              <el-table-column
                prop="id"
                label="序号"
                width="120"
                type="index"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="
                name"
                label="名称"
                width="240"
              ></el-table-column>
              <el-table-column
                prop="description"
                label="描述"
              ></el-table-column>
              <el-table-column label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="{row}">
                  <el-button
                    size="small"
                    type="success"
                  >分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                  >编辑</el-button>
                  <el-button
                    @click="deleteRole(row.id)"
                    size="small"
                    type="danger"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="hight:60px"
            >
              <el-pagination
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="changePage"
                layout="prev,pager,next"
              ></el-pagination>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label='公司信息'>
            <!-- 右侧内容 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              :show-icon="true"
              :closable="false"
            />
            <el-form
              label-width="120px"
              style="margin-top:50px"
            >
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="电话">
                <el-input
                  v-model="formData.companyPhone"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole
} from '@/api/setting'
import {
  mapGetters
} from 'vuex'
export default {
  data() {
    return {
      list: [], //承接数组
      page: {
        //放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0 //默认总数//记录总数
      },
      formData: {
        // 公司信息
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList() //获取角色列表
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const {
        total,
        rows
      } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      // newPage是当前点击的页面
      this.page.page = newPage //将当前页码给当前的最新页码
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async deleteRole(id) {
      // 提示
      try {
        await this.$confirm('确认删除该角色吗？')
        // 只有点击了确定 才能进入下一步
        await deleteRole(id)//调用删除接口
        this.getRoleList()//重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style>
</style>
