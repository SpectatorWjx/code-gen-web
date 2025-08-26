<template>
  <div class="data-management-container">
    <h2>数据管理</h2>
    <div class="action-bar">
      <el-button type="primary" @click="openAddDialog">添加数据源</el-button>
      <el-button type="danger" :disabled="!selectedRows.length" @click="batchDelete">批量删除</el-button>
    </div>
    
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="数据源名称" />
      <el-table-column prop="type" label="数据库类型" />
      <el-table-column prop="host" label="主机地址" />
      <el-table-column prop="port" label="端口" width="100" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="small" type="success" @click="testConnection(scope.row)">测试连接</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 添加/编辑数据源对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加数据源' : '编辑数据源'"
      width="500px"
    >
      <el-form :model="dataSourceForm" label-width="100px">
        <el-form-item label="数据源名称">
          <el-input v-model="dataSourceForm.name" placeholder="请输入数据源名称"></el-input>
        </el-form-item>
        <el-form-item label="数据库类型">
          <el-select v-model="dataSourceForm.type" placeholder="请选择数据库类型" style="width: 100%">
            <el-option label="MySQL" value="mysql" />
            <el-option label="PostgreSQL" value="postgresql" />
            <el-option label="Oracle" value="oracle" />
            <el-option label="SQL Server" value="sqlserver" />
          </el-select>
        </el-form-item>
        <el-form-item label="主机地址">
          <el-input v-model="dataSourceForm.host" placeholder="请输入主机地址"></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="dataSourceForm.port" placeholder="请输入端口"></el-input>
        </el-form-item>
        <el-form-item label="数据库名">
          <el-input v-model="dataSourceForm.database" placeholder="请输入数据库名"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="dataSourceForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="dataSourceForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveDataSource">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '本地MySQL',
    type: 'MySQL',
    host: 'localhost',
    port: '3306',
    username: 'root',
    createTime: '2023-01-01 12:00:00'
  },
  {
    id: 2,
    name: '测试PostgreSQL',
    type: 'PostgreSQL',
    host: '192.168.1.100',
    port: '5432',
    username: 'postgres',
    createTime: '2023-01-02 14:30:00'
  }
])

// 选中的行
const selectedRows = ref([])

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const dataSourceForm = ref({
  id: null,
  name: '',
  type: 'mysql',
  host: '',
  port: '',
  database: '',
  username: '',
  password: ''
})

// 处理选择变化
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

// 打开添加对话框
const openAddDialog = () => {
  dialogType.value = 'add'
  dataSourceForm.value = {
    id: null,
    name: '',
    type: 'mysql',
    host: '',
    port: '',
    database: '',
    username: '',
    password: ''
  }
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  dataSourceForm.value = { ...row, password: '' } // 出于安全考虑，不回显密码
  dialogVisible.value = true
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除数据源 ${row.name} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 这里可以添加删除逻辑
    tableData.value = tableData.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 批量删除
const batchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请至少选择一条记录')
    return
  }
  
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 条数据源记录吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 这里可以添加批量删除逻辑
    const ids = selectedRows.value.map(row => row.id)
    tableData.value = tableData.value.filter(item => !ids.includes(item.id))
    ElMessage.success('批量删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 保存数据源
const saveDataSource = () => {
  // 这里可以添加保存逻辑
  if (dialogType.value === 'add') {
    // 添加数据源
    const newId = tableData.value.length > 0 ? Math.max(...tableData.value.map(item => item.id)) + 1 : 1
    const newDataSource = {
      ...dataSourceForm.value,
      id: newId,
      createTime: new Date().toLocaleString()
    }
    tableData.value.push(newDataSource)
    ElMessage.success('添加数据源成功')
  } else {
    // 编辑数据源
    const index = tableData.value.findIndex(item => item.id === dataSourceForm.value.id)
    if (index !== -1) {
      tableData.value[index] = {
        ...tableData.value[index],
        ...dataSourceForm.value
      }
      ElMessage.success('编辑数据源成功')
    }
  }
  dialogVisible.value = false
}

// 测试连接
const testConnection = (row) => {
  // 这里可以添加测试连接逻辑
  ElMessage.success(`成功连接到数据源: ${row.name}`)
}
</script>

<style scoped>
.data-management-container {
  padding: 20px;
}

.action-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
</style>