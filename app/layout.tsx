import type { Metadata } from 'next'
import { Amiri, Cairo, Rakkas } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import { Toaster } from '@/components/ui/toaster'
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
const rakkas = Rakkas({
  subsets: ["arabic"],
  weight: "400",
  variable: '--font-display'
});

export const metadata: Metadata = {
  title: 'منيو الأصلي',
  description: 'اكتشف أشهى المشويات الشرقية في الأصلي. شيش طاووق، كباب، ريش، وأطباق مشوية بأجود المكونات.',
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
      <body className={`${amiri.variable} ${cairo.variable} ${rakkas.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
