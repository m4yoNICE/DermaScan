import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const oldcamera = () => {
  const [permission, requestPermission] = useCameraPermissions();

  // Refs
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const webStreamRef = useRef(null);

  // State
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [previewKey, setPreviewKey] = useState(0); // used to remount preview

  // Always show instructions when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setShowInstructions(true);
      setCapturedPhoto(null);
      setPreviewKey((k) => k + 1); // reset preview
    }, [])
  );

  // Start/restart web stream
  const startWebStream = async () => {
    try {
      if (webStreamRef.current) {
        webStreamRef.current.getTracks().forEach((t) => t.stop());
        webStreamRef.current = null;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      webStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch {}
      }
    } catch (err) {
      console.error("Web camera error:", err);
    }
  };

  // Setup web on mount
  useEffect(() => {
    if (Platform.OS === "web") {
      startWebStream();
      return () => {
        if (webStreamRef.current) {
          webStreamRef.current.getTracks().forEach((t) => t.stop());
        }
      };
    }
  }, []);

  // Handle permissions (native)
  if (Platform.OS !== "web") {
    if (!permission) return <Text style={{ color: "white" }}>Loading...</Text>;
    if (!permission.granted)
      return (
        <View style={styles.container}>
          <Text style={{ color: "white" }}>No access to camera</Text>
          <Text onPress={requestPermission} style={{ color: "teal" }}>
            Tap to grant permission
          </Text>
        </View>
      );
  }

  // Capture photo
  const takePhoto = async () => {
    if (Platform.OS === "web") {
      const video = videoRef.current;
      if (!video) return;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 720;
      canvas.height = video.videoHeight || 1280;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedPhoto(canvas.toDataURL("image/png"));
    } else {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedPhoto(photo.uri);
      }
    }
  };

  // ✅ Retake
  const handleRetake = async () => {
    setCapturedPhoto(null);
    setPreviewKey((k) => k + 1); // force remount preview
    setShowInstructions(false); // no modal on retake
    if (Platform.OS === "web") {
      await startWebStream(); // ensure stream is live again
    }
  };

  return (
    <View style={styles.container}>
      {/* Instructions modal */}
      <Modal visible={showInstructions} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView>
              <Text style={styles.modalTitle}>Camera Instructions</Text>
              <Text style={styles.instruction}>
                1. <Text style={styles.bold}>Clean, Clear & Steady:</Text> No
                makeup, fresh skin.
              </Text>
              <Text style={styles.instruction}>
                2. <Text style={styles.bold}>Good Lighting:</Text> Use natural
                or well-lit space.
              </Text>
              <Text style={styles.instruction}>
                3. <Text style={styles.bold}>Focus:</Text> Keep your face in
                frame.
              </Text>
              <Text style={styles.instruction}>
                4. <Text style={styles.bold}>Close-up:</Text> Ensure skin
                details are visible.
              </Text>
              <Text style={styles.instruction}>
                5. <Text style={styles.bold}>Stay Still:</Text> Hold steady for
                clarity.
              </Text>

              <TouchableOpacity
                style={styles.agreeButton}
                onPress={() => setShowInstructions(false)}
              >
                <Text style={styles.agreeText}>I agree</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Live camera or captured photo */}
      {!capturedPhoto ? (
        Platform.OS === "web" ? (
          <video
            key={`video-${previewKey}`} // force new element each time
            ref={videoRef}
            autoPlay
            playsInline
            style={styles.video}
          />
        ) : (
          <CameraView
            key={`camera-${previewKey}`} // force remount native camera
            ref={cameraRef}
            style={styles.camera}
            facing="front"
          />
        )
      ) : (
        <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
      )}

      {/* Shutter */}
      {!capturedPhoto && !showInstructions && (
        <View style={styles.shutterContainer}>
          <TouchableOpacity style={styles.shutterButton} onPress={takePhoto}>
            <Ionicons name="camera" size={28} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Retake / Use Photo */}
      {capturedPhoto && !showInstructions && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleRetake}>
            <Text style={{ color: "teal", fontWeight: "bold" }}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              console.log("✅ Image confirmed:", capturedPhoto);
            }}
          >
            <Text style={{ color: "teal", fontWeight: "bold" }}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default oldmanager;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1, width: "100%" },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    backgroundColor: "#000",
  },
  capturedImage: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    backgroundColor: "#000",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "teal",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  instruction: { fontSize: 16, marginBottom: 10, color: "white" },
  bold: { fontWeight: "bold", color: "white" },
  agreeButton: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  agreeText: { color: "teal", fontWeight: "bold", fontSize: 16 },

  shutterContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "teal",
    justifyContent: "center",
    alignItems: "center",
  },
  actions: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  actionBtn: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
