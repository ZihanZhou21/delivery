import React from 'react'
import Link from 'next/link'
import AddressModal from './AddressModal'

interface Props {
  selected: 'delivery' | 'pickup' | null
  setSelected: (v: 'delivery' | 'pickup' | null) => void
  address: string
  setAddress: (v: string) => void
  addressInput: string
  setAddressInput: (v: string) => void
  showAddressModal: boolean
  setShowAddressModal: (v: boolean) => void
  handleDeliveryClick: () => void
  handlePickupClick: () => void
  handleChangeAddress: () => void
}

const DeliveryMethodSelector: React.FC<Props> = ({
  selected,
  setSelected,
  address,
  setAddress,
  addressInput,
  setAddressInput,
  showAddressModal,
  setShowAddressModal,
  handleDeliveryClick,
  handlePickupClick,
  handleChangeAddress,
}) => {
  // 地址提交
  const handleAddressSubmit = () => {
    setAddress(addressInput)
    setShowAddressModal(false)
    setSelected('delivery')
  }

  return (
    <>
      <AddressModal
        show={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        addressInput={addressInput}
        setAddressInput={setAddressInput}
        onSubmit={handleAddressSubmit}
      />
      <div className="flex-1 w-full flex flex-col items-center px-4 pb-6 gap-6">
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
            {selected === 'delivery' && address && (
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
              selected === 'pickup' ? 'border-[#FDC519]' : 'border-transparent'
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
        {selected === 'delivery' && address && (
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
              <span>{address}</span>
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
      </div>
    </>
  )
}

export default DeliveryMethodSelector
