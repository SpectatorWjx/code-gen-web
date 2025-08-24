import { ref } from 'vue'

export function setupApiCaller() {
  const inputValue = ref('')
  const responseData = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref('')

  const callApi = async () => {
    if (!inputValue.value.trim()) {
      errorMessage.value = '请输入内容'
      return
    }

    isLoading.value = true
    errorMessage.value = ''
    responseData.value = null

    try {
      // 这里使用placeholder API，实际项目中替换为真实API
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: inputValue.value,
          body: '这是通过Vue应用发送的请求',
          userId: 1
        })
      })

      if (!response.ok) {
        throw new Error('API请求失败')
      }

      const data = await response.json()
      responseData.value = data
    } catch (error) {
      errorMessage.value = error.message
    } finally {
      isLoading.value = false
    }
  }

  return {
    inputValue,
    responseData,
    isLoading,
    errorMessage,
    callApi
  }
}