import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import Favicon from "@/components/ui/favicon"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://drag-and-draft.netlify.app"),
  title: {
    default: "Drag and Draft | Modern Drag-and-Drop Essay Planner",
    template: "%s | Drag and Draft",
  },
  description:
    "Organize, structure, and export your essays with ease. A simple drag-and-drop tool for students and writers to build better essay outlines.",
  keywords: [
    "essay planner",
    "drag and drop",
    "writing tool",
    "essay structure",
    "academic writing",
    "outline builder",
    "productivity",
    "essay reorder",
    "writing assistant",
  ],
  authors: [{ name: "allemandi", url: "https://github.com/allemandi" }],
  creator: "allemandi",
  publisher: "allemandi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Drag and Draft | Modern Drag-and-Drop Essay Planner",
    description: "Organize, structure, and export your essays with ease.",
    url: "https://drag-and-draft.netlify.app/",
    siteName: "Drag and Draft",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drag and Draft | Modern Drag-and-Drop Essay Planner",
    description: "Organize, structure, and export your essays with ease.",
    creator: "@allemandi",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Drag and Draft",
    description: "Organize, structure, and export your essays with ease. A simple drag-and-drop tool for students and writers to build better essay outlines.",
    url: "https://drag-and-draft.netlify.app",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "allemandi",
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Favicon />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
