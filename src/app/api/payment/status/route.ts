import { NextResponse } from 'next/server'
import {
  getPaymentSessionByOrderId,
  getPaymentSession,
} from '@/lib/services/paymentService'

// GET /api/payment/status - 查询支付状态
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const orderId = searchParams.get('orderId')

    if (!sessionId && !orderId) {
      return NextResponse.json(
        { error: 'Either sessionId or orderId is required' },
        { status: 400 }
      )
    }

    let session

    // 根据会话ID查询
    if (sessionId) {
      session = await getPaymentSession(sessionId)
    }
    // 根据订单ID查询
    else if (orderId) {
      const orderIdNum = parseInt(orderId)
      if (isNaN(orderIdNum)) {
        return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
      }
      session = await getPaymentSessionByOrderId(orderIdNum)
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Payment session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      sessionId: session.id,
      orderId: session.orderId,
      status: session.status,
      amount: session.amount,
      currency: session.currency,
      updatedAt: session.updatedAt,
    })
  } catch (error) {
    console.error('Failed to get payment status:', error)
    return NextResponse.json(
      { error: 'Failed to get payment status' },
      { status: 500 }
    )
  }
}
