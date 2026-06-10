import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const markViewed = searchParams.get('markViewed')

  try {
    const orders = await client.fetch(groq`*[_type == "order"] | order(createdAt asc) {
      _id, items, totalPrice, branch, branchPhone, orderType,
      customerName, customerAddress, customerPhone, status, viewed, createdAt
    }`)

    const mapped = orders.map((o: any) => ({ ...o, id: o._id }))

    if (markViewed === 'true') {
      const unviewedIds = mapped.filter((o: any) => !o.viewed).map((o: any) => o._id)
      if (unviewedIds.length > 0) {
        const transaction = unviewedIds.map((id: string) =>
          writeClient.patch(id).set({ viewed: true })
        )
        await writeClient.transaction(transaction).commit()
      }
    }

    return NextResponse.json(mapped)
  } catch (error: any) {
    console.error('Failed to fetch orders:', error)
    return NextResponse.json({ error: 'فشل جلب الطلبات', details: error?.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!writeClient.config().token) {
      return NextResponse.json({
        error: 'SANITY_API_TOKEN غير موجود',
        details: 'أضف SANITY_API_TOKEN في Vercel Dashboard → Settings → Environment Variables بنفس القيمة اللي في ملف .env.local'
      }, { status: 500 })
    }

    const body = await request.json()
    const doc = await writeClient.create({
      _type: 'order',
      ...body,
      createdAt: new Date().toISOString(),
      viewed: false,
    })

    return NextResponse.json({ id: doc._id }, { status: 201 })
  } catch (error: any) {
    console.error('Failed to save order:', JSON.stringify({ message: error.message, status: error.statusCode, details: error.details }))

    if (error.statusCode === 401 || error.message?.includes('Session not found') || error.message?.includes('session not found')) {
      return NextResponse.json({
        error: 'خطأ في التوثيق مع Sanity',
        details: 'توكن SANITY_API_TOKEN غير صالح أو لا يملك صلاحيات الكتابة. تأكد من وضع التوكن الصحيح في Vercel Dashboard → Settings → Environment Variables',
      }, { status: 500 })
    }

    return NextResponse.json({
      error: 'خطأ في الاتصال بقاعدة البيانات',
      details: error?.message || 'unknown error'
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    await writeClient.patch(id).set({ status }).commit()
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to update order:', error)
    return NextResponse.json({ error: 'فشل تحديث الطلب', details: error?.message }, { status: 500 })
  }
}
