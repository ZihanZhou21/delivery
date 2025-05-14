'use client'
import React, { useState } from 'react'
import { useOrderStore, Order } from '../../store/orderStore'
import Image from 'next/image'
import Link from 'next/link'

function CompletedOrderDetailsModal({
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
      <div
        className="absolute inset-0 bg-black/80 transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-[400px] flex flex-col">
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
          <div className="flex w-full justify-between items-start gap-2 mt-2 mb-4">
            <div className="flex flex-col flex-1 min-w-0">
              <div className="text-white font-extrabold text-2xl leading-tight">
                {order.user.name}
              </div>
              <div className="text-white text-base font-medium mt-1">
                Total{' '}
                {order.items.reduce(
                  (sum: number, item: Order['items'][0]) => sum + item.qty,
                  0
                )}{' '}
                items
              </div>
            </div>
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
          <div className="flex w-full gap-3 mb-4">
            <div className="flex-1 flex items-center justify-center border border-[#FDC519] rounded-lg py-2 px-3 text-white font-medium text-base bg-transparent transition-all">
              Phone: {order.user.phone}
            </div>
            <div className="flex-1 flex items-center justify-center border border-[#FDC519] rounded-lg py-2 px-3 text-white font-medium text-base bg-transparent transition-all">
              Email: {order.user.email}
            </div>
          </div>
          <div className="mt-2">
            {order.items.map((item: Order['items'][0], idx: number) => (
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
          <div className="bg-black rounded-xl p-4 mt-4 mb-4 flex items-center">
            <span className="text-white font-bold text-lg mr-2">
              Order Type:
            </span>
            <span className="text-white font-bold text-lg">
              {order.orderType}
            </span>
          </div>
          <div className="mb-2">
            <span className="text-white font-bold text-lg">Notes</span>
            <div className="bg-black rounded-xl p-4 mt-2 text-white text-base min-h-[60px]">
              {order.notes || 'None'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CompletedOrdersPage() {
  const orders = useOrderStore((state) => state.orders)
  const completedOrders = Array.isArray(orders)
    ? orders.filter((o) => o.status === 'completed')
    : []
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOrder, setModalOrder] = useState<Order | null>(null)

  return (
    <div className="min-h-screen bg-[#363636] flex flex-col items-center w-[400px] mx-auto">
      {/* Header */}
      <CompletedOrderDetailsModal
        order={modalOrder}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <div className="w-full bg-[#FDC519] flex items-center justify-between px-4 py-4">
        <Link href="/admin" className="flex items-center gap-2">
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
        </Link>
        <Link href="/admin">
          <button className="bg-black rounded-xl w-10 h-10 flex items-center justify-center">
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <rect x="4" y="7" width="16" height="2" rx="1" />
              <rect x="4" y="11" width="16" height="2" rx="1" />
              <rect x="4" y="15" width="16" height="2" rx="1" />
            </svg>
          </button>
        </Link>
      </div>
      {/* Title */}
      <div className="w-full flex flex-col items-center mt-8 mb-4">
        <span className="text-[#FDC519] text-2xl font-extrabold tracking-wide">
          COMPLETED ORDERS
        </span>
        <div className="mt-4 w-full flex flex-col items-center">
          <div className="flex items-center gap-2 w-[220px] mb-6">
            <div className="flex-1 bg-[#363636] border border-[#FDC519] rounded-lg px-4 py-2 text-white font-bold flex items-center">
              Today
            </div>
            <button className="bg-[#363636] border border-[#FDC519] rounded-lg w-10 h-10 flex items-center justify-center">
              <svg width="22" height="22" fill="#FDC519" viewBox="0 0 24 24">
                <rect x="6" y="11" width="12" height="2" rx="1" />
                <rect x="11" y="6" width="2" height="12" rx="1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Orders List */}
      <div className="w-full flex flex-col gap-4 px-4 pb-8 max-w-[500px] mx-auto">
        {completedOrders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between bg-black rounded-2xl px-6 py-4 shadow-md">
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-xl">
                {order.user.name}
              </span>
              <span className="text-gray-300 text-sm mt-1">
                {order.items.reduce((sum, item) => sum + item.qty, 0)} items
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-white text-base">Amount</span>
                <span className="text-[#FDC519] font-extrabold text-2xl mt-1 underline">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
              <button
                className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center border-2 border-gray-400"
                onClick={() => {
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
    </div>
  )
}
