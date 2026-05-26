import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { getMenuItemsByCategory, getCategories } from "@/sanity/queries"
import { urlForImage } from "@/sanity/lib/image"
import { ArrowRight } from "lucide-react"
import { OrderButton } from "@/components/order-button"

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((cat: { slug: string }) => ({ slug: cat.slug }))
}

export const dynamic = 'force-dynamic'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getMenuItemsByCategory(slug)
  const category = data?.category
  const items = data?.items ?? []
  const categoryImage = category?.image
    ? urlForImage(category.image)?.width(800).height(400).url()
    : null

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowRight className="w-5 h-5" />
          العودة إلى الرئيسية
        </Link>

        {categoryImage && (
          <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
            <Image
              src={categoryImage}
              alt={category?.title || slug}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-10 text-right">
          {category?.title || slug}
        </h1>

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg py-12">
            لا توجد عناصر في هذه الفئة
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-border">
                  <th className="text-right py-4 px-6 font-display text-xl text-foreground">الصنف</th>
                  <th className="text-right py-4 px-6 font-display text-xl text-foreground">السعر</th>
                  <th className="text-center py-4 px-6 font-display text-xl text-foreground w-48">الطلب</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, idx: number) => (
                  <tr
                    key={item._id}
                    className={`border-b border-border transition-colors hover:bg-white/5 ${
                      idx === items.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="py-5 px-6">
                      <span className="font-sans text-lg text-foreground">{item.name}</span>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1 font-sans">{item.description}</p>
                      )}
                    </td>
                    <td className="py-5 px-6">
                      <span className="font-display text-xl text-primary">{item.price} جنيه</span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <OrderButton itemName={item.name} itemPrice={item.price} variant="table" categoryTitle={category?.title} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
