import { create } from 'zustand'

export type AddressState = {
  address: string
  setAddress: (addr: string) => void
}

export const useAddressStore = create<AddressState>()((set) => ({
  address: '2/51-53 Stanbel Rd, Salisbury Plain, SA 5109',
  setAddress: (addr) => set({ address: addr }),
}))
