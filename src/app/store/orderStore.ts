import { create } from 'zustand'
import * as orderApi from '@/lib/api/orderApi'

export interface UserInfo {
  name: string
  phone: string
  email: string
  address: string
}

export interface OrderItem {
  name: string
  price: number
  qty: number
}

export interface Order {
  id: number
  user: UserInfo
  items: OrderItem[]
  totalAmount: number
  orderType: string
  notes?: string
  status: 'new' | 'pending' | 'completed'
}

export interface OrderState {
  orders: Order[]
  isLoading: boolean
  error: string | null
  modalOpen: boolean
  modalOrder: Order | null
  // UI相关
  openModal: (order: Order) => void
  closeModal: () => void
  // 数据操作 - 同步
  setOrders: (orders: Order[]) => void
  // 数据操作 - 异步API
  fetchOrders: () => Promise<void>
  fetchOrdersByStatus: (
    status: 'new' | 'pending' | 'completed'
  ) => Promise<void>
  fetchOrdersPaginated: (page: number, limit?: number) => Promise<void>
  createOrder: (
    userInfo: UserInfo,
    items: OrderItem[],
    orderType: string,
    notes?: string
  ) => Promise<void>
  updateOrder: (id: number, updates: Partial<Order>) => Promise<void>
  setOrderStatus: (
    id: number,
    status: 'new' | 'pending' | 'completed'
  ) => Promise<void>
  deleteOrder: (id: number) => Promise<void>
}

// 示例订单数据 - 仅用于初始化展示
const sampleOrders: Order[] = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      phone: '0407 509 869',
      email: 'johndoe@gmail.com',
      address: 'Unit 4/24 Vale Ave, Valley View, SA 5093',
    },
    items: [
      { name: 'Bruschetta', price: 12.99, qty: 1 },
      { name: 'Spinach & Artichoke Dip', price: 10.99, qty: 2 },
      { name: 'Egg and Bacon Canapés', price: 9.99, qty: 2 },
    ],
    totalAmount: 12.99 + 10.99 * 2 + 9.99 * 2,
    orderType: 'Delivery',
    notes: `Make more spicy food, And I don't need oregano and chill flacks in the bruschetta`,
    status: 'new',
  },
  {
    id: 2,
    user: {
      name: 'Adam Smith',
      phone: '0408 123 456',
      email: 'adamsmith@gmail.com',
      address: 'Unit 2/10 Main St, City, SA 5000',
    },
    items: [
      { name: 'Pizza', price: 25.99, qty: 1 },
      { name: 'Pasta', price: 12.99, qty: 2 },
    ],
    totalAmount: 25.99 + 12.99 * 2,
    orderType: 'Pickup',
    notes: '',
    status: 'new',
  },
]

export const useOrderStore = create<OrderState>((set) => ({
  orders: sampleOrders,
  isLoading: false,
  error: null,
  modalOpen: false,
  modalOrder: null,

  // UI相关方法
  openModal: (order) => set({ modalOrder: order, modalOpen: true }),
  closeModal: () => set({ modalOpen: false, modalOrder: null }),

  // 同步操作
  setOrders: (orders) => set({ orders }),

  // API集成的异步操作
  fetchOrders: async () => {
    set({ isLoading: true, error: null })
    try {
      const result = await orderApi.fetchOrders()
      set({ orders: result.orders, isLoading: false })
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error fetching orders',
        isLoading: false,
      })
    }
  },

  fetchOrdersByStatus: async (status) => {
    set({ isLoading: true, error: null })
    try {
      const result = await orderApi.fetchOrdersByStatus(status)
      set({ orders: result.orders, isLoading: false })
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : `Unknown error fetching ${status} orders`,
        isLoading: false,
      })
    }
  },

  fetchOrdersPaginated: async (page, limit = 10) => {
    set({ isLoading: true, error: null })
    try {
      const result = await orderApi.fetchOrdersPaginated(page, limit)
      set({ orders: result.orders, isLoading: false })
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : `Unknown error fetching orders page ${page}`,
        isLoading: false,
      })
    }
  },

  createOrder: async (userInfo, items, orderType, notes) => {
    set({ isLoading: true, error: null })
    try {
      const newOrder = await orderApi.createOrder(
        userInfo,
        items,
        orderType,
        notes
      )
      set((state) => ({
        orders: [...state.orders, newOrder],
        isLoading: false,
      }))
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error creating order',
        isLoading: false,
      })
    }
  },

  updateOrder: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      const updatedOrder = await orderApi.updateOrder(id, updates)
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? updatedOrder : order
        ),
        isLoading: false,
      }))
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : `Unknown error updating order ${id}`,
        isLoading: false,
      })
    }
  },

  setOrderStatus: async (id, status) => {
    set({ isLoading: true, error: null })
    try {
      const updatedOrder = await orderApi.updateOrderStatus(id, status)
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? updatedOrder : order
        ),
        isLoading: false,
      }))
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : `Unknown error updating order ${id} status`,
        isLoading: false,
      })
      // 乐观更新回滚 - 如果API调用失败了，保持原始状态
    }
  },

  deleteOrder: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const success = await orderApi.deleteOrder(id)
      if (success) {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
          isLoading: false,
        }))
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : `Unknown error deleting order ${id}`,
        isLoading: false,
      })
    }
  },
}))
