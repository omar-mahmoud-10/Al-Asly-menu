"use client"

import { useState } from "react"
import { MenuItem } from "./menu-item"
import { Button } from "@/components/ui/button"
import { urlForImage } from "@/sanity/lib/image"

interface Category {
  _id: string
  title: string
  slug: string
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

  const filteredItems = activeCategory === ""
    ? items
    : items.filter(item => item.category?._id === activeCategory)

  return (
    <section id="menu" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">
            اكتشف نكهاتنا
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            قائمة الحلويات
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            كل قطعة حلوى تحكي قصة من التراث، مصنوعة بوصفات أصيلة 
            توارثناها عبر الأجيال.
          </p>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <Button
              variant={activeCategory === "" ? "default" : "outline"}
              onClick={() => setActiveCategory("")}
              className={activeCategory === ""
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border-border text-foreground hover:bg-secondary"
              }
            >
              الكل
            </Button>
            {categories.map((category) => (
              <Button
                key={category._id}
                variant={activeCategory === category._id ? "default" : "outline"}
                onClick={() => setActiveCategory(category._id)}
                className={activeCategory === category._id
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-border text-foreground hover:bg-secondary"
                }
              >
                {category.title}
              </Button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuItem
              key={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={urlForImage(item.image)?.width(400).height(300).url()}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
