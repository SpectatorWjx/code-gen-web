<template>
  <div class="system-config-container">
    <h2>系统配置</h2>
    
    <el-tabs v-model="activeTab" class="config-tabs">
      <el-tab-pane label="常规设置" name="general">
        <el-card class="config-card">
          <el-form :model="generalForm" label-width="120px">
            <el-form-item label="系统名称">
              <el-input v-model="generalForm.systemName" placeholder="请输入系统名称"></el-input>
            </el-form-item>
            <el-form-item label="系统版本">
              <el-input v-model="generalForm.systemVersion" placeholder="请输入系统版本"></el-input>
            </el-form-item>
            <el-form-item label="管理员邮箱">
              <el-input v-model="generalForm.adminEmail" placeholder="请输入管理员邮箱"></el-input>
            </el-form-item>
            <el-form-item label="日志级别">
              <el-select v-model="generalForm.logLevel" placeholder="请选择日志级别" style="width: 100%">
                <el-option label="DEBUG" value="debug" />
                <el-option label="INFO" value="info" />
                <el-option label="WARN" value="warn" />
                <el-option label="ERROR" value="error" />
              </el-select>
            </el-form-item>
            <el-form-item label="主题">
              <el-select v-model="generalForm.theme" placeholder="请选择主题" style="width: 100%">
                <el-option label="默认主题" value="default" />
                <el-option label="暗黑主题" value="dark" />
                <el-option label="蓝色主题" value="blue" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveGeneralConfig">保存设置</el-button>
              <el-button @click="resetGeneralForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="代码生成设置" name="codeGen">
        <el-card class="config-card">
          <el-form :model="codeGenForm" label-width="180px">
            <el-form-item label="默认作者">
              <el-input v-model="codeGenForm.defaultAuthor" placeholder="请输入默认作者"></el-input>
            </el-form-item>
            <el-form-item label="默认包名">
              <el-input v-model="codeGenForm.defaultPackage" placeholder="请输入默认包名"></el-input>
            </el-form-item>
            <el-form-item label="默认输出路径">
              <el-input v-model="codeGenForm.defaultOutputPath" placeholder="请输入默认输出路径"></el-input>
            </el-form-item>
            <el-form-item label="自动生成注释">
              <el-switch v-model="codeGenForm.autoGenerateComments" />
            </el-form-item>
            <el-form-item label="使用Lombok">
              <el-switch v-model="codeGenForm.useLombok" />
            </el-form-item>
            <el-form-item label="生成Swagger注解">
              <el-switch v-model="codeGenForm.generateSwagger" />
            </el-form-item>
            <el-form-item label="文件覆盖确认">
              <el-switch v-model="codeGenForm.fileOverrideConfirm" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveCodeGenConfig">保存设置</el-button>
              <el-button @click="resetCodeGenForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="备份与恢复" name="backup">
        <el-card class="config-card">
          <div class="backup-section">
            <h3>系统备份</h3>
            <p>创建系统配置和模板的备份文件</p>
            <el-button type="primary" @click="createBackup">创建备份</el-button>
          </div>
          
          <el-divider></el-divider>
          
          <div class="backup-section">
            <h3>备份历史</h3>
            <el-table :data="backupHistory" style="width: 100%">
              <el-table-column prop="filename" label="文件名" />
              <el-table-column prop="createTime" label="创建时间" />
              <el-table-column prop="fileSize" label="文件大小" />
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button size="small" type="success" @click="restoreBackup(scope.row)">恢复</el-button>
                  <el-button size="small" type="primary" @click="downloadBackup(scope.row)">下载</el-button>
                  <el-button size="small" type="danger" @click="deleteBackup(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <el-divider></el-divider>
          
          <div class="backup-section">
            <h3>恢复备份</h3>
            <p>从备份文件恢复系统配置和模板</p>
            <el-upload
              action="#"
              :auto-upload="false"
              :on-change="handleFileChange"
              :limit="1"
            >
              <template #trigger>
                <el-button type="primary">选择备份文件</el-button>
              </template>
              <el-button style="margin-left: 10px" type="success" @click="uploadBackup">上传并恢复</el-button>
            </el-upload>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 当前激活的标签页
