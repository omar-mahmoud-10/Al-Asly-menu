"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface DescriptionToggleProps {
  description: string
}

export function DescriptionToggle({ description }: DescriptionToggleProps) {
  const [showDescription, setShowDescription] = useState(false)

  return (
    <div className="mt-1">
      {showDescription ? (
        <>
          <p className="text-sm text-muted-foreground font-sans mb-2">{description}</p>
          <button
            onClick={() => setShowDescription(false)}
            className="inline-flex items-center gap-1 text-primary-foreground bg-primary/90 hover:bg-primary border border-primary/50 px-4 py-0.5 rounded-full transition-all cursor-pointer font-bold text-[11px] shadow-lg shadow-primary/25 whitespace-nowrap"
          >
            <ChevronUp className="w-3 h-3" />
            إخفاء المكونات
          </button>
        </>
      ) : (
        <button
          onClick={() => setShowDescription(true)}
          className="inline-flex items-center gap-1 text-primary-foreground bg-primary/90 hover:bg-primary border border-primary/50 px-4 py-0.5 rounded-full transition-all cursor-pointer font-bold text-[11px] shadow-lg shadow-primary/25 whitespace-nowrap"
        >
          <ChevronDown className="w-3 h-3" />
          اضغط لرؤية المكونات
        </button>
      )}
    </div>
  )
}
