import { create } from 'zustand'

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
  modalOpen: boolean
  modalOrder: Order | null
  setOrders: (orders: Order[]) => void
  setOrderStatus: (id: number, status: 'new' | 'pending' | 'completed') => void
  openModal: (order: Order) => void
  closeModal: () => void
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [
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
    {
      id: 3,
      user: {
        name: 'Linda Lee',
        phone: '0412 888 999',
        email: 'lindalee@example.com',
        address: '5/88 Green St, Northfield, SA 5085',
      },
      items: [
        { name: 'Chicken Curry', price: 18.5, qty: 1 },
        { name: 'Naan Bread', price: 3.5, qty: 3 },
      ],
      totalAmount: 18.5 + 3.5 * 3,
      orderType: 'Delivery',
      notes: 'Please arrive 10 minutes earlier, normal spicy level.',
      status: 'new',
    },
    {
      id: 4,
      user: {
        name: 'Michael Brown',
        phone: '0400 222 333',
        email: 'michaelb@gmail.com',
        address: '12/7 River Rd, Mawson Lakes, SA 5095',
      },
      items: [
        { name: 'Butter Chicken', price: 16.99, qty: 2 },
        { name: 'Rice', price: 2.99, qty: 2 },
      ],
      totalAmount: 16.99 * 2 + 2.99 * 2,
      orderType: 'Pickup',
      notes: 'No peanuts, please include cutlery.',
      status: 'new',
    },
    {
      id: 5,
      user: {
        name: 'Sophia Wang',
        phone: '0433 555 666',
        email: 'sophiaw@outlook.com',
        address: '3/21 Ocean Ave, Glenelg, SA 5045',
      },
      items: [
        { name: 'Paneer Tikka', price: 14.5, qty: 1 },
        { name: 'Mango Lassi', price: 4.5, qty: 2 },
      ],
      totalAmount: 14.5 + 4.5 * 2,
      orderType: 'Delivery',
      notes: 'Please add ice to the drinks.',
      status: 'new',
    },
    // 可继续添加更多订单
  ],
  modalOpen: false,
  modalOrder: null,
  setOrders: (orders) => set({ orders }),
  setOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, status } : order
      ),
    })),
  openModal: (order) => set({ modalOrder: order, modalOpen: true }),
  closeModal: () => set({ modalOpen: false, modalOrder: null }),
}))
