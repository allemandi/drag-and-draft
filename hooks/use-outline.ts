"use client"

import { useState, useCallback } from "react"
import type { Section, OutlineBlock } from "@/lib/types"
import { generateId } from "@/lib/utils"
import { arrayMove } from "@dnd-kit/sortable"
import type { DragEndEvent } from "@dnd-kit/core"
import { useToast } from "@/components/ui/use-toast"
import { getDefaultSections } from "@/lib/constants"

export function useOutline() {
  const [sections, setSections] = useState<Section[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedOutline = localStorage.getItem("essayOutline")
        if (savedOutline) {
          return JSON.parse(savedOutline)
        }
      } catch (e) {
        console.error("Error loading outline data:", e)
      }
    }
    return getDefaultSections()
  })

  const { toast } = useToast()

  const updateLocalStorage = useCallback((newSections: Section[]) => {
    localStorage.setItem("essayOutline", JSON.stringify(newSections))
  }, [])

  const saveToLocalStorage = useCallback((data: Section[]) => {
    localStorage.setItem("essayOutline", JSON.stringify(data));
    toast({
      title: "Outline Saved",
      description: "Your essay outline has been saved to local storage.",
      duration: 3000,
    })
  }, [toast]);

  const handleContentChange = useCallback((sectionIndex: number, blockIndex: number, content: string) => {
    setSections(prev =>
      prev.map((section, i) =>
        i === sectionIndex ? {
          ...section,
          blocks: section.blocks.map((block, j) =>
            j === blockIndex ? { ...block, content } : block
          )
        } : section
      )
    )
  }, [])

  const handleLabelChange = useCallback((sectionIndex: number, blockIndex: number, newLabel: string) => {
    setSections(prev =>
      prev.map((section, i) =>
        i === sectionIndex ? {
          ...section,
          blocks: section.blocks.map((block, j) =>
            j === blockIndex ? { ...block, label: newLabel } : block
          )
        } : section
      )
    )
  }, [])

  const handleResetLabel = useCallback((sectionIndex: number, blockIndex: number) => {
    setSections(prev => {
      const newSections = prev.map((section, i) =>
        i === sectionIndex ? {
          ...section,
          blocks: section.blocks.map((block, j) =>
            j === blockIndex ? { ...block, label: block.defaultLabel } : block
          )
        } : section
      )
      toast({
        title: "Label Reset",
        description: "The label has been reset to its default value.",
        duration: 2000,
      })
      return newSections
    })
  }, [toast])

  const handleTitleChange = useCallback((sectionIndex: number, newTitle: string) => {
    setSections(prev =>
      prev.map((section, i) =>
        i === sectionIndex ? { ...section, title: newTitle } : section
      )
    )
  }, [])

  const handleResetTitle = useCallback((sectionIndex: number) => {
    setSections(prev => {
      const newSections = prev.map((section, i) =>
        i === sectionIndex ? { ...section, title: section.defaultTitle } : section
      )
      toast({
        title: "Title Reset",
        description: "The section title has been reset to its default value.",
        duration: 2000,
      })
      return newSections
    })
  }, [toast])

  const addBodySection = useCallback(() => {
    setSections(prev => {
      let maxBodyNumber = 0
      prev.forEach((section) => {
        if (section.type === "body") {
          const match = section.id.match(/body-section-(\d+)/)
          if (match) {
            const num = Number.parseInt(match[1], 10)
            if (num > maxBodyNumber) maxBodyNumber = num
          }
        }
      })

      const newBodyIndex = maxBodyNumber + 1
      const conclusionIndex = prev.findIndex((section) => section.type === "conclusion")

      const newBodySection: Section = {
        id: `body-section-${newBodyIndex}`,
        title: `Body Section ${newBodyIndex}`,
        defaultTitle: `Body Section ${newBodyIndex}`,
        type: "body",
        blocks: [
          {
            id: `body-${newBodyIndex}-topic`,
            label: "Main Point / Topic Sentence",
            defaultLabel: "Main Point / Topic Sentence",
            placeholder: "Introduce point, relate to thesis...",
            content: "",
            type: "body",
          },
          {
            id: `body-${newBodyIndex}-evidence`,
            label: "Evidence",
            defaultLabel: "Evidence",
            placeholder: "Provide specific support (quote, paraphrase, data)...",
            content: "",
            type: "body",
          },
          {
            id: `body-${newBodyIndex}-analysis`,
            label: "Analysis",
            defaultLabel: "Analysis",
            placeholder: "Explain how the evidence supports the argument...",
            content: "",
            type: "body",
          },
          {
            id: `body-${newBodyIndex}-transition`,
            label: "Summary Sentence",
            defaultLabel: "Summary Sentence",
            placeholder: "Tie and transition...",
            content: "",
            type: "body",
          },
        ],
      }

      const newSections = [...prev]
      newSections.splice(conclusionIndex, 0, newBodySection)
      toast({
        title: "Section Added",
        description: `Body Section ${newBodyIndex} has been added.`,
        duration: 3000,
      })
      return newSections
    })
  }, [toast])

  const addBlockToSection = useCallback((sectionIndex: number, label = "New Block") => {
    setSections(prev => {
      const section = prev[sectionIndex]
      const newBlock: OutlineBlock = {
        id: generateId(),
        label: label,
        defaultLabel: label,
        placeholder: "Add your content here...",
        content: "",
        type: section.type,
      }

      const newSections = prev.map((s, i) =>
        i === sectionIndex ? { ...s, blocks: [...s.blocks, newBlock] } : s
      )

      toast({
        title: "Block Added",
        description: `A new block has been added to ${section.title}.`,
        duration: 2000,
      })
      return newSections
    })
  }, [toast])

  const removeBlock = useCallback((sectionIndex: number, blockIndex: number) => {
    setSections(prev => {
      if (prev[sectionIndex].blocks.length <= 1) {
        toast({
          title: "Cannot Remove Block",
          description: "A section must have at least one block.",
          variant: "destructive",
          duration: 3000,
        })
        return prev
      }

      const newSections = prev.map((section, i) =>
        i === sectionIndex ? {
          ...section,
          blocks: section.blocks.filter((_, j) => j !== blockIndex)
        } : section
      )

      toast({
        title: "Block Removed",
        description: "The block has been removed.",
        duration: 2000,
      })
      return newSections
    })
  }, [toast])

  const removeSection = useCallback((sectionIndex: number) => {
    setSections(prev => {
      const sectionType = prev[sectionIndex].type
      if (sectionType === "intro" || sectionType === "conclusion") {
        toast({
          title: "Cannot Remove Section",
          description: "Introduction and Conclusion sections cannot be removed.",
          variant: "destructive",
          duration: 3000,
        })
        return prev
      }

      const newSections = prev.filter((_, i) => i !== sectionIndex)

      toast({
        title: "Section Removed",
        description: "The section has been removed.",
        duration: 3000,
      })
      return newSections
    })
  }, [toast])

  const handleBlockDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSections(prev => {
      const activeBlockId = active.id as string;
      const overBlockId = over.id as string;

      let sectionIndex = -1;
      let activeBlockIndex = -1;
      let overBlockIndex = -1;

      // Find which section and what indices the blocks are in
      // Blocks are now restricted to their parent sections, so we only care about intra-section reordering
      prev.forEach((section, sIdx) => {
        section.blocks.forEach((block, bIdx) => {
          if (block.id === activeBlockId) {
            sectionIndex = sIdx;
            activeBlockIndex = bIdx;
          }
          if (block.id === overBlockId) {
            overBlockIndex = bIdx;
          }
        });
      });

      if (sectionIndex === -1 || activeBlockIndex === -1 || overBlockIndex === -1) return prev;

      return prev.map((section, i) =>
        i === sectionIndex ? {
          ...section,
          blocks: arrayMove(section.blocks, activeBlockIndex, overBlockIndex)
        } : section
      )
    })
  }, [])

  const handleSectionDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setSections(prev => {
      const oldIndex = prev.findIndex((section) => section.id === active.id)
      const newIndex = prev.findIndex((section) => section.id === over.id)

      if (prev[oldIndex].type === "intro" || prev[oldIndex].type === "conclusion") {
        return prev
      }

      if (newIndex === 0 || newIndex === prev.length - 1) {
        toast({
          title: "Cannot Move Section",
          description: "Body sections must remain between Introduction and Conclusion.",
          variant: "destructive",
          duration: 3000,
        })
        return prev
      }

      return arrayMove(prev, oldIndex, newIndex)
    })
  }, [toast])

  const resetAll = useCallback(() => {
    const defaults = getDefaultSections()
    setSections(defaults)
    updateLocalStorage(defaults)
    toast({
      title: "Outline Reset",
      description: "All sections have been reset to default.",
      duration: 2000,
    })
  }, [toast, updateLocalStorage])

  return {
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
  }
}
