"use client"

import { OutlineBlock } from "./outline-block"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { X, Plus, RefreshCw } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"
import type { Section } from "@/lib/types"
import { cn } from "@/lib/utils"

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
  isDraggable: boolean
}

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
}: OutlineSectionProps) {

  const getSectionStyles = (type: string) => {
    switch (type) {
      case "intro":
        return "pastel-intro"
      case "body":
        return "pastel-body"
      case "conclusion":
        return "pastel-conclusion"
      default:
        return "border-border bg-card"
    }
  }

  return (
    <Card className={cn(
      "overflow-hidden border shadow-soft transition-all duration-300",
      getSectionStyles(section.type)
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3 sm:pl-12">
        <div className="flex items-center gap-2">
          <EditableText
            value={section.title}
            onChange={(newTitle) => onTitleChange(sectionIndex, newTitle)}
            as="h2"
            className="text-lg font-bold tracking-tight text-foreground hover:bg-black/5 dark:hover:bg-white/5"
            inputClassName="text-lg font-bold h-8 w-[180px] sm:w-[250px]"
          />
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onResetTitle(sectionIndex)}
            className="h-7 w-7 text-muted-foreground/60 hover:bg-black/5 dark:hover:bg-white/5"
            title="Reset Title"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onAddBlock}
            className="h-7 gap-1 px-2.5 text-[11px] font-bold shadow-sm rounded-lg"
          >
            <Plus className="h-3 w-3" />
            <span className="hidden sm:inline">Add Block</span>
          </Button>

          {section.type === "body" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemoveSection}
              className="h-7 w-7 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive"
              title="Remove Section"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-4 pb-4 pt-0">
        <div className="grid gap-3">
          {section.blocks.map((block, blockIndex) => (
            <OutlineBlock
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
      </CardContent>
    </Card>
  )
}
