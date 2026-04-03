"use client"

import { useState, useMemo, useEffect, useCallback, useRef, memo } from "react"
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  TouchSensor,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { OutlineSection } from "@/components/outline-section"
import { SortableSection } from "@/components/sortable-section"
import { Button } from "@/components/ui/button"
import { Layout, Save, Plus, Moon, Sun, RefreshCw } from "lucide-react"
import { useTheme } from "next-themes"
import Footer from "@/components/footer"
import { formatOutline, downloadFile } from "@/lib/utils"
import { ExportModal } from "@/components/export-modal"
import { BackupModal } from "@/components/backup-modal"
import { useOutline } from "@/hooks/use-outline"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

// Memoize components to improve performance
const MemoizedOutlineSection = memo(OutlineSection)
const MemoizedSortableSection = memo(SortableSection)

export default function EssayOutlinePlanner() {
  const {
    sections,
    setSections,
    handleContentChange,
    handleLabelChange,
    handleResetLabel,
    handleTitleChange,
    handleResetTitle,
    addBodySection,
    addBlockToSection,
    removeBlock,
    removeSection,
    handleBlockDragEnd,
    handleSectionDragEnd,
    resetAll,
    updateLocalStorage,
    saveToLocalStorage,
  } = useOutline()

  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const bodySectionIds = useMemo(() =>
    sections.filter((s) => s.type === "body").map((s) => s.id),
    [sections]
  )

  const handleSave = useCallback(() => {
    saveToLocalStorage(sections)
  }, [saveToLocalStorage, sections])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleSave])

  if (!mounted) return null

  const handleExport = (format: "pdf" | "docx" | "txt" | "md") => {
    const formatted = formatOutline(sections, format)
    downloadFile(formatted, format)
  }

  const handleBackupDownload = () => {
    const data = JSON.stringify(sections, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleBackupUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string)
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed[0].blocks &&
          Array.isArray(parsed[0].blocks)
        ) {
          setSections(parsed)
          updateLocalStorage(parsed)
        } else {
          throw new Error("Invalid format")
        }
      } catch (err) {
        console.error("Failed to parse backup file", err)
        toast({
          title: "Import Failed",
          description: "The backup file is invalid or corrupted.",
          variant: "destructive",
          duration: 4000,
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <div className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-md border-b border-border/50 z-50 shadow-sm">
        <header className="container mx-auto max-w-6xl px-4 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center justify-between w-full sm:w-auto">
              {/* Logo and Title */}
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-primary p-1.5 text-primary-foreground shadow-sm flex items-center justify-center">
                  <Layout className="h-5 w-5" />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:gap-3">
                  <h1 className="text-xl font-black tracking-tight sm:text-2xl leading-none">
                    Drag & Draft
                  </h1>
                  <span className="inline-block text-[10px] sm:text-[11px] font-semibold text-muted-foreground/80 leading-none mt-1 sm:mt-0">
                    Craft your narrative with precision and ease.
                  </span>
                </div>
              </div>

              {/* Mobile Primary Actions */}
              <div className="flex items-center gap-1.5 sm:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-9 w-9 rounded-xl border-border/50"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
                <Button onClick={handleSave} className="h-9 px-4 rounded-xl shadow-sm font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                  <Save className="mr-2 h-3.5 w-3.5" />
                  Save
                </Button>
              </div>
            </div>

            {/* Action Buttons Group */}
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {/* Utility Actions (Backup, Export, Reset) */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <BackupModal
                  onDownload={handleBackupDownload}
                  onUpload={() => fileInputRef.current?.click()}
                />
                <ExportModal onExport={handleExport} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetModal(true)}
                  className="h-8 px-2.5 sm:px-3 rounded-lg border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground text-[10px] sm:text-xs font-bold transition-colors"
                >
                  <RefreshCw className="mr-1.5 h-3 w-3" />
                  Reset
                </Button>
              </div>

              {/* Desktop Primary Actions */}
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-8 w-8 rounded-lg border-border/50"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
                <Button onClick={handleSave} className="h-8 px-4 rounded-lg shadow-sm font-bold text-xs">
                  <Save className="mr-2 h-3.5 w-3.5" />
                  Save
                </Button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleBackupUpload}
              accept=".json"
              className="hidden"
            />
          </div>
        </header>
      </div>

      <div className="container mx-auto max-w-6xl px-4 pt-40 sm:pt-28 pb-16">
        <main className="space-y-8">
          {/* Introduction */}
          {sections[0]?.type === "intro" && (
            <MemoizedOutlineSection
              section={sections[0]}
              sectionIndex={0}
              onContentChange={handleContentChange}
              onLabelChange={handleLabelChange}
              onResetLabel={handleResetLabel}
              onTitleChange={handleTitleChange}
              onResetTitle={handleResetTitle}
              onRemoveSection={() => removeSection(0)}
              onAddBlock={() => addBlockToSection(0)}
              onRemoveBlock={(idx) => removeBlock(0, idx)}
              onBlockDragEnd={handleBlockDragEnd}
              sensors={sensors}
              isDraggable={false}
            />
          )}

          {/* Body Sections */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
            <SortableContext items={bodySectionIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-6">
                {sections.map((section, idx) => {
                  if (section.type !== "body") return null
                  return (
                    <MemoizedSortableSection key={section.id} id={section.id}>
                      <MemoizedOutlineSection
                        section={section}
                        sectionIndex={idx}
                        onContentChange={handleContentChange}
                        onLabelChange={handleLabelChange}
                        onResetLabel={handleResetLabel}
                        onTitleChange={handleTitleChange}
                        onResetTitle={handleResetTitle}
                        onRemoveSection={() => removeSection(idx)}
                        onAddBlock={() => addBlockToSection(idx)}
                        onRemoveBlock={(bIdx) => removeBlock(idx, bIdx)}
                        onBlockDragEnd={handleBlockDragEnd}
                        sensors={sensors}
                        isDraggable={true}
                      />
                    </MemoizedSortableSection>
                  )
                })}
              </div>
            </SortableContext>
          </DndContext>

          <div className="flex justify-center pt-2">
            <Button
              onClick={addBodySection}
              variant="outline"
              className="h-12 w-full max-w-md rounded-xl border-dashed border-primary/20 bg-primary/[0.02] text-sm font-bold text-primary/70 hover:bg-primary/[0.05] hover:border-primary/40 transition-all"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Body Section
            </Button>
          </div>

          {/* Conclusion */}
          {sections[sections.length - 1]?.type === "conclusion" && (
            <MemoizedOutlineSection
              section={sections[sections.length - 1]}
              sectionIndex={sections.length - 1}
              onContentChange={handleContentChange}
              onLabelChange={handleLabelChange}
              onResetLabel={handleResetLabel}
              onTitleChange={handleTitleChange}
              onResetTitle={handleResetTitle}
              onRemoveSection={() => removeSection(sections.length - 1)}
              onAddBlock={() => addBlockToSection(sections.length - 1)}
              onRemoveBlock={(idx) => removeBlock(sections.length - 1, idx)}
              onBlockDragEnd={handleBlockDragEnd}
              sensors={sensors}
              isDraggable={false}
            />
          )}
        </main>

        <Footer />
      </div>

      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Reset everything?</DialogTitle>
            <DialogDescription className="text-sm font-medium">
              This will clear your current outline and restore the default template. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-2 sm:justify-end">
            <Button variant="ghost" onClick={() => setShowResetModal(false)} className="rounded-lg text-xs font-bold">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetAll()
                setShowResetModal(false)
              }}
              className="rounded-lg px-6 text-xs font-bold"
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
