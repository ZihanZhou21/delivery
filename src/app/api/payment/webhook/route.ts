import { NextResponse } from 'next/server'
import { handlePaymentWebhook } from '@/lib/services/paymentService'

// POST /api/payment/webhook - 处理支付网关回调
export async function POST(request: Request) {
  try {
    // 实际项目中，这里需要验证请求是否来自合法的支付网关
    // 通常会验证签名或令牌

    const payload = await request.json()

    // 处理支付网关回调
    const result = await handlePaymentWebhook(payload)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to process payment webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process payment webhook' },
      { status: 500 }
    )
  }
}
