import Image from "next/image"
import { Card } from "@/components/ui/card"
import { OrderButton } from "@/components/order-button"

interface MenuItemProps {
  name: string
  description: string
  price: number
  image?: string
}

export function MenuItem({ name, description, price, image }: MenuItemProps) {
  return (
    <Card className="group overflow-hidden bg-white/5 backdrop-blur-sm border-border hover:shadow-lg hover:border-primary/30 hover:bg-white/10 transition-all duration-300 flex flex-col h-full rounded-xl">
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
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-display text-xl text-foreground">{name}</h3>
          <span className="font-display text-xl text-primary whitespace-nowrap">
            {price} جنيه
          </span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow font-sans">{description}</p>
        <OrderButton itemName={name} itemPrice={price} />
      </div>
    </Card>
  )
}
