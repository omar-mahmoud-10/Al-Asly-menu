import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-display text-foreground mb-2">غير مصرح</h1>
        <p className="text-muted-foreground mb-6">
          عذراً، ليس لديك صلاحية الوصول إلى هذه الصفحة. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع المدير.
        </p>
        <Link
          href="/orderselaslybirketelsaba"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-3 rounded-lg text-base font-medium transition-colors"
        >
          تسجيل الدخول بحساب مختلف
        </Link>
      </div>
    </div>
  )
}
