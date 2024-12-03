import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ResultItem from "./ResultItem";

type ConversionStatus = "success" | "error" | "pending";

interface ConversionResult {
  id: string;
  filename: string;
  status: ConversionStatus;
  error?: string;
}

interface ResultsListProps {
  results?: ConversionResult[];
  onDownload?: (id: string) => void;
  className?: string;
}

const DEFAULT_RESULTS: ConversionResult[] = [
  {
    id: "1",
    filename: "document.txt",
    status: "success",
  },
  {
    id: "2",
    filename: "spreadsheet.csv",
    status: "error",
    error: "Conversion failed",
  },
  {
    id: "3",
    filename: "data.json",
    status: "pending",
  },
];

const ResultsList = ({
  results = DEFAULT_RESULTS,
  onDownload = () => {},
  className = "",
}: ResultsListProps) => {
  return (
    <div
      className={cn(
        "w-full h-[200px] border rounded-lg bg-background p-4",
        className,
      )}
    >
      <h3 className="text-sm font-medium mb-2">Conversion Results</h3>
      <ScrollArea className="h-[calc(200px-4rem)]">
        <div className="space-y-2">
          {results.map((result) => (
            <ResultItem
              key={result.id}
              filename={result.filename}
              status={result.status}
              error={result.error}
              onDownload={() => onDownload(result.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ResultsList;
