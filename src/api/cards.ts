import api from "./client";
import { Platform } from "react-native";

export const uploadCardScan = async (formData: FormData) => {
  try {
    const response = await api.post("/cards/scan", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: (data, headers) => {
        // Axios on React Native sometimes has issues with multipart/form-data
        // We need to return data as is
        return data;
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading card scan:", error);
    throw error;
  }
};
