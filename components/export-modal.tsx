"use client";

import { FileText, FileCode2, FileArchive, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface ExportModalProps {
  onExport: (format: "pdf" | "docx" | "txt" | "md") => void;
}

export function ExportModal({ onExport }: ExportModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-lg font-bold text-xs">
          <Download className="h-3.5 w-3.5 sm:mr-1.5" />
          <span>Export</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Export Outline</DialogTitle>
          <DialogDescription className="text-sm font-medium">
            Choose your preferred format to download your essay outline.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button
            onClick={() => onExport("pdf")}
            variant="outline"
            className="h-16 flex-col items-center justify-center rounded-xl p-2 transition-all hover:bg-primary/[0.03] hover:border-primary/20"
          >
            <FileText className="h-4 w-4 mb-1 text-red-500/80" />
            <span className="text-[11px] font-black">PDF</span>
          </Button>
          <Button
            onClick={() => onExport("docx")}
            variant="outline"
            className="h-16 flex-col items-center justify-center rounded-xl p-2 transition-all hover:bg-primary/[0.03] hover:border-primary/20"
          >
            <FileCode2 className="h-4 w-4 mb-1 text-blue-500/80" />
            <span className="text-[11px] font-black">Word</span>
          </Button>
          <Button
            onClick={() => onExport("txt")}
            variant="outline"
            className="h-16 flex-col items-center justify-center rounded-xl p-2 transition-all hover:bg-primary/[0.03] hover:border-primary/20"
          >
            <FileArchive className="h-4 w-4 mb-1 text-slate-500/80" />
            <span className="text-[11px] font-black">Text</span>
          </Button>
          <Button
            onClick={() => onExport("md")}
            variant="outline"
            className="h-16 flex-col items-center justify-center rounded-xl p-2 transition-all hover:bg-primary/[0.03] hover:border-primary/20"
          >
            <FileCode2 className="h-4 w-4 mb-1 text-emerald-500/80" />
            <span className="text-[11px] font-black">Markdown</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}