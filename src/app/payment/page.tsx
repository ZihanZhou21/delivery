'use client'
import TopBar from '../components/TopBar'
import { useCartStore } from '../store/cartStore'
import React from 'react'

export default function PaymentPage() {
  const finalPrice = useCartStore((state) => state.finalPrice)

  return (
    <div className="min-h-screen bg-white flex flex-col items-center w-full">
      <div className="w-full max-w-[400px] flex flex-col items-center bg-[#222] min-h-screen rounded-t-2xl">
        <TopBar />
        <div className="w-full px-4 py-6 flex flex-col gap-6 flex-1">
          <div className="text-[#FDC519] text-2xl font-extrabold text-center mt-2 tracking-wide mb-4">
            PAYMENT GATEWAY
          </div>
          <div className="flex justify-center">
            <div className="bg-black text-white rounded-xl px-6 py-3 text-xl font-bold">
              Total Amount: ${finalPrice.toFixed(2)}
            </div>
          </div>
          <form className="flex flex-col gap-4 mt-4">
            <input
              className="w-full rounded-lg p-4 bg-[#333] text-white placeholder:text-gray-400 text-base outline-none"
              placeholder="Name on card"
              type="text"
            />
            <input
              className="w-full rounded-lg p-4 bg-[#333] text-white placeholder:text-gray-400 text-base outline-none"
              placeholder="Card Number"
              type="text"
              inputMode="numeric"
              maxLength={19}
            />
            <div className="flex gap-4">
              <input
                className="flex w-1/2 rounded-lg p-4 bg-[#333] text-white placeholder:text-gray-400 text-base outline-none"
                placeholder="CVV"
                type="text"
                inputMode="numeric"
                maxLength={3}
              />
              <input
                className="flex-1 rounded-lg p-4 bg-[#333] text-white placeholder:text-gray-400 text-base outline-none"
                placeholder="Expiry Date"
                type="text"
                maxLength={5}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#FDC519] text-black font-bold text-xl rounded-xl py-3 mt-2 hover:bg-yellow-400 transition">
              Submit
            </button>
          </form>
          <button className="w-full bg-black text-white font-bold text-xl rounded-xl py-3 flex items-center justify-center gap-2 mt-2">
            Check Out with
            <span className="text-2xl"></span> Pay
          </button>
          <button className="w-full bg-black text-white font-bold text-xl rounded-xl py-3 flex items-center justify-center gap-2 mt-2">
            Buy with
            <span className="text-2xl">
              <svg width="24" height="24" viewBox="0 0 48 48">
                <g>
                  <path
                    fill="#4285F4"
                    d="M43.611 20.083H42V20H24v8h11.303C34.889 32.438 29.889 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c2.73 0 5.23.936 7.207 2.482l6.086-6.086C33.527 6.527 28.977 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.045 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z"
                  />
                  <path
                    fill="#34A853"
                    d="M6.306 14.691l6.571 4.819C14.655 16.104 19.001 13 24 13c2.73 0 5.23.936 7.207 2.482l6.086-6.086C33.527 6.527 28.977 4 24 4c-7.732 0-14.436 4.41-17.694 10.691z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M24 44c5.798 0 11.009-2.221 14.994-5.826l-6.909-5.665C29.89 34.438 26.995 35.5 24 35.5c-5.858 0-10.803-3.721-12.597-8.946l-6.563 5.065C9.538 39.421 16.227 44 24 44z"
                  />
                  <path
                    fill="#EA4335"
                    d="M43.611 20.083H42V20H24v8h11.303c-1.527 4.438-6.527 8-11.303 8-3.162 0-6.012-1.084-8.207-2.938l-6.909 5.665C9.538 39.421 16.227 44 24 44c7.732 0 14.436-4.41 17.694-10.691z"
                  />
                  <path fill="none" d="M0 0h48v48H0z" />
                </g>
              </svg>
            </span>
            Pay
          </button>
        </div>
      </div>
    </div>
  )
}
