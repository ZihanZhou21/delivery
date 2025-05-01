'use client'
import React, { useState } from 'react'
import Image from 'next/image'

const orders = [
  { id: 1, name: 'John Doe', items: 5, amount: 12.99 },
  { id: 2, name: 'Adam Smith', items: 8, amount: 50.99 },
  { id: 3, name: 'John Smith', items: 12, amount: 70.99 },
  { id: 4, name: 'Adam Doe', items: 2, amount: 8.99 },
  { id: 5, name: 'Danny Jones', items: 1, amount: 7.99 },
]

// 定义Order类型
interface Order {
  id: number
  name: string
  items: number
  amount: number
}

// 新增：订单详情弹窗组件
function OrderDetailsModal({
  order,
  open,
  onClose,
}: {
  order: Order | null
  open: boolean
  onClose: () => void
}) {
  if (!open || !order) return null
  return (
    <div className="fixed inset-0 mx-auto z-50 w-[400px] flex items-end justify-center">
      {/* 黑色半透明蒙版 */}
      <div
        className="absolute inset-0 bg-black/80 transition-opacity"
        onClick={onClose}
      />
      {/* 弹窗内容，底部弹出，宽度不超过400px */}
      <div className="relative z-10 w-full max-w-[400px] flex flex-col">
        {/* 顶部关闭按钮，居中悬浮 */}
        <button
          className="absolute left-1/2 -top-6 -translate-x-1/2 bg-[#FDC519] w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold z-20 border-4 border-white shadow-lg"
          onClick={onClose}
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="#222"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div
          className="bg-[#363636] rounded-t-2xl shadow-2xl px-6 pt-10 pb-4 flex flex-col w-full"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.45)' }}>
          {/* 顶部信息区，严格按图片样式 */}
          <div className="flex w-full justify-between items-start gap-2 mt-2 mb-4">
            {/* 左侧：姓名和总件数 */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="text-white font-extrabold text-2xl leading-tight">
                {order.name}
              </div>
              <div className="text-white text-base font-medium mt-1">
                Total {order.items} items
              </div>
            </div>
            {/* 右侧：地址 */}
            <div className="flex flex-col items-end flex-1 min-w-0">
              <div className="flex items-center text-white text-base font-medium gap-1 mb-1">
                <svg width="18" height="18" fill="#FDC519" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                </svg>
                <span className="font-semibold">Address:</span>
              </div>
              <div className="text-white text-base text-right leading-tight">
                Unit 4/24 Vale Ave, Valley View
                <br />
                SA 5093
              </div>
            </div>
          </div>
          {/* 电话和邮箱按钮区 */}
          <div className="flex w-full gap-3 mb-4">
            <div className="flex-1 flex items-center justify-center border border-[#FDC519] rounded-lg py-2 px-3 text-white font-medium text-base bg-transparent transition-all">
              Phone: 0407 509 869
            </div>
            <div className="flex-1 flex items-center justify-center border border-[#FDC519] rounded-lg py-2 px-3 text-white font-medium text-base bg-transparent transition-all">
              Email: johndoe@gmail.com
            </div>
          </div>
          {/* 商品列表 */}
          <div className="mt-2">
            <div className="flex items-center justify-between font-bold text-lg text-white mt-2">
              <span>Bruschetta</span>
              <span className="text-[#FDC519]">$12.99</span>
            </div>
            <div className="text-gray-300 text-sm mb-2">$12.99 × 1</div>
            <div className="border-t border-dashed border-gray-400 my-2" />
            <div className="flex items-center justify-between font-bold text-lg text-white mt-2">
              <span>Spinach & Artichoke Dip</span>
              <span className="text-[#FDC519]">$21.98</span>
            </div>
            <div className="text-gray-300 text-sm mb-2">$10.99 × 2</div>
            <div className="border-t border-dashed border-gray-400 my-2" />
            <div className="flex items-center justify-between font-bold text-lg text-white mt-2">
              <span>Egg and Bacon Canapés</span>
              <span className="text-[#FDC519]">$19.98</span>
            </div>
            <div className="text-gray-300 text-sm mb-2">$9.99 × 2</div>
          </div>
          {/* 配送方式 */}
          <div className="bg-black rounded-xl p-4 mt-4 mb-4 flex items-center">
            <span className="text-white font-bold text-lg mr-2">
              Order Type:
            </span>
            <span className="text-white font-bold text-lg">Delivery</span>
          </div>
          {/* 备注 */}
          <div className="mb-2">
            <span className="text-white font-bold text-lg">Notes</span>
            <div className="bg-black rounded-xl p-4 mt-2 text-white text-base min-h-[60px]">
              Make more spicy food, And I don&apos;t need oregano and chill
              flacks in the bruschetta
            </div>
          </div>
          {/* 操作按钮 */}
          <div className="flex gap-4 mt-4">
            <button className="flex-1 bg-[#FDC519] text-black font-extrabold rounded-xl py-3 text-xl hover:bg-yellow-400 transition">
              Accept Order
            </button>
            <button className="flex-1 bg-red-600 text-white font-extrabold rounded-xl py-3 text-xl hover:bg-red-700 transition">
              Reject Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [tab, setTab] = useState('new')
  // 新增：弹窗显示状态和当前订单
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOrder, setModalOrder] = useState<Order | null>(null)

  return (
    <div className="min-h-screen bg-[#363636] flex flex-col items-center w-[400px] mx-auto">
      {/* Header */}
      <OrderDetailsModal
        order={modalOrder}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <div className="w-full bg-[#FDC519] flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Image src="/egg-logo.png" alt="logo" width={80} height={50} />
          <div className="flex flex-col ml-2">
            <span className="font-extrabold text-lg leading-5 text-black tracking-wide">
              THE EGG
            </span>
            <span className="font-bold text-xs text-black -mt-1">EATERY</span>
            <span className="font-bold text-xs text-black -mt-1">
              & INDIAN CAFE
            </span>
          </div>
        </div>
        <button className="bg-black rounded-xl w-10 h-10 flex items-center justify-center">
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
            <rect x="4" y="7" width="16" height="2" rx="1" />
            <rect x="4" y="11" width="16" height="2" rx="1" />
            <rect x="4" y="15" width="16" height="2" rx="1" />
          </svg>
        </button>
      </div>
      {/* Tabs */}
      <div className="w-full max-w-[400px] px-4 mt-4">
        <div className="flex w-full border border-[#FDC519] rounded-lg overflow-hidden">
          <button
            className={`flex-1 py-3 font-bold rounded-sm my-1 ml-1 text-lg transition ${
              tab === 'new'
                ? 'bg-[#FDC519] text-black'
                : 'bg-transparent text-white'
            }`}
            onClick={() => setTab('new')}>
            New Orders
          </button>
          <button
            className={`flex-1 py-3 font-bold text-lg rounded-sm my-1 mr-1 transition ${
              tab === 'pending'
                ? 'bg-[#FDC519] text-black'
                : 'bg-transparent text-white'
            }`}
            onClick={() => setTab('pending')}>
            Pending Orders
          </button>
        </div>
      </div>
      {/* Orders List */}
      <div className="w-full max-w-[400px] flex flex-col gap-4 mt-6 px-4 pb-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between bg-black rounded-2xl px-6 py-4 shadow-md"
            style={{ cursor: 'pointer' }}>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-xl">
                {order.name}
              </span>
              <span className="text-gray-300 text-sm mt-1">
                {order.items} items
              </span>
            </div>
            <div className="flex justify-between items-center w-[145px]">
              <div className="flex flex-col items-start">
                <span className="text-white text-base ">Amount</span>
                <span className="text-[#FDC519]  font-extrabold text-2xl mt-1">
                  ${order.amount.toFixed(2)}
                </span>
              </div>
              {/* 圆形按钮，点击弹出详情弹窗 */}
              <button
                className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center border-2 border-gray-400"
                onClick={(e) => {
                  e.stopPropagation()
                  setModalOrder(order)
                  setModalOpen(true)
                }}>
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" fill="#fff" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* 订单详情弹窗 */}
    </div>
  )
}
