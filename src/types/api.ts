export type LoginResponse = {
  token: string;
};

export const convertFile = async (
  file: File,
  targetFormat: string
): Promise<Blob> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const simulatedBlob = new Blob([`Simulated content for ${file.name}`], {
        type: "text/plain",
      });
      resolve(simulatedBlob);
    }, 3000); // Simulează o întârziere de 3 secunde
  });
};
