import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  items: OrderItem[]
  totalPrice: number
  branch: string
  branchPhone: string
  orderType: string
  customerName: string
  customerAddress: string
  customerPhone: string
  status: 'pending' | 'confirmed'
  createdAt: string
  viewed: boolean
}

const DATA_DIR = path.join(process.cwd(), 'data')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readOrders(): Order[] {
  ensureDir()
  if (!fs.existsSync(ORDERS_FILE)) {
    return []
  }
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

function writeOrders(orders: Order[]) {
  ensureDir()
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const markViewed = searchParams.get('markViewed')
  const unviewedCount = searchParams.get('unviewedCount')

  const orders = readOrders()

  if (unviewedCount === 'true') {
    return NextResponse.json({ count: orders.filter(o => !o.viewed).length })
  }

  if (markViewed === 'true') {
    writeOrders(orders.map(o => ({ ...o, viewed: true })))
  }

  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const orders = readOrders()
    const newOrder: Order = {
      ...body,
      id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      viewed: false,
    }
    orders.push(newOrder)
    writeOrders(orders)
    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json({ error: 'فشل حفظ الطلب' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    const orders = readOrders()
    const idx = orders.findIndex(o => o.id === id)
    if (idx !== -1) {
      orders[idx].status = status
      writeOrders(orders)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update order:', error)
    return NextResponse.json({ error: 'فشل تحديث الطلب' }, { status: 500 })
  }
}
