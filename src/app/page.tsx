'use client'
import { useState } from 'react'
import StoreInfo from './components/StoreInfo'
import TopBar from './components/TopBar'
import DeliveryMethodSelector from './components/DeliveryMethodSelector'
// 移除未使用的 Link 导入
// 移除不存在的 DeliveryMethodSelector 导入

export default function Home() {
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [addressInput, setAddressInput] = useState('')
  const [selected, setSelected] = useState<'delivery' | 'pickup' | null>(null)

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
      {/* 主内容区域加深色背景和圆角 */}
      <div className="w-full max-w-[400px] flex flex-col items-center bg-[#222] rounded-2xl min-h-screen">
        <TopBar />
        <DeliveryMethodSelector
          selected={selected}
          setSelected={setSelected}
          deliveryAddress={deliveryAddress}
          setDeliveryAddress={setDeliveryAddress}
          addressInput={addressInput}
          setAddressInput={setAddressInput}
          // 传递弹窗控制
          showAddressModal={showAddressModal}
          setShowAddressModal={setShowAddressModal}
          handleDeliveryClick={handleDeliveryClick}
          handlePickupClick={handlePickupClick}
          handleChangeAddress={handleChangeAddress}
        />
        <StoreInfo />
      </div>
    </div>
  )
}
