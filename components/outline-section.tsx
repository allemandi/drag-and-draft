"use client"

import * as React from "react"
import { memo } from "react"
import { OutlineBlock } from "./outline-block"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { X, Plus, RefreshCw, GripVertical } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"
import type { Section } from "@/lib/types"
import { cn } from "@/lib/utils"
import { DndContext, closestCenter, type DragEndEvent, type DragStartEvent, type SensorDescriptor, type SensorOptions, DragOverlay, defaultDropAnimationSideEffects } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers"
import { useState } from "react"

interface OutlineSectionProps {
  section: Section
  sectionIndex: number
  onContentChange: (sectionIndex: number, blockIndex: number, newContent: string) => void
  onLabelChange: (sectionIndex: number, blockIndex: number, newLabel: string) => void
  onResetLabel: (sectionIndex: number, blockIndex: number) => void
  onTitleChange: (sectionIndex: number, newTitle: string) => void
  onResetTitle: (sectionIndex: number) => void
  onRemoveSection: (sectionIndex: number) => void
  onAddBlock: (sectionIndex: number) => void
  onRemoveBlock: (sectionIndex: number, blockIndex: number) => void
  onDragStart?: (event: DragStartEvent) => void
  onBlockDragEnd: (event: DragEndEvent) => void
  sensors: SensorDescriptor<SensorOptions>[]
  isDraggable: boolean
  lastAddedId?: string | null
  setLastAddedId?: (id: string | null) => void
}

// Memoize OutlineBlock for performance
const MemoizedOutlineBlock = memo(OutlineBlock)

export function OutlineSection({
  section,
  sectionIndex,
  onContentChange,
  onLabelChange,
  onResetLabel,
  onTitleChange,
  onResetTitle,
  onRemoveSection,
  onAddBlock,
  onRemoveBlock,
  onDragStart,
  onBlockDragEnd,
  sensors,
  isDraggable,
  lastAddedId,
  setLastAddedId,
}: OutlineSectionProps) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)

  const onContentChangeWrapped = React.useCallback((blockIndex: number, newContent: string) => {
    onContentChange(sectionIndex, blockIndex, newContent)
  }, [onContentChange, sectionIndex])

  const onLabelChangeWrapped = React.useCallback((blockIndex: number, newLabel: string) => {
    onLabelChange(sectionIndex, blockIndex, newLabel)
  }, [onLabelChange, sectionIndex])

  const onResetLabelWrapped = React.useCallback((blockIndex: number) => {
    onResetLabel(sectionIndex, blockIndex)
  }, [onResetLabel, sectionIndex])

  const onTitleChangeWrapped = React.useCallback((newTitle: string) => {
    onTitleChange(sectionIndex, newTitle)
  }, [onTitleChange, sectionIndex])

  const onRemoveBlockWrapped = React.useCallback((blockIndex: number) => {
    onRemoveBlock(sectionIndex, blockIndex)
  }, [onRemoveBlock, sectionIndex])

  const handleDragStartWrapped = React.useCallback((event: DragStartEvent) => {
    setActiveBlockId(event.active.id as string)
    if (onDragStart) onDragStart(event)
  }, [onDragStart])

  const handleDragEndWrapped = React.useCallback((event: DragEndEvent) => {
    setActiveBlockId(null)
    onBlockDragEnd(event)
  }, [onBlockDragEnd])

  const getSectionStyles = () => {
    const base = "overflow-hidden border-2 shadow-md transition-all duration-300"
    switch (section.type) {
      case "intro":
        return cn(base, "border-indigo-500/50 dark:border-indigo-400/40 bg-indigo-50/40 dark:bg-indigo-950/20")
      case "conclusion":
        return cn(base, "border-emerald-500/50 dark:border-emerald-400/40 bg-emerald-50/40 dark:bg-emerald-950/20")
      default:
        return cn(base, "border-primary/40 dark:border-primary/30 bg-white dark:bg-card")
    }
  }

  return (
    <Card className={getSectionStyles()}>
      <CardHeader className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 px-4 py-3 sm:px-6 sm:py-4 gap-2",
        isDraggable && "pl-11 sm:pl-14"
      )}>
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden min-w-0 flex-1">
          <EditableText
              id={section.id}
            value={section.title}
            onChange={onTitleChangeWrapped}
            as="h2"
            ariaLabel={`Section title: ${section.title}`}
            className="text-lg sm:text-xl font-black tracking-tight text-foreground hover:bg-black/5 dark:hover:bg-white/5 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md transition-colors truncate"
            inputClassName="text-lg sm:text-xl font-black h-8 sm:h-9 w-full"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onResetTitle(sectionIndex)}
            className="h-9 sm:h-8 px-2 sm:px-2 gap-1.5 text-[10px] font-bold uppercase text-muted-foreground/70 hover:text-primary hover:bg-primary/5"
            title="Reset Title"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="sm:inline">Reset Title</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAddBlock(sectionIndex)}
            className="h-9 sm:h-8 px-3 sm:px-3 gap-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm rounded-lg"
          >
            <Plus className="h-3 w-3" />
            <span className="sm:inline">Add Block</span>
          </Button>

          {section.type === "body" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveSection(sectionIndex)}
              className="h-9 w-9 sm:h-7 sm:w-7 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive"
              title="Remove Section"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6 pt-0 min-w-0 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStartWrapped}
          onDragEnd={handleDragEndWrapped}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext items={section.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-4 w-full min-w-0">
              {section.blocks.map((block, blockIndex) => (
                <MemoizedOutlineBlock
                  key={block.id}
                  id={block.id}
                  block={block}
                  blockIndex={blockIndex}
                  onChange={onContentChangeWrapped}
                  onLabelChange={onLabelChangeWrapped}
                  onResetLabel={onResetLabelWrapped}
                  onRemoveBlock={onRemoveBlockWrapped}
                  showRemoveButton={section.blocks.length > 1}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.4',
                },
              },
            }),
          }}>
            {activeBlockId ? (
              <div className="w-full opacity-90 scale-[1.02] shadow-xl rounded-2xl overflow-hidden border-2 border-primary/30 bg-card p-3 sm:p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 text-primary/40">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                      {section.blocks.find(b => b.id === activeBlockId)?.label}
                    </div>
                    <div className="text-sm text-foreground/80 line-clamp-2 italic">
                      {section.blocks.find(b => b.id === activeBlockId)?.content || "No content yet..."}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </CardContent>
    </Card>
  )
}
