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
  title: 'سلسلة متاجر حلويات ياقوت | حلويات شرقية أصيلة',
  description: 'اكتشف أشهى الحلويات الشرقية في سلسلة متاجر حلويات ياقوت. بقلاوة، كنافة، بسبوسة، ومعمول بأجود المكونات.',
  generator: 'v0.app',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    images: ['/logo.jpg'],
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
