'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Clock, MapPin, Phone, User, Package, Bike, Utensils, ShoppingBag, AlertTriangle, CheckCircle, Eye, ChevronDown, ChevronUp, Bell, LogOut, RefreshCw, Shield, Mail, Send, UserPlus } from 'lucide-react'

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

interface StaffInfo {
  email: string
  role: 'admin' | 'manager' | 'staff'
  id: string
}

const ORDER_TYPE_ICONS: Record<string, any> = {
  'تيك أواي': Package,
  'دليفرى': Bike,
  'صالة': Utensils,
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'مدير',
  manager: 'مشرف',
  staff: 'موظف',
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'text-red-400 border-red-500/30 bg-red-500/10',
  manager: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  staff: 'text-green-400 border-green-500/30 bg-green-500/10',
}

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)

    setTimeout(() => {
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.frequency.value = 1108
      osc2.type = 'sine'
      gain2.gain.setValueAtTime(0.3, ctx.currentTime)
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      osc2.start(ctx.currentTime)
      osc2.stop(ctx.currentTime + 0.3)
    }, 200)
  } catch {}
}

function requestNotificationPermission() {
  if (!('Notification' in window)) return
  if (Notification.permission === 'default') {
    Notification.requestPermission()
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }
}

function showSystemNotification(title: string, body: string) {
  const sendViaSW = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'show-notification', title, body })
      return true
    }
    return false
  }

  if (!('Notification' in window)) return
  if (Notification.permission === 'granted') {
    if (!sendViaSW()) {
      new Notification(title, { body, icon: '/logo_metaTitle.jpg', tag: 'new-order', requireInteraction: true })
    }
  }
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        if (!sendViaSW()) {
          new Notification(title, { body, icon: '/logo_metaTitle.jpg', tag: 'new-order', requireInteraction: true })
        }
      }
    })
  }
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (minutes < 1) return 'الآن'
  if (minutes < 60) return `منذ ${minutes} دقيقة`
  if (hours < 24) return `منذ ${hours} ساعة`
  return d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function OrdersDashboard() {
  const [staff, setStaff] = useState<StaffInfo | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [hasNewOrder, setHasNewOrder] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [requestLoading, setRequestLoading] = useState(false)
  const [pendingRequests, setPendingRequests] = useState(0)
  const lastOrderCount = useRef(0)
  const audioInitialized = useRef(false)

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch('/api/orders-login/me')
        if (res.ok) {
          const data = await res.json()
          setStaff(data.staff)
        }
      } catch {}
      setAuthLoading(false)
    }
    verifySession()
  }, [])

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders')
      if (res.status === 401) {
        setStaff(null)
        return
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        if (!audioInitialized.current && data.length > lastOrderCount.current && lastOrderCount.current > 0) {
          playNotificationSound()
          setHasNewOrder(true)
          setTimeout(() => setHasNewOrder(false), 5000)
          const newOrders = data.slice(lastOrderCount.current)
          newOrders.forEach((o: Order) => {
            const items = o.items.map(i => `${i.name} ×${i.quantity}`).join('، ')
            showSystemNotification(
              `طلب جديد من ${o.customerName || o.branch}`,
              `${o.branch} - ${o.orderType}\n${items}\nالإجمالي: ${o.totalPrice} جنيه`
            )
          })
        }
        lastOrderCount.current = data.length
        setOrders(data)
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPendingRequests = useCallback(async () => {
    try {
      const res = await fetch('/api/access-request/review')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) setPendingRequests(data.length)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (!staff) return
    requestNotificationPermission()
    fetchOrders()
    if (staff.role === 'admin') fetchPendingRequests()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [staff, fetchOrders, fetchPendingRequests])

  const markAsViewed = useCallback(async () => {
    try {
      await fetch('/api/orders?markViewed=true')
    } catch {}
  }, [])

  useEffect(() => {
    if (staff && orders.length > 0) {
      const unviewed = orders.some(o => !o.viewed)
      if (unviewed) {
        markAsViewed()
      }
    }
  }, [staff, orders.length, markAsViewed])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError(false)
    setRequestLoading(true)
    try {
      const loginRes = await fetch('/api/orders-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim() }),
      })
      if (loginRes.ok) {
        const data = await loginRes.json()
        setStaff(data.staff)
        setEmailInput('')
        setRequestLoading(false)
        return
      }
      const accessRes = await fetch('/api/access-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim() }),
      })
      if (accessRes.ok) {
        setRequestSent(true)
        setEmailInput('')
      } else {
        setEmailError(true)
      }
    } catch {
      setEmailError(true)
    }
    setRequestLoading(false)
  }

  const handleLogout = async () => {
    await fetch('/api/orders-login', { method: 'DELETE' })
    setStaff(null)
    setOrders([])
    lastOrderCount.current = 0
  }

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        fetchOrders()
      }
    } catch {}
  }

  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4" dir="rtl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-display text-primary tracking-wide">لوحة الطلبات</h1>
          <p className="text-foreground/60 text-sm mt-2">elsaly birket elsaba</p>
        </div>

        {!showForm ? (
          <div className="w-full max-w-sm text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-display text-foreground">ليس لديك صلاحية الوصول</h2>
              <p className="text-muted-foreground text-sm">
                هذه الصفحة مخصصة لفريق العمل فقط. إذا كنت أحد الموظفين، يرجى طلب إذن الوصول من المدير.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-primary-foreground h-12 rounded-lg text-base font-medium cursor-pointer"
            >
              <Send className="w-5 h-5" />
              طلب إذن الوصول من المدير
            </button>
          </div>
        ) : requestSent ? (
          <div className="w-full max-w-sm text-center space-y-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-green-400 text-base font-medium">تم إرسال طلب الوصول</p>
              <p className="text-muted-foreground text-sm mt-1">سيتم مراجعة طلبك من قبل المدير</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="w-full max-w-sm space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-display text-foreground">أدخل بريدك الإلكتروني</h2>
              <p className="text-muted-foreground text-sm">سيتم إرسال طلب الوصول إلى المدير</p>
            </div>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => { setEmailInput(e.target.value); setEmailError(false) }}
              placeholder="البريد الإلكتروني"
              autoFocus
              dir="ltr"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg"
            />
            {emailError && (
              <p className="text-destructive text-sm text-center flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                حدث خطأ في إرسال الطلب
              </p>
            )}
            <button
              type="submit"
              disabled={!emailInput || requestLoading}
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground h-12 rounded-lg text-base font-medium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {requestLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  إرسال طلب الوصول
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              رجوع
            </button>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-8 h-8 text-primary" />
              {hasNewOrder && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-ping" />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display text-primary">لوحة الطلبات</h1>
              <p className="text-muted-foreground text-sm">elsaly birket elsaba</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border ${ROLE_COLORS[staff.role] || ''}`}>
                <Shield className="w-3 h-3" />
                {ROLE_LABELS[staff.role] || staff.role}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-border text-muted-foreground bg-secondary/30">
                <Mail className="w-3 h-3" />
                <span dir="ltr">{staff.email}</span>
              </span>
            </div>
            <div className="flex gap-2 text-xs">
              <div className="bg-secondary/50 rounded-lg px-3 py-2 text-center">
                <p className="text-warning font-bold text-lg">{pendingOrders}</p>
                <p className="text-muted-foreground">قيد الانتظار</p>
              </div>
              <div className="bg-secondary/50 rounded-lg px-3 py-2 text-center">
                <p className="text-primary font-bold text-lg">{confirmedOrders}</p>
                <p className="text-muted-foreground">مؤكد</p>
              </div>
            </div>
            {staff.role === 'admin' && (
              <a
                href="/staff/manage"
                className="relative p-2 rounded-lg border border-border hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                title="إدارة فريق العمل"
              >
                <Shield className="w-5 h-5" />
                {pendingRequests > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {pendingRequests}
                  </span>
                )}
              </a>
            )}
            <button
              onClick={fetchOrders}
              className="p-2 rounded-lg border border-border hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="تحديث"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg border border-border hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        {hasNewOrder && (
          <div className="mb-4 bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3 animate-pulse">
            <Bell className="w-6 h-6 text-destructive" />
            <div>
              <p className="text-foreground font-bold">🚨 طلب جديد!</p>
              <p className="text-muted-foreground text-sm">يوجد طلب جديد بانتظار التأكيد على الواتساب</p>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <ShoppingBag className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg">لا توجد طلبات حتى الآن</p>
            <p className="text-sm">عند إرسال طلب جديد سيظهر هنا</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="px-4 py-3 text-sm font-medium text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-sm font-medium text-muted-foreground">التاريخ</th>
                  <th className="px-4 py-3 text-sm font-medium text-muted-foreground">الفرع</th>
                  <th className="px-4 py-3 text-sm font-medium text-muted-foreground">النوع</th>
                  <th className="px-4 py-3 text-sm font-medium text-muted-foreground">العميل</th>
                  <th className="px-4 py-3 text-sm font-medium text-muted-foreground">التواصل</th>
                  <th className="px-4 py-3 text-sm font-medium text-muted-foreground">الأصناف</th>
                  <th className="px-4 py-3 text-sm font-medium text-muted-foreground">الإجمالي</th>
                  <th className="px-4 py-3 text-sm font-medium text-muted-foreground">الحالة</th>
                  <th className="px-4 py-3 text-sm font-medium text-muted-foreground">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => {
                  const OrderTypeIcon = ORDER_TYPE_ICONS[order.orderType] || ShoppingBag
                  const isExpanded = expandedOrder === order.id
                  return (
                    <tr key={order.id} className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${
                      order.status === 'confirmed' ? 'bg-green-950/40' : !order.viewed ? 'bg-primary/5' : ''
                    }`}>
                      <td className="px-4 py-3 text-sm text-foreground">
                        <div className="flex items-center gap-2">
                          {!order.viewed && <Eye className="w-3 h-3 text-primary" />}
                          {idx + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {order.branch}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1.5">
                          <OrderTypeIcon className="w-3.5 h-3.5 text-primary" />
                          <span className="text-foreground">{order.orderType}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                          {order.customerName || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {order.customerPhone ? (
                          <a href={`tel:${order.customerPhone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                            {order.customerPhone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          {order.items.length} صنف
                        </button>
                        {isExpanded && (
                          <div className="mt-2 bg-secondary/30 rounded-lg p-2 space-y-1">
                            {order.items.map((item) => (
                              <div key={item.id} className="text-xs text-foreground flex justify-between gap-4">
                                <span>{item.name}</span>
                                <span className="text-muted-foreground whitespace-nowrap">{item.quantity} × {item.price} ج</span>
                              </div>
                            ))}
                            {order.customerAddress && (
                              <div className="text-xs text-muted-foreground pt-1 border-t border-border/50 mt-1">
                                <span>العنوان: {order.customerAddress}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-primary whitespace-nowrap">{order.totalPrice} جنيه</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {order.status === 'pending' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                          {order.status === 'pending' ? 'بانتظار التأكيد' : 'مؤكد'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30 transition-colors cursor-pointer border border-green-500/30 font-medium"
                          >
                           تأكيد الأوردر
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <span className="text-green-500/60 text-xs">✓ مؤكد</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Auto-refresh info */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          يتم التحديث تلقائياً كل 10 ثوانٍ
        </p>
      </div>
    </div>
  )
}
