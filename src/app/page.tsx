'use client'
import { useState } from 'react'
import StoreInfo from './components/StoreInfo'
import TopBar from './components/TopBar'
import DeliveryMethodSelector from './components/DeliveryMethodSelector'
import StoreNotice, {
  isStoreClosedAllDay,
  isStoreOpenNow,
} from './components/StoreNotice'
import { useAddressStore } from './store/addressStore'
// 移除未使用的 Link 导入
// 移除不存在的 DeliveryMethodSelector 导入

export default function Home() {
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [selected, setSelected] = useState<'delivery' | 'pickup' | null>(null)
  const address = useAddressStore((state) => state.address)
  const setAddress = useAddressStore((state) => state.setAddress)
  const [addressInput, setAddressInput] = useState(address)

  // 判断StoreNotice是否应显示
  const closedAllDay = isStoreClosedAllDay()
  const openNow = isStoreOpenNow()
  const showYellow = !closedAllDay && !openNow
  const showRed = closedAllDay
  const showNotice = showYellow || showRed

  // 处理点击Delivery卡片
  const handleDeliveryClick = () => {
    if (!address) {
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
      {/* 主内容区域加深色背景和圆角 */}
      <div className="w-full max-w-[400px] flex flex-col items-center bg-[#222] rounded-2xl min-h-screen">
        <TopBar />
        <div className="w-full px-4 py-6 flex flex-col gap-2 pb-24">
          <div className="text-white text-2xl font-bold text-center mt-2 py-6">
            Welcome to The Egg Eatery & Indian Cafe
          </div>
          {showNotice && <StoreNotice />}
          {!showNotice && (
            <DeliveryMethodSelector
              selected={selected}
              setSelected={setSelected}
              address={address}
              setAddress={setAddress}
              addressInput={addressInput}
              setAddressInput={setAddressInput}
              showAddressModal={showAddressModal}
              setShowAddressModal={setShowAddressModal}
              handleDeliveryClick={handleDeliveryClick}
              handlePickupClick={handlePickupClick}
              handleChangeAddress={handleChangeAddress}
            />
          )}
          <StoreInfo />
        </div>
      </div>
    </div>
  )
}
