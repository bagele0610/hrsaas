<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容  -头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <TreeTools
          :tree-node="company"
          :is-root="true"
          @addDepts="addDepts"
        />
        <!-- 放置一个el-tree -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
          @addDepts="addDepts"
        >
          <!-- 传入内容  插槽内容  会循环多次  有多少节点  就循环多少次 -->
          <!-- 作用于插槽  slot-scope="obj" 接受传递给插槽的数据  data是每个节点的数据对象-->
          <TreeTools
            slot-scope="{data}"
            :tree-node="data"
            @delDepts="getDePartments()"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 防止新增弹层组件 -->
    <AddDept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDePartments"
    />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDePartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept.vue'
export default {
  components: {
    TreeTools, AddDept
  },
  data() {
    return {
      company: {}, // 头部的数据结构
      departs: [],
      defaultProps: {
        label: 'name' // 表示从这个属性显示内容
        // children: 'children', // 从这个属性去找子节点
      },
      showDialog: false, // 默认不显示弹层
      node: null// 记录当前点击的node节点

    }
  },
  created() {
    this.getDePartments()// 调用自身的方法
  },
  methods: {
    async getDePartments() {
      const result = await getDePartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '') // 需要转换为树形结构
    },
    // 监听tree-tools中触发的点击添加子部门的事件
    // node是点击的部门
    addDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true//弹出层
      this.node = node
      // 在这里调用获取部门详情方法
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
