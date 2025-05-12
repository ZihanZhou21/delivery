import { NextResponse } from 'next/server'
import { createPaymentSession } from '@/lib/services/paymentService'

// POST /api/payment/create-session - 创建支付会话
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 验证必填字段
    if (!body.orderId || typeof body.orderId !== 'number') {
      return NextResponse.json(
        { error: 'Valid orderId is required' },
        { status: 400 }
      )
    }

    if (!body.amount || typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      )
    }

    // 创建支付会话
    const session = await createPaymentSession(
      body.orderId,
      body.amount,
      body.currency || 'AUD'
    )

    // 实际项目中，这里会调用真实的支付网关API（如Stripe、PayPal等）
    // 并返回支付URL或客户端令牌等

    return NextResponse.json({
      sessionId: session.id,
      status: session.status,
      // 模拟支付URL，实际项目中应从支付网关获取
      paymentUrl: `/payment/gateway?session=${session.id}`,
    })
  } catch (error) {
    console.error('Failed to create payment session:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    )
  }
}
