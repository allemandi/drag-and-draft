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

  return (
    <Card className={cn(
      "overflow-hidden border-1.5 sm:border-2 shadow-soft transition-all duration-300 bg-background"
    )}>
      <CardHeader className={cn(
        "flex flex-row items-center justify-between space-y-0 px-4 py-3 sm:px-6 sm:py-4 gap-2",
        isDraggable && "pl-11 sm:pl-14"
      )}>
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden min-w-0 flex-1 sm:flex-none">
          <EditableText
            value={section.title}
            onChange={(newTitle) => onTitleChange(sectionIndex, newTitle)}
            as="h2"
            ariaLabel={`Section title: ${section.title}`}
            className="text-lg sm:text-xl font-black tracking-tight text-foreground hover:bg-black/5 dark:hover:bg-white/5 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md transition-colors truncate"
            inputClassName="text-lg sm:text-xl font-black h-8 sm:h-9 w-full"
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onResetTitle(sectionIndex)}
            className="h-8 w-8 sm:w-auto gap-1.5 px-0 sm:px-2 text-[10px] font-bold uppercase text-muted-foreground/50 hover:text-primary hover:bg-primary/5"
            title="Reset Title"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset Title</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onAddBlock}
            className="h-8 w-8 sm:w-auto gap-1.5 px-0 sm:px-3 text-[10px] font-black uppercase tracking-wider shadow-sm rounded-lg"
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

      <CardContent className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6 pt-0 min-w-0 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onBlockDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext items={section.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-4 w-full min-w-0">
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
