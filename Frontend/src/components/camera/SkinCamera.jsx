import { CameraView } from "expo-camera";
import { useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CircularButton from "../CircularButton";
import { router } from "expo-router";
import ImageApi from "@/services/ImageApi";

const SkinCamera = () => {
  const [failMessage, setFailMessage] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [enableTorch, setEnableTorch] = useState(false);
  const [capturePic, setCapturePic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);

  const shutterAnim = useRef(new Animated.Value(1)).current;

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>
          Camera access is required for skin scanning.
        </Text>
        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={requestPermission}
        >
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const animateShutter = () => {
    Animated.sequence([
      Animated.timing(shutterAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shutterAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCapture = async () => {
    try {
      animateShutter();

      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      setCapturePic(photo);
    } catch (err) {
      console.log("Capture error:", err);
    }
  };

  const handleUsePhoto = async () => {
    if (!capturePic) return;
    setIsLoading(true);

    try {
      const res = await ImageApi.uploadImageAPI(capturePic.uri);
      const { result, message, data } = res.data;
      if (result === "failed") {
        // Show alarm modal
        setFailMessage(res.data.message);
        setIsLoading(false);
        return;
      }
      router.push({
        pathname: "/Results",
        params: {
          data: JSON.stringify(res.data),
        },
      });
    } catch (err) {
      console.log("UPLOAD FAILED →", err?.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => setCapturePic(null);

  return (
    <View style={styles.container}>
      {/* CAMERA MASK */}
      <View style={styles.cameraMask}>
        {!capturePic && !failMessage && (
          <CameraView
            ref={cameraRef}
            style={styles.cameraBox}
            facing={facing}
            enableTorch={enableTorch}
          />
        )}
      </View>

      {/* FRAME OUTLINE */}
      <View pointerEvents="none" style={styles.frameOutline} />

      {/* CONTROLS */}
      <View style={styles.controls}>
        <CircularButton size={65} onPress={() => setEnableTorch(!enableTorch)}>
          <MaterialCommunityIcons name="flashlight" size={28} color="#fff" />
        </CircularButton>

        <Animated.View style={{ transform: [{ scale: shutterAnim }] }}>
          <CircularButton size={95} onPress={handleCapture}>
            <FontAwesome6 name="camera" size={30} color="#fff" />
          </CircularButton>
        </Animated.View>

        <CircularButton
          size={65}
          onPress={() => setFacing(facing === "back" ? "front" : "back")}
        >
          <FontAwesome6 name="camera-rotate" size={28} color="#fff" />
        </CircularButton>
      </View>

      {/* PREVIEW MODAL */}
      <Modal visible={!!capturePic} transparent animationType="fade">
        <View style={styles.modalContainer}>
          {isLoading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color="#00CC99" />
              <Text style={styles.loadingText}>Analyzing skin...</Text>
            </View>
          ) : (
            <View style={styles.previewCard}>
              <Image
                source={{ uri: capturePic?.uri }}
                style={styles.previewImg}
              />

              <Text style={styles.previewTitle}>Use this image?</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={handleRetake}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.okayBtn}
                  onPress={handleUsePhoto}
                >
                  <Text style={styles.okayText}>Okay</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
      {/* PREVIEW MODAL */}
      <Modal visible={!!failMessage} transparent animationType="fade">
        <View style={styles.failOverlay}>
          <View style={styles.failCard}>
            <Text style={styles.failTitle}>Alert</Text>
            <Text style={styles.failMsg}>{failMessage}</Text>

            <TouchableOpacity
              style={styles.failBtn}
              onPress={() => setFailMessage(null)}
            >
              <Text style={styles.failBtnText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SkinCamera;

const FRAME_SIZE = 280;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },

  // Camera masking area
  cameraMask: {
    marginTop: 90,
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    alignSelf: "center",
    borderRadius: FRAME_SIZE / 2,
    overflow: "hidden",
    backgroundColor: "#000",
    elevation: 10,
  },

  cameraBox: {
    width: "100%",
    height: "100%",
  },

  // Teal circle frame
  frameOutline: {
    position: "absolute",
    top: 90,
    alignSelf: "center",
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: FRAME_SIZE / 2,
    borderWidth: 4,
    borderColor: "#00CC99",
  },

  // Controls at bottom
  controls: {
    position: "absolute",
    bottom: 45,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
  },

  // Modal overlay
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  previewCard: {
    width: "88%",
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 25,
    alignItems: "center",
  },

  previewImg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
  },

  previewTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    color: "#222",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 25,
  },

  cancelBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "#000",
    marginRight: 10,
  },

  cancelText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  okayBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: "#000",
    marginLeft: 10,
  },

  okayText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },

  loadingCard: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 18,
    fontSize: 16,
    color: "#00CC99",
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  permissionText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },

  permissionBtn: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#00CC99",
  },

  permissionBtnText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
