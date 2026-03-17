"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  TouchSensor,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers"
import { OutlineSection } from "@/components/outline-section"
import { SortableSection } from "@/components/sortable-section"
import { Button } from "@/components/ui/button"
import { Layout, Save, Plus, Moon, Sun, RefreshCw, Database, Download } from "lucide-react"
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

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleExport = (format: "pdf" | "docx" | "txt" | "md") => {
    const formatted = formatOutline(sections, format)
    downloadFile(formatted, format)
  }

  const handleSave = () => {
    saveToLocalStorage(sections)
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
      <div className="container mx-auto max-w-6xl px-4 py-10 pb-24">
        <header className="mb-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center gap-2.5 sm:justify-start">
                <div className="rounded-xl bg-primary p-2 text-primary-foreground shadow-sm">
                  <Layout className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Drag & Draft
                </h1>
              </div>
              <p className="text-sm font-medium text-muted-foreground/80">
                Craft your narrative with precision and ease.
              </p>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-card p-1 shadow-soft border border-border/40">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 rounded-lg"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              <div className="h-5 w-px bg-border/40 mx-0.5" />
              <Button onClick={handleSave} className="h-9 px-4 rounded-lg shadow-sm font-bold text-xs">
                <Save className="mr-2 h-3.5 w-3.5" />
                Save
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <BackupModal
              onDownload={handleBackupDownload}
              onUpload={() => fileInputRef.current?.click()}
            />
            <ExportModal onExport={handleExport} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResetModal(true)}
              className="rounded-lg border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs font-bold"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Reset All
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleBackupUpload}
              accept=".json"
              className="hidden"
            />
          </div>
        </header>

        <main className="space-y-8">
          {/* Introduction */}
          {sections[0]?.type === "intro" && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleBlockDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext items={sections[0].blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                <OutlineSection
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
                  isDraggable={false}
                />
              </SortableContext>
            </DndContext>
          )}

          {/* Body Sections */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
            <SortableContext items={bodySectionIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-6">
                {sections.map((section, idx) => {
                  if (section.type !== "body") return null
                  return (
                    <SortableSection key={section.id} id={section.id}>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleBlockDragEnd}
                        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                      >
                        <SortableContext items={section.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                          <OutlineSection
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
                            isDraggable={true}
                          />
                        </SortableContext>
                      </DndContext>
                    </SortableSection>
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleBlockDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext items={sections[sections.length - 1].blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                <OutlineSection
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
                  isDraggable={false}
                />
              </SortableContext>
            </DndContext>
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
