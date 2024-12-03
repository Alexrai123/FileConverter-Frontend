import React, { useState } from "react";
import DropZone from "./DropZone";
import FormatSelection from "./FormatSelection";
import ConversionProgress from "./ConversionProgress";
import ResultsList from "./ResultsList";
import { FileFormat } from "./FormatDropdown";

const FileConverter = () => {
  const [sourceFormat, setSourceFormat] = useState<FileFormat>(".txt");
  const [targetFormat, setTargetFormat] = useState<FileFormat>(".pdf");
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileSelect = (files: FileList) => {
    setIsConverting(true);
    // Simulate conversion progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsConverting(false);
      }
    }, 500);
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
      <ResultsList />
    </div>
  );
};

export default FileConverter;
