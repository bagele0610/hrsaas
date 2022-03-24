<template>
  <!-- 放置弹层组件 -->
  <el-dialog
    title="新增部门"
    :visible="showDialog"
    @close="btnCancel"
  >
    <!-- 表单数据 -->
    <el-form
      ref="deptForm"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >

      <el-form-item
        label="部门名称"
        prop="name"
      >
        <el-input
          v-model="formData.name"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>

      <el-form-item
        label="部门编码"
        prop="code"
      >
        <el-input
          v-model="formData.code"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>

      <el-form-item
        label="
        部门名负责人"
        prop="manager"
      >

        <!-- native修饰符，可以找到原生元素的事件 -->
        <el-select
          @focus="getEmployeeSimple"
          v-model="formData.manager"
          style="width:80%"
          placeholder="请选择"
        >
          <!-- 遍历选项 -->
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="
        部门介绍"
        prop="introduce"
      >
        <el-input
          v-model="formData.introduce"
          style="width:80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>

    </el-form>
    <!-- 确定和消息 -->
    <el-row
      slot="footer"
      type="flex"
      justify="center"
    >
      <el-col :span="6">
        <el-button
          size="small"
          @click="btnCancel"
        >取消</el-button>
        <el-button
          @click="btnOk"
          size="small"
          type="primary"
        >确定</el-button>

      </el-col>
    </el-row>

  </el-dialog>
</template>

<script>
import { getDePartments, addDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: '',
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // /检查部门名称是否重复
    const checkNameRepeat = async (rule, value, callback) => {
      // value是部门名称 与同级部门下的部门去比较 有没有相同的 不能重复
      const { depts } = await getDePartments()
      // 去找同级部门下 有没有和value相同的数据
      // 找到同级部门所有的子部门
      const isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      console.log(isRepeat)
      // 如果isRepeat为true 表示有相同名称
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDePartments()
      // 要求编码 和所有的部门编码都不能重复  由于历史数据有可能没有code所以加一个强制性条件 就是value值不为空
      const isRepeat = depts.some(item => item.code === value && value)
      isRepeat ? callback(new Error(`组织架构下已经有${value}编码了`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: { // 校验规则  {key：数组}
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkNameRepeat
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码长度为1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkCodeRepeat
          }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍长度为1-300个字符', trigger: 'blur' }
        ]
      },
      peoples: []
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    btnOk() {
      // 手动校验表单
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          // 表单校验通过,可以提交了
          // 将ID设成pid
          await addDepartments({ ...this.formData, pid: this.treeNode.id })
          this.$emit('addDepts')//触发子传父自定义事件 渲染页面
          this.$emit('update:showDialog', false)//sync修饰符，父组件.sync
          // 不用清楚已有表单数据---因为关闭dialog的时候 会 触发el-dialog的close事件
        }
      })
    },
    btnCancel() {
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清楚之前的数据和校验
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style scoped lang='less'></style>
