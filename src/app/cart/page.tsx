'use client'
import TopBar from '../components/TopBar'
import StoreInfo from '../components/StoreInfo'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore, CartState, CartItem } from '../store/cartStore'
import AddressModal from '../components/AddressModal'
import { useAddressStore } from '../store/addressStore'

export default function CartPage() {
  const cart = useCartStore((state: CartState) => state.cart)
  const safeCart = Array.isArray(cart) ? cart : []
  console.log(safeCart)
  const updateQty = useCartStore((state: CartState) => state.updateQty)
  const updateNote = useCartStore((state: CartState) => state.updateNote)
  const removeFromCart = useCartStore(
    (state: CartState) => state.removeFromCart
  )

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>(
    'delivery'
  )
  const address = useAddressStore((state) => state.address)
  const setAddress = useAddressStore((state) => state.setAddress)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [addressInput, setAddressInput] = useState(address)
  const [editingItem, setEditingItem] = useState<CartItem | null>(null)
  const [editQty, setEditQty] = useState(1)
  const [editNote, setEditNote] = useState('')
  const [showEmptyTip, setShowEmptyTip] = useState(false)

  const deliveryFee = 4.99
  const totalPrice = safeCart.reduce(
    (sum: number, i: CartItem) => sum + i.price * i.qty,
    0
  )
  const finalPrice =
    deliveryType === 'delivery' ? totalPrice + deliveryFee : totalPrice

  const setFinalPrice = useCartStore((state: CartState) => state.setFinalPrice)
  React.useEffect(() => {
    setFinalPrice(finalPrice)
  }, [finalPrice, setFinalPrice])

  const handleEdit = (item: CartItem) => {
    setEditingItem(item)
    setEditQty(item.qty)
    setEditNote(item.note || '')
  }

  const handleApplyChanges = () => {
    if (!editingItem) return
    if (editQty === 0) {
      removeFromCart(editingItem.id)
    } else {
      updateQty(editingItem.id, editQty)
      updateNote(editingItem.id, editNote)
    }
    setEditingItem(null)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center w-full">
      <AddressModal
        show={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        addressInput={addressInput}
        setAddressInput={setAddressInput}
        onSubmit={() => {
          setAddress(addressInput)
          setShowAddressModal(false)
        }}
      />
      <div className="w-full max-w-[400px] flex flex-col items-center bg-[#222] min-h-screen rounded-t-2xl">
        <TopBar />
        <div className="w-full px-4 pb-20 py-6 flex flex-col gap-4 flex-1">
          <div className="text-[#FDC519] text-2xl font-extrabold text-center mt-2 tracking-wide mb-4">
            ORDER CONFIRMATION
          </div>
          {/* 购物车商品列表 */}
          <div className="flex flex-col gap-2">
            {safeCart.map((item: CartItem) => (
              <div
                key={item.id}
                className="flex flex-col border-b border-dashed border-gray-400 pb-2 mb-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-lg">
                    {item.name}
                  </span>
                  <span className="text-[#FDC519] text-lg font-bold">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col items-start justify-between text-gray-300 text-sm mt-1">
                  <span>
                    ${item.price.toFixed(2)} x {item.qty}
                  </span>
                  <button
                    className="text-xs underline"
                    onClick={() => handleEdit(item)}>
                    Edit &gt;
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 编辑模态框 */}
          {editingItem && (
            <div className="fixed inset-0 z-50 flex items-end justify-center">
              <div className="absolute inset-0 flex justify-center items-end">
                <div
                  className="bg-black/80 w-full max-w-[400px] h-full"
                  onClick={() => setEditingItem(null)}></div>
              </div>
              <div className="relative z-10 w-full max-w-[400px] flex flex-col">
                <button
                  className="absolute left-1/2 -top-6 -translate-x-1/2 bg-[#FDC519] w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold z-20 border-4 border-white"
                  onClick={() => setEditingItem(null)}
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  ×
                </button>
                <div className="w-full h-48 relative">
                  <Image
                    src={editingItem.img as string}
                    alt={editingItem.name}
                    fill
                    className="object-cover w-full h-full rounded-t-2xl"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="bg-[#333] p-5 flex flex-col gap-4 rounded-t-2xl">
                  <div>
                    <div className="text-white text-2xl font-extrabold">
                      {editingItem.name}
                    </div>
                    <div className="text-[#FDC519] text-xl font-bold mt-1">
                      ${editingItem.price.toFixed(2)}
                    </div>
                  </div>
                  {/* 数量选择 */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-white text-xl">Quantity</div>
                    <div className="flex items-center bg-black rounded-lg px-3 py-2 min-w-[90px] justify-between">
                      <button
                        className="text-white text-2xl px-2"
                        onClick={() => setEditQty((q) => Math.max(0, q - 1))}>
                        -
                      </button>
                      <span className="text-white text-xl font-bold w-8 text-center">
                        {editQty.toString().padStart(2, '0')}
                      </span>
                      <button
                        className="text-white text-2xl px-2"
                        onClick={() => setEditQty((q) => q + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                  {/* 备注输入 */}
                  <div>
                    <div className="text-white text-lg font-bold mb-1">
                      Notes
                    </div>
                    <textarea
                      className="w-full rounded-xl p-4 bg-black text-white placeholder:text-gray-400 text-base outline-none min-h-[60px] resize-none"
                      placeholder="Add Note"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                    />
                  </div>
                  {/* Apply Changes按钮 */}
                  <button
                    className="w-full bg-[#FDC519] text-black font-bold text-xl rounded-xl py-3 hover:bg-yellow-400 transition mt-2"
                    onClick={handleApplyChanges}>
                    Apply Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 备注和添加更多 */}
          <div className="flex items-center justify-between text-gray-200 text-sm mb-2">
            <button className="">+ Add note</button>
            <Link href="/menu" className="text-[#FDC519]">
              + Add more items
            </Link>
          </div>
          {/* 总价 */}
          <div className="flex items-center justify-between text-white text-lg font-bold mt-2 mb-4">
            <span>Total Price</span>
            <span className="text-[#FDC519]">${finalPrice.toFixed(2)}</span>
          </div>
          {/* 配送方式选择 */}
          <div className="bg-black rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-2">
              <button
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  deliveryType === 'delivery'
                    ? 'bg-[#FDC519] border-[#FDC519]'
                    : 'border-white'
                }`}
                onClick={() => setDeliveryType('delivery')}>
                {deliveryType === 'delivery' && (
                  <span className="w-3 h-3 bg-white rounded-full block"></span>
                )}
              </button>
              <span className="text-white font-bold">DELIVERY</span>
              <span className="ml-auto bg-[#222] text-white rounded-lg px-3 py-1 text-sm font-bold">
                ${deliveryFee.toFixed(2)}
              </span>
            </div>
            <div className="text-white text-sm ml-8 ">{address}</div>
            <button
              className="text-[#FDC519] text-xs text-start underline ml-8 mt-1"
              onClick={() => setShowAddressModal(true)}>
              Change Address
            </button>
            <div className="border-t border-dashed border-gray-600 my-2"></div>
            <div className="flex items-center gap-2 mb-1">
              <button
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  deliveryType === 'pickup'
                    ? 'bg-[#FDC519] border-[#FDC519]'
                    : 'border-white'
                }`}
                onClick={() => setDeliveryType('pickup')}>
                {deliveryType === 'pickup' && (
                  <span className="w-3 h-3 bg-white rounded-full block"></span>
                )}
              </button>
              <span className="text-white font-bold">STORE PICKUP</span>
            </div>
            <div className="text-white text-sm ml-8">
              Unit 4/24 Vale Ave, Valley View SA 5093
            </div>
          </div>
          <StoreInfo />
        </div>
        {/* 黄色悬浮条 */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-[400px] flex items-center justify-between bg-[#FDC519] px-4 py-4 font-extrabold text-xl">
          <span className="text-[#E53935]">${finalPrice.toFixed(2)}</span>
          {safeCart.length > 0 ? (
            <Link href="/payment" className="ml-auto">
              <button className="text-black font-extrabold">
                Place Order &gt;
              </button>
            </Link>
          ) : (
            <button
              className="text-black font-extrabold ml-auto"
              onClick={() => {
                setShowEmptyTip(true)
                setTimeout(() => setShowEmptyTip(false), 3000)
              }}>
              Place Order &gt;
            </button>
          )}
        </div>
      </div>
      {/* 空购物车提示悬浮条 */}
      {showEmptyTip && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#E53935] text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
          Please add at least one item.
        </div>
      )}
    </div>
  )
}
