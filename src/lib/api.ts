const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface ConversionResponse {
  downloadUrl: string;
  message: string;
  success: boolean;
}

export const convertFile = async (
  file: File,
  sourceFormat: string,
  targetFormat: string,
): Promise<ConversionResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("sourceFormat", sourceFormat);
  formData.append("targetFormat", targetFormat);

  try {
    const response = await fetch(`${API_BASE_URL}/api/convert`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Conversion failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during conversion:", error);
    throw error;
  }
};

export const downloadFile = async (downloadUrl: string): Promise<Blob> => {
  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error("Download failed");
    }
    return await response.blob();
  } catch (error) {
    console.error("Error during download:", error);
    throw error;
  }
};
