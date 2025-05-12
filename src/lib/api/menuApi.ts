import { MenuItem } from '@/app/store/menuStore'
import { api } from './apiUtils'

// 获取所有菜单项
export async function fetchMenuItems(): Promise<MenuItem[]> {
  return api.get<MenuItem[]>('/api/menu')
}

// 获取特定分类的菜单项
export async function fetchMenuItemsByCategory(
  category: string
): Promise<MenuItem[]> {
  return api.get<MenuItem[]>(
    `/api/menu?category=${encodeURIComponent(category)}`
  )
}

// 创建新菜单项
export async function createMenuItem(
  item: Omit<MenuItem, 'id' | 'isOutOfStock'>
): Promise<MenuItem> {
  return api.post<MenuItem>('/api/menu', item)
}

// 获取单个菜单项
export async function fetchMenuItem(id: string): Promise<MenuItem> {
  return api.get<MenuItem>(`/api/menu/${id}`)
}

// 更新菜单项
export async function updateMenuItem(
  id: string,
  updates: Partial<MenuItem>
): Promise<MenuItem> {
  return api.put<MenuItem>(`/api/menu/${id}`, updates)
}

// 删除菜单项
export async function deleteMenuItem(id: string): Promise<boolean> {
  const result = await api.delete<{ success: boolean }>(`/api/menu/${id}`)
  return result.success
}

// 切换菜单项库存状态
export async function toggleItemStock(id: string): Promise<MenuItem> {
  return api.patch<MenuItem>(`/api/menu/${id}/stock`)
}
