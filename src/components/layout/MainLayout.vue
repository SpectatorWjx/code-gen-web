<template>
  <div class="layout-container">
    <el-container>
      <el-aside width="200px">
        <div class="logo-container">
          <h2>代码生成系统</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          :default-openeds="['1', '2', '3', '4']"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><setting /></el-icon>
              <span>基础配置</span>
            </template>
            <el-menu-item index="/basic-config">
              <el-icon><setting /></el-icon>
              <span>项目配置</span>
            </el-menu-item>
            <el-menu-item index="/basic-config?tab=dataType">
              <el-icon><setting /></el-icon>
              <span>数据类型管理</span>
            </el-menu-item>
            <el-menu-item index="/basic-config?tab=dbConnection">
              <el-icon><setting /></el-icon>
              <span>数据库连接配置</span>
            </el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="2">
            <template #title>
              <el-icon><document /></el-icon>
              <span>数据管理</span>
            </template>
            <el-menu-item index="/data-management">
              <el-icon><document /></el-icon>
              <span>实体管理</span>
            </el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="3">
            <template #title>
              <el-icon><files /></el-icon>
              <span>模板管理</span>
            </template>
            <el-menu-item index="/template-management">
              <el-icon><files /></el-icon>
              <span>代码模板</span>
            </el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="4">
            <template #title>
              <el-icon><tools /></el-icon>
              <span>系统配置</span>
            </template>
            <el-menu-item index="/system-config">
              <el-icon><tools /></el-icon>
              <span>系统设置</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container style="margin-left: 200px;">
        <el-header>
          <div class="header-container">
            <h3>{{ currentMenuTitle }}</h3>
          </div>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Setting, Document, Files, Tools } from '@element-plus/icons-vue'

const route = useRoute()

const activeMenu = computed(() => {
  // 兼容带 query 的菜单高亮
  if (route.path === '/basic-config') {
    if (route.query.tab === 'dataType') return '/basic-config?tab=dataType';
    if (route.query.tab === 'dbConnection') return '/basic-config?tab=dbConnection';
    return '/basic-config';
  }
  return route.fullPath;
});

const menuTitles = {
  '/basic-config': '基础配置',
  '/basic-config?tab=dataType': '数据类型管理',
  '/basic-config?tab=dbConnection': '数据库连接配置',
  '/data-management': '数据管理',
  '/template-management': '模板管理',
  '/system-config': '系统配置'
};

const currentMenuTitle = computed(() => {
  // 优先匹配完整路径
  return menuTitles[route.fullPath] || menuTitles[route.path] || '';
});
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-container {
  height: 100%;
}

.el-aside {
  background-color: #304156;
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #263445;
}

.el-menu-vertical {
  border-right: none;
}

.el-header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  border-bottom: 1px solid #e6e6e6;
  margin-left: 200px;
}

.header-container {
  display: flex;
  align-items: center;
}

.el-main {
  padding: 20px;
}
</style>