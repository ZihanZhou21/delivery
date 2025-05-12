import { NextResponse } from 'next/server'
import { initAllServices } from '@/lib/services/initServices'

// 初始化状态标志
let initialized = false

// GET /api/init - 初始化所有服务
export async function GET() {
  try {
    if (!initialized) {
      await initAllServices()
      initialized = true
      return NextResponse.json({ success: true, message: '服务初始化成功' })
    }

    return NextResponse.json({ success: true, message: '服务已经初始化过' })
  } catch (error) {
    console.error('初始化服务失败:', error)
    return NextResponse.json(
      {
        success: false,
        message: '初始化服务失败',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
