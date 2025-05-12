'use client'
import TopBar from '../../components/TopBar'
import Link from 'next/link'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'

export default function PaymentSuccessPage() {
  // const router = useRouter()
  // const [countdown, setCountdown] = useState(5)

  // 倒计时5秒后自动跳转到首页
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCountdown((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(timer)
  //         router.push('/')
  //         return 0
  //       }
  //       return prev - 1
  //     })
  //   }, 1000)

  //   return () => clearInterval(timer)
  // }, [router])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center w-full">
      <div className="w-full max-w-[400px] flex flex-col items-center bg-[#222] min-h-screen rounded-t-2xl">
        <TopBar />
        <div className="w-full px-4 py-6 flex flex-col gap-6 flex-1 items-center justify-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="text-[#FDC519] text-2xl font-extrabold text-center tracking-wide mb-4">
            Payment Success!
          </div>
          <div className="text-white text-center">
            <p className="mb-4">
              Your order has been submitted, we will process it as soon as
              possible.
            </p>
            <p className="text-gray-400">
              Order information has been sent to the merchant&apos;s backend,
              you can view the order details in the backend.
            </p>
          </div>
          <Link
            href="/menu"
            className="bg-[#FDC519] text-black font-bold text-xl rounded-xl py-3 px-8 mt-8 hover:bg-yellow-400 transition">
            {/* Back to Home ({countdown}) */}
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  )
}
