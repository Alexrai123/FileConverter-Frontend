import React, { useState, useEffect } from "react";
import DropZone from "./DropZone";
import FormatSelection from "./FormatSelection";
import ConversionProgress from "./ConversionProgress";
import ResultsList from "./ResultsList";
import { FileFormat } from "./FormatDropdown";
import { useToast } from "@/components/ui/use-toast";
import { incrementFilesConverted } from "@/api/apiClient";
import { fetchUserProfile } from "@/api/apiClient";
import { clearConversionHistory } from "@/api/apiClient";

type ConversionStatus = "success" | "error" | "pending";

interface ConversionResult {
  id: string;
  filename: string;
  status: ConversionStatus;
  error?: string;
  blob?: Blob;
}

interface UserProfile {
  email: string;
  subscriptionType: string;
  price: number;
  fileSizeLimit: number;
  fileNumberLimitPerDay: number;
  subscriptionStartDate: string;
  nrOfFilesConvertedPerMonth: number;
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
  const [profile, setProfile] = useState<UserProfile | null>(null); // `UserProfile` este tipul profilului
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedResults = localStorage.getItem("conversionResults");
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  const isValidConversion = (source: FileFormat, target: FileFormat) => {
    return VALID_CONVERSIONS[source]?.includes(target);
  };

  const getConvertedFilename = (
    originalName: string,
    targetFormat: FileFormat
  ) => {
    const nameWithoutExtension = originalName.split(".")[0];
    return `${nameWithoutExtension}${targetFormat}`;
  };

  const handleFileConversionSuccess = async (email: string) => {
    try {
      await incrementFilesConverted(email); // Apel către backend

      // Fetch profil actualizat
      const updatedProfile = await fetchUserProfile(email);
      setProfile(updatedProfile);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated with the new file count.",
      });
    } catch (error: any) {
      if (error.message === "File conversion limit reached.") {
        toast({
          variant: "destructive",
          title: "Limit reached",
          description: "You have reached your daily file conversion limit.",
        });
      } else {
        console.error("Error updating profile:", error);
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "Failed to update your profile. Please try again.",
        });
      }
    }
  };

  const handleFileSelect = async (files: FileList) => {
    setIsConverting(true);
    const userEmail = localStorage.getItem("loggedInEmail"); // Preia email-ul utilizatorului logat
    if (!userEmail) {
      alert("No logged-in user found.");
      setIsConverting(false);
      return;
    }
    for (const file of Array.from(files)) {
      const convertedFilename = getConvertedFilename(file.name, targetFormat);

      try {
        // Incrementarea în backend (verifică limita)
        await incrementFilesConverted(userEmail);

        // Simularea conversiei
        const blob = await new Promise<Blob>((resolve) =>
          setTimeout(
            () =>
              resolve(new Blob([`Simulated content`], { type: "text/plain" })),
            3000
          )
        );

        // Adaugă fișierul în istoric doar dacă conversia a reușit
        const newResult: ConversionResult = {
          id: Math.random().toString(36).substr(2, 9),
          filename: convertedFilename,
          status: "success",
          blob,
        };

        setResults((prev) => {
          const updatedResults = [newResult, ...prev];
          localStorage.setItem(
            "conversionResults",
            JSON.stringify(updatedResults)
          );
          return updatedResults;
        });

        // Afișează mesaj de succes
        alert(
          `Conversion successful: ${file.name} has been converted to ${targetFormat}`
        );
      } catch (error: any) {
        console.error("Error during file conversion:", error);

        // Afișează notificare de eroare dacă limita este depășită
        if (error.message === "File conversion limit reached.") {
          alert("Error: You have reached your daily file conversion limit.");
        } else {
          alert(`Error: Failed to convert ${file.name}.`);
        }
      }
    }
    setIsConverting(false);
    setProgress(0);
  };

  const handleDownload = async (id: string) => {
    const result = results.find((r) => r.id === id);
    if (!result?.blob) return;

    try {
      const url = window.URL.createObjectURL(result.blob);
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

  const handleClearHistory = async () => {
    try {
      // Șterge istoricul doar din frontend (și localStorage)
      setResults([]); // Resetează starea Conversion Results
      localStorage.removeItem("conversionResults"); // Șterge istoricul din localStorage

      // Opțional: Apel către backend pentru alte scopuri
      const userEmail = localStorage.getItem("loggedInEmail"); // Preia email-ul utilizatorului logat
      if (!userEmail) {
        alert("No logged-in user found.");
        return;
      }
      await clearConversionHistory(userEmail);

      alert("Conversion history cleared successfully.");
    } catch (error) {
      console.error("Error clearing conversion history:", error);
      alert("Failed to clear conversion history. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-background min-h-screen flex flex-col items-center">
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

      {/* Adaugă un wrapper div pentru buton */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleClearHistory}
          className="bg-red-500 text-white px-6 py-3 rounded shadow-md hover:bg-red-600 transition duration-200"
        >
          Clear Conversion History
        </button>
      </div>
    </div>
  );
};

export default FileConverter;
