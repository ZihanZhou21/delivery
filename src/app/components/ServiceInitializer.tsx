'use client'

import { useEffect } from 'react'

// 简单的服务初始化组件，会在客户端挂载时调用初始化API
export default function ServiceInitializer() {
  useEffect(() => {
    async function initServices() {
      try {
        const response = await fetch('/api/init')
        const data = await response.json()

        if (data.success) {
          console.log('服务初始化成功:', data.message)
        } else {
          console.error('服务初始化失败:', data.message)
        }
      } catch (err) {
        console.error('调用初始化API失败:', err)
      }
    }

    initServices()
  }, [])

  // 这个组件不渲染任何内容
  return null
}
