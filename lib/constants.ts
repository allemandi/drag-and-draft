import type { Section } from "./types"

export const DEFAULT_SECTIONS: Section[] = [
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

export const getDefaultSections = (): Section[] => JSON.parse(JSON.stringify(DEFAULT_SECTIONS))
