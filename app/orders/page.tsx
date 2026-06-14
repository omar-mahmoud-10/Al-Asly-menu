'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { Clock, MapPin, Phone, User, Package, Bike, Utensils, ShoppingBag, AlertTriangle, CheckCircle, Eye, ChevronDown, ChevronUp, Bell, LogOut, RefreshCw, Shield, Mail, Trash2 } from 'lucide-react'

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

let swRegistration: ServiceWorkerRegistration | null = null

async function requestNotificationPermission() {
  if (!('Notification' in window)) return
  if (Notification.permission === 'default') {
    await Notification.requestPermission()
  }
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      swRegistration = reg
      await navigator.serviceWorker.ready
    } catch (e) {
      console.warn('Service worker registration failed:', e)
    }
  }
}

async function subscribeToPush(email: string) {
  if (!('Notification' in window) || !('PushManager' in window) || !swRegistration) return
  if (Notification.permission !== 'granted') return

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!publicKey) return

  try {
    const urlBase64ToUint8Array = (base64String: string) => {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
      const rawData = atob(base64)
      const outputArray = new Uint8Array(rawData.length)
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }
      return outputArray
    }

    let subscription = await swRegistration.pushManager.getSubscription()
    if (!subscription) {
      subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })
    }

    await fetch('/api/push-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        subscription: subscription.toJSON(),
      }),
    })
  } catch (e) {
    console.warn('Failed to subscribe to push:', e)
  }
}

async function unsubscribeFromPush() {
  if (!swRegistration) return
  try {
    const subscription = await swRegistration.pushManager.getSubscription()
    if (subscription) {
      await fetch('/api/push-unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      })
      await subscription.unsubscribe()
    }
  } catch (e) {
    console.warn('Failed to unsubscribe from push:', e)
  }
}

function showSystemNotification(title: string, body: string) {
  if (!('Notification' in window)) {
    console.warn('Notification API not available')
    return
  }

  const show = () => {
    if (swRegistration && swRegistration.active) {
      try {
        swRegistration.active.postMessage({ type: 'show-notification', title, body })
        return
      } catch (e) {
        console.warn('Failed to send notification via SW:', e)
      }
    }
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'show-notification', title, body })
      return
    }
    try {
      new Notification(title, { body, icon: '/logo_metaTitle.jpg', tag: 'new-order', requireInteraction: true })
    } catch (e) {
      console.warn('Failed to show notification:', e)
    }
  }

  if (Notification.permission === 'granted') {
    show()
  } else if (Notification.permission === 'default') {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        show()
      } else {
        console.warn('Notification permission denied by user')
      }
    })
  } else {
    console.warn('Notification permission denied. Enable notifications in browser settings.')
  }
}

