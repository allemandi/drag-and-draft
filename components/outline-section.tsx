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
      "overflow-hidden border-2 shadow-soft transition-all duration-300",
      getSectionStyles(section.type)
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-4 sm:pl-14">
        <div className="flex items-center gap-3">
          <EditableText
            value={section.title}
            onChange={(newTitle) => onTitleChange(sectionIndex, newTitle)}
            as="h2"
            className="text-xl font-black tracking-tight text-foreground hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1 rounded-md transition-colors"
            inputClassName="text-xl font-black h-9 w-[200px] sm:w-[300px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onResetTitle(sectionIndex)}
            className="h-7 w-7 text-muted-foreground/40 hover:bg-black/5 dark:hover:bg-white/5"
            title="Reset Title"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onAddBlock}
            className="h-8 gap-1.5 px-3 text-[10px] font-black uppercase tracking-wider shadow-sm rounded-lg border-secondary-foreground/5"
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

      <CardContent className="space-y-4 px-6 pb-6 pt-0">
        <div className="grid gap-4">
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
