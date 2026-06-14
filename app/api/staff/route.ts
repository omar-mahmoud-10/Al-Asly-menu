import { NextResponse } from 'next/server'
import { requireStaff } from '@/lib/auth-middleware'
import { getAllStaff, createStaffMember, updateStaffRole, deleteStaffMember } from '@/sanity/queries'

export async function GET(request: Request) {
  const auth = await requireStaff(request, 'manager')
  if (auth instanceof NextResponse) return auth

  try {
    const staff = await getAllStaff()
    return NextResponse.json(staff)
  } catch {
    return NextResponse.json({ error: 'فشل جلب بيانات فريق العمل' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireStaff(request, 'admin')
  if (auth instanceof NextResponse) return auth

  try {
    const { email, role } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    const validRoles = ['admin', 'manager', 'staff']
    if (role && !validRoles.includes(role)) {
      return NextResponse.json({ error: 'صلاحية غير صالحة' }, { status: 400 })
    }

    const doc = await createStaffMember({
      email: email.toLowerCase().trim(),
      role: role || 'staff',
    })

    return NextResponse.json({ success: true, id: doc._id }, { status: 201 })
  } catch (error: any) {
    if (error.message?.includes('already exists') || error.statusCode === 409) {
      return NextResponse.json({ error: 'هذا البريد الإلكتروني مضاف مسبقاً' }, { status: 409 })
    }
    console.error('Failed to create staff:', error)
    return NextResponse.json({ error: 'فشل إضافة عضو فريق العمل' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const auth = await requireStaff(request, 'admin')
  if (auth instanceof NextResponse) return auth

  try {
    const { id, role } = await request.json()

    if (!id || !role) {
      return NextResponse.json({ error: 'معرف العضو والصلاحية مطلوبان' }, { status: 400 })
    }

    const validRoles = ['admin', 'manager', 'staff']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'صلاحية غير صالحة' }, { status: 400 })
    }

    if (id === auth.staff.staffId && role !== 'admin') {
      return NextResponse.json({ error: 'لا يمكنك تغيير صلاحية نفسك' }, { status: 403 })
    }

    await updateStaffRole(id, role)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'فشل تحديث صلاحية العضو' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const auth = await requireStaff(request, 'admin')
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'معرف العضو مطلوب' }, { status: 400 })
    }

    if (id === auth.staff.staffId) {
      return NextResponse.json({ error: 'لا يمكنك حذف نفسك' }, { status: 403 })
    }

    await deleteStaffMember(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'فشل حذف العضو' }, { status: 500 })
  }
}