function formatDate(iso: string, serverTime?: string) {
  const d = new Date(iso)
  const now = serverTime ? new Date(serverTime) : new Date()
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
  const [googleError, setGoogleError] = useState(false)
  const [googleCredential, setGoogleCredential] = useState<string | null>(null)
  const [requestSent, setRequestSent] = useState(false)
  const [requestLoading, setRequestLoading] = useState(false)
  const [pendingRequests, setPendingRequests] = useState(0)
  const [serverTime, setServerTime] = useState<string | undefined>(undefined)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingAll, setDeletingAll] = useState(false)
  const [pushStatus, setPushStatus] = useState<'loading' | 'subscribed' | 'denied' | 'unsupported' | 'error'>('loading')
  const [tick, setTick] = useState(0)
  const lastOrderCount = useRef(0)
  const initialFetchDone = useRef(false)

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
      setServerTime(res.headers.get('X-Server-Time') || undefined)
      const data = await res.json()
      if (Array.isArray(data)) {
        if (initialFetchDone.current && data.length > lastOrderCount.current) {
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
        initialFetchDone.current = true
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

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch('/api/orders-login/me')
      if (res.ok) {
        const data = await res.json()
        if (data.staff && (data.staff.role !== staff?.role || data.staff.email !== staff?.email)) {
          setStaff(data.staff)
        }
      }
    } catch {}
  }, [staff])

  const sanitySubRef = useRef<{ unsubscribe: () => void } | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const listenHeardRef = useRef(false)

  useEffect(() => {
    if (!staff) return

    const startPoll = () => {
      if (pollRef.current) return
      pollRef.current = setInterval(fetchOrders, 3000)
    }

    const stopPoll = () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }

    const setupPush = async () => {
      if (!('Notification' in window) || !('PushManager' in window) || !('serviceWorker' in navigator)) {
        setPushStatus('unsupported')
        return
      }
      if (Notification.permission === 'denied') {
        setPushStatus('denied')
        return
      }
      try {
        await requestNotificationPermission()
        if (Notification.permission !== 'granted') {
          setPushStatus('denied')
          return
        }
        if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
          setPushStatus('error')
          return
        }
        await subscribeToPush(staff.email)
        setPushStatus('subscribed')
      } catch {
        setPushStatus('error')
      }
    }

    setupPush()
    fetchOrders()
    if (staff.role === 'admin') fetchPendingRequests()

    const fallbackTimer = setTimeout(startPoll, 2000)

    const setupSanityListen = async () => {
      try {
        const mod = await import('next-sanity')
        const sanity = mod.createClient({
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
          apiVersion: '2024-01-01',
          useCdn: false,
        })

        const obs = sanity.listen('*[_type == "order"]')
        sanitySubRef.current = obs.subscribe({
          next: () => {
            listenHeardRef.current = true
            clearTimeout(fallbackTimer)
            stopPoll()
            fetchOrders()
          },
          error: () => {
            if (!listenHeardRef.current) startPoll()
          },
        })
      } catch {
        startPoll()
      }
    }

    setupSanityListen()

    const sessionInterval = setInterval(refreshSession, 30000)

    return () => {
      clearTimeout(fallbackTimer)
      stopPoll()
      if (sanitySubRef.current) {
        sanitySubRef.current.unsubscribe()
        sanitySubRef.current = null
      }
      clearInterval(sessionInterval)
      listenHeardRef.current = false
    }
  }, [staff, fetchOrders, fetchPendingRequests, refreshSession])

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

  useEffect(() => {
    const interval = setInterval(() => setTick(n => n + 1), 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const onShow = () => { if (document.visibilityState === 'visible') fetchOrders() }
    document.addEventListener('visibilitychange', onShow)
    return () => document.removeEventListener('visibilitychange', onShow)
  }, [fetchOrders])

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setGoogleError(false)
    setGoogleCredential(credentialResponse.credential)
    try {
      const res = await fetch('/api/orders-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleToken: credentialResponse.credential }),
      })
      if (res.ok) {
        const data = await res.json()
        setStaff(data.staff)
      } else {
        setGoogleError(true)
      }
    } catch {
      setGoogleError(true)
    }
  }

  const handleRequestAccess = async () => {
    if (!googleCredential) return
    setRequestLoading(true)
    try {
      const res = await fetch('/api/access-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleToken: googleCredential }),
      })
      if (res.ok) {
        setRequestSent(true)
      }
    } catch {}
    setRequestLoading(false)
  }

  const handleLogout = async () => {
    await unsubscribeFromPush()
    await fetch('/api/orders-login', { method: 'DELETE' })
    setStaff(null)
    setOrders([])
    lastOrderCount.current = 0
    initialFetchDone.current = false
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

  const handleDeleteAll = async () => {
    setDeletingAll(true)
    try {
      const res = await fetch('/api/orders', { method: 'DELETE' })
      if (res.ok) {
        setOrders([])
        lastOrderCount.current = 0
      }
    } catch {}
    setDeletingAll(false)
    setShowDeleteConfirm(false)
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

        <div className="w-full max-w-sm space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-display text-foreground">تسجيل الدخول</h2>
            <p className="text-muted-foreground text-sm">سجل الدخول بحساب Google المصرح به</p>
          </div>

          <div className="flex justify-center overflow-hidden">
            <div className="scale-[0.85] sm:scale-100 origin-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setGoogleError(true)}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                width={320}
              />
            </div>
          </div>

          {googleError && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-center">
              <p className="text-destructive text-sm">
                ليس لديك صلاحية الدخول
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                أرسل طلب وصول إلى المدير للحصول على الصلاحية
              </p>
              {requestSent ? (
                <div className="mt-3 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm font-medium">✓ تم إرسال طلب الوصول</p>
                  <p className="text-muted-foreground text-xs mt-1">سيتم مراجعة طلبك من قبل المدير</p>
                </div>
              ) : (
                <button
                  onClick={handleRequestAccess}
                  disabled={requestLoading}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {requestLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  طلب صلاحية الدخول
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                {hasNewOrder && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full animate-ping" />
                )}
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-display text-primary">لوحة الطلبات</h1>
                <p className="text-muted-foreground text-[10px] sm:text-sm">elsaly birket elsaba</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 sm:p-2 rounded-lg border border-border hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md border text-[10px] sm:text-xs ${ROLE_COLORS[staff.role] || ''}`}>
              <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              {ROLE_LABELS[staff.role] || staff.role}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md border border-border text-muted-foreground bg-secondary/30 text-[10px] sm:text-xs max-w-[140px] sm:max-w-none truncate">
              <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
              <span dir="ltr" className="truncate">{staff.email}</span>
            </span>
            <div className="flex gap-1 sm:gap-2 mr-auto">
              <div className="bg-secondary/50 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-center">
                <p className="text-warning font-bold text-sm sm:text-lg">{pendingOrders}</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">قيد الانتظار</p>
              </div>
              <div className="bg-secondary/50 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-center">
                <p className="text-primary font-bold text-sm sm:text-lg">{confirmedOrders}</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">مؤكد</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {(staff.role === 'manager' || staff.role === 'admin') && orders.length > 0 && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 sm:p-2 rounded-lg border border-destructive/30 hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-colors cursor-pointer"
                title="حذف جميع الطلبات"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </button>
            )}
            {(staff.role === 'admin' || staff.role === 'manager') && (
              <a
                href="/staff/manage"
                className="relative p-1.5 sm:p-2 rounded-lg border border-border hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                title="إدارة فريق العمل"
              >
                <Shield className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                {staff.role === 'admin' && pendingRequests > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-destructive text-destructive-foreground text-[8px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
                    {pendingRequests}
                  </span>
                )}
              </a>
            )}
            <button
              onClick={() => {
                if (pushStatus !== 'subscribed' && staff) {
                  setPushStatus('loading')
                  requestNotificationPermission().then(() => {
                    if (staff) subscribeToPush(staff.email).then(() => setPushStatus('subscribed')).catch(() => setPushStatus('error'))
                  }).catch(() => setPushStatus('error'))
                }
              }}
              className={`p-1.5 sm:p-2 rounded-lg border transition-colors cursor-pointer ${
                pushStatus === 'subscribed'
                  ? 'border-green-500/50 bg-green-500/10 text-green-400'
                  : pushStatus === 'denied'
                  ? 'border-destructive/30 bg-destructive/10 text-destructive'
                  : pushStatus === 'error'
                  ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                  : 'border-border hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
              }`}
              title={
                pushStatus === 'subscribed' ? 'الإشعارات مفعلة' :
                pushStatus === 'denied' ? 'الإشعارات محظورة' :
                pushStatus === 'unsupported' ? 'المتصفح لا يدعم' :
                pushStatus === 'error' ? 'فشل التفعيل - اضغط لإعادة المحاولة' :
                'جاري التفعيل...'
              }
            >
              {pushStatus === 'loading' ? (
                <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Bell className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              )}
            </button>
            <button
              onClick={fetchOrders}
              className="p-1.5 sm:p-2 rounded-lg border border-border hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="تحديث"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
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
          <>
            {/* Desktop table view */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    <th className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-[10px] sm:text-sm font-medium text-muted-foreground">#</th>
                    <th className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-[10px] sm:text-sm font-medium text-muted-foreground">التاريخ</th>
                    <th className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-[10px] sm:text-sm font-medium text-muted-foreground">الفرع</th>
                    <th className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-[10px] sm:text-sm font-medium text-muted-foreground">النوع</th>
                    <th className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-[10px] sm:text-sm font-medium text-muted-foreground">العميل</th>
                    <th className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-[10px] sm:text-sm font-medium text-muted-foreground">التواصل</th>
                    <th className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-[10px] sm:text-sm font-medium text-muted-foreground">الأصناف</th>
                    <th className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-[10px] sm:text-sm font-medium text-muted-foreground">الإجمالي</th>
                    <th className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-[10px] sm:text-sm font-medium text-muted-foreground">الحالة</th>
                    <th className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-[10px] sm:text-sm font-medium text-muted-foreground">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => {
                    const OrderTypeIcon = ORDER_TYPE_ICONS[order.orderType] || ShoppingBag
                    const isExpanded = expandedOrder === order.id
                    return (
                      <tr key={order.id} className={`border-b border-border/50 transition-colors ${
                        order.status === 'confirmed' ? 'bg-green-950/40 hover:bg-green-950/60' : !order.viewed ? 'bg-primary/5 hover:bg-secondary/30' : 'hover:bg-secondary/30'
                      }`}>
                        <td className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground">
                          <div className="flex items-center gap-1 sm:gap-2">
                            {!order.viewed && <Eye className="w-2 h-2 sm:w-3 sm:h-3 text-primary" />}
                            <span className="text-[11px] sm:text-sm">{idx + 1}</span>
                          </div>
                        </td>
                        <td className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-foreground whitespace-nowrap">
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-muted-foreground shrink-0" />
                            <span className="text-[10px] sm:text-sm">{formatDate(order.createdAt, serverTime)}</span>
                          </div>
                        </td>
                        <td className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-foreground">
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-primary shrink-0" />
                            <span className="truncate max-w-[60px] sm:max-w-none">{order.branch}</span>
                          </div>
                        </td>
                        <td className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3">
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <OrderTypeIcon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-primary shrink-0" />
                            <span className="text-[11px] sm:text-sm text-foreground">{order.orderType}</span>
                          </div>
                        </td>
                        <td className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-foreground">
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <User className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-muted-foreground shrink-0" />
                            <span className="truncate max-w-[50px] sm:max-w-none">{order.customerName || '—'}</span>
                          </div>
                        </td>
                        <td className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-[11px] sm:text-sm text-foreground">
                          {order.customerPhone ? (
                            <a href={`tel:${order.customerPhone}`} className="flex items-center gap-1 sm:gap-1.5 hover:text-primary transition-colors">
                              <Phone className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-muted-foreground shrink-0" />
                              <span className="text-[10px] sm:text-sm" dir="ltr">{order.customerPhone}</span>
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3">
                          <button
                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                            className="flex items-center gap-1 sm:gap-1.5 text-primary hover:text-primary/80 transition-colors cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" /> : <ChevronDown className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}
                            <span className="text-[11px] sm:text-sm">{order.items.length} صنف</span>
                          </button>
                          {isExpanded && (
                            <div className="mt-1 sm:mt-2 bg-secondary/30 rounded-lg p-1.5 sm:p-2 space-y-0.5 sm:space-y-1">
                              {order.items.map((item) => (
                                <div key={item.id} className="text-[10px] sm:text-xs text-foreground flex justify-between gap-2 sm:gap-4">
                                  <span>{item.name}</span>
                                  <span className="text-muted-foreground whitespace-nowrap">{item.quantity} × {item.price} ج</span>
                                </div>
                              ))}
                              {order.customerAddress && (
                                <div className="text-[10px] sm:text-xs text-muted-foreground pt-0.5 sm:pt-1 border-t border-border/50 mt-0.5 sm:mt-1">
                                  <span>العنوان: {order.customerAddress}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 text-[11px] sm:text-sm font-bold text-primary whitespace-nowrap">{order.totalPrice} جنيه</td>
                        <td className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3">
                          <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-medium ${
                            order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}>
                            {order.status === 'pending' ? <AlertTriangle className="w-2 h-2 sm:w-3 sm:h-3" /> : <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3" />}
                            {order.status === 'pending' ? 'بانتظار التأكيد' : 'مؤكد'}
                          </span>
                        </td>
                        <td className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              className="px-1.5 sm:px-3 py-1 sm:py-1.5 bg-green-500/20 text-green-400 rounded text-[9px] sm:text-xs hover:bg-green-500/30 transition-colors cursor-pointer border border-green-500/30 font-medium whitespace-nowrap"
                            >
                             تأكيد
                            </button>
                          )}
                          {order.status === 'confirmed' && (
                            <span className="text-green-500/60 text-[10px] sm:text-xs">✓</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="block md:hidden space-y-2">
              {orders.map((order, idx) => {
                const OrderTypeIcon = ORDER_TYPE_ICONS[order.orderType] || ShoppingBag
                const isExpanded = expandedOrder === order.id
                return (
                  <div key={order.id} className={`rounded-lg border border-border p-2 ${
                    order.status === 'confirmed' ? 'bg-green-950/40' : !order.viewed ? 'bg-primary/5' : 'bg-secondary/10'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {!order.viewed && <Eye className="w-2.5 h-2.5 text-primary" />}
                        <span className="text-[11px] font-bold text-foreground">#{idx + 1}</span>
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-medium ${
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {order.status === 'pending' ? <AlertTriangle className="w-1.5 h-1.5" /> : <CheckCircle className="w-1.5 h-1.5" />}
                          {order.status === 'pending' ? 'بانتظار التأكيد' : 'مؤكد'}
                        </span>
                      </div>
                      <span className="text-[8px] text-muted-foreground">{formatDate(order.createdAt, serverTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-foreground mb-1 flex-wrap">
                      <span className="flex items-center gap-0.5"><MapPin className="w-2 h-2 text-primary" /> {order.branch}</span>
                      <OrderTypeIcon className="w-2 h-2 text-primary" />
                      <span>{order.orderType}</span>
                      <span className="flex items-center gap-0.5"><User className="w-2 h-2 text-muted-foreground" /> {order.customerName || '—'}</span>
                      {order.customerPhone && (
                        <a href={`tel:${order.customerPhone}`} className="flex items-center gap-0.5 hover:text-primary">
                          <Phone className="w-2 h-2 text-muted-foreground" /> {order.customerPhone}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border/50">
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                        <span className="text-[9px]">{order.items.length} صنف</span>
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-primary">{order.totalPrice} جنيه</span>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[9px] hover:bg-green-500/30 transition-colors cursor-pointer border border-green-500/30 font-medium"
                          >
                            تأكيد
                          </button>
                        )}
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-1 bg-secondary/30 rounded p-1.5 space-y-0.5">
                        {order.items.map((item) => (
                          <div key={item.id} className="text-[9px] text-foreground flex justify-between">
                            <span>{item.name}</span>
                            <span className="text-muted-foreground whitespace-nowrap">{item.quantity} × {item.price} ج</span>
                          </div>
                        ))}
                        {order.customerAddress && (
                          <div className="text-[9px] text-muted-foreground pt-0.5 border-t border-border/50 mt-0.5">
                            العنوان: {order.customerAddress}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Auto-refresh info */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          الأوردرات الجديدة تظهر تلقائياً في الوقت الحقيقي
        </p>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <h2 className="text-lg font-display text-foreground mb-2">حذف جميع الطلبات</h2>
              <p className="text-muted-foreground text-sm mb-6">
                هل أنت متأكد من حذف جميع الطلبات؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deletingAll}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-secondary/50 transition-colors text-sm font-medium cursor-pointer disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteAll}
                  disabled={deletingAll}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors text-sm font-medium cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deletingAll ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  حذف الكل
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
