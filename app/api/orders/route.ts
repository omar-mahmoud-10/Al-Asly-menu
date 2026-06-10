import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const markViewed = searchParams.get('markViewed')
  const unviewedCount = searchParams.get('unviewedCount')

  if (unviewedCount === 'true') {
    const count = await client.fetch(groq`count(*[_type == "order" && viewed == false])`)
    return NextResponse.json({ count })
  }

  const orders = await client.fetch(groq`*[_type == "order"] | order(createdAt asc) {
    _id,
    items,
    totalPrice,
    branch,
    branchPhone,
    orderType,
    customerName,
    customerAddress,
    customerPhone,
    status,
    viewed,
    createdAt
  }`)

  const mapped = orders.map((o: any) => ({ ...o, id: o._id }))

  if (markViewed === 'true') {
    const unviewedIds = mapped.filter((o: any) => !o.viewed).map((o: any) => o._id)
    if (unviewedIds.length > 0) {
      const tx = writeClient.transaction()
      unviewedIds.forEach((id: string) => tx.patch(id, (p) => p.set({ viewed: true })))
      await tx.commit()
    }
  }

  return NextResponse.json(mapped)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const doc = await writeClient.create({
      _type: 'order',
      ...body,
      createdAt: new Date().toISOString(),
      viewed: false,
    })
    return NextResponse.json({ ...doc, id: doc._id }, { status: 201 })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    await writeClient.patch(id).set({ status }).commit()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
