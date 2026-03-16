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
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button
            onClick={() => onExport("pdf")}
            variant="outline"
            className="h-20 flex-col items-center justify-center rounded-2xl p-4 transition-all hover:bg-red-500/[0.03] hover:border-red-500/20"
          >
            <FileText className="h-5 w-5 mb-1.5 text-red-500/80" />
            <span className="text-[11px] font-black tracking-widest">PDF</span>
          </Button>
          <Button
            onClick={() => onExport("docx")}
            variant="outline"
            className="h-20 flex-col items-center justify-center rounded-2xl p-4 transition-all hover:bg-blue-500/[0.03] hover:border-blue-500/20"
          >
            <FileCode2 className="h-5 w-5 mb-1.5 text-blue-500/80" />
            <span className="text-[11px] font-black tracking-widest">WORD</span>
          </Button>
          <Button
            onClick={() => onExport("txt")}
            variant="outline"
            className="h-20 flex-col items-center justify-center rounded-2xl p-4 transition-all hover:bg-slate-500/[0.03] hover:border-slate-500/20"
          >
            <FileArchive className="h-5 w-5 mb-1.5 text-slate-500/80" />
            <span className="text-[11px] font-black tracking-widest">TEXT</span>
          </Button>
          <Button
            onClick={() => onExport("md")}
            variant="outline"
            className="h-20 flex-col items-center justify-center rounded-2xl p-4 transition-all hover:bg-emerald-500/[0.03] hover:border-emerald-500/20"
          >
            <FileCode2 className="h-5 w-5 mb-1.5 text-emerald-500/80" />
            <span className="text-[11px] font-black tracking-widest">MARKDOWN</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}