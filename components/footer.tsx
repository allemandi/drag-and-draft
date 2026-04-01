"use client";

import Link from "next/link";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Footer() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <>
      <footer className="fixed bottom-0 left-0 w-full py-2 px-4 sm:px-8 bg-background/80 backdrop-blur-md border-t border-border flex flex-row justify-center items-center gap-6 sm:gap-10 z-40">
        <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
          © {new Date().getFullYear()} allemandi
        </p>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" asChild>
            <Link
              href="https://github.com/allemandi/drag-and-draft"
              target="_blank"
              rel="noopener"
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8"
            onClick={() => setIsHelpModalOpen(true)}
            aria-label="Help"
          >
            <CircleHelp className="h-4 w-4" />
          </Button>
        </div>
      </footer>

      <Dialog open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Help & Instructions</DialogTitle>
            <DialogDescription className="text-sm font-medium">
              Quick guide on how to use Drag and Draft.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm">Welcome to Drag and Draft! Here&apos;s a quick guide:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Drag by the grip icons (⋮⋮) to reorder sections and blocks.</li>
              <li>Click any title or textbox to edit text.</li>
              <li>Export your outline using the toolbar (PDF, DOCX, TXT, Markdown).</li>
              <li>Remember to Save and Backup regularly!</li>
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsHelpModalOpen(false)} className="rounded-lg text-xs font-bold">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}