import { Order, OrderItem, UserInfo } from '@/app/store/orderStore'

// 内存存储
let orders: Order[] = []
let nextOrderId = 1

// 创建新订单
export async function createOrder(
  userInfo: UserInfo,
  items: OrderItem[],
  orderType: string,
  notes?: string
): Promise<Order> {
  // 计算总金额
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  )

  const newOrder: Order = {
    id: nextOrderId++,
    user: userInfo,
    items,
    totalAmount,
    orderType,
    notes,
    status: 'new',
  }

  orders.push(newOrder)
  return newOrder
}

// 获取所有订单
export async function getAllOrders(): Promise<Order[]> {
  return orders
}

// 根据状态获取订单
export async function getOrdersByStatus(
  status: 'new' | 'pending' | 'completed'
): Promise<Order[]> {
  return orders.filter((order) => order.status === status)
}

// 分页获取订单
export async function getOrdersPaginated(
  page: number = 1,
  limit: number = 10
): Promise<{
  orders: Order[]
  total: number
  page: number
  totalPages: number
}> {
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const paginatedOrders = orders.slice(startIndex, endIndex)

  return {
    orders: paginatedOrders,
    total: orders.length,
    page,
    totalPages: Math.ceil(orders.length / limit),
  }
}

// 获取单个订单
export async function getOrderById(id: number): Promise<Order | null> {
  return orders.find((order) => order.id === id) || null
}

// 更新订单
export async function updateOrder(
  id: number,
  updates: Partial<Order>
): Promise<Order | null> {
  const index = orders.findIndex((order) => order.id === id)
  if (index === -1) return null

  orders[index] = { ...orders[index], ...updates }
  return orders[index]
}

// 更新订单状态
export async function updateOrderStatus(
  id: number,
  status: 'new' | 'pending' | 'completed'
): Promise<Order | null> {
  return updateOrder(id, { status })
}

// 删除订单
export async function deleteOrder(id: number): Promise<boolean> {
  const initialLength = orders.length
  orders = orders.filter((order) => order.id !== id)
  return orders.length < initialLength
}

// 初始化一些示例数据
export async function initOrderService(initialOrders?: Order[]): Promise<void> {
  if (initialOrders && Array.isArray(initialOrders)) {
    orders = initialOrders

    // 设置下一个ID为最大ID+1
    const maxId = Math.max(...orders.map((order) => order.id), 0)
    nextOrderId = maxId + 1
  }
}

// 根据日期获取订单统计
export async function getOrderStatsByDate(): Promise<{
// startDate: Date,
// endDate: Date
  totalOrders: number
  totalSales: number
  ordersByType: Record<string, number>
}> {
  // 在真实实现中，这里应该查询数据库
  // 在内存实现中，我们假设订单有createdAt字段（实际上我们的接口没有）

  return {
    totalOrders: orders.length,
    totalSales: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    ordersByType: orders.reduce((acc, order) => {
      acc[order.orderType] = (acc[order.orderType] || 0) + 1
      return acc
    }, {} as Record<string, number>),
  }
}
