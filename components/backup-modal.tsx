"use client";

import { Download, Upload, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

interface BackupModalProps {
  onDownload: () => void;
  onUpload: () => void;
}

export function BackupModal({ onDownload, onUpload }: BackupModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = () => {
    onDownload();
    setIsOpen(false);
  };

  const handleUpload = () => {
    onUpload();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-lg font-bold text-xs">
          <Database className="h-3.5 w-3.5 sm:mr-1.5" />
          <span>Backup</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Backup & Restore</DialogTitle>
          <DialogDescription className="text-sm font-medium">
            Download your current outline to a file or upload a previously saved backup.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          <Button onClick={handleDownload} variant="default" className="w-full justify-start rounded-xl h-12 px-5">
            <Download className="h-4 w-4 mr-3" />
            <div className="flex flex-col items-start">
              <span className="text-xs font-black">Download Backup</span>
              <span className="text-[10px] font-medium opacity-70">Save as JSON file</span>
            </div>
          </Button>
          <Button onClick={handleUpload} variant="outline" className="w-full justify-start rounded-xl h-12 px-5">
            <Upload className="h-4 w-4 mr-3" />
            <div className="flex flex-col items-start">
              <span className="text-xs font-black">Load Backup</span>
              <span className="text-[10px] font-medium text-muted-foreground">Restore from JSON</span>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}