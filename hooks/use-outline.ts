"use client"

import { useState, useCallback, useMemo } from "react"
import type { Section, OutlineBlock } from "@/lib/types"
import { generateId } from "@/lib/utils"
import { arrayMove } from "@dnd-kit/sortable"
import type { DragEndEvent } from "@dnd-kit/core"
import { useToast } from "@/components/ui/use-toast"

const getDefaultSections = (): Section[] => [
  {
    id: "intro-section",
    title: "Introduction",
    defaultTitle: "Introduction",
    type: "intro",
    blocks: [
      {
        id: "hook",
        label: "Hook / Opening Question",
        defaultLabel: "Hook / Opening Question",
        placeholder: "Begin with bold question, statement, or story:\n'When a character is strikingly alienated, society's norms...'",
        content: "",
        type: "intro",
      },
      {
        id: "context",
        label: "Context or Background",
        defaultLabel: "Context or Background",
        placeholder: "Briefly introduce context or general ideas on the topic:\n'The conditions to a qualified society for the creation of norms can be outlined in the works...'",
        content: "",
        type: "intro",
      },
      {
        id: "thesis",
        label: "Thesis Statement (Theme)",
        defaultLabel: "Thesis Statement (Theme)",
        placeholder:
          "Summarize the main message in one sentence:\n'This work clearly outlines that although groups claim be legitimate society as a matter of course, the majority fail to qualify according...'",
        content: "",
        type: "intro",
      },
    ],
  },
  {
    id: "body-section-1",
    title: "Body Section 1",
    defaultTitle: "Body Section 1",
    type: "body",
    blocks: [
      {
        id: "body-1-topic",
        label: "Main Point / Topic Sentence",
        defaultLabel: "Main Point / Topic Sentence",
        placeholder: "Introduce point, relate to thesis:\n'Legitimacy is established through indifferent qualification, not social negotiation...'",
        content: "",
        type: "body",
      },
      {
        id: "body-1-evidence",
        label: "Evidence",
        defaultLabel: "Evidence",
        placeholder: "Provide specific support (quote, paraphrase, data):\n'In the first work, the author details alienation as...'",
        content: "",
        type: "body",
      },
      {
        id: "body-1-analysis",
        label: "Analysis",
        defaultLabel: "Analysis",
        placeholder: "Explain how the evidence supports the argument:\n'This highlights how external perception plays a lesser role in structural...'",
        content: "",
        type: "body",
      },
      {
        id: "body-1-transition",
        label: "Summary Sentence",
        defaultLabel: "Summary Sentence",
        placeholder: "Tie and transition:\n'Therefore, the backbone of legitimate society gravitates towards imponderabilia of everyday life rather than...'",
        content: "",
        type: "body",
      },
    ],
  },
  {
    id: "conclusion-section",
    title: "Conclusion",
    defaultTitle: "Conclusion",
    type: "conclusion",
    blocks: [
      {
        id: "restate-thesis",
        label: "Theme Recap",
        defaultLabel: "Theme Recap",
        placeholder: "Reword central message clearly:\n'While many gatherings announce themselves as society incarnate, only those that accommodate the abnormal...'",
        content: "",
        type: "conclusion",
      },
      {
        id: "summary",
        label: "Summary",
        defaultLabel: "Summary",
        placeholder: "Briefly recap body sections:\n'A legitimate society resists public enthusiasm, exposes self-negotiation, and insists...'",
        content: "",
        type: "conclusion",
      },
      {
        id: "implication",
        label: "Implication",
        defaultLabel: "Implication",
        placeholder: "Deepen the point without new ideas:\n'Ultimately, recognizing that most so-called societies are exercises in collective...'",
        content: "",
        type: "conclusion",
      },
      {
        id: "closing",
        label: "Closing",
        defaultLabel: "Closing",
        placeholder: "Leave reader with a strong final thought\n'In the end, society is less what the masses say it is, and more what endures...'",
        content: "",
        type: "conclusion",
      },
    ],
  },
]

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

  const handleContentChange = useCallback((sectionIndex: number, blockIndex: number, content: string) => {
    setSections(prev => {
      const newSections = prev.map((section, i) =>
        i === sectionIndex ? {
          ...section,
          blocks: section.blocks.map((block, j) =>
            j === blockIndex ? { ...block, content } : block
          )
        } : section
      )
      return newSections
    })
  }, [])

  const handleLabelChange = useCallback((sectionIndex: number, blockIndex: number, newLabel: string) => {
    setSections(prev => {
      const newSections = [...prev]
      newSections[sectionIndex].blocks[blockIndex].label = newLabel
      return newSections
    })
  }, [])

  const handleResetLabel = useCallback((sectionIndex: number, blockIndex: number) => {
    setSections(prev => {
      const newSections = [...prev]
      const defaultLabel = newSections[sectionIndex].blocks[blockIndex].defaultLabel
      newSections[sectionIndex].blocks[blockIndex].label = defaultLabel
      toast({
        title: "Label Reset",
        description: "The label has been reset to its default value.",
        duration: 2000,
      })
      return newSections
    })
  }, [toast])

  const saveToLocalStorage = useCallback((data: Section[]) => {
    localStorage.setItem("essayOutline", JSON.stringify(data));
    toast({
      title: "Outline Saved",
      description: "Your essay outline has been saved to local storage.",
      duration: 3000,
    })
  }, [toast]);

  const handleTitleChange = useCallback((sectionIndex: number, newTitle: string) => {
    setSections(prev => {
      const newSections = [...prev]
      newSections[sectionIndex].title = newTitle
      return newSections
    })
  }, [])

  const handleResetTitle = useCallback((sectionIndex: number) => {
    setSections(prev => {
      const newSections = [...prev]
      const defaultTitle = newSections[sectionIndex].defaultTitle
      newSections[sectionIndex].title = defaultTitle
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

      const newSections = [...prev]
      newSections[sectionIndex] = {
        ...section,
        blocks: [...section.blocks, newBlock]
      }
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

      const newSections = [...prev]
      newSections[sectionIndex].blocks.splice(blockIndex, 1)
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

      const newSections = [...prev]
      newSections.splice(sectionIndex, 1)
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
      const blockMap = new Map<string, { sectionIndex: number, blockIndex: number }>();
      prev.forEach((section, sectionIndex) => {
        section.blocks.forEach((block, blockIndex) => {
          blockMap.set(block.id, { sectionIndex, blockIndex });
        });
      });

      const activeBlockInfo = blockMap.get(active.id as string);
      const overBlockInfo = blockMap.get(over.id as string);

      if (!activeBlockInfo || !overBlockInfo) return prev;

      const newSections = [...prev]
      if (activeBlockInfo.sectionIndex === overBlockInfo.sectionIndex) {
        const sectionIndex = activeBlockInfo.sectionIndex
        newSections[sectionIndex] = {
          ...newSections[sectionIndex],
          blocks: arrayMove(newSections[sectionIndex].blocks, activeBlockInfo.blockIndex, overBlockInfo.blockIndex),
        }
      } else {
        const activeSection = { ...newSections[activeBlockInfo.sectionIndex] }
        const overSection = { ...newSections[overBlockInfo.sectionIndex] }

        const [blockToMove] = activeSection.blocks.splice(activeBlockInfo.blockIndex, 1)
        blockToMove.type = overSection.type
        overSection.blocks.splice(overBlockInfo.blockIndex, 0, blockToMove)

        newSections[activeBlockInfo.sectionIndex] = activeSection
        newSections[overBlockInfo.sectionIndex] = overSection

        toast({
          title: "Block Moved",
          description: `Block moved to ${overSection.title}`,
          duration: 2000,
        })
      }
      return newSections
    })
  }, [toast])

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
