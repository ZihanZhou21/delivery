'use client'
import TopBar from '../components/TopBar'
import Image from 'next/image'
import React, { useState, useRef, useEffect } from 'react'
import StoreInfo from '../components/StoreInfo'
import Link from 'next/link'
import { useCartStore, CartState, CartItem } from '../store/cartStore'
import StoreNotice from '../components/StoreNotice'
import { useMenuStore, MenuItem as MenuStoreItem } from '../store/menuStore'

type MenuItem = {
  name: string
  desc: string
  price: number
  img: string
  qty?: number
  note?: string
  id: string
  isOutOfStock?: boolean
}

export default function AppMenu() {
  const [selectedCategory, setSelectedCategory] = useState('Appetizers')
  const [modalItem, setModalItem] = useState<MenuItem | null>(null)
  const [modalQty, setModalQty] = useState(1)
  const [modalNote, setModalNote] = useState('')
  const [recentItem, setRecentItem] = useState<MenuItem | null>(null)
  const [showClosedTip, setShowClosedTip] = useState(false)
  const [showNotice, setShowNotice] = useState(false)
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const addToCart = useCartStore((state: CartState) => state.addToCart)
  const cart = useCartStore((state: CartState) => state.cart)
  const safeCart = Array.isArray(cart) ? cart : []
  const removeFromCartByName = useCartStore(
    (state: CartState) => state.removeFromCartByName
  )

  // 从 menuStore 获取菜单数据相关功能
  const menuItems = useMenuStore((state) => state.menuItems)
  const fetchMenuItems = useMenuStore((state) => state.fetchMenuItems)
  const isLoading = useMenuStore((state) => state.isLoading)

  // 组件加载时获取所有菜单数据
  useEffect(() => {
    fetchMenuItems()
  }, [fetchMenuItems])

  // 根据分类整理菜单数据
  const menuData = React.useMemo(() => {
    const categories: { [key: string]: MenuStoreItem[] } = {}

    menuItems.forEach((item) => {
      const category = item.category || 'Other'
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(item)
    })

    return Object.keys(categories).map((category) => ({
      category,
      items: categories[category],
    }))
  }, [menuItems])

  // 获取所有分类名称
  const categories = menuData.map((c) => c.category)

  // 处理分类选择，跳转到相应部分
  const handleSelect = (cat: string) => {
    setSelectedCategory(cat)
    setTimeout(() => {
      sectionRefs.current[cat]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 50)
  }

  const openModal = (item: MenuItem) => {
    if (showNotice) {
      setShowClosedTip(false)
      setTimeout(() => setShowClosedTip(true), 0)
      setTimeout(() => setShowClosedTip(false), 2500)
      return
    }

    // 如果菜品缺货，不打开模态框
    if (item.isOutOfStock) {
      return
    }

    setModalItem(item)
    setModalQty(1)
    setModalNote('')
  }
  const closeModal = () => setModalItem(null)

  // Add to cart
  const handleAddToCart = () => {
    if (!modalItem) return
    const newItem = {
      ...modalItem,
      qty: modalQty,
      note: modalNote,
      id: modalItem.id,
      price: modalItem.price,
      name: modalItem.name,
      img: modalItem.img,
    }
    addToCart(newItem)
    setRecentItem(newItem)
    setModalItem(null)
  }
  // Remove recently added item
  const handleRemoveRecent = () => {
    if (recentItem && recentItem.name) {
      removeFromCartByName(recentItem.name)
    }
    setRecentItem(null)
  }
  // Calculate total price and quantity
  const totalQty = safeCart.reduce(
    (sum: number, i: CartItem) => sum + (i.qty ?? 1),
    0
  )
  const totalPrice = safeCart.reduce(
    (sum: number, i: CartItem) => sum + i.price * (i.qty ?? 1),
    0
  )

  return (
    <div className="min-h-screen bg-white flex flex-col items-center w-full">
      <div className="w-full max-w-[400px] flex flex-col items-center bg-[#222] rounded-2xl min-h-screen">
        <TopBar />

        <div className="w-full px-4 py-6 flex flex-col gap-2 pb-24">
          <StoreNotice onVisibleChange={setShowNotice} />
          <div className="text-[#FDC519] text-2xl font-extrabold text-center mt-2 tracking-wide">
            OUR MENU
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="text-center py-4 text-white">加载菜单中...</div>
          )}

          {/* Category selection */}
          {!isLoading && categories.length > 0 && (
            <div className="flex justify-center mt-2 mb-4">
              <select
                className="text-white bg-transparent border border-[#FDC519] rounded-lg px-6 py-2 text-lg font-semibold focus:outline-none"
                value={selectedCategory}
                onChange={(e) => handleSelect(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="text-black">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Menu item list - 显示所有分类 */}
          {!isLoading &&
            menuData.map((cat) => (
              <div
                key={cat.category}
                ref={(el) => {
                  sectionRefs.current[cat.category] = el
                }}
                className="mb-6">
                <div className="text-white text-xl font-bold mb-2">
                  {cat.category}
                </div>
                <div className="flex flex-col gap-4">
                  {cat.items.map((item) => {
                    // 转换store菜单项到当前组件的菜单项格式
                    const menuItem: MenuItem = {
                      name: item.name,
                      desc: item.desc || '',
                      price: item.price,
                      img: item.image || '/menu/default.png',
                      id: item.id,
                      isOutOfStock: item.isOutOfStock,
                    }

                    return (
                      <div
                        key={item.id}
                        className="flex bg-white rounded-2xl p-2 gap-4 shadow-md h-30 relative">
                        <div className="w-25 rounded-xl overflow-hidden flex-shrink-0 h-full">
                          <Image
                            src={menuItem.img}
                            alt={menuItem.name}
                            width={100}
                            height={100}
                            className={`object-cover w-full h-full ${
                              item.isOutOfStock ? 'opacity-50' : ''
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="">
                            <div className="font-bold text-xl text-black truncate">
                              {menuItem.name}
                            </div>
                            <div className="text-gray-700 text-sm line-clamp-2">
                              {menuItem.desc}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="text-[#E53935] font-extrabold text-2xl">
                              ${menuItem.price.toFixed(2)}
                            </div>
                            <button
                              className={`${
                                item.isOutOfStock
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-black hover:bg-gray-800'
                              } text-white rounded-full px-6 py-1 font-semibold ml-2`}
                              onClick={() => openModal(menuItem)}
                              disabled={item.isOutOfStock}>
                              Add
                            </button>
                          </div>
                        </div>

                        {item.isOutOfStock && (
                          <div className="absolute top-2 right-2 bg-[#E53935] text-white text-xs font-bold px-2 py-1 rounded">
                            Out of Stock
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          <StoreInfo />
          {showClosedTip && (
            <div className="fixed bottom-20 max-w-[300px] left-1/2 -translate-x-1/2 z-50 bg-[#E53935] text-white px-6 py-3 mb-4 rounded-xl font-bold text-lg shadow-lg">
              Online order is currently closed. You cannot add items now.
            </div>
          )}
        </div>

        {/* Modal section */}
        {modalItem && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Black semi-transparent mask */}
            <div className="absolute inset-0 flex justify-center items-end">
              <div
                className="bg-black/80 w-full max-w-[400px] h-full"
                onClick={closeModal}></div>
            </div>
            {/* Bottom modal form */}
            <div className="relative z-10 w-full max-w-[400px] flex flex-col">
              {/* Close button */}
              <button
                className="absolute left-1/2 -top-6 -translate-x-1/2 bg-[#FDC519] w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold z-20 border-4 border-white"
                onClick={closeModal}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                ×
              </button>
              {/* Large image */}
              <div className="w-full h-48 relative">
                <Image
                  src={modalItem.img}
                  alt={modalItem.name}
                  fill
                  className="object-cover w-full h-full rounded-t-2xl"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="bg-[#333] p-5 flex flex-col gap-4">
                <div>
                  <div className="text-white text-2xl font-extrabold">
                    {modalItem.name}
                  </div>
                  <div className="text-white text-base mt-1">
                    {modalItem.desc}
                  </div>
                </div>
                {/* Quantity selection */}
                <div className="flex items-center justify-between mt-2">
                  <div className="text-white text-xl">Quantity</div>
                  <div className="flex items-center bg-black rounded-lg px-3 py-2 min-w-[90px] justify-between">
                    <button
                      className="text-white text-2xl px-2"
                      onClick={() => setModalQty((q) => Math.max(1, q - 1))}>
                      -
                    </button>
                    <span className="text-white text-xl font-bold w-8 text-center">
                      {modalQty.toString().padStart(2, '0')}
                    </span>
                    <button
                      className="text-white text-2xl px-2"
                      onClick={() => setModalQty((q) => q + 1)}>
                      +
                    </button>
                  </div>
                </div>
                {/* Note input */}
                <div>
                  <div className="text-white text-lg font-bold mb-1">Notes</div>
                  <textarea
                    className="w-full rounded-xl p-4 bg-black text-white placeholder:text-gray-400 text-base outline-none min-h-[60px] resize-none"
                    placeholder="Add Note"
                    value={modalNote}
                    onChange={(e) => setModalNote(e.target.value)}
                  />
                </div>
                {/* Add to order button and price */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="flex-1 bg-[#FDC519] text-black font-bold text-xl rounded-xl py-3 hover:bg-yellow-400 transition"
                    onClick={handleAddToCart}>
                    Add to Order
                  </button>
                  <div className="bg-black text-[#FDC519] rounded-xl px-6 py-3 text-xl font-bold">
                    ${(modalItem.price * modalQty).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Floating bar and mini floating bar */}
        {safeCart.length > 0 && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-[400px] flex flex-col items-center pointer-events-none">
            {/* Mini floating bar */}
            {recentItem && (
              <div
                className="w-2/3 mx-auto flex items-center justify-between bg-[#FDC519]/90 rounded-full shadow-lg px-2 pl-4 py-2 gap-4 mb-2 pointer-events-auto animate-fade-in-up"
                style={{ minWidth: '220px' }}>
                <div className="flex-1 text-start text-xs items-center justify-center text-black truncate">
                  {recentItem.qty} × {recentItem.name}
                </div>
                <button
                  className="flex text-black w-4 h-4 items-center justify-center font-sm rounded-full border-2 border-black"
                  onClick={handleRemoveRecent}>
                  ×
                </button>
              </div>
            )}
            {/* Main floating bar */}
            <div className="w-full flex items-center justify-between bg-white shadow-2xl px-4 py-4 pointer-events-auto">
              <div className="flex flex-col">
                <span className="font-extrabold text-[#E53935] text-2xl">
                  ${totalPrice.toFixed(2)}
                </span>
                <span className="text-black text-xs">
                  {totalQty} items added
                </span>
              </div>
              <Link href="/cart" className="ml-4">
                <button className="bg-[#FDC519] text-black rounded-xl px-6 py-2 font-bold text-lg">
                  View Cart
                </button>
              </Link>
            </div>
            {/* Store closed tip */}
          </div>
        )}
      </div>
    </div>
  )
}
