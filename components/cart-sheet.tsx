"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/lib/cart-context"
import { Badge } from "@/components/ui/badge"

const branches = [
  { name: "فرع موقف مصر", phone: "201206170001" },
  { name: "فرع موقف شبين", phone: "201061465200" },
]

export function CartSheet() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart, cartOpen, closeCart } = useCart()
  const [showBranchDialog, setShowBranchDialog] = useState(false)

  const buildMessage = (branchName: string) => {
    const lines = items.map(
      (item, i) => `${i + 1}- ${item.name} × ${item.quantity} = ${item.price * item.quantity} جنيه`
    )
    const total = `الإجمالي: ${totalPrice} جنيه`
    return `طلب من ${branchName}\n\n${lines.join("\n")}\n\n${total}`
  }

  const handleSendOrder = (phone: string, branchName: string) => {
    const message = buildMessage(branchName)
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank")
    setShowBranchDialog(false)
    closeCart()
    clearCart()
  }

  return (
    <>
      <Sheet open={cartOpen} onOpenChange={(o) => !o && closeCart()}>
        <SheetTrigger asChild>
          <button className="relative w-12 h-12 rounded-full border-2 border-[#2B0003]/30 flex items-center justify-center text-[#2B0003] hover:bg-[#2B0003] hover:text-white transition-all duration-300 cursor-pointer">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
                {totalItems}
              </Badge>
            )}
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md bg-background border-border">
          <SheetHeader>
            <SheetTitle className="font-display text-2xl text-foreground text-right">سلة الطلبات</SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">السلة فارغة</p>
              <p className="text-sm">أضف أصنافاً لبدء الطلب</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-border">
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-foreground font-medium truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.price} جنيه</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-sans text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="font-sans text-foreground">الإجمالي</span>
                  <span className="font-display text-xl text-primary">{totalPrice} جنيه</span>
                </div>
                <Button
                  onClick={() => setShowBranchDialog(true)}
                  className="w-full bg-primary hover:bg-primary/80 text-primary-foreground gap-2 h-12 text-base rounded-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  إرسال الطلب إلى المطعم
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={showBranchDialog} onOpenChange={setShowBranchDialog}>
        <DialogContent dir="rtl" className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-2xl">اختر الفرع المطلوب</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            {branches.map((branch) => (
              <Button
                key={branch.phone}
                onClick={() => handleSendOrder(branch.phone, branch.name)}
                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground h-12 text-base rounded-lg"
              >
                {branch.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
