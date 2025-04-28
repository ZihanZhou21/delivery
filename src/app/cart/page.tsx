'use client'
import TopBar from '../components/TopBar'
import StoreInfo from '../components/StoreInfo'
import React, { useState } from 'react'

// 假设cart数据结构如下，实际可用context或props传递
const initialCart = [
  {
    id: 1,
    name: 'Bruschetta',
    price: 12.99,
    qty: 1,
    note: '',
  },
  {
    id: 2,
    name: 'Spinach & Artichoke Dip',
    price: 10.99,
    qty: 2,
    note: '',
  },
  {
    id: 3,
    name: 'Egg and Bacon Canapés',
    price: 9.99,
    qty: 2,
    note: '',
  },
]

export default function CartPage() {
  const [cart] = useState(initialCart)
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>(
    'delivery'
  )
  const [address] = useState('2/51-53 Stanbel Rd, Salisbury Plain, SA 5109')
  const deliveryFee = 4.99
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const finalPrice =
    deliveryType === 'delivery' ? totalPrice + deliveryFee : totalPrice

  return (
    <div className="min-h-screen bg-white  flex flex-col  justify-center items-center w-full ">
      <div className="w-full max-w-[400px] flex flex-col items-center bg-[#222] min-h-screen rounded-t-2xl">
        <TopBar />
        <div className="w-full px-4 pb-20 py-6 flex flex-col gap-4 flex-1">
          <div className="text-[#FDC519] text-2xl font-extrabold text-center mt-2 tracking-wide mb-4">
            ORDER CONFIRMATION
          </div>
          {/* 购物车商品列表 */}
          <div className="flex flex-col gap-2">
            {cart.map((item) => (
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
                  <button className=" text-xs underline">Edit &gt;</button>
                </div>
              </div>
            ))}
          </div>
          {/* 备注和添加更多 */}
          <div className="flex items-center justify-between text-gray-200 text-sm mb-2">
            <button className="">+ Add note</button>
            <button className="text-[#FDC519]">+ Add more items</button>
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
            <button className="text-[#FDC519] text-xs text-start underline ml-8 mt-1">
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
          <span className="text-[#E53935]">${finalPrice.toFixed(0)}</span>
          <button className="ml-auto text-black font-extrabold">
            Place Order &gt;
          </button>
        </div>
      </div>
    </div>
  )
}
