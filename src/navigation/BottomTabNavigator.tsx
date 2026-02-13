import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ListScreen from "../screens/ListScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import FloatingActionButton from "../components/FloatingActionButton";
import CameraModal from "../components/CameraModal";
import { uploadCardScan } from "../api/cards";
import { useAuthStore } from "../store/useAuthStore";
import { Alert, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const handleCapture = async (photo: any) => {
    try {
      const formData = new FormData();

      const filename = photo.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      // @ts-ignore
      formData.append("image", {
        uri: photo.uri,
        name: filename,
        type,
      });

      if (user?.id) {
        formData.append("userId", user.id.toString());
      }

      await uploadCardScan(formData);
      await queryClient.invalidateQueries({ queryKey: ["cards"] });
      Alert.alert("Success", "Card uploaded for processing!");
      setIsCameraVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to upload card.");
    }
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === "List") {
              iconName = focused ? "list" : "list-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            } else {
              iconName = "help-circle";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="List" component={ListScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      <FloatingActionButton onPress={() => setIsCameraVisible(true)} />

      <CameraModal
        visible={isCameraVisible}
        onClose={() => setIsCameraVisible(false)}
        onCapture={handleCapture}
      />
    </>
  );
}
