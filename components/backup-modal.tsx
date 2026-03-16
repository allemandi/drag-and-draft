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
        <div className="flex flex-col gap-3 mt-6">
          <Button onClick={handleDownload} variant="default" className="w-full justify-start rounded-2xl h-16 px-6">
            <Download className="h-5 w-5 mr-4" />
            <div className="flex flex-col items-start">
              <span className="text-[13px] font-black">Download Backup</span>
              <span className="text-[10px] font-medium opacity-70 uppercase tracking-wider">Save as JSON file</span>
            </div>
          </Button>
          <Button onClick={handleUpload} variant="outline" className="w-full justify-start rounded-2xl h-16 px-6">
            <Upload className="h-5 w-5 mr-4" />
            <div className="flex flex-col items-start">
              <span className="text-[13px] font-black">Load Backup</span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Restore from JSON</span>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}