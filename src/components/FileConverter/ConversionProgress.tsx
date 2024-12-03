import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ConversionProgressProps {
  progress?: number;
  status?: string;
  isActive?: boolean;
  className?: string;
}

const ConversionProgress = ({
  progress = 0,
  status = "Ready to convert",
  isActive = false,
  className = "",
}: ConversionProgressProps) => {
  return (
    <div
      className={cn(
        "w-full p-4 space-y-2 bg-background border rounded-lg",
        isActive ? "opacity-100" : "opacity-50",
        className,
      )}
    >
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-muted-foreground">{status}</p>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default ConversionProgress;
