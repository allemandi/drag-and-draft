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
        <Button variant="outline" className="rounded-xl">
          <Download className="h-4 w-4 sm:mr-2" />
          <span>Export</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Export Outline</DialogTitle>
          <DialogDescription>
            Choose your preferred format to download your essay outline.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <Button
            onClick={() => onExport("pdf")}
            variant="outline"
            className="h-20 flex-col items-start rounded-2xl p-4 transition-all hover:bg-primary/5 hover:border-primary/30"
          >
            <FileText className="h-5 w-5 mb-2 text-red-500" />
            <span className="font-bold">PDF</span>
            <span className="text-[10px] text-muted-foreground">Standard Document</span>
          </Button>
          <Button
            onClick={() => onExport("docx")}
            variant="outline"
            className="h-20 flex-col items-start rounded-2xl p-4 transition-all hover:bg-primary/5 hover:border-primary/30"
          >
            <FileCode2 className="h-5 w-5 mb-2 text-blue-500" />
            <span className="font-bold">Word</span>
            <span className="text-[10px] text-muted-foreground">DOCX Format</span>
          </Button>
          <Button
            onClick={() => onExport("txt")}
            variant="outline"
            className="h-20 flex-col items-start rounded-2xl p-4 transition-all hover:bg-primary/5 hover:border-primary/30"
          >
            <FileArchive className="h-5 w-5 mb-2 text-slate-500" />
            <span className="font-bold">Text</span>
            <span className="text-[10px] text-muted-foreground">Plain Text TXT</span>
          </Button>
          <Button
            onClick={() => onExport("md")}
            variant="outline"
            className="h-20 flex-col items-start rounded-2xl p-4 transition-all hover:bg-primary/5 hover:border-primary/30"
          >
            <FileCode2 className="h-5 w-5 mb-2 text-emerald-500" />
            <span className="font-bold">Markdown</span>
            <span className="text-[10px] text-muted-foreground">Rich Formatting</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}