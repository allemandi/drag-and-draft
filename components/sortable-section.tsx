"use client"

import type React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

interface SortableSectionProps {
  id: string
  children: React.ReactNode
}

export function SortableSection({ id, children }: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id,
    data: {
      type: "section",
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: 'opacity 100ms ease',
    opacity: isDragging ? 0.6 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 50 : 0,
    whiteSpace: 'pre-line',
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        className="absolute top-[18px] sm:top-[22px] left-2.5 sm:left-3.5 cursor-grab p-1 rounded text-muted-foreground/30 transition-colors hover:bg-accent hover:text-foreground active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring z-10"
        {...attributes}
        {...listeners}
        data-drag-handle
        tabIndex={0}
        aria-label="Drag to reorder section"
        aria-roledescription="sortable"
        role="button"
        style={{ touchAction: "none" }}
      >
        <GripVertical className="h-4 w-4" />
        <span className="sr-only">Use arrow keys to reorder when focused</span>
      </div>
      {children}
    </div>
  )
}
