import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

interface CameraModalProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (photo: any) => void;
}

export default function CameraModal({
  visible,
  onClose,
  onCapture,
}: CameraModalProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.message}>
            We need your permission to show the camera
          </Text>
          <TouchableOpacity onPress={requestPermission} style={styles.button}>
            <Text style={styles.text}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.text}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  function toggleCameraFacing() {
    setFacing((current: CameraType) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: false,
        });
        setPhoto(photoData);
      } catch (error) {
        Alert.alert("Error", "Failed to take picture");
      }
    }
  }

  function retakePicture() {
    setPhoto(null);
  }

  function confirmPicture() {
    if (photo) {
      setIsProcessing(true);
      // Simulate/Wait for parent handling?
      // Actually we just pass it up and let parent handle loading if needed.
      // But parent might want to close modal only after success.
      // For now, let's just pass it up.
      onCapture(photo);
      setPhoto(null);
      setIsProcessing(false);
      // Note: In a real app you might want to keep loading state until upload finishes.
      // But for this modal, we'll just close or let parent close it.
    }
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {photo ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: photo.uri }} style={styles.previewImage} />
            <View style={styles.previewControls}>
              <TouchableOpacity
                style={[styles.button, styles.retakeButton]}
                onPress={retakePicture}
                disabled={isProcessing}
              >
                <Text style={styles.text}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={confirmPicture}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.text}>Use Photo</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleCameraFacing}
              >
                <Ionicons name="camera-reverse" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
              >
                <View style={styles.captureInner} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={onClose}>
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </CameraView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginBottom: 40,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 5,
    alignSelf: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  controlButton: {
    padding: 10,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  previewImage: {
    flex: 1,
    resizeMode: "contain",
  },
  previewControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "black",
  },
  retakeButton: {
    backgroundColor: "#444",
    paddingHorizontal: 30,
  },
  confirmButton: {
    backgroundColor: "tomato",
    paddingHorizontal: 30,
  },
});
