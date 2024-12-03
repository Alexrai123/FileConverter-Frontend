import React from "react";
import { Download, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConversionStatus = "success" | "error" | "pending";

interface ResultItemProps {
  filename?: string;
  status?: ConversionStatus;
  error?: string;
  onDownload?: () => void;
  className?: string;
}

const ResultItem = ({
  filename = "example.txt",
  status = "success",
  error = "",
  onDownload = () => {},
  className = "",
}: ResultItemProps) => {
  const statusIcon = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-destructive" />,
    pending: null,
  }[status];

  return (
    <div
      className={cn(
        "w-full p-3 flex items-center justify-between",
        "border rounded-lg bg-background",
        "transition-colors hover:bg-accent/50",
        className,
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {statusIcon}
        <div className="truncate">
          <p className="font-medium truncate">{filename}</p>
          {status === "error" && error && (
            <p className="text-sm text-destructive truncate">{error}</p>
          )}
        </div>
      </div>
      {status === "success" && (
        <Button
          variant="ghost"
          size="sm"
          className="flex-shrink-0"
          onClick={onDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      )}
    </div>
  );
};

export default ResultItem;
