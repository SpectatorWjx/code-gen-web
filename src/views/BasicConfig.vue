<template>
  <div class="basic-config-container">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>基础配置</span>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="项目配置" name="project">
          <el-form :model="configForm" label-width="120px">
            <el-form-item label="项目名称">
              <el-input v-model="configForm.projectName" placeholder="请输入项目名称"></el-input>
            </el-form-item>
            <el-form-item label="输出路径">
              <el-input v-model="configForm.outputPath" placeholder="请输入代码输出路径"></el-input>
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="configForm.author" placeholder="请输入作者名称"></el-input>
            </el-form-item>
            <el-form-item label="版本号">
              <el-input v-model="configForm.version" placeholder="请输入版本号"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="button-row">
                <el-button type="primary" @click="saveConfig">保存配置</el-button>
                <el-button @click="resetForm">重置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="数据类型管理" name="dataType">
          <div class="table-operations button-row">
            <el-button type="primary" @click="openDataTypeDialog('add')">新增数据类型</el-button>
            <el-button type="danger" :disabled="!selectedDataTypes.length" @click="batchDeleteDataTypes">批量删除</el-button>
          </div>
          
          <el-table 
            :data="dataTypes" 
            border 
            style="width: 100%" 
            @selection-change="handleDataTypeSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="typeName" label="类型名称" width="180" />
            <el-table-column prop="typeCode" label="类型代码" width="180" />
            <el-table-column label="操作">
              <template #default="scope">
                <div class="button-row">
                  <el-button size="small" @click="openDataTypeDialog('edit', scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteDataType(scope.row)">删除</el-button>
                  <el-button size="small" type="primary" @click="openMappingDialog(scope.row)">类型映射</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        
        <!-- 数据类型表单对话框 -->
        <el-dialog 
          :title="dataTypeForm.id ? '编辑数据类型' : '新增数据类型'" 
          v-model="dataTypeDialogVisible"
          width="500px"
        >
          <el-form :model="dataTypeForm" label-width="100px" :rules="dataTypeRules" ref="dataTypeFormRef">
            <el-form-item label="类型名称" prop="typeName">
              <el-input v-model="dataTypeForm.typeName" placeholder="请输入类型名称"></el-input>
            </el-form-item>
            <el-form-item label="类型代码" prop="typeCode">
              <el-input v-model="dataTypeForm.typeCode" placeholder="请输入类型代码"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="dataTypeForm.description" type="textarea" placeholder="请输入描述"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dataTypeDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="saveDataType">确定</el-button>
            </span>
          </template>
        </el-dialog>
        
        <!-- 类型映射对话框 -->
        <el-dialog 
          title="类型映射配置" 
          v-model="mappingDialogVisible"
          width="700px"
        >
          <div v-if="currentDataType">
            <h3>{{ currentDataType.typeName }} ({{ currentDataType.typeCode }}) 的类型映射</h3>
            
            <el-tabs v-model="mappingActiveTab">
              <el-tab-pane label="编程语言映射" name="language">
                <el-form :model="languageMappingForm" label-width="120px">
                  <el-form-item label="Java">
                    <el-input v-model="languageMappingForm.java" placeholder="Java类型"></el-input>
                  </el-form-item>
                  <el-form-item label="JavaScript">
                    <el-input v-model="languageMappingForm.javascript" placeholder="JavaScript类型"></el-input>
                  </el-form-item>
                  <el-form-item label="Python">
                    <el-input v-model="languageMappingForm.python" placeholder="Python类型"></el-input>
                  </el-form-item>
                  <el-form-item label="Go">
                    <el-input v-model="languageMappingForm.go" placeholder="Go类型"></el-input>
                  </el-form-item>
                  <el-form-item label="C#">
                    <el-input v-model="languageMappingForm.csharp" placeholder="C#类型"></el-input>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              
              <el-tab-pane label="数据库映射" name="database">
                <el-form :model="databaseMappingForm" label-width="120px">
                  <el-form-item label="MySQL">
                    <el-input v-model="databaseMappingForm.mysql" placeholder="MySQL类型"></el-input>
                  </el-form-item>
                  <el-form-item label="PostgreSQL">
                    <el-input v-model="databaseMappingForm.postgresql" placeholder="PostgreSQL类型"></el-input>
                  </el-form-item>
                  <el-form-item label="Oracle">
                    <el-input v-model="databaseMappingForm.oracle" placeholder="Oracle类型"></el-input>
                  </el-form-item>
                  <el-form-item label="SQL Server">
                    <el-input v-model="databaseMappingForm.sqlserver" placeholder="SQL Server类型"></el-input>
                  </el-form-item>
                  <el-form-item label="SQLite">
                    <el-input v-model="databaseMappingForm.sqlite" placeholder="SQLite类型"></el-input>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="mappingDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="saveMappings">保存映射</el-button>
            </span>
          </template>
        </el-dialog>
      </el-tab-pane>
      
      <el-tab-pane label="数据库连接配置" name="dbConnection">
        <div class="table-operations button-row">
          <el-button type="primary" @click="openDbConnectionDialog('add')">新增数据库连接</el-button>
          <el-button type="danger" :disabled="!selectedConnections.length" @click="batchDeleteConnections">批量删除</el-button>
        </div>
        
        <el-table 
          :data="dbConnections" 
          border 
          style="width: 100%" 
          @selection-change="handleConnectionSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="连接名称" width="180" />
          <el-table-column prop="dbType" label="数据库类型" width="120">
            <template #default="scope">
              <el-tag :type="getDbTypeTagType(scope.row.dbType)">{{ scope.row.dbType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="host" label="主机地址" />
          <el-table-column prop="port" label="端口" width="80" />
          <el-table-column prop="database" label="数据库名" />
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <div class="button-row">
                <el-button size="small" @click="openDbConnectionDialog('edit', scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteConnection(scope.row)">删除</el-button>
                <el-button size="small" type="success" @click="testConnection(scope.row)">测试</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 数据库连接表单对话框 -->
        <el-dialog 
          :title="connectionForm.id ? '编辑数据库连接' : '新增数据库连接'" 
          v-model="connectionDialogVisible"
          width="500px"
        >
          <el-form :model="connectionForm" label-width="100px" :rules="connectionRules" ref="connectionFormRef">
            <el-form-item label="连接名称" prop="name">
              <el-input v-model="connectionForm.name" placeholder="请输入连接名称"></el-input>
            </el-form-item>
            <el-form-item label="数据库类型" prop="dbType">
              <el-select v-model="connectionForm.dbType" placeholder="请选择数据库类型" style="width: 100%">
                <el-option label="MySQL" value="MySQL" />
                <el-option label="PostgreSQL" value="PostgreSQL" />
                <el-option label="Oracle" value="Oracle" />
                <el-option label="SQL Server" value="SQL Server" />
                <el-option label="SQLite" value="SQLite" />
              </el-select>
            </el-form-item>
            <el-form-item label="主机地址" prop="host" v-if="connectionForm.dbType !== 'SQLite'">
              <el-input v-model="connectionForm.host" placeholder="请输入主机地址"></el-input>
            </el-form-item>
            <el-form-item label="端口" prop="port" v-if="connectionForm.dbType !== 'SQLite'">
              <el-input v-model="connectionForm.port" placeholder="请输入端口号"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username" v-if="connectionForm.dbType !== 'SQLite'">
              <el-input v-model="connectionForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" v-if="connectionForm.dbType !== 'SQLite'">
              <el-input v-model="connectionForm.password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item :label="connectionForm.dbType === 'SQLite' ? '文件路径' : '数据库名'" prop="database">
              <el-input v-model="connectionForm.database" :placeholder="connectionForm.dbType === 'SQLite' ? '请输入SQLite文件路径' : '请输入数据库名'"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="connectionDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="saveConnection">确定</el-button>
            </span>
          </template>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'

const route = useRoute()

// 选项卡控制
const activeTab = ref('project')

// ==================== 项目配置 ====================
const configForm = ref({
  projectName: '',
  outputPath: '',
  author: '',
  version: '1.0.0'
})

const saveConfig = () => {
  // 这里可以添加保存配置的逻辑
  ElMessage.success('配置保存成功')
}

const resetForm = () => {
  configForm.value = {
    projectName: '',
    outputPath: '',
    author: '',
    version: '1.0.0'
  }
}

// ==================== 数据类型管理 ====================
// 数据类型列表
const dataTypes = ref([
  { id: 1, typeName: '整数', typeCode: 'int', description: '整数类型' },
  { id: 2, typeName: '字符串', typeCode: 'string', description: '字符串类型' },
  { id: 3, typeName: '日期时间', typeCode: 'datetime', description: '日期时间类型' },
  { id: 4, typeName: '浮点数', typeCode: 'float', description: '浮点数类型' },
  { id: 5, typeName: '布尔值', typeCode: 'boolean', description: '布尔值类型' }
])

// 选中的数据类型
const selectedDataTypes = ref([])

// 数据类型表单
const dataTypeForm = ref({
  id: '',
  typeName: '',
  typeCode: '',
  description: ''
})

// 数据类型表单验证规则
const dataTypeRules = {
  typeName: [
    { required: true, message: '请输入类型名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  typeCode: [
    { required: true, message: '请输入类型代码', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ]
}

// 数据类型对话框可见性
const dataTypeDialogVisible = ref(false)
const dataTypeFormRef = ref(null)

// 打开数据类型对话框
const openDataTypeDialog = (type, row) => {
  if (type === 'add') {
    dataTypeForm.value = {
      id: '',
      typeName: '',
      typeCode: '',
      description: ''
    }
  } else {
    dataTypeForm.value = JSON.parse(JSON.stringify(row))
  }
  dataTypeDialogVisible.value = true
}

// 保存数据类型
const saveDataType = () => {
  dataTypeFormRef.value.validate((valid) => {
    if (valid) {
      if (dataTypeForm.value.id) {
        // 编辑现有数据类型
        const index = dataTypes.value.findIndex(item => item.id === dataTypeForm.value.id)
        if (index !== -1) {
          dataTypes.value[index] = { ...dataTypeForm.value }
          ElMessage.success('数据类型更新成功')
        }
      } else {
        // 添加新数据类型
        const newId = dataTypes.value.length > 0 ? Math.max(...dataTypes.value.map(item => item.id)) + 1 : 1
        dataTypes.value.push({
          ...dataTypeForm.value,
          id: newId
        })
        ElMessage.success('数据类型添加成功')
      }
      dataTypeDialogVisible.value = false
    }
  })
}

// 删除数据类型
const deleteDataType = (row) => {
  ElMessageBox.confirm(
    `确定要删除数据类型 "${row.typeName}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = dataTypes.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      dataTypes.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 批量删除数据类型
const batchDeleteDataTypes = () => {
  if (selectedDataTypes.value.length === 0) {
    ElMessage.warning('请选择要删除的数据类型')
    return
  }
  
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedDataTypes.value.length} 个数据类型吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const ids = selectedDataTypes.value.map(item => item.id)
    dataTypes.value = dataTypes.value.filter(item => !ids.includes(item.id))
    ElMessage.success('批量删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 处理数据类型选择变化
const handleDataTypeSelectionChange = (selection) => {
  selectedDataTypes.value = selection
}

// ==================== 类型映射 ====================
// 当前选中的数据类型
const currentDataType = ref(null)

// 类型映射对话框可见性
const mappingDialogVisible = ref(false)
const mappingActiveTab = ref('language')

// 编程语言映射表单
const languageMappingForm = ref({
  java: '',
  javascript: '',
  python: '',
  go: '',
  csharp: ''
})

// 数据库映射表单
const databaseMappingForm = ref({
  mysql: '',
  postgresql: '',
  oracle: '',
  sqlserver: '',
  sqlite: ''
})

// 打开映射对话框
const openMappingDialog = (row) => {
  currentDataType.value = row
  
  // 这里可以根据数据类型加载已有的映射配置
  // 示例数据
  if (row.typeCode === 'int') {
    languageMappingForm.value = {
      java: 'Integer',
      javascript: 'Number',
      python: 'int',
      go: 'int',
      csharp: 'int'
    }
    databaseMappingForm.value = {
      mysql: 'INT',
      postgresql: 'INTEGER',
      oracle: 'NUMBER',
      sqlserver: 'INT',
      sqlite: 'INTEGER'
    }
  } else if (row.typeCode === 'string') {
    languageMappingForm.value = {
      java: 'String',
      javascript: 'String',
      python: 'str',
      go: 'string',
      csharp: 'string'
    }
    databaseMappingForm.value = {
      mysql: 'VARCHAR',
      postgresql: 'VARCHAR',
      oracle: 'VARCHAR2',
      sqlserver: 'NVARCHAR',
      sqlite: 'TEXT'
    }
  } else {
    // 默认清空表单
    languageMappingForm.value = {
      java: '',
      javascript: '',
      python: '',
      go: '',
      csharp: ''
    }
    databaseMappingForm.value = {
      mysql: '',
      postgresql: '',
      oracle: '',
      sqlserver: '',
      sqlite: ''
    }
  }
  
  mappingDialogVisible.value = true
}

// 保存映射配置
const saveMappings = () => {
  // 这里可以添加保存映射配置的逻辑
  ElMessage.success(`${currentDataType.value.typeName} 的类型映射保存成功`)
  mappingDialogVisible.value = false
}

// ==================== 数据库连接配置 ====================
// 数据库连接列表
const dbConnections = ref([
  { 
    id: 1, 
    name: '本地MySQL', 
    dbType: 'MySQL', 
    host: 'localhost', 
    port: '3306', 
    username: 'root',
    password: '******',
    database: 'test_db'
  },
  { 
    id: 2, 
    name: '开发PostgreSQL', 
    dbType: 'PostgreSQL', 
    host: '192.168.1.100', 
    port: '5432', 
    username: 'postgres',
    password: '******',
    database: 'dev_db'
  },
  { 
    id: 3, 
    name: '本地SQLite', 
    dbType: 'SQLite', 
    database: 'C:/data/local.db'
  }
])

// 选中的数据库连接
const selectedConnections = ref([])

// 数据库连接表单
const connectionForm = ref({
  id: '',
  name: '',
  dbType: 'MySQL',
  host: '',
  port: '',
  username: '',
  password: '',
  database: ''
})

// 数据库连接表单验证规则
const connectionRules = {
  name: [
    { required: true, message: '请输入连接名称', trigger: 'blur' }
  ],
  dbType: [
    { required: true, message: '请选择数据库类型', trigger: 'change' }
  ],
  host: [
    { required: true, message: '请输入主机地址', trigger: 'blur' }
  ],
  port: [
    { required: true, message: '请输入端口号', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  database: [
    { required: true, message: '请输入数据库名', trigger: 'blur' }
  ]
}

// 数据库连接对话框可见性
const connectionDialogVisible = ref(false)
const connectionFormRef = ref(null)

// 打开数据库连接对话框
const openDbConnectionDialog = (type, row) => {
  if (type === 'add') {
    connectionForm.value = {
      id: '',
      name: '',
      dbType: 'MySQL',
      host: '',
      port: '',
      username: '',
      password: '',
      database: ''
    }
  } else {
    connectionForm.value = JSON.parse(JSON.stringify(row))
  }
  connectionDialogVisible.value = true
}

// 保存数据库连接
const saveConnection = () => {
  connectionFormRef.value.validate((valid) => {
    if (valid) {
      if (connectionForm.value.id) {
        // 编辑现有连接
        const index = dbConnections.value.findIndex(item => item.id === connectionForm.value.id)
        if (index !== -1) {
          dbConnections.value[index] = { ...connectionForm.value }
          ElMessage.success('数据库连接更新成功')
        }
      } else {
        // 添加新连接
        const newId = dbConnections.value.length > 0 ? Math.max(...dbConnections.value.map(item => item.id)) + 1 : 1
        dbConnections.value.push({
          ...connectionForm.value,
          id: newId
        })
        ElMessage.success('数据库连接添加成功')
      }
      connectionDialogVisible.value = false
    }
  })
}

// 删除数据库连接
const deleteConnection = (row) => {
  ElMessageBox.confirm(
    `确定要删除数据库连接 "${row.name}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = dbConnections.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      dbConnections.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 批量删除数据库连接
const batchDeleteConnections = () => {
  if (selectedConnections.value.length === 0) {
    ElMessage.warning('请选择要删除的数据库连接')
    return
  }
  
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedConnections.value.length} 个数据库连接吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const ids = selectedConnections.value.map(item => item.id)
    dbConnections.value = dbConnections.value.filter(item => !ids.includes(item.id))
    ElMessage.success('批量删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 处理数据库连接选择变化
const handleConnectionSelectionChange = (selection) => {
  selectedConnections.value = selection
}

// 测试数据库连接
const testConnection = (row) => {
  ElMessage.info(`正在测试连接 ${row.name}...`)
  // 这里可以添加实际的连接测试逻辑
  setTimeout(() => {
    ElMessage.success(`连接 ${row.name} 测试成功`)
  }, 1000)
}

// 获取数据库类型对应的标签类型
const getDbTypeTagType = (dbType) => {
  const typeMap = {
    'MySQL': 'primary',
    'PostgreSQL': 'success',
    'Oracle': 'warning',
    'SQL Server': 'danger',
    'SQLite': 'info'
  }
  return typeMap[dbType] || ''
}

// 页面加载时初始化数据
onMounted(() => {
  // 这里可以添加从后端加载数据的逻辑
  
  // 根据URL参数设置活动标签页
  const tab = route.query.tab
  if (tab && ['project', 'dataType', 'dbConnection'].includes(tab)) {
    activeTab.value = tab
  }
})
</script>

<style scoped>
.basic-config-container {
  padding: 20px;
}

.config-card {
  margin-top: 20px;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-operations {
  margin-bottom: 16px;
}

.button-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.el-tag {
  margin-right: 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-tabs {
  margin-bottom: 20px;
}

/* 表格内按钮间距 */
.el-table .cell .el-button {
  margin-right: 0;
}

/* 表单项间距 */
.el-form-item {
  margin-bottom: 18px;
}
</style>