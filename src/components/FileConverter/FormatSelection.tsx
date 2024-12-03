import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import FormatDropdown from "./FormatDropdown";

type FileFormat =
  | ".txt"
  | ".docx"
  | ".csv"
  | ".xlsx"
  | ".json"
  | ".xml"
  | ".pdf";

interface FormatSelectionProps {
  sourceFormat?: FileFormat;
  targetFormat?: FileFormat;
  onSourceFormatChange?: (format: FileFormat) => void;
  onTargetFormatChange?: (format: FileFormat) => void;
  disabled?: boolean;
  className?: string;
}

const FormatSelection = ({
  sourceFormat = ".txt",
  targetFormat = ".pdf",
  onSourceFormatChange = () => {},
  onTargetFormatChange = () => {},
  disabled = false,
  className = "",
}: FormatSelectionProps) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center gap-4 p-4 bg-background",
        className,
      )}
    >
      <FormatDropdown
        value={sourceFormat}
        onValueChange={onSourceFormatChange}
        label="From"
        placeholder="Select source format"
        disabled={disabled}
      />
      <div className="flex items-center justify-center">
        <ArrowRight className="w-6 h-6 text-muted-foreground" />
      </div>
      <FormatDropdown
        value={targetFormat}
        onValueChange={onTargetFormatChange}
        label="To"
        placeholder="Select target format"
        disabled={disabled}
      />
    </div>
  );
};

export default FormatSelection;
