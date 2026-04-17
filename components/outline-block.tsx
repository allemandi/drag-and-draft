"use client"

import type React from "react"
import { useState, useRef, useEffect, useId } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, X, RefreshCw, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditableText } from "@/components/ui/editable-text"
import type { OutlineBlock as OutlineBlockType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface OutlineBlockProps {
  block: OutlineBlockType
  blockIndex: number
  onChange: (blockIndex: number, newContent: string) => void
  onLabelChange: (blockIndex: number, newLabel: string) => void
  onResetLabel: (blockIndex: number) => void
  onRemoveBlock: (blockIndex: number) => void
  showRemoveButton: boolean
}

export function OutlineBlock({
  block,
  blockIndex,
  onChange,
  onLabelChange,
  onResetLabel,
  onRemoveBlock,
  showRemoveButton,
}: OutlineBlockProps) {
  const dragDescId = useId()
  const [isEditing, setIsEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    data: {
      type: "block",
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
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
    onChange(blockIndex, newContent)
  }

  const getBlockStyles = (hasContent: boolean) => {
    const base = "w-full min-h-[40px] sm:min-h-[50px] p-3 sm:p-4 rounded-xl transition-all duration-300 border"
    if (!hasContent) {
      return cn(base, "bg-muted/10 border-primary/10 hover:bg-muted/20 hover:border-primary/20")
    }
    return cn(base, "bg-background/50 border-primary/10 hover:bg-background/70 hover:border-primary/20")
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-2xl border-1.5 sm:border-2 border-border/60 bg-card p-3 sm:p-4 transition-all duration-300 w-full min-w-0 overflow-hidden",
        isDragging ? "z-50 shadow-md scale-[1.01] border-primary/20" : "shadow-soft hover:shadow-md hover:border-border"
      )}
    >
      <div className="flex items-start gap-2 sm:gap-4 min-w-0">
        <div
          {...attributes}
          {...listeners}
          className="mt-0.5 flex-shrink-0 cursor-grab rounded p-1 text-muted-foreground/60 transition-colors hover:bg-accent/50 hover:text-foreground active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ touchAction: 'none' }}
          tabIndex={0}
          role="button"
          aria-label={`Drag to reorder ${block.label} block`}
          aria-describedby={dragDescId}
          aria-roledescription="sortable"
          data-drag-handle
        >
          <GripVertical className="h-4 w-4" />
          <span id={dragDescId} className="sr-only">Use arrow keys to reorder when focused</span>
        </div>

        <div className="flex-grow space-y-2 sm:space-y-3 overflow-hidden min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <EditableText
                value={block.label}
                onChange={(newLabel) => onLabelChange(blockIndex, newLabel)}
                as="label"
                ariaLabel={`Block label: ${block.label}`}
                className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground/80 truncate block"
                inputClassName="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] h-5 w-full"
              />
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 transition-opacity flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onResetLabel(blockIndex)}
                className="h-6 w-6 sm:w-auto gap-1 px-0 sm:px-1.5 text-[10px] font-bold uppercase text-muted-foreground/70 hover:text-primary hover:bg-primary/5"
                title="Reset Label"
              >
                <RefreshCw className="h-3 w-3" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
              {showRemoveButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveBlock(blockIndex)}
                  className="h-6 w-6 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/5 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove Block"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          <div className="w-full relative group/content" onClick={() => setIsEditing(true)}>
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={block.content}
                onChange={handleContentChange}
                onBlur={() => setIsEditing(false)}
                aria-label={`Editing ${block.label} content`}
                className={cn(
                  getBlockStyles(true),
                  "focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none overflow-hidden text-sm shadow-inner-soft border-primary/40 bg-background"
                )}
                placeholder={block.placeholder}
              />
            ) : (
              <div
                className={cn(
                  getBlockStyles(!!block.content),
                  "cursor-text focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none flex items-start gap-2 hover:bg-primary/[0.03] relative"
                )}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsEditing(true);
                  }
                }}
                role="button"
                aria-label={`Edit ${block.label} content. ${block.content ? 'Current content: ' + block.content.substring(0, 50) + '...' : 'Currently empty.'}`}
              >
                <div className="flex-grow min-h-[20px]">
                  {block.content ? (
                    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                      {block.content}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground/70 italic whitespace-pre-line">
                      {block.placeholder}
                    </p>
                  )}
                </div>
                <div className="absolute right-3 bottom-3 opacity-0 group-hover/content:opacity-100 transition-opacity">
                  <Pencil className="h-3 w-3 text-primary/40" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
