'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function PwaRouter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true

    if (isStandalone && pathname === '/') {
      const saved = localStorage.getItem('pwa_last_page')
      if (saved && saved !== '/' && saved !== pathname) {
        window.location.replace(saved)
        return
      }
    }

    if (isStandalone || pathname !== '/favicon.ico') {
      localStorage.setItem('pwa_last_page', pathname)
    }
  }, [pathname])

  return <>{children}</>
}
