import { api } from './apiUtils'

// 支付会话响应接口
export interface PaymentSessionResponse {
  sessionId: string
  status: string
  paymentUrl?: string
}

// 支付状态响应接口
export interface PaymentStatusResponse {
  sessionId: string
  orderId: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  amount: number
  currency: string
  updatedAt: string
}

// 创建支付会话
export async function createPaymentSession(
  orderId: number,
  amount: number,
  currency: string = 'AUD'
): Promise<PaymentSessionResponse> {
  return api.post<PaymentSessionResponse>('/api/payment/create-session', {
    orderId,
    amount,
    currency,
  })
}

// 通过支付会话ID查询支付状态
export async function getPaymentStatus(
  sessionId: string
): Promise<PaymentStatusResponse> {
  return api.get<PaymentStatusResponse>(
    `/api/payment/status?sessionId=${sessionId}`
  )
}

// 通过订单ID查询支付状态
export async function getPaymentStatusByOrderId(
  orderId: number
): Promise<PaymentStatusResponse> {
  return api.get<PaymentStatusResponse>(
    `/api/payment/status?orderId=${orderId}`
  )
}

// 处理支付网关回调
export async function handlePaymentCallback(
  payload: Record<string, unknown>
): Promise<{ success: boolean }> {
  return api.post<{ success: boolean }>('/api/payment/webhook', payload)
}
