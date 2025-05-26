'use client'
import { useState } from 'react'
import StoreInfo from './components/StoreInfo'
import TopBar from './components/TopBar'
import DeliveryMethodSelector from './components/DeliveryMethodSelector'
import StoreNotice from './components/StoreNotice'
import { useAddressStore } from './store/addressStore'
// Remove non-existent DeliveryMethodSelector import

export default function Home() {
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [selected, setSelected] = useState<'delivery' | 'pickup' | null>(null)
  const address = useAddressStore((state) => state.address)
  const setAddress = useAddressStore((state) => state.setAddress)
  const [addressInput, setAddressInput] = useState(address)
  const [showNotice, setShowNotice] = useState(false)

  // Handle click on Delivery card
  const handleDeliveryClick = () => {
    if (!address) {
      setShowAddressModal(true)
    } else {
      setSelected('delivery')
    }
  }

  // Handle click on Store Pickup card
  const handlePickupClick = () => {
    setSelected('pickup')
  }

  // Handle address change
  const handleChangeAddress = () => {
    setShowAddressModal(true)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center w-full">
      {/* Main content area with dark background and rounded corners */}
      <div className="w-full max-w-[400px] flex flex-col items-center bg-[#222] rounded-2xl min-h-screen">
        <TopBar />
        <div className="w-full px-4 py-6 flex flex-col gap-2 pb-24">
          <div className="text-white text-2xl font-bold text-center mt-2 py-6">
            Welcome to The Egg Eatery & Indian Cafe.
          </div>
          <StoreNotice onVisibleChange={setShowNotice} />
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
