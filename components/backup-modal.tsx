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
        <Button variant="outline" className="rounded-xl">
          <Database className="h-4 w-4 sm:mr-2" />
          <span>Backup</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Backup & Restore</DialogTitle>
          <DialogDescription>
            Download your current outline to a file or upload a previously saved backup.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button onClick={handleDownload} variant="default" className="w-full justify-start rounded-xl h-14 px-6">
            <Download className="h-5 w-5 mr-3" />
            <div className="flex flex-col items-start">
              <span className="font-bold">Download Backup</span>
              <span className="text-xs font-normal opacity-80 text-left">Save your work as a JSON file</span>
            </div>
          </Button>
          <Button onClick={handleUpload} variant="outline" className="w-full justify-start rounded-xl h-14 px-6">
            <Upload className="h-5 w-5 mr-3" />
            <div className="flex flex-col items-start">
              <span className="font-bold">Load Backup</span>
              <span className="text-xs font-normal text-muted-foreground text-left">Restore from a JSON file</span>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}