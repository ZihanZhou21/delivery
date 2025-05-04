'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useOrderStore, Order } from '../store/orderStore'
import Link from 'next/link'

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
  const setOrderStatus = useOrderStore((state) => state.setOrderStatus)
  const [showCallUber, setShowCallUber] = useState(false)
  if (!open || !order) return null
  const isDelivery = order.orderType.toLowerCase() === 'delivery'
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
          {/* 顶部信息区 */}
          <div className="flex w-full justify-between items-start gap-2 mt-2 mb-4">
            {/* 左侧：姓名和总件数 */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="text-white font-extrabold text-2xl leading-tight">
                {order.user.name}
              </div>
              <div className="text-white text-base font-medium mt-1">
                Total{' '}
                {order.items.reduce((sum: number, item) => sum + item.qty, 0)}{' '}
                items
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
                {order.user.address}
              </div>
            </div>
          </div>
          {/* 电话和邮箱按钮区 */}
          <div className="flex w-full gap-3 mb-4">
            <div className="flex-1 flex items-center justify-center border border-[#FDC519] rounded-lg py-2 px-3 text-white font-medium text-base bg-transparent transition-all">
              Phone: {order.user.phone}
            </div>
            <div className="flex-1 flex items-center justify-center border border-[#FDC519] rounded-lg py-2 px-3 text-white font-medium text-base bg-transparent transition-all">
              Email: {order.user.email}
            </div>
          </div>
          {/* 商品列表 */}
          <div className="mt-2">
            {order.items.map((item, idx) => (
              <div key={item.name + idx}>
                <div className="flex items-center justify-between font-bold text-lg text-white mt-2">
                  <span>{item.name}</span>
                  <span className="text-[#FDC519]">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
                <div className="text-gray-300 text-sm mb-2">
                  ${item.price.toFixed(2)} × {item.qty}
                </div>
                {idx !== order.items.length - 1 && (
                  <div className="border-t border-dashed border-gray-400 my-2" />
                )}
              </div>
            ))}
          </div>
          {/* 配送方式 */}
          <div className="bg-black rounded-xl p-4 mt-4 mb-4 flex items-center">
            <span className="text-white font-bold text-lg mr-2">
              Order Type:
            </span>
            <span className="text-white font-bold text-lg">
              {order.orderType}
            </span>
          </div>
          {/* 备注 */}
          <div className="mb-2">
            <span className="text-white font-bold text-lg">Notes</span>
            <div className="bg-black rounded-xl p-4 mt-2 text-white text-base min-h-[60px]">
              {order.notes || '无'}
            </div>
          </div>
          {/* 操作按钮 */}
          <div className="flex gap-4 mt-4">
            {order.status === 'pending' ? (
              <>
                <button
                  className="flex-1 bg-[#FDC519] text-black font-extrabold rounded-xl py-3 text-xl hover:bg-yellow-400 transition"
                  onClick={() => {
                    setOrderStatus(order.id, 'completed')
                    onClose()
                  }}>
                  Complete Order
                </button>
                <button className="flex-1 bg-red-600 text-white font-extrabold rounded-xl py-3 text-xl hover:bg-red-700 transition">
                  Reject Order
                </button>
              </>
            ) : !showCallUber ? (
              <div className="flex w-full gap-4">
                <button
                  className="flex-1 bg-[#FDC519] text-black font-extrabold rounded-xl py-3 text-xl hover:bg-yellow-400 transition"
                  onClick={() => {
                    if (isDelivery) {
                      setShowCallUber(true)
                    } else {
                      setOrderStatus(order.id, 'pending')
                      onClose()
                    }
                  }}>
                  Accept Order
                </button>{' '}
                <button className="flex-1 bg-red-600 text-white font-extrabold rounded-xl py-3 text-xl hover:bg-red-700 transition">
                  Reject Order
                </button>
              </div>
            ) : (
              <button
                className="flex-1 bg-[#FDC519] text-black font-extrabold rounded-xl py-3 text-xl hover:bg-yellow-400 transition flex items-center justify-center gap-2"
                onClick={() => {
                  setOrderStatus(order.id, 'pending')
                  setShowCallUber(false)
                  onClose()
                }}>
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="#222"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  style={{ marginRight: 8 }}>
                  <path
                    d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"
                    stroke="#222"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Call Uber Delivery
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [tab, setTab] = useState('new')
  const { orders, modalOpen, modalOrder, openModal, closeModal } =
    useOrderStore()
  const filteredOrders = orders.filter((order) => order.status === tab)

  return (
    <div className="min-h-screen bg-[#363636] flex flex-col items-center w-[400px] mx-auto">
      {/* Header */}
      <OrderDetailsModal
        order={modalOrder}
        open={modalOpen}
        onClose={closeModal}
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
        <div className="relative">
          <button
            className="bg-black rounded-xl w-10 h-10 flex items-center justify-center focus:outline-none"
            onClick={() => setMenuOpen((v) => !v)}>
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <rect x="4" y="7" width="16" height="2" rx="1" />
              <rect x="4" y="11" width="16" height="2" rx="1" />
              <rect x="4" y="15" width="16" height="2" rx="1" />
            </svg>
          </button>
          {menuOpen && (
            <div className="flex flex-col absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg z-50 border border-gray-200">
              <Link
                href="/admin/completed"
                className="px-4 py-3 border-1 bg-[#333] text-[#FDC519] hover:bg-[#FDC519] hover:text-black rounded-t-xl font-bold transition"
                onClick={() => setMenuOpen(false)}>
                Completed
              </Link>
              <Link
                href="/admin/menu"
                className="px-4 py-3 bg-[#333] text-[#FDC519] hover:bg-[#FDC519] hover:text-black rounded-b-xl font-bold transition"
                onClick={() => setMenuOpen(false)}>
                Menu
              </Link>
            </div>
          )}
        </div>
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
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between bg-black rounded-2xl px-6 py-4 shadow-md"
            style={{ cursor: 'pointer', position: 'relative' }}>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-xl">
                {order.user.name}
              </span>
              <span className="text-gray-300 text-sm mt-1">
                {order.items.reduce((sum: number, item) => sum + item.qty, 0)}{' '}
                items
              </span>
            </div>
            <div className="flex justify-between items-center w-[145px]">
              <div className="flex flex-col items-start">
                <span className="text-white text-base ">Amount</span>
                <span className="text-[#FDC519]  font-extrabold text-2xl mt-1">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
              {/* 圆形按钮，点击弹出详情弹窗 */}
              <button
                className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center border-2 border-gray-400"
                onClick={(e) => {
                  e.stopPropagation()
                  openModal(order)
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
