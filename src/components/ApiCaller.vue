<script setup>
import { defineOptions } from 'vue'
import { setupApiCaller } from './ApiCaller/ApiCaller'
import './ApiCaller/ApiCaller.css'

defineOptions({
  name: 'ApiCaller'
})

const { inputValue, responseData, isLoading, errorMessage, callApi } = setupApiCaller()
</script>

<template>
  <div class="api-caller-container">
    <h2>API调用示例</h2>
    
    <div class="input-group">
      <label for="inputField">输入内容:</label>
      <input
        id="inputField"
        v-model="inputValue"
        type="text"
        placeholder="请输入要发送的内容"
        :disabled="isLoading"
      >
    </div>

    <button
      @click="callApi"
      :disabled="isLoading"
      class="call-button"
    >
      {{ isLoading ? '发送中...' : '调用API' }}
    </button>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-if="responseData" class="response-container">
      <h3>响应结果:</h3>
      <pre>{{ responseData }}</pre>
    </div>
  </div>
</template>

<style scoped>
/* 样式已移至外部CSS文件 */
</style>