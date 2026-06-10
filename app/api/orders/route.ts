import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { getProjectId, getDataset, token } from '@/sanity/env'
import { groq } from 'next-sanity'

function getMutationUrl() {
  return `https://${getProjectId()}.api.sanity.io/v2024-01-01/data/mutate/${getDataset()}`
}

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
        const patches = unviewedIds.map((id: string) => ({
          patch: { id, set: { viewed: true } }
        }))
        await fetch(getMutationUrl(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mutations: patches }),
        })
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
    if (!token) {
      return NextResponse.json({
        error: 'SANITY_API_TOKEN غير موجود',
        details: 'أضف SANITY_API_TOKEN في Vercel Dashboard → Settings → Environment Variables بنفس القيمة اللي في ملف .env.local'
      }, { status: 500 })
    }

    const body = await request.json()
    const mutationBody = {
      mutations: [{
        create: {
          _type: 'order',
          ...body,
          createdAt: new Date().toISOString(),
          viewed: false,
        }
      }]
    }

    const res = await fetch(getMutationUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mutationBody),
    })

    const result = await res.json()

    if (!res.ok) {
      console.error('Sanity API error:', JSON.stringify(result))
      let msg = result?.error?.description || result?.message || JSON.stringify(result)
      if (msg.includes('already exists')) {
        return NextResponse.json({ success: true, id: 'duplicate' })
      }
      return NextResponse.json({
        error: 'رفض Sanity حفظ الطلب',
        details: msg.substring(0, 300)
      }, { status: 500 })
    }

    const docId = result?.results?.[0]?.id || result?.document?._id || 'unknown'
    return NextResponse.json({ id: docId }, { status: 201 })
  } catch (error: any) {
    console.error('Failed to save order:', error)
    return NextResponse.json({
      error: 'خطأ في الاتصال بقاعدة البيانات',
      details: error?.message || 'unknown error'
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()

    const res = await fetch(getMutationUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations: [{ patch: { id, set: { status } } }] }),
    })

    if (!res.ok) {
      const result = await res.json()
      throw new Error(result?.error?.description || 'فشل تحديث الطلب')
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to update order:', error)
    return NextResponse.json({ error: 'فشل تحديث الطلب', details: error?.message }, { status: 500 })
  }
}
