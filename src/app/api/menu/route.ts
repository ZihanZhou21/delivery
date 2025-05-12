import { NextResponse } from 'next/server'
import {
  getAllMenuItems,
  createMenuItem,
  getMenuItemsByCategory,
} from '@/lib/services/menuService'
import { MenuItem } from '@/app/store/menuStore'

// GET /api/menu - 获取所有菜单项或根据分类筛选
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')

    let items: MenuItem[]

    if (category) {
      items = await getMenuItemsByCategory(category)
    } else {
      items = await getAllMenuItems()
    }

    return NextResponse.json(items)
  } catch (error) {
    console.error('Failed to get menu items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

// POST /api/menu - 创建新的菜单项
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 必填字段验证
    if (!body.name || typeof body.price !== 'number') {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      )
    }

    const newItem = await createMenuItem({
      name: body.name,
      price: body.price,
      desc: body.desc,
      image: body.image,
      category: body.category,
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Failed to create menu item:', error)
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}
