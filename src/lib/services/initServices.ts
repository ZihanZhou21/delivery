import { initMenuService } from './menuService'
import { initOrderService } from './orderService'
import { initStoreTimeService } from './storeTimeService'
import { Order } from '@/app/store/orderStore'
import { MenuItem } from '@/app/store/menuStore'
import { StoreTimeDay } from '@/app/store/opentimeStore'

// 菜单示例数据 - 使用与menuService相同的固定ID
const sampleMenuItems: MenuItem[] = [
  {
    id: 'crispy-calamari',
    name: 'Crispy Calamari',
    desc: 'Lightly battered calamari served with lemon aioli',
    price: 12.99,
    image: '/menu/calamari.png',
    category: 'Appetizers',
    isOutOfStock: false,
  },
  {
    id: 'bruschetta',
    name: 'Bruschetta',
    desc: 'Grilled bread topped with tomatoes, garlic, basil and olive oil',
    price: 8.99,
    image: '/menu/bruschetta.png',
    category: 'Appetizers',
    isOutOfStock: false,
  },
  {
    id: 'spinach-artichoke-dip',
    name: 'Spinach & Artichoke Dip',
    desc: 'Creamy dip served with tortilla chips',
    price: 10.99,
    image: '/menu/spinach.png',
    category: 'Appetizers',
    isOutOfStock: false,
  },
  {
    id: 'stuffed-eggs',
    name: 'Stuffed Eggs',
    desc: 'Egg nest, purple eggs and eggs with avocado',
    price: 11.99,
    image: '/menu/stuffed-eggs.png',
    category: 'Appetizers',
    isOutOfStock: false,
  },
  {
    id: 'egg-bacon-canapes',
    name: 'Egg and Bacon Canapés',
    desc: 'Bacon and eggs by making these easy and elegant canapés',
    price: 9.99,
    image: '/menu/egg-bacon.png',
    category: 'Appetizers',
    isOutOfStock: false,
  },
  {
    id: 'egg-bacon-cheese',
    name: 'Egg Bacon Cheese...',
    desc: 'Crispy bacon, Gooey egg, Beer Soaked-Onions and American cheese',
    price: 12.99,
    image: '/menu/egg-bacon-cheese.png',
    category: 'Main Courses',
    isOutOfStock: false,
  },
  {
    id: 'creamy-bacon-egg',
    name: 'Creamy Bacon & Egg...',
    desc: 'Spaghetti dish is a delicious, carb-filled way to start any morning',
    price: 8.99,
    image: '/menu/bruschetta.png',
    category: 'Main Courses',
    isOutOfStock: false,
  },
]

// 订单示例数据
const sampleOrders: Order[] = []

// 营业时间示例数据
const sampleStoreHours: StoreTimeDay[] = [
  {
    day: 'Monday',
    intervals: [{ open: '08:00', close: '23:30' }],
    closed: false,
  },
  {
    day: 'Tuesday',
    intervals: [{ open: '08:00', close: '23:30' }],
    closed: false,
  },
  {
    day: 'Wednesday',
    intervals: [{ open: '08:00', close: '23:30' }],
    closed: false,
  },
  {
    day: 'Thursday',
    intervals: [{ open: '08:00', close: '23:30' }],
    closed: false,
  },
  {
    day: 'Friday',
    intervals: [{ open: '08:00', close: '23:30' }],
    closed: false,
  },
  {
    day: 'Saturday',
    intervals: [{ open: '08:00', close: '23:30' }],
    closed: false,
  },
  {
    day: 'Sunday',
    intervals: [{ open: '08:00', close: '23:30' }],
    closed: false,
  },
]

// 初始化所有服务
export async function initAllServices() {
  console.log('初始化所有服务...')

  try {
    await initMenuService(sampleMenuItems)
    await initOrderService(sampleOrders)
    await initStoreTimeService(sampleStoreHours)

    console.log('服务初始化完成')
  } catch (error) {
    console.error('服务初始化失败:', error)
  }
}
