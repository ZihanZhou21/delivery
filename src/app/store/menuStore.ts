import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface MenuItem {
  id: string
  name: string
  price: number
  image?: string
  desc?: string
  category?: string
  isOutOfStock: boolean
}

interface MenuState {
  menuItems: MenuItem[]
  addMenuItem: (item: Omit<MenuItem, 'id' | 'isOutOfStock'>) => void
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
  toggleStockStatus: (id: string) => void
}

// 生成唯一 ID 的简单函数
const generateId = () => Math.random().toString(36).substring(2, 9)

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      menuItems: [
        // Appetizers 分类
        {
          id: generateId(),
          name: 'Crispy Calamari',
          desc: 'Lightly battered calamari served with lemon aioli',
          price: 12.99,
          image: '/menu/calamari.png',
          category: 'Appetizers',
          isOutOfStock: false,
        },
        {
          id: generateId(),
          name: 'Bruschetta',
          desc: 'Grilled bread topped with tomatoes, garlic, basil and olive oil',
          price: 8.99,
          image: '/menu/bruschetta.png',
          category: 'Appetizers',
          isOutOfStock: false,
        },
        {
          id: generateId(),
          name: 'Spinach & Artichoke Dip',
          desc: 'Creamy dip served with tortilla chips',
          price: 10.99,
          image: '/menu/spinach.png',
          category: 'Appetizers',
          isOutOfStock: false,
        },
        {
          id: generateId(),
          name: 'Stuffed Eggs',
          desc: 'Egg nest, purple eggs and eggs with avocado',
          price: 11.99,
          image: '/menu/stuffed-eggs.png',
          category: 'Appetizers',
          isOutOfStock: false,
        },
        {
          id: generateId(),
          name: 'Egg and Bacon Canapés',
          desc: 'Bacon and eggs by making these easy and elegant canapés',
          price: 9.99,
          image: '/menu/egg-bacon.png',
          category: 'Appetizers',
          isOutOfStock: false,
        },

        // Main Courses 分类
        {
          id: generateId(),
          name: 'Egg Bacon Cheese...',
          desc: 'Crispy bacon, Gooey egg, Beer Soaked-Onions and American cheese',
          price: 12.99,
          image: '/menu/egg-bacon-cheese.png',
          category: 'Main Courses',
          isOutOfStock: false,
        },
        {
          id: generateId(),
          name: 'Creamy Bacon & Egg...',
          desc: 'Spaghetti dish is a delicious, carb-filled way to start any morning',
          price: 8.99,
          image: '/menu/bruschetta.png',
          category: 'Main Courses',
          isOutOfStock: false,
        },
      ],
      addMenuItem: (item) =>
        set((state) => ({
          menuItems: [
            ...state.menuItems,
            { ...item, id: generateId(), isOutOfStock: false },
          ],
        })),
      updateMenuItem: (id, updates) =>
        set((state) => ({
          menuItems: state.menuItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      deleteMenuItem: (id) =>
        set((state) => ({
          menuItems: state.menuItems.filter((item) => item.id !== id),
        })),
      toggleStockStatus: (id) =>
        set((state) => ({
          menuItems: state.menuItems.map((item) =>
            item.id === id
              ? { ...item, isOutOfStock: !item.isOutOfStock }
              : item
          ),
        })),
    }),
    {
      name: 'menu-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
