<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容  -头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <TreeTools
          :tree-node="company"
          :is-root="true"
        />
        <!-- 放置一个el-tree -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容  插槽内容  会循环多次  有多少节点  就循环多少次 -->
          <!-- 作用于插槽  slot-scope="obj" 接受传递给插槽的数据  data是每个节点的数据对象-->
          <TreeTools
            slot-scope="{data}"
            :tree-node="data"
          />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDePartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  components: {
    TreeTools
  },
  data() {
    return {
      company: { name: '', manager: '' }, // 头部的数据结构
      departs: [],
      defaultProps: {
        label: 'name', // 表示从这个属性显示内容
        children: 'children'// 从这个属性去找子节点
      }
    }
  },
  created() {
    this.getDePartments()// 调用自身的方法
  },
  methods: {
    async getDePartments() {
      const result = await getDePartments()
      this.company = { name: result.companyName, manager: '负责人' }
      this.departs = tranListToTreeData(result.depts, '') // 需要转换为树形结构
      console.log(result)
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
