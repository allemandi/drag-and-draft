"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface EditableTextProps {
  value: string
  onChange: (newValue: string) => void
  className?: string
  inputClassName?: string
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "label"
  ariaLabel?: string
}

export function EditableText({
  value,
  onChange,
  className,
  inputClassName,
  as: Component = "span",
  ariaLabel,
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

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setIsEditing(true)
    }
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel || (value ? `Editing ${value}` : "Edit text")}
        className={cn(
          "h-auto py-0 px-1 min-w-[50px] inline-block font-inherit text-inherit leading-inherit border-transparent bg-transparent focus-visible:ring-offset-0 shadow-none",
          inputClassName
        )}
      />
    )
  }

  return (
    <Component
      onClick={() => setIsEditing(true)}
      onKeyDown={handleTextKeyDown}
      tabIndex={0}
      role="button"
      aria-label={ariaLabel || (value ? `Edit ${value}` : "Edit empty text")}
      className={cn(
        "cursor-pointer hover:bg-accent/20 rounded px-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-transparent",
        className
      )}
    >
      {value || <span className="text-muted-foreground italic">Empty</span>}
    </Component>
  )
}
