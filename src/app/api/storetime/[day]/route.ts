import { NextResponse } from 'next/server'
import { updateDayHours } from '@/lib/services/storeTimeService'
import { TimeInterval } from '@/app/store/opentimeStore'

// PUT /api/storetime/:day - 更新特定日期的营业时间
export async function PUT(
  request: Request,
  { params }: { params: { day: string } }
) {
  try {
    const day = params.day
    // 验证天名称
    const validDays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]

    if (!validDays.includes(day)) {
      return NextResponse.json(
        { error: 'Invalid day name. Must be one of: ' + validDays.join(', ') },
        { status: 400 }
      )
    }

    const body = await request.json()

    // 验证请求主体
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // 提取时间间隔和closed状态
    const { intervals, closed } = body

    // 验证时间间隔
    if (!Array.isArray(intervals)) {
      return NextResponse.json(
        { error: 'Intervals must be an array' },
        { status: 400 }
      )
    }

    // 验证每个时间间隔
    for (const interval of intervals) {
      if (!interval.open || !interval.close) {
        return NextResponse.json(
          { error: 'Each interval must have open and close time' },
          { status: 400 }
        )
      }

      // 验证时间格式（简单验证）
      const timeFormat = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeFormat.test(interval.open) || !timeFormat.test(interval.close)) {
        return NextResponse.json(
          { error: 'Time must be in 24-hour format HH:MM' },
          { status: 400 }
        )
      }
    }

    // 更新特定日期的营业时间
    const updatedDay = await updateDayHours(
      day,
      intervals as TimeInterval[],
      closed
    )

    if (!updatedDay) {
      return NextResponse.json(
        { error: 'Failed to update day hours' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedDay)
  } catch (error) {
    console.error('Failed to update day hours:', error)
    return NextResponse.json(
      { error: 'Failed to update day hours' },
      { status: 500 }
    )
  }
}
