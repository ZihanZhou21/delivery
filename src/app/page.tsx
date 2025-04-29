'use client'
import { useState } from 'react'
import StoreInfo from './components/StoreInfo'
import TopBar from './components/TopBar'
import Link from 'next/link'

export default function Home() {
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [addressInput, setAddressInput] = useState('')
  const [selected, setSelected] = useState<'delivery' | 'pickup' | null>(null)

  // 处理提交地址
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDeliveryAddress(addressInput)
    setShowAddressModal(false)
    setSelected('delivery')
  }

  // 处理点击Delivery卡片
  const handleDeliveryClick = () => {
    if (!deliveryAddress) {
      setShowAddressModal(true)
    } else {
      setSelected('delivery')
    }
  }

  // 处理点击Store Pickup卡片
  const handlePickupClick = () => {
    setSelected('pickup')
  }

  // 处理更改地址
  const handleChangeAddress = () => {
    setShowAddressModal(true)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center w-full">
      {/* 蒙版 */}
      {showAddressModal && (
        <div className="fixed inset-0 flex items-end justify-center z-50">
          <div className="w-full max-w-[400px] h-full relative flex flex-col justify-end">
            {/* 黑色半透明蒙版 */}
            <div className="absolute inset-0 bg-black/75 z-10 rounded-t-2xl"></div>
            {/* 地址输入表单弹窗 */}
            <div className="relative z-20 rounded-t-2xl bg-[#333] p-6 pb-4">
              <button
                className="absolute left-1/2 -top-6 -translate-x-1/2 bg-[#FDC519] w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
                onClick={() => setShowAddressModal(false)}>
                ×
              </button>
              <form onSubmit={handleAddressSubmit}>
                <div className="text-white font-bold text-lg mb-2">
                  Delivery Address
                </div>
                <input
                  className="w-full rounded-lg p-4 bg-black text-white placeholder:text-gray-400 text-base mb-4 outline-none"
                  placeholder="Enter Delivery Address"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#FDC519] text-black font-bold text-xl rounded-xl py-3 mt-2 hover:bg-yellow-400 transition">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 主内容区域加深色背景和圆角 */}
      <div className="w-full max-w-[400px] flex flex-col items-center bg-[#222] rounded-2xl min-h-screen">
        <TopBar />

        {/* 主体内容 */}
        <div className="flex-1 w-full flex flex-col items-center px-4 py-6 gap-6">
          <div className="text-white text-2xl font-bold text-center mt-2">
            Welcome to The Egg Eatery & Indian Cafe
          </div>
          <div className="text-white text-lg font-semibold text-center">
            How would you like to Start!
          </div>
          <div className="flex gap-4 w-full mt-2 flex-row">
            {/* Delivery 卡片 */}
            <div
              className={`flex-1 bg-[#FDC519] rounded-2xl flex flex-col items-center py-6 shadow-md relative cursor-pointer border-2 ${
                selected === 'delivery'
                  ? 'border-[#FDC519]'
                  : 'border-transparent'
              }`}
              onClick={handleDeliveryClick}>
              <div className="mb-2">
                <svg
                  width="40"
                  height="40"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <rect x="3" y="7" width="18" height="10" rx="2" />
                  <path d="M16 17v2a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2" />
                  <circle cx="7.5" cy="17.5" r="1.5" />
                  <circle cx="16.5" cy="17.5" r="1.5" />
                </svg>
              </div>
              <div className="font-bold text-xl text-black">Delivery</div>
              <div className="text-black text-center mt-1 text-base">
                We Deliver
                <br />
                Within 10km From
                <br />
                Our Location
              </div>
              {/* 对勾 */}
              {selected === 'delivery' && deliveryAddress && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 10.5l3.5 3.5 6-7"
                      stroke="#FDC519"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
            {/* Store Pickup 卡片 */}
            <div
              className={`flex-1 bg-[#FDC519] rounded-2xl flex flex-col items-center py-6 shadow-md relative cursor-pointer border-2 ${
                selected === 'pickup'
                  ? 'border-[#FDC519]'
                  : 'border-transparent'
              }`}
              onClick={handlePickupClick}>
              <div className="mb-2">
                <svg
                  width="40"
                  height="40"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <rect x="4" y="7" width="16" height="13" rx="2" />
                  <path d="M8 7V5a4 4 0 0 1 8 0v2" />
                </svg>
              </div>
              <div className="font-bold text-xl text-black">Store Pickup</div>
              <div className="text-black text-center mt-1 text-base">
                Ready For
                <br />
                Pickup in 20-30
                <br />
                Minutes
              </div>
              {/* 对勾 */}
              {selected === 'pickup' && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 10.5l3.5 3.5 6-7"
                      stroke="#FDC519"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* 地址和费用，仅在delivery被选中且有地址时显示 */}
          {selected === 'delivery' && deliveryAddress && (
            <>
              <div className="w-full flex items-center justify-between mt-4">
                <div className="text-white font-bold text-lg flex items-center gap-2">
                  Delivery Address
                </div>
                <button
                  className="border border-[#FDC519] text-[#FDC519] rounded-lg px-4 py-1 font-semibold hover:bg-[#FDC519] hover:text-black transition"
                  onClick={handleChangeAddress}>
                  Change
                </button>
              </div>
              <div className="w-full flex items-center gap-2 text-white text-base mt-1">
                <svg width="22" height="22" fill="#FDC519" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>{deliveryAddress}</span>
              </div>
              <div className="w-full bg-black rounded-xl p-4 mt-4 text-white text-lg font-bold">
                Delivery Charges:
                <div className="font-normal text-base mt-1">
                  Delivery cost will be $4.99
                </div>
              </div>
            </>
          )}

          <Link href="/menu" className="w-full">
            <button className="w-full bg-transparent border border-[#FDC519] text-[#FDC519] rounded-xl py-3 text-xl font-bold mt-2 hover:bg-[#FDC519] hover:text-black transition">
              Continue to Menu
            </button>
          </Link>

          <StoreInfo />
        </div>
      </div>
    </div>
  )
}
