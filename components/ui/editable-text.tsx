"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Pencil } from "lucide-react"

interface EditableTextProps {
  value: string
  onChange: (newValue: string) => void
  className?: string
  inputClassName?: string
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "label"
  ariaLabel?: string
  showEditIcon?: boolean
}

export function EditableText({
  value,
  onChange,
  className,
  inputClassName,
  as: Component = "span",
  ariaLabel,
  showEditIcon = true,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTempValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleBlur = () => {
    setIsEditing(false)
    if (tempValue !== value) {
      onChange(tempValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur()
    } else if (e.key === "Escape") {
      setTempValue(value)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 max-w-full">
        <Input
          ref={inputRef}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          aria-label={ariaLabel || (value ? `Editing ${value}` : "Edit text")}
          className={cn(
            "h-auto py-1 px-2 min-w-[50px] inline-block font-inherit text-inherit leading-inherit border-primary/40 bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm",
            inputClassName
          )}
        />
        {showEditIcon && <Pencil className="h-3 w-3 text-primary flex-shrink-0 animate-pulse" />}
      </div>
    )
  }

  return (
    <div className="group flex items-center gap-2 max-w-full">
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        aria-label={ariaLabel || (value ? `Edit ${value}` : "Edit empty text")}
        className={cn(
          "text-left cursor-pointer hover:bg-accent/20 rounded px-2 py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border border-primary/10 hover:border-primary/30 min-w-[40px] truncate outline-none",
          className
        )}
      >
        <Component className="inline">
          {value || <span className="text-muted-foreground italic text-xs">Empty</span>}
        </Component>
      </button>
      {showEditIcon && (
        <Pencil className="h-3 w-3 text-primary/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity flex-shrink-0" />
      )}
    </div>
  )
}
