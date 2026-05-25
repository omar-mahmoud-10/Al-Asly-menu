import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-sanity-secret')
  const expectedSecret = process.env.SANITY_WEBHOOK_SECRET

  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  revalidatePath('/')
  revalidatePath('/category/[slug]')

  return NextResponse.json({ revalidated: true })
}
