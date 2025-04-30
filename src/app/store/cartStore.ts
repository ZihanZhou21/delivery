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
  deliveryFee: number
  finalPrice: number
  orderNote: string
  setDeliveryFee: (fee: number) => void
  setFinalPrice: (price: number) => void
  setOrderNote: (note: string) => void
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
      deliveryFee: 0,
      finalPrice: 0,
      orderNote: '',
      setDeliveryFee: (fee) => set({ deliveryFee: fee }),
      setFinalPrice: (price) => set({ finalPrice: price }),
      setOrderNote: (note) => set({ orderNote: note }),
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
      name: 'cart-storage', // localStorage key
    }
  )
)
