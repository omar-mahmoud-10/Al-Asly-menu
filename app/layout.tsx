import type { Metadata } from 'next'
import { Amiri, Cairo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: '--font-serif'
});
const cairo = Cairo({
  subsets: ["arabic"],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'محل مشويات حاتي الأصلي | مشويات شرقية أصيلة',
  description: 'اكتشف أشهى المشويات الشرقية في محل مشويات حاتي الأصلي. شيش طاووق، كباب، ريش، وأطباق مشوية بأجود المكونات.',
  generator: 'v0.app',
  icons: {
    icon: '/logo_metaTitle.jpg',
    apple: '/logo_metaTitle.jpg',
  },
  openGraph: {
    images: ['/logo_metaTitle.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${amiri.variable} ${cairo.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
