'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import config from '../../../sanity/sanity.config'

const NextStudio = dynamic(() => import('next-sanity/studio').then((mod) => mod.NextStudio), {
  ssr: false,
})

export default function StudioPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    fetch('/api/orders-login')
      .then((res) => {
        if (res.ok) setAuthed(true)
        else router.push('/staff-login?redirect=/studio')
      })
      .catch(() => router.push('/staff-login?redirect=/studio'))
  }, [router])

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <NextStudio config={config} />
}
