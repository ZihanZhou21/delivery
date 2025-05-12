import { MenuItem } from '@/app/store/menuStore'

// 生成ID的简单函数 - 仅用于新建项目时
const generateId = () => Math.random().toString(36).substring(2, 9)

// 内存存储 - 使用固定ID而非随机生成
let menuItems: MenuItem[] = [
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

// 获取所有菜品
export async function getAllMenuItems(): Promise<MenuItem[]> {
  return menuItems
}

// 通过ID获取菜品
export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  return menuItems.find((item) => item.id === id) || null
}

// 通过分类获取菜品
export async function getMenuItemsByCategory(
  category: string
): Promise<MenuItem[]> {
  return menuItems.filter((item) => item.category === category)
}

// 创建新菜品
export async function createMenuItem(
  item: Omit<MenuItem, 'id' | 'isOutOfStock'>
): Promise<MenuItem> {
  const newItem: MenuItem = {
    ...item,
    id: generateId(),
    isOutOfStock: false,
  }

  menuItems.push(newItem)
  return newItem
}

// 更新菜品
export async function updateMenuItem(
  id: string,
  updates: Partial<MenuItem>
): Promise<MenuItem | null> {
  const index = menuItems.findIndex((item) => item.id === id)
  if (index === -1) return null

  menuItems[index] = { ...menuItems[index], ...updates }
  return menuItems[index]
}

// 删除菜品
export async function deleteMenuItem(id: string): Promise<boolean> {
  const initialLength = menuItems.length
  menuItems = menuItems.filter((item) => item.id !== id)
  return menuItems.length < initialLength
}

// 切换菜品库存状态
export async function toggleItemStockStatus(
  id: string
): Promise<MenuItem | null> {
  const index = menuItems.findIndex((item) => item.id === id)
  if (index === -1) return null

  menuItems[index] = {
    ...menuItems[index],
    isOutOfStock: !menuItems[index].isOutOfStock,
  }

  return menuItems[index]
}

// 初始化服务
export async function initMenuService(
  initialItems?: MenuItem[]
): Promise<void> {
  if (initialItems && Array.isArray(initialItems)) {
    menuItems = initialItems
  }
}
