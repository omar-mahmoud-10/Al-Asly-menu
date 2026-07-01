"use client"

import { useState, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { urlForImage } from "@/sanity/lib/image"
import { OrderButton } from "@/components/order-button"
import { DescriptionToggle } from "@/components/description-toggle"

interface Category {
  _id: string
  title: string
  slug: string
  image?: any
}

interface PriceOption {
  label: string
  price: number
}

interface MenuItemData {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  image: any
  group?: string
  priceOptions?: PriceOption[]
  category: {
    _id: string
    title: string
    slug: string
  }
}

interface MenuSectionProps {
  items: MenuItemData[]
  categories: Category[]
}

export function MenuSection({ items, categories }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState("")

  const activeCat = categories.find((c) => c._id === activeCategory)
  const filteredItems = activeCategory === ""
    ? []
    : items.filter(item => item.category?._id === activeCategory)

  const categoryImage = activeCat?.image
    ? urlForImage(activeCat.image)?.width(800).height(400).url()
    : null

  return (
    <section className={`px-4 sm:px-6 lg:px-8 bg-background min-h-screen overflow-x-hidden ${activeCategory ? 'pt-4 pb-16' : 'py-6'}`}>
      <div className="max-w-4xl mx-auto">
        {!activeCategory && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => { setActiveCategory(category._id); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                className="font-display text-2xl sm:text-3xl py-6 px-6 rounded-xl text-center transition-all duration-300 border-2 border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary cursor-pointer"
              >
                {category.title}
              </button>
            ))}
          </div>
        )}

        {activeCategory && activeCat && (
          <>
            <button
              onClick={() => { setActiveCategory(""); window.scrollTo({ top: 0, behavior: "smooth" }) }}
              className="inline-flex items-center gap-2 text-primary-foreground bg-primary/90 hover:bg-primary border border-primary/50 px-5 py-2.5 rounded-full transition-all mb-6 cursor-pointer font-medium text-sm shadow-lg shadow-primary/25"
            >
              <ArrowRight className="w-4 h-4" />
              العودة إلى الأقسام
            </button>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-xl sm:text-2xl lg:text-4xl text-foreground break-words">
                  {activeCat.title}
                </h2>
              </div>
              {categoryImage && (
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 border border-border bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <img
                    src={categoryImage}
                    alt={activeCat.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            {filteredItems.length === 0 ? (
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
                      for (const item of filteredItems) {
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
                        const isLastGroup = rowIndex + groupItems.length - 1 >= totalRows - 1
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
          </>
        )}
      </div>
    </section>
  )
}
