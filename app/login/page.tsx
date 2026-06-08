'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        const params = new URLSearchParams(window.location.search)
        router.push(params.get('from') || '/')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'كلمة المرور غير صحيحة')
      }
    } catch {
      setError('حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-display text-primary tracking-wide">الأصلى</h1>
        <p className="text-gold/70 text-sm mt-1">للمشويات</p>
        <p className="text-foreground/80 text-base font-bold mt-6 max-w-xs leading-relaxed">
          الموقع الإلكتروني للأصلي للمشويات متاح قريبا إن شاء الله
        </p>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-display text-foreground">تسجيل الدخول</h2>
          <p className="text-muted-foreground text-sm">يرجى إدخال كلمة المرور</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة المرور"
          autoFocus
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg"
        />
        {error && <p className="text-destructive text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-primary hover:bg-primary/80 text-primary-foreground h-12 rounded-lg text-base font-medium disabled:opacity-50 cursor-pointer"
        >
          {loading ? '...جارٍ التحقق' : 'دخول'}
        </button>
      </form>
    </div>
  )
}
