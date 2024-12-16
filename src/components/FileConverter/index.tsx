import React, { useState } from "react";
import DropZone from "./DropZone";
import FormatSelection from "./FormatSelection";
import ConversionProgress from "./ConversionProgress";
import ResultsList from "./ResultsList";
import { FileFormat } from "./FormatDropdown";
import { convertFile, downloadFile } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

type ConversionStatus = "success" | "error" | "pending";

interface ConversionResult {
  id: string;
  filename: string;
  status: ConversionStatus;
  error?: string;
  downloadUrl?: string;
}

const VALID_CONVERSIONS: Record<FileFormat, FileFormat[]> = {
  ".txt": [".pdf", ".docx"],
  ".docx": [".pdf", ".txt"],
  ".csv": [".xlsx", ".json"],
  ".xlsx": [".csv", ".json"],
  ".json": [".xml", ".csv", ".xlsx"],
  ".xml": [".json"],
  ".pdf": [".txt", ".docx"],
};

const FileConverter = () => {
  const [sourceFormat, setSourceFormat] = useState<FileFormat>(".txt");
  const [targetFormat, setTargetFormat] = useState<FileFormat>(".pdf");
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const { toast } = useToast();

  const isValidConversion = (source: FileFormat, target: FileFormat) => {
    return VALID_CONVERSIONS[source]?.includes(target);
  };

  const getConvertedFilename = (
    originalName: string,
    targetFormat: FileFormat,
  ) => {
    const nameWithoutExtension = originalName.split(".")[0];
    return `${nameWithoutExtension}${targetFormat}`;
  };

  const handleFileSelect = async (files: FileList) => {
    setIsConverting(true);

    for (const file of Array.from(files)) {
      const convertedFilename = getConvertedFilename(file.name, targetFormat);
      const newResult: ConversionResult = {
        id: Math.random().toString(36).substr(2, 9),
        filename: convertedFilename,
        status: "pending",
      };

      setResults((prev) => [newResult, ...prev]);

      try {
        // Start progress simulation
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentProgress = Math.min(currentProgress + 10, 90);
          setProgress(currentProgress);
        }, 500);

        // Actual conversion
        const response = await convertFile(file, sourceFormat, targetFormat);

        // Clear interval and set final progress
        clearInterval(interval);
        setProgress(100);

        // Update result
        setResults((prev) =>
          prev.map((result) =>
            result.id === newResult.id
              ? {
                  ...result,
                  status: response.success ? "success" : "error",
                  error: response.success ? undefined : response.message,
                  downloadUrl: response.downloadUrl,
                }
              : result,
          ),
        );

        if (response.success) {
          toast({
            title: "Conversion successful",
            description: `${file.name} has been converted to ${targetFormat}`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Conversion failed",
            description: response.message,
          });
        }
      } catch (error) {
        setResults((prev) =>
          prev.map((result) =>
            result.id === newResult.id
              ? {
                  ...result,
                  status: "error",
                  error: "Conversion failed. Please try again.",
                }
              : result,
          ),
        );

        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to convert file. Please try again.",
        });
      }
    }

    setIsConverting(false);
    setProgress(0);
  };

  const handleDownload = async (id: string) => {
    const result = results.find((r) => r.id === id);
    if (!result?.downloadUrl) return;

    try {
      const blob = await downloadFile(result.downloadUrl);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Failed to download the converted file. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-background min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">File Converter</h1>
      <DropZone onFileSelect={handleFileSelect} isActive={isConverting} />
      <FormatSelection
        sourceFormat={sourceFormat}
        targetFormat={targetFormat}
        onSourceFormatChange={setSourceFormat}
        onTargetFormatChange={setTargetFormat}
        disabled={isConverting}
      />
      <ConversionProgress
        progress={progress}
        status={isConverting ? "Converting..." : "Ready to convert"}
        isActive={isConverting}
      />
      <ResultsList results={results} onDownload={handleDownload} />
    </div>
  );
};

export default FileConverter;
