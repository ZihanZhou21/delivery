// 支付会话类型
export interface PaymentSession {
  id: string
  orderId: number
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  paymentMethod?: string
}

// 内存存储
const paymentSessions: PaymentSession[] = []

// 生成唯一ID
const generateSessionId = () =>
  `sess_${Math.random().toString(36).substring(2, 15)}`

// 创建支付会话
export async function createPaymentSession(
  orderId: number,
  amount: number,
  currency: string = 'AUD'
): Promise<PaymentSession> {
  const now = new Date()

  const session: PaymentSession = {
    id: generateSessionId(),
    orderId,
    amount,
    currency,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  }

  paymentSessions.push(session)
  return session
}

// 获取支付会话
export async function getPaymentSession(
  sessionId: string
): Promise<PaymentSession | null> {
  return paymentSessions.find((session) => session.id === sessionId) || null
}

// 根据订单ID获取支付会话
export async function getPaymentSessionByOrderId(
  orderId: number
): Promise<PaymentSession | null> {
  // 倒序查找，总是返回最新的支付会话
  return (
    [...paymentSessions]
      .reverse()
      .find((session) => session.orderId === orderId) || null
  )
}

// 更新支付会话状态
export async function updatePaymentStatus(
  sessionId: string,
  status: 'pending' | 'completed' | 'failed' | 'cancelled',
  paymentMethod?: string
): Promise<PaymentSession | null> {
  const index = paymentSessions.findIndex((session) => session.id === sessionId)
  if (index === -1) return null

  paymentSessions[index] = {
    ...paymentSessions[index],
    status,
    updatedAt: new Date(),
    paymentMethod: paymentMethod || paymentSessions[index].paymentMethod,
  }

  return paymentSessions[index]
}

// 支付完成处理（实际项目中这里会调用订单服务的更新方法）
export async function completePayment(
  sessionId: string,
  paymentMethod: string
): Promise<boolean> {
  const session = await updatePaymentStatus(
    sessionId,
    'completed',
    paymentMethod
  )
  if (!session) return false

  // 这里会调用订单服务更新订单状态
  // 例如: await orderService.updateOrderStatus(session.orderId, 'pending')
  console.log(`Payment ${sessionId} completed for order ${session.orderId}`)

  return true
}

// 模拟支付网关回调处理
export async function handlePaymentWebhook(payload: {
  session_id: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  payment_method?: string
}): Promise<{ success: boolean; message: string }> {
  // 实际项目中，这里会验证来自支付网关的签名
  if (!payload || !payload.session_id) {
    return { success: false, message: 'Invalid payload' }
  }

  try {
    const { session_id, status, payment_method } = payload
    await updatePaymentStatus(session_id, status, payment_method)

    if (status === 'completed') {
      await completePayment(session_id, payment_method || 'default_method')
    }

    return { success: true, message: 'Webhook processed successfully' }
  } catch (error) {
    console.error('Payment webhook error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
