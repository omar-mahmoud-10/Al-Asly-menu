"use client"

import { useState } from "react"
import Image from "next/image"
import { MessageCircle } from "lucide-react"
import { urlForImage } from "@/sanity/lib/image"

interface Category {
  _id: string
  title: string
  slug: string
  image?: any
}

interface MenuItemData {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  image: any
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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(
                  activeCategory === category._id ? "" : category._id
                )}
                className={`font-display text-2xl sm:text-3xl py-6 px-6 rounded-xl text-center transition-all duration-300 border-2 cursor-pointer ${
                  activeCategory === category._id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        )}

        {activeCategory && activeCat && (
          <>
            {categoryImage && (
              <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={categoryImage}
                  alt={activeCat.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <h2 className="font-display text-4xl text-foreground mb-6 text-right">
              {activeCat.title}
            </h2>

            {filteredItems.length === 0 ? (
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
                    {filteredItems.map((item: any, idx: number) => (
                      <tr
                        key={item._id}
                        className={`border-b border-border transition-colors hover:bg-white/5 ${
                          idx === filteredItems.length - 1 ? "border-b-0" : ""
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
                          <a
                            href={`https://wa.me/201206170001?text=${encodeURIComponent(`أود أن أطلب: ${item.name} بسعر ${item.price} جنيه`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl text-base shadow-lg shadow-green-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105"
                          >
                            <MessageCircle className="w-5 h-5" />
                            اطلب الآن
                          </a>
                        </td>
                      </tr>
                    ))}
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
