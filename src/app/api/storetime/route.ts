import { NextResponse } from 'next/server'
import { getStoreHours, setStoreHours } from '@/lib/services/storeTimeService'
import { StoreTimeDay } from '@/app/store/opentimeStore'

// GET /api/storetime - 获取所有营业时间
export async function GET() {
  try {
    const hours = await getStoreHours()
    return NextResponse.json(hours)
  } catch (error) {
    console.error('Failed to get store hours:', error)
    return NextResponse.json(
      { error: 'Failed to fetch store hours' },
      { status: 500 }
    )
  }
}

// PUT /api/storetime - 更新所有营业时间
export async function PUT(request: Request) {
  try {
    const body = await request.json()

    // 验证输入
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Store hours must be an array' },
        { status: 400 }
      )
    }

    // 验证每一天的数据结构
    for (const day of body) {
      if (!day.day) {
        return NextResponse.json(
          { error: 'Each day object must have a day name' },
          { status: 400 }
        )
      }

      if (!Array.isArray(day.intervals)) {
        return NextResponse.json(
          { error: 'Each day object must have intervals array' },
          { status: 400 }
        )
      }

      // 验证每个时间间隔
      for (const interval of day.intervals) {
        if (!interval.open || !interval.close) {
          return NextResponse.json(
            { error: 'Each interval must have open and close time' },
            { status: 400 }
          )
        }

        // 验证时间格式（简单验证）
        const timeFormat = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
        if (
          !timeFormat.test(interval.open) ||
          !timeFormat.test(interval.close)
        ) {
          return NextResponse.json(
            { error: 'Time must be in 24-hour format HH:MM' },
            { status: 400 }
          )
        }
      }
    }

    // 更新营业时间
    const updatedHours = await setStoreHours(body as StoreTimeDay[])
    return NextResponse.json(updatedHours)
  } catch (error) {
    console.error('Failed to update store hours:', error)
    return NextResponse.json(
      { error: 'Failed to update store hours' },
      { status: 500 }
    )
  }
}
