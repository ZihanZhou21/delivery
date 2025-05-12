import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import * as menuApi from '@/lib/api/menuApi'

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
  isLoading: boolean
  error: string | null
  // CRUD操作
  addMenuItem: (item: Omit<MenuItem, 'id' | 'isOutOfStock'>) => Promise<void>
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<void>
  deleteMenuItem: (id: string) => Promise<void>
  toggleStockStatus: (id: string) => Promise<void>
  // 加载操作
  fetchMenuItems: () => Promise<void>
  fetchMenuItemsByCategory: (category: string) => Promise<void>
}

// 生成唯一 ID 的简单函数
// const generateId = () => Math.random().toString(36).substring(2, 9)

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      menuItems: [
        // 默认菜单数据保留用于初始显示，后续会被API覆盖
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
      ],
      isLoading: false,
      error: null,

      // API集成的CRUD操作
      fetchMenuItems: async () => {
        set({ isLoading: true, error: null })
        try {
          const items = await menuApi.fetchMenuItems()
          set({ menuItems: items, isLoading: false })
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Unknown error fetching menu',
            isLoading: false,
          })
        }
      },

      fetchMenuItemsByCategory: async (category) => {
        set({ isLoading: true, error: null })
        try {
          const items = await menuApi.fetchMenuItemsByCategory(category)
          set({ menuItems: items, isLoading: false })
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : `Unknown error fetching ${category} items`,
            isLoading: false,
          })
        }
      },

      addMenuItem: async (item) => {
        set({ isLoading: true, error: null })
        try {
          const newItem = await menuApi.createMenuItem(item)
          set((state) => ({
            menuItems: [...state.menuItems, newItem],
            isLoading: false,
          }))
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Unknown error adding item',
            isLoading: false,
          })
        }
      },

      updateMenuItem: async (id, updates) => {
        set({ isLoading: true, error: null })
        try {
          const updatedItem = await menuApi.updateMenuItem(id, updates)
          set((state) => ({
            menuItems: state.menuItems.map((item) =>
              item.id === id ? updatedItem : item
            ),
            isLoading: false,
          }))
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Unknown error updating item',
            isLoading: false,
          })
        }
      },

      deleteMenuItem: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const success = await menuApi.deleteMenuItem(id)
          if (success) {
            set((state) => ({
              menuItems: state.menuItems.filter((item) => item.id !== id),
              isLoading: false,
            }))
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Unknown error deleting item',
            isLoading: false,
          })
        }
      },

      toggleStockStatus: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const updatedItem = await menuApi.toggleItemStock(id)
          set((state) => ({
            menuItems: state.menuItems.map((item) =>
              item.id === id ? updatedItem : item
            ),
            isLoading: false,
          }))
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Unknown error toggling stock status',
            isLoading: false,
          })
        }
      },
    }),
    {
      name: 'menu-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
