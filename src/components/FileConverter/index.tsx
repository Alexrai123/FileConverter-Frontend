import React, { useState } from "react";
import DropZone from "./DropZone";
import FormatSelection from "./FormatSelection";
import ConversionProgress from "./ConversionProgress";
import ResultsList from "./ResultsList";
import { FileFormat } from "./FormatDropdown";

type ConversionStatus = "success" | "error" | "pending";

interface ConversionResult {
  id: string;
  filename: string;
  status: ConversionStatus;
  error?: string;
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

  const isValidConversion = (source: FileFormat, target: FileFormat) => {
    return VALID_CONVERSIONS[source]?.includes(target);
  };

  const getConvertedFilename = (
    originalName: string,
    targetFormat: FileFormat,
  ) => {
    // Remove the original extension and add the new one
    const nameWithoutExtension = originalName.split(".")[0];
    return `${nameWithoutExtension}${targetFormat}`;
  };

  const handleFileSelect = (files: FileList) => {
    setIsConverting(true);

    // Process each file
    Array.from(files).forEach((file) => {
      const convertedFilename = getConvertedFilename(file.name, targetFormat);
      const newResult: ConversionResult = {
        id: Math.random().toString(36).substr(2, 9),
        filename: convertedFilename,
        status: "pending",
      };

      setResults((prev) => [newResult, ...prev]);

      // Simulate conversion progress
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          clearInterval(interval);
          setIsConverting(false);
          setProgress(0);

          // Update result status based on conversion validity
          setResults((prev) =>
            prev.map((result) =>
              result.id === newResult.id
                ? {
                    ...result,
                    status: isValidConversion(sourceFormat, targetFormat)
                      ? "success"
                      : "error",
                    error: isValidConversion(sourceFormat, targetFormat)
                      ? undefined
                      : `Cannot convert from ${sourceFormat} to ${targetFormat}`,
                  }
                : result,
            ),
          );
        }
      }, 500);
    });
  };

  const handleDownload = (id: string) => {
    // Handle file download logic here
    console.log(`Downloading file with id: ${id}`);
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
