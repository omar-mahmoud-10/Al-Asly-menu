"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"

interface MenuItemProps {
  name: string
  description: string
  price: number
  image?: string
}

export function MenuItem({ name, description, price, image }: MenuItemProps) {
  return (
    <Card className="group overflow-hidden bg-card border-border hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 sm:h-56 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <span className="text-muted-foreground">لا توجد صورة</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-serif text-xl font-semibold text-foreground">{name}</h3>
          <span className="font-serif text-xl font-bold text-primary whitespace-nowrap">
            {price} جنيه
          </span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </Card>
  )
}
