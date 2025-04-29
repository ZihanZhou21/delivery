'use client'
import TopBar from '../components/TopBar'
import Image from 'next/image'
import React, { useState, useRef } from 'react'
import StoreInfo from '../components/StoreInfo'
import Link from 'next/link'
import { useCartStore, CartState, CartItem } from '../../store/cartStore'

type MenuItem = {
  name: string
  desc: string
  price: number
  img: string
  qty?: number
  note?: string
  id?: number
}

const menuData = [
  {
    category: 'Appetizers',
    items: [
      {
        name: 'Crispy Calamari',
        desc: 'Lightly battered calamari served with lemon aioli',
        price: 12.99,
        img: '/menu/calamari.png',
      },
      {
        name: 'Bruschetta',
        desc: 'Grilled bread topped with tomatoes, garlic, basil and olive oil',
        price: 8.99,
        img: '/menu/bruschetta.png',
      },
      {
        name: 'Spinach & Artichoke Dip',
        desc: 'Creamy dip served with tortilla chips',
        price: 10.99,
        img: '/menu/spinach.png',
      },
      {
        name: 'Stuffed Eggs',
        desc: 'Egg nest, purple eggs and eggs with avocado',
        price: 11.99,
        img: '/menu/stuffed-eggs.png',
      },
      {
        name: 'Egg and Bacon Canapés',
        desc: 'Bacon and eggs by making these easy and elegant canapés',
        price: 9.99,
        img: '/menu/egg-bacon.png',
      },
    ],
  },
  {
    category: 'Main Courses',
    items: [
      {
        name: 'Egg Bacon Cheese...',
        desc: 'Crispy bacon, Gooey egg, Beer Soaked-Onions and American cheese',
        price: 12.99,
        img: '/menu/egg-bacon-cheese.png',
      },
      {
        name: 'Creamy Bacon & Egg...',
        desc: 'Spaghetti dish is a delicious, carb-filled way to start any morning',
        price: 8.99,
        img: '/menu/bruschetta.png',
      },
    ],
  },
  // 可继续添加其他分类
]

export default function AppMenu() {
  const [selectedCategory, setSelectedCategory] = useState('Appetizers')
  const [modalItem, setModalItem] = useState<MenuItem | null>(null)
  const [modalQty, setModalQty] = useState(1)
  const [modalNote, setModalNote] = useState('')
  const [recentItem, setRecentItem] = useState<MenuItem | null>(null)
  const categories = menuData.map((c) => c.category)
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const addToCart = useCartStore((state: CartState) => state.addToCart)
  const cart = useCartStore((state: CartState) => state.cart)
  const removeFromCart = useCartStore(
    (state: CartState) => state.removeFromCart
  )

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
    setModalItem(item)
    setModalQty(1)
    setModalNote('')
  }
  const closeModal = () => setModalItem(null)

  // 添加到购物车
  const handleAddToCart = () => {
    if (!modalItem) return
    const newItem = {
      ...modalItem,
      qty: modalQty,
      note: modalNote,
      id: Date.now() + Math.random(),
      price: modalItem.price,
      name: modalItem.name,
      img: modalItem.img,
    }
    addToCart(newItem)
    setRecentItem(newItem)
    setModalItem(null)
  }
  // 移除最近添加的小条
  const handleRemoveRecent = () => {
    if (recentItem && recentItem.id) {
      removeFromCart(recentItem.id)
    }
    setRecentItem(null)
  }
  // 统计总价和数量
  const totalQty = cart.reduce(
    (sum: number, i: CartItem) => sum + (i.qty ?? 1),
    0
  )
  const totalPrice = cart.reduce(
    (sum: number, i: CartItem) => sum + i.price * (i.qty ?? 1),
    0
  )

  return (
    <div className="min-h-screen bg-white flex flex-col items-center w-full">
      <div className="w-full max-w-[400px] flex flex-col items-center bg-[#222] rounded-2xl min-h-screen">
        <TopBar />
        <div className="w-full px-4 py-6 flex flex-col gap-2 pb-24">
          <div className="text-[#FDC519] text-2xl font-extrabold text-center mt-2 tracking-wide">
            OUR MENU
          </div>
          {/* 分类选择 */}
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
          {/* 菜单项列表 */}
          {menuData.map((cat) => (
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
                {cat.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex bg-white rounded-2xl p-2 gap-4 shadow-md h-30">
                    <div className="w-25 rounded-xl overflow-hidden flex-shrink-0 h-full">
                      <Image
                        src={item.img}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="">
                        <div className="font-bold text-xl text-black truncate">
                          {item.name}
                        </div>
                        <div className="text-gray-700 text-sm line-clamp-2">
                          {item.desc}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-[#E53935] font-extrabold text-2xl">
                          ${item.price.toFixed(2)}
                        </div>
                        <button
                          className="bg-black text-white rounded-full px-6 py-1 font-semibold ml-2"
                          onClick={() => openModal(item)}>
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <StoreInfo />
        </div>
        {/* 弹窗部分 */}
        {modalItem && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* 半透明黑色蒙版 */}
            <div className="absolute inset-0 flex justify-center items-end">
              <div
                className="bg-black/80 w-full max-w-[400px] h-full"
                onClick={closeModal}></div>
            </div>
            {/* 底部弹窗表单 */}
            <div className="relative z-10 w-full max-w-[400px] flex flex-col">
              {/* 关闭按钮 */}
              <button
                className="absolute left-1/2 -top-6 -translate-x-1/2 bg-[#FDC519] w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold z-20 border-4 border-white"
                onClick={closeModal}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                ×
              </button>
              {/* 大图 */}
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
                {/* 数量选择 */}
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
                {/* 备注输入 */}
                <div>
                  <div className="text-white text-lg font-bold mb-1">Notes</div>
                  <textarea
                    className="w-full rounded-xl p-4 bg-black text-white placeholder:text-gray-400 text-base outline-none min-h-[60px] resize-none"
                    placeholder="Add Note"
                    value={modalNote}
                    onChange={(e) => setModalNote(e.target.value)}
                  />
                </div>
                {/* 添加到订单按钮和价格 */}
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
        {/* 悬浮条和小悬浮条 */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-[400px] flex flex-col items-center pointer-events-none">
            {/* 小悬浮条 */}
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
            {/* 主悬浮条 */}
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
          </div>
        )}
      </div>
    </div>
  )
}
