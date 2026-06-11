'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, AlertTriangle, Mail } from 'lucide-react'

export default function StaffLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/orders-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (res.ok) {
        router.push('/orderselaslybirketelsaba')
      } else {
        const data = await res.json()
        setError(data.error || 'فشل تسجيل الدخول')
      }
    } catch {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-display text-primary tracking-wide">لوحة الطلبات</h1>
        <p className="text-foreground/60 text-sm mt-2">elsaly birket elsaba</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-display text-foreground">تسجيل الدخول</h2>
          <p className="text-muted-foreground text-sm">يرجى إدخال البريد الإلكتروني المصرح به</p>
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError('') }}
          placeholder="البريد الإلكتروني"
          autoFocus
          dir="ltr"
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg"
        />

        {error && (
          <p className="text-destructive text-sm text-center flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!email || loading}
          className="w-full bg-primary hover:bg-primary/80 text-primary-foreground h-12 rounded-lg text-base font-medium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            'دخول'
          )}
        </button>
      </form>
    </div>
  )
}
