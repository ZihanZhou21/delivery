import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: number
  name: string
  price: number
  qty: number
  note?: string
  img?: string
}

export type CartState = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
  updateQty: (id: number, qty: number) => void
  updateNote: (id: number, note: string) => void
  clearCart: () => void
  setCart: (cart: CartItem[]) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) => {
        const currentCart = Array.isArray(get().cart) ? get().cart : []
        const exists = currentCart.find((i) => i.id === item.id)
        if (exists) {
          set({
            cart: currentCart.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
            ),
          })
        } else {
          set({ cart: [...currentCart, item] })
        }
      },
      removeFromCart: (id) =>
        set({
          cart: (Array.isArray(get().cart) ? get().cart : []).filter(
            (i) => i.id !== id
          ),
        }),
      updateQty: (id, qty) =>
        set({
          cart: (Array.isArray(get().cart) ? get().cart : []).map((i) =>
            i.id === id ? { ...i, qty } : i
          ),
        }),
      updateNote: (id, note) =>
        set({
          cart: (Array.isArray(get().cart) ? get().cart : []).map((i) =>
            i.id === id ? { ...i, note } : i
          ),
        }),
      clearCart: () => set({ cart: [] }),
      setCart: (cart) => set({ cart: Array.isArray(cart) ? cart : [] }),
    }),
    {
      name: 'cart_data', // localStorage key
      merge: (persisted, current) => {
        // 保证cart一定是数组
        const p = persisted as CartState
        if (p && typeof p === 'object' && !Array.isArray(p.cart)) {
          p.cart = []
        }
        return { ...current, ...p }
      },
    }
  )
)
