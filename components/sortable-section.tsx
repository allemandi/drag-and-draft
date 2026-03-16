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
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'opacity 100ms ease',
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 50 : 0,
    whiteSpace: 'pre-line',
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        className="absolute top-6 left-4 cursor-grab p-1.5 rounded-lg text-muted-foreground/50 transition-colors hover:bg-accent hover:text-foreground active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring z-10"
        {...attributes}
        {...listeners}
        data-drag-handle
        tabIndex={0}
        aria-label="Drag to reorder section"
        role="button"
        style={{ touchAction: "none" }}
      >
        <GripVertical className="h-5 w-5" />
      </div>
      {children}
    </div>
  )
}
