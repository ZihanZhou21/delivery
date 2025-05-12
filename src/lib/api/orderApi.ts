import { Order, OrderItem, UserInfo } from '@/app/store/orderStore'
import { api } from './apiUtils'

// 分页订单响应接口
interface PaginatedOrdersResponse {
  orders: Order[]
  total: number
  page: number
  totalPages: number
}

// 订单列表响应接口
interface OrdersResponse {
  orders: Order[]
  total: number
}

// 获取所有订单
export async function fetchOrders(): Promise<OrdersResponse> {
  return api.get<OrdersResponse>('/api/orders')
}

// 根据状态获取订单
export async function fetchOrdersByStatus(
  status: 'new' | 'pending' | 'completed'
): Promise<OrdersResponse> {
  return api.get<OrdersResponse>(`/api/orders?status=${status}`)
}

// 分页获取订单
export async function fetchOrdersPaginated(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedOrdersResponse> {
  return api.get<PaginatedOrdersResponse>(
    `/api/orders?page=${page}&limit=${limit}`
  )
}

// 获取单个订单
export async function fetchOrder(id: number): Promise<Order> {
  return api.get<Order>(`/api/orders/${id}`)
}

// 创建新订单
export async function createOrder(
  userInfo: UserInfo,
  items: OrderItem[],
  orderType: string,
  notes?: string
): Promise<Order> {
  return api.post<Order>('/api/orders', {
    userInfo,
    items,
    orderType,
    notes,
  })
}

// 更新订单
export async function updateOrder(
  id: number,
  updates: Partial<Order>
): Promise<Order> {
  return api.put<Order>(`/api/orders/${id}`, updates)
}

// 更新订单状态
export async function updateOrderStatus(
  id: number,
  status: 'new' | 'pending' | 'completed'
): Promise<Order> {
  return api.put<Order>(`/api/orders/${id}`, { status })
}

// 删除订单
export async function deleteOrder(id: number): Promise<boolean> {
  const result = await api.delete<{ success: boolean }>(`/api/orders/${id}`)
  return result.success
}
