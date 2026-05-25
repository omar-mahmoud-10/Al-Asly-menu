"use client"

import { useState } from "react"
import { Plus, ShoppingCart, Check, MessageCircle, Utensils, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/lib/cart-context"

const branches = [
  { name: "فرع موقف مصر", phone: "201206170001" },
  { name: "فرع موقف شبين", phone: "201061465200" },
]

const orderTypeOptions: Record<string, { id: string; name: string; icon: any }[]> = {
  "فرع موقف مصر": [
    { id: "takeaway", name: "تيك أواي", icon: Package },
    { id: "dinein", name: "صالة", icon: Utensils },
  ],
  "فرع موقف شبين": [
    { id: "takeaway", name: "تيك أواي", icon: Package },
  ],
}

interface OrderButtonProps {
  itemName: string
  itemPrice: number
  variant?: "table" | "card"
}

export function OrderButton({ itemName, itemPrice, variant = "card" }: OrderButtonProps) {
  const { items, addItem, clearCart } = useCart()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showBranch, setShowBranch] = useState(false)
  const [showOrderType, setShowOrderType] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<{ name: string; phone: string } | null>(null)
  const id = `${itemName}-${itemPrice}`

  const handleAdd = () => {
    addItem(id, itemName, itemPrice)
    setShowSuccess(true)
  }

  const handleBranchSelect = (branch: { name: string; phone: string }) => {
    setSelectedBranch(branch)
    setShowBranch(false)
    setShowOrderType(true)
  }

  const handleSendOrder = (orderType: string) => {
    if (!selectedBranch) return
    const allItems = items.length > 0
      ? items.map((item, i) => `${i + 1}- ${item.name} × ${item.quantity} = ${item.price * item.quantity} جنيه`).join("\n")
      : `1- ${itemName} × 1 = ${itemPrice} جنيه`
    const total = items.length > 0
      ? items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      : itemPrice
    const message = `طلب من ${selectedBranch.name} - ${orderType}\n\n${allItems}\n\nالإجمالي: ${total} جنيه`
    window.open(`https://wa.me/${selectedBranch.phone}?text=${encodeURIComponent(message)}`, "_blank")
    setShowOrderType(false)
    setShowSuccess(false)
    setSelectedBranch(null)
    clearCart()
  }

  const button = variant === "table" ? (
    <button
      onClick={handleAdd}
      className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-sans font-medium transition-colors cursor-pointer"
    >
      <Plus className="w-4 h-4" />
      أضف
    </button>
  ) : (
    <Button
      onClick={handleAdd}
      className="w-full bg-primary hover:bg-primary/80 text-primary-foreground gap-2 rounded-lg"
      size="sm"
    >
      <ShoppingCart className="w-4 h-4" />
      أضف إلى السلة
    </Button>
  )

  return (
    <>
      {button}

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent dir="rtl" className="sm:max-w-[380px]">
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="font-display text-2xl text-foreground mb-1">
              تمت الإضافة بنجاح ✓
            </DialogTitle>
            <p className="text-muted-foreground text-sm mb-6">{itemName}</p>
            <div className="flex flex-col gap-3 w-full">
              <Button
                onClick={() => { setShowSuccess(false); setShowBranch(true) }}
                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground gap-2 h-12 text-base rounded-lg"
              >
                <MessageCircle className="w-5 h-5" />
                إرسال الطلب إلى المطعم
              </Button>
              <Button
                onClick={() => setShowSuccess(false)}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground h-12 text-base rounded-lg"
              >
                أضف المزيد
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBranch} onOpenChange={setShowBranch}>
        <DialogContent dir="rtl" className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-2xl">اختر الفرع المطلوب</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            {branches.map((branch) => (
              <Button
                key={branch.phone}
                onClick={() => handleBranchSelect(branch)}
                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground h-12 text-base rounded-lg"
              >
                {branch.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showOrderType} onOpenChange={(o) => { setShowOrderType(o); if (!o) setSelectedBranch(null) }}>
        <DialogContent dir="rtl" className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-2xl">اختر نوع الطلب</DialogTitle>
            {selectedBranch && (
              <p className="text-center text-muted-foreground text-sm mt-1">{selectedBranch.name}</p>
            )}
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            {(selectedBranch ? orderTypeOptions[selectedBranch.name] : []).map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.id}
                  onClick={() => handleSendOrder(type.name)}
                  className="w-full bg-primary hover:bg-primary/80 text-primary-foreground h-14 text-base rounded-lg gap-3"
                >
                  <Icon className="w-5 h-5" />
                  {type.name}
                </Button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
