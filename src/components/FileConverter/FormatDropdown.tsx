import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type FileFormat =
  | ".txt"
  | ".docx"
  | ".csv"
  | ".xlsx"
  | ".json"
  | ".xml"
  | ".pdf";

interface FormatDropdownProps {
  value?: FileFormat;
  onValueChange?: (value: FileFormat) => void;
  label?: string;
  placeholder?: string;
  formats?: FileFormat[];
  className?: string;
  disabled?: boolean;
}

const DEFAULT_FORMATS: FileFormat[] = [
  ".txt",
  ".docx",
  ".csv",
  ".xlsx",
  ".json",
  ".xml",
  ".pdf",
];

const FormatDropdown = ({
  value = ".txt",
  onValueChange = () => {},
  label = "Format",
  placeholder = "Select format",
  formats = DEFAULT_FORMATS,
  className = "",
  disabled = false,
}: FormatDropdownProps) => {
  return (
    <div className={cn("flex flex-col gap-2 bg-background", className)}>
      {label && (
        <label className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}
      <Select
        value={value}
        onValueChange={(val) => onValueChange(val as FileFormat)}
        disabled={disabled}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {formats.map((format) => (
            <SelectItem key={format} value={format}>
              {format}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FormatDropdown;
