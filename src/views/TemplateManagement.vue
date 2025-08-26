<template>
  <div class="template-management-container">
    <h2>模板管理</h2>
    <div class="action-bar">
      <el-button type="primary" @click="openAddDialog">添加模板</el-button>
      <el-button type="danger" :disabled="!selectedRows.length" @click="batchDelete">批量删除</el-button>
      <el-button type="success" :disabled="!selectedRows.length" @click="batchExport">批量导出</el-button>
    </div>
    
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="模板名称" />
      <el-table-column prop="type" label="模板类型" />
      <el-table-column prop="language" label="编程语言" />
      <el-table-column prop="framework" label="框架" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="small" type="success" @click="handleExport(scope.row)">导出</el-button>
          <el-button size="small" type="primary" @click="handlePreview(scope.row)">预览</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 添加/编辑模板对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加模板' : '编辑模板'"
      width="700px"
    >
      <el-form :model="templateForm" label-width="100px">
        <el-form-item label="模板名称">
          <el-input v-model="templateForm.name" placeholder="请输入模板名称"></el-input>
        </el-form-item>
        <el-form-item label="模板类型">
          <el-select v-model="templateForm.type" placeholder="请选择模板类型" style="width: 100%">
            <el-option label="实体类" value="entity" />
            <el-option label="控制器" value="controller" />
            <el-option label="服务层" value="service" />
            <el-option label="数据访问层" value="dao" />
            <el-option label="前端组件" value="component" />
            <el-option label="完整项目" value="project" />
          </el-select>
        </el-form-item>
        <el-form-item label="编程语言">
          <el-select v-model="templateForm.language" placeholder="请选择编程语言" style="width: 100%">
            <el-option label="Java" value="java" />
            <el-option label="JavaScript" value="javascript" />
            <el-option label="TypeScript" value="typescript" />
            <el-option label="Python" value="python" />
            <el-option label="Go" value="go" />
            <el-option label="C#" value="csharp" />
          </el-select>
        </el-form-item>
        <el-form-item label="框架">
          <el-select v-model="templateForm.framework" placeholder="请选择框架" style="width: 100%">
            <el-option label="Spring Boot" value="spring-boot" />
            <el-option label="Vue" value="vue" />
            <el-option label="React" value="react" />
            <el-option label="Angular" value="angular" />
            <el-option label="Express" value="express" />
            <el-option label="Django" value="django" />
            <el-option label="Flask" value="flask" />
          </el-select>
        </el-form-item>
        <el-form-item label="模板内容">
          <el-input
            v-model="templateForm.content"
            type="textarea"
            :rows="10"
            placeholder="请输入模板内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="templateForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入模板描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTemplate">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 预览模板对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="模板预览"
      width="800px"
    >
      <div class="preview-header">
        <h3>{{ currentTemplate.name }}</h3>
        <p>类型: {{ currentTemplate.type }} | 语言: {{ currentTemplate.language }} | 框架: {{ currentTemplate.framework }}</p>
      </div>
      <div class="preview-content">
        <pre><code>{{ currentTemplate.content }}</code></pre>
      </div>
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
    name: 'Spring Boot 实体类模板',
    type: '实体类',
    language: 'Java',
    framework: 'Spring Boot',
    createTime: '2023-01-01 12:00:00',
    updateTime: '2023-01-10 15:30:00',
    content: 'package $\{package\};\n\nimport lombok.Data;\nimport javax.persistence.*;\nimport java.io.Serializable;\nimport java.util.Date;\n\n/**\n * $\{entityComment\}\n * @author $\{author\}\n * @date $\{date\}\n */\n@Data\n@Entity\n@Table(name = "$\{tableName\}")\npublic class $\{className\} implements Serializable {\n\n    private static final long serialVersionUID = 1L;\n    \n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    \n    // TODO: Add your fields here\n    \n}',
    description: 'Spring Boot 项目的实体类模板，包含基本的注解和序列化接口实现'
  },
  {
    id: 2,
    name: 'Vue 组件模板',
    type: '前端组件',
    language: 'JavaScript',
    framework: 'Vue',
    createTime: '2023-01-05 09:15:00',
    updateTime: '2023-01-15 11:20:00',
    content: '<template>\n  <div class="$\{componentName\}-container">\n    <!-- Your component template here -->\n  </div>\n</template>\n\n<script\\> setup\\>\nimport { ref, onMounted } from "vue";\n\n// props\nconst props = defineProps({\n  // Define your props here\n});\n\n// emits\nconst emit = defineEmits([\n  // Define your emits here\n]);\n\n// data\nconst data = ref(null);\n\n// lifecycle hooks\nonMounted(() => {\n  // Initialization logic here\n});\n\n// methods\nconst yourMethod = () => {\n  // Method implementation\n};\n</script\\>\n\n<style scoped>\n.$\{componentName\}-container {\n  /* Your styles here */\n}\n</style>',
    description: 'Vue 3 组件模板，使用 Composition API 和 <script setup> 语法'
  }
])

// 选中的行
const selectedRows = ref([])

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const templateForm = ref({
  id: null,
  name: '',
  type: '',
  language: '',
  framework: '',
  content: '',
  description: ''
})

// 预览对话框
const previewDialogVisible = ref(false)
const currentTemplate = ref({})

// 处理选择变化
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

// 打开添加对话框
const openAddDialog = () => {
  dialogType.value = 'add'
  templateForm.value = {
    id: null,
    name: '',
    type: '',
    language: '',
    framework: '',
    content: '',
    description: ''
  }
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  templateForm.value = { ...row }
  dialogVisible.value = true
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除模板 ${row.name} 吗？`,
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
    `确定要删除选中的 ${selectedRows.value.length} 条模板记录吗？`,
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

// 保存模板
const saveTemplate = () => {
  // 这里可以添加保存逻辑
  if (dialogType.value === 'add') {
    // 添加模板
    const newId = tableData.value.length > 0 ? Math.max(...tableData.value.map(item => item.id)) + 1 : 1
    const now = new Date().toLocaleString()
    const newTemplate = {
      ...templateForm.value,
      id: newId,
      createTime: now,
      updateTime: now
    }
    tableData.value.push(newTemplate)
    ElMessage.success('添加模板成功')
  } else {
    // 编辑模板
    const index = tableData.value.findIndex(item => item.id === templateForm.value.id)
    if (index !== -1) {
      tableData.value[index] = {
        ...tableData.value[index],
        ...templateForm.value,
        updateTime: new Date().toLocaleString()
      }
      ElMessage.success('编辑模板成功')
    }
  }
  dialogVisible.value = false
}

// 处理导出
const handleExport = (row) => {
  // 这里可以添加导出逻辑
  ElMessage.success(`成功导出模板: ${row.name}`)
}

// 批量导出
const batchExport = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请至少选择一条记录')
    return
  }
  
  // 这里可以添加批量导出逻辑
  ElMessage.success(`成功导出 ${selectedRows.value.length} 个模板`)
}

// 处理预览
const handlePreview = (row) => {
  currentTemplate.value = row
  previewDialogVisible.value = true
}
</script>

<style scoped>
.template-management-container {
  padding: 20px;
}

.action-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.preview-header {
  margin-bottom: 20px;
}

.preview-content {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  overflow: auto;
  max-height: 500px;
}

.preview-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>