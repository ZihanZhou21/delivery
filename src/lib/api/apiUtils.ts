// API响应的基础接口
export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

// API错误类
export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

// 处理API响应
async function handleResponse<T>(response: Response): Promise<T> {
  // 处理204无内容的情况
  if (response.status === 204) {
    return {} as T
  }

  // 尝试解析JSON响应
  let data: Record<string, unknown>
  try {
    data = await response.json()
  } catch {
    throw new ApiError('无效的JSON响应', response.status)
  }

  // 处理错误状态码
  if (!response.ok) {
    const message = (data.error as string) || `HTTP错误 ${response.status}`
    throw new ApiError(message, response.status)
  }

  return data as T
}

// 通用API请求函数
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // 设置默认请求头
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })
    return handleResponse<T>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(error instanceof Error ? error.message : '未知API错误')
  }
}

// 封装常用的HTTP方法
export const api = {
  get: <T>(url: string, options?: RequestInit) =>
    apiRequest<T>(url, { ...options, method: 'GET' }),

  post: <T>(
    url: string,
    data?: Record<string, unknown>,
    options?: RequestInit
  ) =>
    apiRequest<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(
    url: string,
    data?: Record<string, unknown>,
    options?: RequestInit
  ) =>
    apiRequest<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(
    url: string,
    data?: Record<string, unknown>,
    options?: RequestInit
  ) =>
    apiRequest<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(url: string, options?: RequestInit) =>
    apiRequest<T>(url, { ...options, method: 'DELETE' }),
}
