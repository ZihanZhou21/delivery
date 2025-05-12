import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
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
  removeFromCart: (id: string) => void
  removeFromCartByName: (name: string) => void
  updateQty: (id: string, qty: number) => void
  updateQtyByName: (name: string, qty: number) => void
  updateNote: (id: string, note: string) => void
  updateNoteByName: (name: string, note: string) => void
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
      removeFromCartByName: (name) =>
        set({
          cart: (Array.isArray(get().cart) ? get().cart : []).filter(
            (i) => i.name !== name
          ),
        }),
      updateQty: (id, qty) =>
        set({
          cart: (Array.isArray(get().cart) ? get().cart : []).map((i) =>
            i.id === id ? { ...i, qty } : i
          ),
        }),
      updateQtyByName: (name, qty) =>
        set({
          cart: (Array.isArray(get().cart) ? get().cart : []).map((i) =>
            i.name === name ? { ...i, qty } : i
          ),
        }),
      updateNote: (id, note) =>
        set({
          cart: (Array.isArray(get().cart) ? get().cart : []).map((i) =>
            i.id === id ? { ...i, note } : i
          ),
        }),
      updateNoteByName: (name, note) =>
        set({
          cart: (Array.isArray(get().cart) ? get().cart : []).map((i) =>
            i.name === name ? { ...i, note } : i
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
