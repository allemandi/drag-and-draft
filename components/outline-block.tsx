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
    e.target.style.height = "auto"
    e.target.style.height = `${e.target.scrollHeight}px`
    onChange(newContent)
  }

  const getBlockStyles = (type: string, hasContent: boolean) => {
    const base = "w-full min-h-[50px] p-4 rounded-xl transition-all duration-300 border-2"
    if (!hasContent) return cn(base, "bg-muted/10 border-transparent hover:bg-muted/20 hover:border-muted/30")

    switch (type) {
      case "intro":
        return cn(base, "bg-background/50 border-border/80 hover:bg-background/70")
      case "body":
        return cn(base, "bg-background/50 border-border/80 hover:bg-background/70")
      case "conclusion":
        return cn(base, "bg-background/50 border-border/80 hover:bg-background/70")
      default:
        return cn(base, "bg-muted/10 border-border hover:bg-muted/20")
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-2xl border-2 border-border/60 bg-card p-4 transition-all duration-300",
        isDragging ? "z-50 shadow-xl scale-[1.02] border-primary/20" : "shadow-soft hover:shadow-md hover:border-border"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          {...attributes}
          {...listeners}
          className="mt-0.5 flex-shrink-0 cursor-grab rounded p-1 text-muted-foreground/30 transition-colors hover:bg-accent/50 hover:text-foreground active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ touchAction: 'none' }}
          tabIndex={0}
          role="button"
          aria-label="Drag to reorder block"
          aria-roledescription="sortable"
          data-drag-handle
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <div className="flex-grow space-y-3">
          <div className="flex items-center justify-between">
            <EditableText
              value={block.label}
              onChange={onLabelChange}
              as="label"
              ariaLabel={`Block label: ${block.label}`}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground/80"
              inputClassName="text-[10px] font-black uppercase tracking-[0.2em] h-5 w-full"
            />

            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                onClick={onResetLabel}
                className="h-6 w-6 text-muted-foreground/40 hover:text-primary hover:bg-primary/5"
                title="Reset Label"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              {showRemoveButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRemoveBlock}
                  className="h-6 w-6 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5"
                  title="Remove Block"
                >
                  <X className="h-3.5 w-3.5" />
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
                aria-label={`Editing content for ${block.label}`}
                className={cn(
                  getBlockStyles(block.type, true),
                  "focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none overflow-hidden text-sm shadow-inner-soft"
                )}
                placeholder={block.placeholder}
              />
            ) : (
              <div
                className={cn(getBlockStyles(block.type, !!block.content), "cursor-text focus-visible:ring-2 focus-visible:ring-ring/20 outline-none")}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsEditing(true);
                  }
                }}
                role="button"
                aria-label={`Edit content for ${block.label}`}
              >
                {block.content ? (
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                    {block.content}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground/50 italic whitespace-pre-line">
                    {block.placeholder}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
