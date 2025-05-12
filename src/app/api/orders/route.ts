import { NextResponse } from 'next/server'
import {
  createOrder,
  getAllOrders,
  getOrdersByStatus,
  getOrdersPaginated,
} from '@/lib/services/orderService'

// GET /api/orders - 获取订单列表，支持状态筛选和分页
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as
      | 'new'
      | 'pending'
      | 'completed'
      | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let result

    if (status) {
      // 按状态筛选
      const filteredOrders = await getOrdersByStatus(status)
      result = { orders: filteredOrders, total: filteredOrders.length }
    } else if (page) {
      // 分页获取
      result = await getOrdersPaginated(page, limit)
    } else {
      // 获取所有订单
      const allOrders = await getAllOrders()
      result = { orders: allOrders, total: allOrders.length }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to get orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - 创建新订单
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 验证必填字段
    if (!body.userInfo || !body.items || !body.orderType) {
      return NextResponse.json(
        { error: 'User info, items, and order type are required' },
        { status: 400 }
      )
    }

    // 验证用户信息
    if (!body.userInfo.name || !body.userInfo.phone) {
      return NextResponse.json(
        { error: 'User name and phone are required' },
        { status: 400 }
      )
    }

    // 验证订单项
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    const newOrder = await createOrder(
      body.userInfo,
      body.items,
      body.orderType,
      body.notes
    )

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
