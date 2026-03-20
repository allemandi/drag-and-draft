"use client";

import Link from "next/link";
import { Github, HelpCircle } from "lucide-react";
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
      <footer className="fixed bottom-0 left-0 w-full py-2 px-4 sm:px-8 bg-background/80 backdrop-blur-md border-t border-border flex flex-row justify-between items-center z-40">
        <p className="text-xs sm:text-sm text-muted-foreground">
          © {new Date().getFullYear()} allemandi
        </p>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" asChild>
            <Link
              href="https://github.com/allemandi/drag-and-draft"
              target="_blank"
              rel="noopener"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8"
            onClick={() => setIsHelpModalOpen(true)}
            aria-label="Help"
          >
            <HelpCircle className="h-4 w-4" />
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