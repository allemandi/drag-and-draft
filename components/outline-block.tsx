"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditableText } from "@/components/ui/editable-text"
import type { OutlineBlock as OutlineBlockType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface OutlineBlockProps {
  block: OutlineBlockType
  onChange: (newContent: string) => void
  onLabelChange: (newLabel: string) => void
  onResetLabel: () => void
  onRemoveBlock: () => void
  showRemoveButton: boolean
}

export function OutlineBlock({
  block,
  onChange,
  onLabelChange,
  onResetLabel,
  onRemoveBlock,
  showRemoveButton,
}: OutlineBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [isEditing])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    // Auto-resize textarea
    e.target.style.height = "auto"
    e.target.style.height = `${e.target.scrollHeight}px`
    onChange(newContent)
  }

  const getBlockStyles = (type: string, hasContent: boolean) => {
    const base = "w-full min-h-[80px] p-3 rounded-lg transition-all duration-200 border border-transparent shadow-sm"
    switch (type) {
      case "intro":
        return cn(base, hasContent ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30" : "bg-muted/30 hover:bg-muted/50")
      case "body":
        return cn(base, hasContent ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30" : "bg-muted/30 hover:bg-muted/50")
      case "conclusion":
        return cn(base, hasContent ? "bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30" : "bg-muted/30 hover:bg-muted/50")
      default:
        return cn(base, "bg-muted/30 hover:bg-muted/50")
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-xl border border-border bg-card p-4 transition-all duration-200",
        isDragging ? "z-50 shadow-xl scale-[1.02]" : "shadow-sm hover:shadow-md"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="mt-1 flex-shrink-0 cursor-grab rounded p-1.5 text-muted-foreground/50 transition-colors hover:bg-accent hover:text-foreground active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          style={{ touchAction: 'none' }}
          tabIndex={0}
          role="button"
          aria-label="Drag to reorder block"
          data-drag-handle
        >
          <GripVertical className="h-5 w-5" />
        </div>

        <div className="flex-grow space-y-3">
          <div className="flex items-center justify-between">
            <EditableText
              value={block.label}
              onChange={onLabelChange}
              as="label"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              inputClassName="text-xs font-semibold uppercase tracking-wider h-6 w-auto"
            />

            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                onClick={onResetLabel}
                className="h-7 w-7 text-muted-foreground hover:text-primary"
                title="Reset Label"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
              {showRemoveButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRemoveBlock}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  title="Remove Block"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="w-full" onClick={() => setIsEditing(true)}>
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={block.content}
                onChange={handleContentChange}
                onBlur={() => setIsEditing(false)}
                className={cn(
                  getBlockStyles(block.type, true),
                  "focus:outline-none focus:ring-2 focus:ring-ring resize-none overflow-hidden"
                )}
                placeholder={block.placeholder}
              />
            ) : (
              <div
                className={cn(getBlockStyles(block.type, !!block.content), "cursor-text focus-visible:ring-2 focus-visible:ring-ring outline-none")}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsEditing(true);
                  }
                }}
                role="button"
                aria-label="Edit content"
              >
                {block.content ? (
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                    {block.content}
                  </p>
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    {block.placeholder.split('\n')[0]}...
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
