import React from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFileSelect?: (files: FileList) => void;
  isActive?: boolean;
  className?: string;
}

const DropZone = ({
  onFileSelect = () => {},
  isActive = false,
  className = "",
}: DropZoneProps) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      onFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileSelect(e.target.files);
    }
  };

  return (
    <div
      className={cn(
        "w-full h-[300px] bg-background flex flex-col items-center justify-center",
        "border-2 border-dashed rounded-lg transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25",
        isActive && "pointer-events-none opacity-50",
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        id="file-upload"
        onChange={handleFileSelect}
        multiple
      />
      <label
        htmlFor="file-upload"
        className={cn(
          "flex flex-col items-center justify-center gap-4 cursor-pointer",
          "w-full h-full",
        )}
      >
        <div className="p-4 rounded-full bg-primary/10">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">
            Drag & drop files here or click to browse
          </p>
          <p className="text-sm text-muted-foreground">
            Supported formats: .txt, .docx, .csv, .xlsx, .json, .xml, .pdf
          </p>
        </div>
      </label>
    </div>
  );
};

export default DropZone;
