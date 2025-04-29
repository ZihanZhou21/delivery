import React from 'react'

interface AddressModalProps {
  show: boolean
  onClose: () => void
  addressInput: string
  setAddressInput: (v: string) => void
  onSubmit: () => void
}

const AddressModal: React.FC<AddressModalProps> = ({
  show,
  onClose,
  addressInput,
  setAddressInput,
  onSubmit,
}) => {
  if (!show) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="fixed inset-0 flex items-end justify-center z-50">
      <div className="w-full max-w-[400px] h-full relative flex flex-col justify-end">
        {/* 黑色半透明蒙版 */}
        <div
          className="absolute inset-0 bg-black/75 z-10 rounded-t-2xl"
          onClick={onClose}></div>
        {/* 地址输入表单弹窗 */}
        <div className="relative z-20 rounded-t-2xl bg-[#333] p-6 pb-4">
          <button
            className="absolute left-1/2 -top-6 -translate-x-1/2 bg-[#FDC519] w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
            onClick={onClose}>
            ×
          </button>
          <form onSubmit={handleSubmit}>
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
  )
}

export default AddressModal