const activeTab = ref('general')

// 常规设置表单
const generalForm = ref({
  systemName: '代码生成系统',
  systemVersion: '1.0.0',
  adminEmail: 'admin@example.com',
  logLevel: 'info',
  theme: 'default'
})

// 代码生成设置表单
const codeGenForm = ref({
  defaultAuthor: 'Admin',
  defaultPackage: 'com.example',
  defaultOutputPath: './output',
  autoGenerateComments: true,
  useLombok: true,
  generateSwagger: true,
  fileOverrideConfirm: true
})

// 备份历史
const backupHistory = ref([
  {
    id: 1,
    filename: 'backup-20230101.zip',
    createTime: '2023-01-01 12:00:00',
    fileSize: '1.2 MB'
  },
  {
    id: 2,
    filename: 'backup-20230215.zip',
    createTime: '2023-02-15 09:30:00',
    fileSize: '1.5 MB'
  }
])

// 上传的文件
const uploadFile = ref(null)

// 保存常规设置
const saveGeneralConfig = () => {
  // 这里可以添加保存逻辑
  ElMessage.success('常规设置保存成功')
}

// 重置常规设置表单
const resetGeneralForm = () => {
  generalForm.value = {
    systemName: '代码生成系统',
    systemVersion: '1.0.0',
    adminEmail: 'admin@example.com',
    logLevel: 'info',
    theme: 'default'
  }
}

// 保存代码生成设置
const saveCodeGenConfig = () => {
  // 这里可以添加保存逻辑
  ElMessage.success('代码生成设置保存成功')
}

// 重置代码生成设置表单
const resetCodeGenForm = () => {
  codeGenForm.value = {
    defaultAuthor: 'Admin',
    defaultPackage: 'com.example',
    defaultOutputPath: './output',
    autoGenerateComments: true,
    useLombok: true,
    generateSwagger: true,
    fileOverrideConfirm: true
  }
}

// 创建备份
const createBackup = () => {
  // 这里可以添加创建备份逻辑
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  
  const filename = `backup-${year}${month}${day}-${hours}${minutes}.zip`
  const newBackup = {
    id: backupHistory.value.length + 1,
    filename,
    createTime: now.toLocaleString(),
    fileSize: '1.3 MB' // 模拟文件大小
  }
  
  backupHistory.value.unshift(newBackup)
  ElMessage.success('备份创建成功')
}

// 恢复备份
const restoreBackup = (backup) => {
  ElMessageBox.confirm(
    `确定要从备份 ${backup.filename} 恢复系统吗？当前的配置和模板将被覆盖。`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 这里可以添加恢复逻辑
    ElMessage.success(`成功从备份 ${backup.filename} 恢复系统`)
  }).catch(() => {
    // 取消恢复
  })
}

// 下载备份
const downloadBackup = (backup) => {
  // 这里可以添加下载逻辑
  ElMessage.success(`开始下载备份文件: ${backup.filename}`)
}

// 删除备份
const deleteBackup = (backup) => {
  ElMessageBox.confirm(
    `确定要删除备份 ${backup.filename} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 这里可以添加删除逻辑
    backupHistory.value = backupHistory.value.filter(item => item.id !== backup.id)
    ElMessage.success('备份删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 处理文件变化
const handleFileChange = (file) => {
  uploadFile.value = file
}

// 上传并恢复备份
const uploadBackup = () => {
  if (!uploadFile.value) {
    ElMessage.warning('请先选择备份文件')
    return
  }
  
  ElMessageBox.confirm(
    '确定要上传并恢复此备份文件吗？当前的配置和模板将被覆盖。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 这里可以添加上传和恢复逻辑
    ElMessage.success('备份文件上传并恢复成功')
    uploadFile.value = null
  }).catch(() => {
    // 取消上传
  })
}
</script>

<style scoped>
.system-config-container {
  padding: 20px;
}

.config-tabs {
  margin-top: 20px;
}

.config-card {
  margin-top: 20px;
}

.backup-section {
  margin-bottom: 20px;
}

.backup-section h3 {
  margin-top: 0;
  margin-bottom: 10px;
}
</style>