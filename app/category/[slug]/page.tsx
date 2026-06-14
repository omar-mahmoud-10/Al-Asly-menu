import Link from "next/link"
import { Header } from "@/components/header"
import { getMenuItemsByCategory, getCategories } from "@/sanity/queries"
import { urlForImage } from "@/sanity/lib/image"
import { ArrowRight } from "lucide-react"
import { OrderButton } from "@/components/order-button"
import { DescriptionToggle } from "@/components/description-toggle"

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
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start gap-4 mb-8">
          <div className="flex-1 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-3"
            >
              <ArrowRight className="w-4 h-4" />
              العودة إلى الرئيسية
            </Link>
            <h1 className="font-display text-xl sm:text-2xl md:text-4xl lg:text-5xl text-foreground break-words">
              {category?.title || slug}
            </h1>
          </div>
          {categoryImage && (
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 border border-border bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <img
                src={categoryImage}
                alt={category?.title || slug}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg py-12">
            لا توجد عناصر في هذه الفئة
          </p>
        ) : (
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-border">
                  <th className="text-right py-2 px-2 sm:py-4 sm:px-4 lg:px-6 font-display text-sm sm:text-lg lg:text-xl text-foreground">الصنف</th>
                  <th className="text-right py-2 px-2 sm:py-4 sm:px-4 lg:px-6 font-display text-sm sm:text-lg lg:text-xl text-foreground">السعر</th>
                   <th className="text-center py-2 px-2 sm:py-4 sm:px-4 lg:px-6 font-display text-sm sm:text-lg lg:text-xl text-foreground">الطلب</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const grouped: Record<string, any[]> = {}
                  const ungrouped: any[] = []
                  for (const item of items) {
                    if (item.group) {
                      if (!grouped[item.group]) grouped[item.group] = []
                      grouped[item.group].push(item)
                    } else {
                      ungrouped.push(item)
                    }
                  }
                  const rows: any[] = []
                  let rowIndex = 0
                  const totalRows = ungrouped.length + Object.keys(grouped).length

                  for (const item of ungrouped) {
                    const isLast = rowIndex === totalRows - 1
                    const hasPriceOptions = item.priceOptions && item.priceOptions.length > 0
                    rows.push(
                      <tr key={item._id} className={`border-b border-border transition-colors hover:bg-white/5 ${isLast ? 'border-b-0' : ''}`}>
                        <td className="py-3 px-2 sm:py-5 sm:px-4 lg:px-6">
                          <span className="font-sans text-sm sm:text-lg text-foreground">{item.name}</span>
                          {item.description && (
                            <DescriptionToggle description={item.description} />
                          )}
                        </td>
                        {hasPriceOptions ? (
                          <td colSpan={2} className="py-3 px-2 sm:py-5 sm:px-4 lg:px-6 text-center">
                            <OrderButton itemName={item.name} itemPrice={item.price} variant="table" priceOptions={item.priceOptions} />
                          </td>
                        ) : (
                          <>
                            <td className="py-3 px-2 sm:py-5 sm:px-4 lg:px-6">
                              <span className="font-display text-sm sm:text-lg lg:text-xl text-primary">{item.price} جنيه</span>
                            </td>
                            <td className="py-3 px-2 sm:py-5 sm:px-4 lg:px-6 text-center">
                              <OrderButton itemName={item.name} itemPrice={item.price} variant="table" />
                            </td>
                          </>
                        )}
                      </tr>
                    )
                    rowIndex++
                  }

                  for (const [groupName, groupItems] of Object.entries(grouped)) {
                    rows.push(
                      <tr key={`group-${groupName}`} className="bg-primary/5 border-b border-border">
                        <td colSpan={3} className="py-2 px-2 sm:py-3 sm:px-4 lg:px-6">
                          <span className="font-display text-sm sm:text-lg text-primary">{groupName}</span>
                        </td>
                      </tr>
                    )
                    rowIndex++
                    for (const item of groupItems) {
                      const isLast = rowIndex >= totalRows - 1
                      const hasPriceOptions = item.priceOptions && item.priceOptions.length > 0
                      rows.push(
                        <tr key={item._id} className={`border-b border-border transition-colors hover:bg-white/5 ${isLast ? 'border-b-0' : ''}`}>
                          <td className="py-3 px-2 sm:py-5 sm:px-4 lg:px-6">
                            <span className="font-sans text-sm sm:text-lg text-foreground">{item.name}</span>
                            {item.description && (
                              <DescriptionToggle description={item.description} />
                            )}
                          </td>
                          {hasPriceOptions ? (
                            <td colSpan={2} className="py-3 px-2 sm:py-5 sm:px-4 lg:px-6 text-center">
                              <OrderButton itemName={item.name} itemPrice={item.price} variant="table" priceOptions={item.priceOptions} />
                            </td>
                          ) : (
                            <>
                              <td className="py-3 px-2 sm:py-5 sm:px-4 lg:px-6">
                                <span className="font-display text-sm sm:text-lg lg:text-xl text-primary">{item.price} جنيه</span>
                              </td>
                              <td className="py-3 px-2 sm:py-5 sm:px-4 lg:px-6 text-center">
                                <OrderButton itemName={item.name} itemPrice={item.price} variant="table" />
                              </td>
                            </>
                          )}
                        </tr>
                      )
                      rowIndex++
                    }
                  }
                  return rows
                })()}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
