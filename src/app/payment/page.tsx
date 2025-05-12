'use client'
import TopBar from '../components/TopBar'
import { useCartStore } from '../store/cartStore'
import { useAddressStore } from '../store/addressStore'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createOrder } from '@/lib/api/orderApi'
import { createPaymentSession } from '@/lib/api/paymentApi'

// 硬编码的用户信息
const hardcodedUser = {
  name: 'Zihan Zhou',
  phone: '0407 509 869',
  email: 'zihan@example.com',
  address: '2/51-53 Stanbel Rd, Salisbury Plain, SA 5109',
  // 信用卡信息
  cardName: 'Zihan Zhou',
  cardNumber: '4111 1111 1111 1111',
  cardCvv: '123',
  cardExpiry: '12/25',
}

export default function PaymentPage() {
  const router = useRouter()
  const cart = useCartStore((state) => state.cart)
  const finalPrice = useCartStore((state) => state.finalPrice)
  const orderNote = useCartStore((state) => state.orderNote)
  const address = useAddressStore((state) => state.address)
  const clearCart = useCartStore((state) => state.clearCart)

  // 表单状态
  const [cardName, setCardName] = useState(hardcodedUser.cardName)
  const [cardNumber, setCardNumber] = useState(hardcodedUser.cardNumber)
  const [cardCvv, setCardCvv] = useState(hardcodedUser.cardCvv)
  const [cardExpiry, setCardExpiry] = useState(hardcodedUser.cardExpiry)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [deliveryType, setDeliveryType] = useState('delivery')

  // 从本地存储获取配送方式
  useEffect(() => {
    const storedType = localStorage.getItem('deliveryType')
    if (storedType === 'pickup' || storedType === 'delivery') {
      setDeliveryType(storedType)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      // 准备订单项
      const orderItems = cart.map((item) => ({
        name: item.name,
        price: item.price,
        qty: item.qty,
      }))

      // 使用地址信息和硬编码用户信息
      const userInfo = {
        name: hardcodedUser.name,
        phone: hardcodedUser.phone,
        email: hardcodedUser.email,
        address: address || hardcodedUser.address,
      }

      // 创建订单
      const newOrder = await createOrder(
        userInfo,
        orderItems,
        deliveryType,
        orderNote || undefined
      )

      console.log('order created:', newOrder)

      // 创建支付会话
      const paymentSession = await createPaymentSession(
        newOrder.id,
        finalPrice,
        'AUD'
      )

      console.log('created payment session:', paymentSession)

      // 清空购物车
      clearCart()

      // 模拟支付成功，跳转到成功页面
      router.push('/payment/success')
    } catch (error) {
      console.error('order or payment process error:', error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Order or payment process error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // 格式化卡号显示
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  // 格式化过期日期
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return value
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center w-full">
      <div className="w-full max-w-[400px] flex flex-col items-center bg-[#222] min-h-screen rounded-t-2xl">
        <TopBar />
        <div className="w-full px-4 py-6 flex flex-col gap-6 flex-1">
          <div className="text-[#FDC519] text-2xl font-extrabold text-center mt-2 tracking-wide mb-4">
            Payment Information
          </div>
          <div className="flex justify-center">
            <div className="bg-black text-white rounded-xl px-6 py-3 text-xl font-bold">
              Final Price: ${finalPrice.toFixed(2)}
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg text-center">
              {errorMessage}
            </div>
          )}

          <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
            <input
              className="w-full rounded-lg p-4 bg-[#333] text-white placeholder:text-gray-400 text-base outline-none"
              placeholder="card holder name"
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
            <input
              className="w-full rounded-lg p-4 bg-[#333] text-white placeholder:text-gray-400 text-base outline-none"
              placeholder="card number"
              type="text"
              inputMode="numeric"
              maxLength={19}
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              required
            />
            <div className="flex gap-4">
              <input
                className="flex w-1/2 rounded-lg p-4 bg-[#333] text-white placeholder:text-gray-400 text-base outline-none"
                placeholder="CVV"
                type="text"
                inputMode="numeric"
                maxLength={3}
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                required
              />
              <input
                className="flex-1 rounded-lg p-4 bg-[#333] text-white placeholder:text-gray-400 text-base outline-none"
                placeholder="expiry date (MM/YY)"
                type="text"
                maxLength={5}
                value={cardExpiry}
                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FDC519] text-black font-bold text-xl rounded-xl py-3 mt-2 hover:bg-yellow-400 transition disabled:opacity-50">
              {isSubmitting ? 'Processing...' : 'Confirm Payment'}
            </button>
          </form>
          <div className="text-white text-center text-sm mt-4">
            <p>user information</p>
            <p>name: {hardcodedUser.name}</p>
            <p>phone: {hardcodedUser.phone}</p>
            <p>email: {hardcodedUser.email}</p>
            <p>address: {address || hardcodedUser.address}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
