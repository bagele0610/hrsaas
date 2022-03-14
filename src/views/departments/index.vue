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
export default {
  components: {
    TreeTools
  },
  data() {
    return {
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' }, // 头部的数据结构
      departs: [
        {
          name: '总裁办', manager: '1',
          children: [{ name: '董事会', manager: '12' }]
        },
        { name: '行政部', manager: '2' },
        { name: '人事部', manager: '3' }
      ],
      defaultProps: {
        label: 'name', // 表示从这个属性显示内容
        children: 'children'// 从这个属性去找子节点
      }
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
