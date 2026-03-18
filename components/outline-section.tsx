"use client"

import { memo } from "react"
import { OutlineBlock } from "./outline-block"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { X, Plus, RefreshCw } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"
import type { Section } from "@/lib/types"
import { cn } from "@/lib/utils"
import { DndContext, closestCenter, type DragEndEvent, type SensorDescriptor, type SensorOptions } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers"

interface OutlineSectionProps {
  section: Section
  sectionIndex: number
  onContentChange: (sectionIndex: number, blockIndex: number, newContent: string) => void
  onLabelChange: (sectionIndex: number, blockIndex: number, newLabel: string) => void
  onResetLabel: (sectionIndex: number, blockIndex: number) => void
  onTitleChange: (sectionIndex: number, newTitle: string) => void
  onResetTitle: (sectionIndex: number) => void
  onRemoveSection: () => void
  onAddBlock: () => void
  onRemoveBlock: (blockIndex: number) => void
  onBlockDragEnd: (event: DragEndEvent) => void
  sensors: SensorDescriptor<SensorOptions>[]
  isDraggable: boolean
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
  onBlockDragEnd,
  sensors,
  isDraggable,
}: OutlineSectionProps) {

  const getSectionStyles = (type: string) => {
    switch (type) {
      case "intro":
        return "bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60"
      case "body":
        return "bg-card border-border/80"
      case "conclusion":
        return "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60"
      default:
        return "bg-card"
    }
  }

  return (
    <Card className={cn(
      "relative border-2 shadow-soft transition-all duration-300",
      getSectionStyles(section.type)
    )}>
      <CardHeader className={cn(
        "flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0 px-4 py-3 sm:px-6 sm:py-4",
        isDraggable && "pl-11 sm:pl-14"
      )}>
        <div className="flex items-center gap-3">
          <EditableText
            value={section.title}
            onChange={(newTitle) => onTitleChange(sectionIndex, newTitle)}
            as="h2"
            ariaLabel={`Section title: ${section.title}`}
            className="text-xl font-black tracking-tight text-foreground hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1 rounded-md transition-colors"
            inputClassName="text-xl font-black h-9 w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onResetTitle(sectionIndex)}
            className="h-8 gap-1.5 px-2 text-[10px] font-bold uppercase text-muted-foreground/50 hover:text-primary hover:bg-primary/5"
            title="Reset Title"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset Title</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onAddBlock}
            className="h-8 gap-1.5 px-3 text-[10px] font-black uppercase tracking-wider shadow-sm rounded-lg"
          >
            <Plus className="h-3 w-3" />
            <span className="hidden sm:inline">Add Block</span>
          </Button>

          {section.type === "body" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemoveSection}
              className="h-7 w-7 text-muted-foreground/30 hover:bg-destructive/10 hover:text-destructive"
              title="Remove Section"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn(
        "space-y-4 px-4 pb-4 sm:px-6 sm:pb-6 pt-0",
        isDraggable && "pl-11 sm:pl-14"
      )}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onBlockDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext items={section.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className="grid gap-4">
              {section.blocks.map((block, blockIndex) => (
                <MemoizedOutlineBlock
                  key={block.id}
                  block={block}
                  onChange={(newContent) => onContentChange(sectionIndex, blockIndex, newContent)}
                  onLabelChange={(newLabel) => onLabelChange(sectionIndex, blockIndex, newLabel)}
                  onResetLabel={() => onResetLabel(sectionIndex, blockIndex)}
                  onRemoveBlock={() => onRemoveBlock(blockIndex)}
                  showRemoveButton={section.blocks.length > 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  )
}
