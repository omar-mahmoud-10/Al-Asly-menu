'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Shield, Trash2, Plus, AlertTriangle, CheckCircle, ArrowRight, Mail, UserCog, Send, Check, X } from 'lucide-react'

interface StaffMember {
  _id: string
  email: string
  role: 'admin' | 'manager' | 'staff'
  createdAt: string
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'مدير',
  manager: 'مشرف',
  staff: 'موظف',
}

const ROLE_OPTIONS = [
  { value: 'staff', label: 'موظف' },
  { value: 'manager', label: 'مشرف' },
  { value: 'admin', label: 'مدير' },
]

export default function StaffManagePage() {
  const router = useRouter()
  const [staffList, setStaffList] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<any[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<'admin' | 'manager' | 'staff'>('staff')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [expandedToken, setExpandedToken] = useState<string | null>(null)
  const [currentRole, setCurrentRole] = useState<'admin' | 'manager' | null>(null)

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/access-request/review')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) setRequests(data)
      }
    } catch {}
  }

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff')
      if (res.status === 401) {
        router.push('/orders')
        return
      }
      if (res.status === 403) {
        router.push('/unauthorized')
        return
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        setStaffList(data)
      }
    } catch {
      setError('فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('/api/orders-login/me')
        if (res.ok) {
          const data = await res.json()
          setCurrentRole(data.staff?.role || null)
        }
      } catch {}
    }
    fetchCurrentUser()
    fetchStaff()
    fetchRequests()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newEmail.trim()) {
      setError('يرجى إدخال البريد الإلكتروني')
      return
    }

    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.trim(), role: newRole }),
      })

      if (res.ok) {
        setSuccess('تمت إضافة العضو بنجاح')
        setNewEmail('')
        setNewRole('staff')
        setShowAddForm(false)
        fetchStaff()
      } else {
        const data = await res.json()
        setError(data.error || 'فشل إضافة العضو')
      }
    } catch {
      setError('حدث خطأ في الاتصال')
    }
  }

  const handleRoleChange = async (id: string, role: string) => {
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/staff', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role }),
      })

      if (res.ok) {
        setSuccess('تم تغيير الصلاحية بنجاح')
        fetchStaff()
      } else {
        const data = await res.json()
        setError(data.error || 'فشل تغيير الصلاحية')
      }
    } catch {
      setError('حدث خطأ في الاتصال')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العضو؟')) return

    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/staff', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        setSuccess('تم حذف العضو بنجاح')
        fetchStaff()
      } else {
        const data = await res.json()
        setError(data.error || 'فشل حذف العضو')
      }
    } catch {
      setError('حدث خطأ في الاتصال')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <UserCog className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-display text-primary">إدارة فريق العمل</h1>
              <p className="text-muted-foreground text-sm">elsaly birket elsaba</p>
          {requests.length > 0 && (
            <p className="text-destructive text-xs mt-1 flex items-center gap-1">
              <Send className="w-3 h-3" />
              {requests.length} طلب وصول معلق
            </p>
          )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/orders')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              لوحة الطلبات
            </button>
            {currentRole === 'admin' && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                إضافة عضو
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            <p className="text-foreground text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
            <p className="text-foreground text-sm">{success}</p>
          </div>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-6 bg-secondary/30 border border-border rounded-xl p-4 md:p-6">
            <h2 className="text-lg font-display text-foreground mb-4">إضافة عضو جديد</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="staff@example.com"
                  dir="ltr"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">الصلاحية</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!newEmail.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  إضافة
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setNewEmail(''); setError('') }}
                  className="px-6 py-2.5 border border-border hover:bg-secondary/50 text-muted-foreground rounded-lg text-sm transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pending Requests */}
        {currentRole === 'admin' && requests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-display text-foreground mb-3 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              طلبات وصول معلقة
              <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">{requests.length}</span>
            </h2>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">البريد الإلكتروني</th>
                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">تاريخ الطلب</th>
                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req: any) => {
                    let tokenEmail = ''
                    try {
                      if (req.googleToken) {
                        const payload = JSON.parse(atob(req.googleToken.split('.')[1]))
                        tokenEmail = payload.email || ''
                      }
                    } catch {}
                    return (
                    <tr key={req._id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm text-foreground" dir="ltr">{req.email}</span>
                        {tokenEmail && tokenEmail !== req.email && (
                          <p className="text-[10px] text-warning mt-0.5">موثق: {tokenEmail}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(req.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {req.googleToken && (
                            <>
                              <button
                                onClick={() => setExpandedToken(expandedToken === req._id ? null : req._id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition-colors cursor-pointer border border-blue-500/30"
                                title="عرض رمز Google الموثق"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                التحقق
                              </button>
                              {expandedToken === req._id && (
                                <div className="absolute top-0 left-0 right-0 z-10 mt-10 bg-card border border-border rounded-xl p-3 shadow-xl">
                                  <p className="text-xs font-medium text-foreground mb-1">Google ID Token (موثق من Google)</p>
                                  <code className="text-[10px] text-muted-foreground break-all select-all block max-h-28 overflow-y-auto">
                                    {req.googleToken}
                                  </code>
                                  <p className="text-[10px] text-muted-foreground mt-1">
                                    يمكنك التحقق من هذا الرمز عبر Google للتحقق من صحة البريد الإلكتروني
                                  </p>
                                </div>
                              )}
                            </>
                          )}
                          <button
                            onClick={async () => {
                              setError(''); setSuccess('')
                              const res = await fetch('/api/access-request/review', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: req._id, action: 'approve' }),
                              })
                              if (res.ok) {
                                setSuccess('تم قبول الطلب وإضافة العضو')
                                fetchStaff(); fetchRequests()
                              } else {
                                const d = await res.json(); setError(d.error || 'فشل')
                              }
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30 transition-colors cursor-pointer border border-green-500/30"
                          >
                            <Check className="w-3.5 h-3.5" />
                            قبول
                          </button>
                          <button
                            onClick={async () => {
                              setError(''); setSuccess('')
                              const res = await fetch('/api/access-request/review', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: req._id, action: 'deny' }),
                              })
                              if (res.ok) {
                                setSuccess('تم رفض الطلب')
                                fetchRequests()
                              } else {
                                const d = await res.json(); setError(d.error || 'فشل')
                              }
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs hover:bg-destructive/20 transition-colors cursor-pointer border border-destructive/30"
                          >
                            <X className="w-3.5 h-3.5" />
                            رفض
                          </button>
                        </div>
                      </td>
                    </tr>
                    )})}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Staff List */}
        {staffList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Shield className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg">لا يوجد أعضاء في فريق العمل</p>
            <p className="text-sm">قم بإضافة أول عضو عبر زر "إضافة عضو"</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="px-4 py-3 text-sm font-medium text-muted-foreground">البريد الإلكتروني</th>
                  <th className="px-4 py-3 text-sm font-medium text-muted-foreground">الصلاحية</th>
                  <th className="px-4 py-3 text-sm font-medium text-muted-foreground">تاريخ الإضافة</th>
                  <th className="px-4 py-3 text-sm font-medium text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((member) => (
                  <tr key={member._id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-foreground" dir="ltr">{member.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {currentRole === 'admin' ? (
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member._id, e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {ROLE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${
                          member.role === 'admin' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                          member.role === 'manager' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
                          'text-green-400 border-green-500/30 bg-green-500/10'
                        }`}>
                          {ROLE_LABELS[member.role]}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(member.createdAt).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {currentRole === 'admin' && (
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs hover:bg-destructive/20 transition-colors cursor-pointer border border-destructive/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          حذف
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Info */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          يمكن للمدراء والمشرفين الوصول إلى هذه الصفحة
        </p>
      </div>
    </div>
  )
}
