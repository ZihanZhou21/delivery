import { NextResponse } from 'next/server'
import { toggleItemStockStatus } from '@/lib/services/menuService'

// 切换菜单项的库存状态 PATCH /api/menu/:id/stock
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 确保使用await解析params
    const { id } = await params
    const updatedItem = await toggleItemStockStatus(id)

    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Failed to toggle stock status:', error)
    return NextResponse.json(
      { error: 'Failed to toggle stock status' },
      { status: 500 }
    )
  }
}
