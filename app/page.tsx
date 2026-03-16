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
import { Layout, Save, Plus, Moon, Sun, RefreshCw } from "lucide-react"
import { useTheme } from "next-themes"
import Footer from "@/components/footer"
import { formatOutline, downloadFile } from "@/lib/utils"
import { ExportModal } from "@/components/export-modal"
import { BackupModal } from "@/components/backup-modal"
import { useOutline } from "@/hooks/use-outline"
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
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <div className="container mx-auto max-w-5xl px-4 py-12 pb-32">
        <header className="mb-16">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-end">
            <div className="space-y-3 text-center sm:text-left">
              <div className="flex items-center justify-center gap-3 sm:justify-start">
                <div className="rounded-2xl bg-primary p-2 text-primary-foreground shadow-lg">
                  <Layout className="h-8 w-8" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                  Drag & Draft
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Craft your narrative with precision and ease.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-card p-1.5 shadow-soft border border-border/50">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-10 w-10 rounded-xl"
              >
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <div className="h-6 w-px bg-border/50 mx-1" />
              <Button onClick={handleSave} className="h-10 px-5 rounded-xl shadow-sm">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <BackupModal
              onDownload={handleBackupDownload}
              onUpload={() => fileInputRef.current?.click()}
            />
            <ExportModal onExport={handleExport} />
            <Button
              variant="outline"
              onClick={() => setShowResetModal(true)}
              className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/30"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
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

        <main className="space-y-12">
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
              <div className="space-y-8">
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

          <div className="flex justify-center pt-4">
            <Button
              onClick={addBodySection}
              size="lg"
              className="h-16 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 px-10 text-lg font-semibold text-primary hover:bg-primary/10 hover:border-primary/40 transition-all shadow-none"
            >
              <Plus className="mr-3 h-6 w-6" />
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
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset everything?</DialogTitle>
            <DialogDescription>
              This will clear your current outline and restore the default template. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-2 sm:justify-end">
            <Button variant="ghost" onClick={() => setShowResetModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetAll()
                setShowResetModal(false)
              }}
              className="rounded-xl px-8"
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
