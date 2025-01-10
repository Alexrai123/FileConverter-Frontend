import axios from "axios";

interface UserProfile {
  email: string;
  subscriptionType: string;
  price: number;
  fileSizeLimit: number;
  fileNumberLimitPerDay: number;
  subscriptionStartDate: string;
  nrOfFilesConvertedPerMonth: number;
}

const apiClient = axios.create({
  baseURL: "http://localhost:8080", // Adaptează portul dacă este diferit
  headers: {
    "Content-Type": "application/json",
  },
});

export const incrementFilesConverted = async (email: string) => {
  try {
    const response = await apiClient.put(
      `/users/profile/increment-files/${email}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("File conversion limit reached.");
    }
    throw error;
  }
};

export const decrementFilesConverted = async (email: string) => {
  return apiClient.put(`/users/profile/decrement-files/${email}`);
};

export const fetchUserProfile = async (email: string): Promise<UserProfile> => {
  try {
    const response = await apiClient.get(`/users/profile/${email}`);
    return response.data; // Returnează datele actualizate ale utilizatorului
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
};

export const clearConversionHistory = async (email: string) => {
  return apiClient.put(`/users/profile/clear-history/${email}`);
};

export const getSubscriptionTypes = async () => {
  const response = await apiClient.get("/subscriptionTypes/all");
  return response.data; // Datele JSON
};

export const changeSubscriptionType = async (
  email: string,
  subscriptionType: string
) => {
  return apiClient.put(`/users/profile/change-subscription/${email}`, {
    subscriptionType: subscriptionType,
  });
};

export const getUsers = async () => apiClient.get("/users/all");

export const updateUserByEmail = async (
  email: string,
  data: { email?: string; subscriptionType?: string }
) => {
  return apiClient.put(`/users/update-by-email/${email}`, data);
};

export const deleteUserByEmail = async (email: string) => {
  return apiClient.delete(`/users/${email}`);
};

export const loginAdmin = async (username: string, password: string) => {
  return apiClient.post("/login", { username, password });
};

export default apiClient;
