import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Platform } from "react-native";

// Adjust URL based on environment
const API_URL = "http://localhost:3000/cards/scan";

export const useScanCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageUri: string) => {
      const formData = new FormData();

      const fileName = imageUri.split("/").pop() || "card.jpg";
      const fileType =
        fileName.split(".").pop() === "png" ? "image/png" : "image/jpeg";

      formData.append("image", {
        uri: Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
        name: fileName,
        type: fileType,
      } as any);

      // Add dummy userId for now as per backend controller assumption
      formData.append("userId", "1");

      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      console.log("Scan initiated:", data);
      // Optimistically add to list or just invalidate to fetch the "Pending" card
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
    onError: (error) => {
      console.error("Scan failed:", error);
    },
  });
};
