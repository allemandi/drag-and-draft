import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import Favicon from "@/components/ui/favicon"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Drag and Draft | Modern Drag-and-Drop Essay Planner",
  description: "Organize, structure, and export your essays with ease. A powerful drag-and-drop tool for students and writers to build better essay outlines.",
  keywords: ["essay planner", "drag and drop", "writing tool", "essay structure", "academic writing", "outline builder", "productivity"],
  authors: [{ name: "Drag and Draft Team" }],
  openGraph: {
    title: "Drag and Draft | Modern Drag-and-Drop Essay Planner",
    description: "Organize, structure, and export your essays with ease.",
    type: "website",
    url: "https://drag-and-draft.netlify.app/",
    siteName: "Drag and Draft",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drag and Draft | Modern Drag-and-Drop Essay Planner",
    description: "Organize, structure, and export your essays with ease.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Favicon />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}