'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useMenuStore, MenuItem } from '../../store/menuStore'

// 编辑菜单项弹窗组件
function EditMenuItemModal({
  item,
  isOpen,
  onClose,
  onSave,
}: {
  item: MenuItem
  isOpen: boolean
  onClose: () => void
  onSave: (updates: Partial<MenuItem>) => void
}) {
  const [name, setName] = useState(item.name)
  const [price, setPrice] = useState(item.price.toString())
  const [desc, setDesc] = useState(item.desc || '')
  const [category, setCategory] = useState(item.category || '')
  const [image, setImage] = useState(item.image || '')
  const [isOutOfStock, setIsOutOfStock] = useState(item.isOutOfStock)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const priceNum = parseFloat(price)
    if (!name || isNaN(priceNum) || priceNum < 0) {
      alert('Please enter a valid name and non-negative price.')
      return
    }

    onSave({
      name,
      price: priceNum,
      desc: desc || undefined,
      category: category || undefined,
      image: image || undefined,
      isOutOfStock,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
      <div className="bg-[#363636] w-[360px] rounded-2xl z-10 p-6 shadow-xl">
        <h2 className="text-[#FDC519] text-xl font-bold mb-4 text-center">
          Edit Menu Item
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-black text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-[#FDC519] focus:outline-none"
            required
          />
          <input
            type="number"
            placeholder="Price (e.g. 9.99)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-black text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-[#FDC519] focus:outline-none"
            step="0.01"
            min="0"
            required
          />
          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="bg-black text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-[#FDC519] focus:outline-none"
            rows={3}
          />
          <input
            type="text"
            placeholder="Category (e.g. Appetizers, Main Courses)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-black text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-[#FDC519] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="bg-black text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-[#FDC519] focus:outline-none"
          />
          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              id="outOfStock"
              checked={isOutOfStock}
              onChange={(e) => setIsOutOfStock(e.target.checked)}
              className="w-4 h-4 accent-[#FDC519]"
            />
            <label htmlFor="outOfStock" className="text-white">
              Mark as Out of Stock
            </label>
          </div>
          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition">
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#FDC519] text-black font-extrabold rounded-xl hover:bg-yellow-400 transition">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MenuAdminPage() {
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleStockStatus,
  } = useMenuStore()

  // 添加新菜单项的状态
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemImage, setNewItemImage] = useState('')
  const [newItemDesc, setNewItemDesc] = useState('')
  const [newItemCategory, setNewItemCategory] = useState('')

  // 控制表单和弹窗显示
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  // 处理添加新菜单项
  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const price = parseFloat(newItemPrice)
    if (newItemName && !isNaN(price) && price >= 0) {
      addMenuItem({
        name: newItemName,
        price,
        image: newItemImage || undefined,
        desc: newItemDesc || undefined,
        category: newItemCategory || undefined,
      })
      // 清空表单并隐藏
      setNewItemName('')
      setNewItemPrice('')
      setNewItemImage('')
      setNewItemDesc('')
      setNewItemCategory('')
      setShowAddForm(false)
    } else {
      alert('Please enter a valid name and non-negative price.')
    }
  }

  // 处理编辑菜单项
  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item)
  }

  // 处理保存菜单项编辑
  const handleSaveEdit = (id: string, updates: Partial<MenuItem>) => {
    updateMenuItem(id, updates)
  }

  // 处理删除菜单项
  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMenuItem(id)
    }
  }

  // 处理切换库存状态
  const handleToggleStock = (id: string) => {
    toggleStockStatus(id)
  }

  // 按分类分组菜单项
  const groupedMenuItems = menuItems.reduce(
    (groups: Record<string, MenuItem[]>, item) => {
      const category = item.category || 'Uncategorized'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(item)
      return groups
    },
    {}
  )

  return (
    <div className="min-h-screen bg-[#363636] flex flex-col items-center w-[400px] mx-auto pb-8">
      {/* 头部 */}
      <div className="w-full bg-[#FDC519] flex items-center justify-between px-4 py-4 sticky top-0 z-10">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="white"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        </Link>
      </div>

      {/* 页面标题和添加按钮 */}
      <div className="w-full max-w-[380px] flex items-center justify-between my-6 px-2">
        <h1 className="text-[#FDC519] text-2xl font-extrabold tracking-wide">
          Menu Management
        </h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#FDC519] text-black font-bold rounded-xl px-3 py-2 text-sm hover:bg-yellow-400 transition flex items-center gap-1">
          {showAddForm ? 'Close' : 'Add Item'}
          {!showAddForm && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* 添加新菜单项表单 - 可切换显示 */}
      {showAddForm && (
        <form
          onSubmit={handleAddItem}
          className="w-full max-w-[360px] bg-black rounded-2xl p-6 mb-8 shadow-md flex flex-col gap-4">
          <h2 className="text-white font-bold text-xl mb-2 text-center">
            Add New Menu Item
          </h2>
          <input
            type="text"
            placeholder="Item Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="bg-[#363636] text-white rounded-lg px-4 py-2 border border-gray-500 focus:border-[#FDC519] focus:outline-none"
            required
          />
          <input
            type="number"
            placeholder="Price (e.g. 9.99)"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            className="bg-[#363636] text-white rounded-lg px-4 py-2 border border-gray-500 focus:border-[#FDC519] focus:outline-none"
            step="0.01"
            min="0"
            required
          />
          <textarea
            placeholder="Description"
            value={newItemDesc}
            onChange={(e) => setNewItemDesc(e.target.value)}
            className="bg-[#363636] text-white rounded-lg px-4 py-2 border border-gray-500 focus:border-[#FDC519] focus:outline-none"
            rows={2}
          />
          <input
            type="text"
            placeholder="Category (e.g. Appetizers, Main Courses)"
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="bg-[#363636] text-white rounded-lg px-4 py-2 border border-gray-500 focus:border-[#FDC519] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Image URL (Optional)"
            value={newItemImage}
            onChange={(e) => setNewItemImage(e.target.value)}
            className="bg-[#363636] text-white rounded-lg px-4 py-2 border border-gray-500 focus:border-[#FDC519] focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#FDC519] text-black font-extrabold rounded-xl py-3 text-lg hover:bg-yellow-400 transition mt-2">
            Add Item
          </button>
        </form>
      )}

      {/* 菜单项列表 - 按分类分组 */}
      <div className="w-full max-w-[380px] flex flex-col gap-6 px-2">
        {Object.keys(groupedMenuItems).length === 0 ? (
          <p className="text-gray-400 text-center">No menu items yet.</p>
        ) : (
          Object.entries(groupedMenuItems).map(([category, items]) => (
            <div key={category} className="mb-4">
              <h2 className="text-[#FDC519] text-xl font-bold mb-3">
                {category}
              </h2>
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-black rounded-2xl p-4 shadow-md flex items-start gap-4 relative ${
                      item.isOutOfStock ? 'opacity-60' : ''
                    }`}>
                    {/* 图片 */}
                    <div className="flex-shrink-0 w-16 h-16 bg-[#363636] rounded-lg overflow-hidden border border-gray-600 flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/images/placeholder.png' // Image fallback
                          }}
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No image</span>
                      )}
                    </div>

                    {/* 详情 */}
                    <div className="flex-grow flex flex-col justify-start overflow-hidden">
                      <span
                        className="text-white font-bold text-lg truncate"
                        title={item.name}>
                        {item.name}
                      </span>
                      <span className="text-[#FDC519] font-semibold text-base">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.desc && (
                        <p
                          className="text-gray-300 text-sm mt-1 line-clamp-2"
                          title={item.desc}>
                          {item.desc}
                        </p>
                      )}
                      {item.isOutOfStock && (
                        <span className="text-red-500 text-xs font-bold absolute top-2 right-2 bg-black/80 px-1.5 py-0.5 rounded">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex flex-col gap-1.5 flex-shrink-0 ml-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="bg-[#363636] text-white rounded-md px-2 py-1 text-xs hover:bg-gray-600 transition"
                        title="Edit">
                        ✏️
                      </button>
                      <button
                        onClick={() => handleToggleStock(item.id)}
                        className={`${
                          item.isOutOfStock
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-yellow-600 hover:bg-yellow-700'
                        } text-white rounded-md px-2 py-1 text-xs transition`}
                        title={
                          item.isOutOfStock
                            ? 'Mark as In Stock'
                            : 'Mark as Out of Stock'
                        }>
                        {item.isOutOfStock ? '✅' : '❌'}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="bg-red-600 text-white rounded-md px-2 py-1 text-xs hover:bg-red-700 transition"
                        title="Delete">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 编辑菜单项弹窗 */}
      {editingItem && (
        <EditMenuItemModal
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(updates) => handleSaveEdit(editingItem.id, updates)}
        />
      )}
    </div>
  )
}
