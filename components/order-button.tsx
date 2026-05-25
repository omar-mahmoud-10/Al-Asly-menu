"use client"

import { Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

interface OrderButtonProps {
  itemName: string
  itemPrice: number
  variant?: "table" | "card"
}

export function OrderButton({ itemName, itemPrice, variant = "card" }: OrderButtonProps) {
  const { addItem } = useCart()
  const id = `${itemName}-${itemPrice}`

  const handleAdd = () => addItem(id, itemName, itemPrice)

  if (variant === "table") {
    return (
      <button
        onClick={handleAdd}
        className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-sans font-medium transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        أضف
      </button>
    )
  }

  return (
    <Button
      onClick={handleAdd}
      className="w-full bg-primary hover:bg-primary/80 text-primary-foreground gap-2 rounded-lg"
      size="sm"
    >
      <ShoppingCart className="w-4 h-4" />
      أضف إلى السلة
    </Button>
  )
}
