import * as ImagePicker from "expo-image-picker";
import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CircularButton from "../designs/CircularButton";
import Slider from "@react-native-community/slider";
import Card from "../designs/cards/Card";
import { router } from "expo-router";
import Api from "@/services/Api";
import { useAnalysis } from "src/contexts/AnalysisContext";
import * as ImageManipulator from "expo-image-manipulator";
import { ToastMessage } from "../designs/feedback/ToastMessage";
import CameraLoadingModal from "./CameraLoadingModal";

const SkinCamera = () => {
  const {
    setAnalysis,
    setRecommendation,
    setAnalysisDescription,
    setRecommendDescription,
  } = useAnalysis();

  const [facing, setFacing] = useState("back");
  const [enableTorch, setEnableTorch] = useState(false);
  const [capturePic, setCapturePic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [failMessage, setFailMessage] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const cameraRef = useRef(null);
  const shutterAnim = useRef(new Animated.Value(1)).current;

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(facing);
  const handleFocus = useCallback(async (e) => {
    const { locationX, locationY } = e.nativeEvent;
    try {
      await cameraRef.current?.focus({ x: locationX, y: locationY });
    } catch {}
  }, []);

  if (!hasPermission) {
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

  if (!device) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>No camera device found.</Text>
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
    if (!cameraRef.current || !isCameraReady) {
      ToastMessage("error", "Camera not ready");
      return;
    }
    try {
      animateShutter();
      const photo = await cameraRef.current.takePhoto({
        flash: enableTorch ? "on" : "off",
        enableShutterSound: false,
      });

      const uri = `file://${photo.path}`;
      const size = Math.min(photo.width, photo.height);
      const originX = (photo.width - size) / 2;
      const originY = (photo.height - size) / 2;

      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ crop: { originX, originY, width: size, height: size } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG },
      );
      setCapturePic(result);
    } catch (err) {
      console.log("Capture error:", err);
      ToastMessage("error", "Capture failed", err.message);
    }
  };

  const handleUsePhoto = async () => {
    if (!capturePic) return;
    setIsLoading(true);
    try {
      const res = await Api.uploadSkinImageAPI(capturePic.uri);
      const { analysis, recommendation } = res.data;

      if (analysis.result === "failed") {
        setCapturePic(null);
        setFailMessage(analysis.message);
        return;
      }
      if (analysis.result === "consult") {
        setAnalysis({
          status: "consult",
          condition_name: analysis.data.condition_name,
          confidenceScores: analysis.data.confidenceScores,
        });
        router.push("/Results");
        return;
      }
      if (analysis.result === "flagged") {
        setAnalysis({ status: "flagged" });
        router.push("/Results");
        return;
      }
      if (analysis.result === "normal") {
        setAnalysis({
          status: "normal",
          condition_name: analysis.data.condition_name,
          confidenceScores: analysis.data.confidenceScores,
          image_url: analysis.data.image_url,
        });
        router.push("/Results");
        return;
      }
      if (analysis.result === "success") {
        setAnalysis({
          id: analysis.data.id,
          userId: analysis.data.userId,
          imageId: analysis.data.imageId,
          conditionId: analysis.data.conditionId,
          confidenceScores: analysis.data.confidenceScores,
          status: analysis.data.status,
          condition_name: analysis.data.condition_name,
          canRecommend: analysis.data.canRecommend,
          createdAt: analysis.data.createdAt,
          updatedAt: analysis.data.updatedAt,
          image_url: analysis.data.image_url,
          candidates: analysis.data.candidates,
        });
        setAnalysisDescription(res.data.analysisDescription);
        setRecommendDescription(res.data.recommendDescription);
        setRecommendation(recommendation?.map((item) => ({ ...item })) ?? []);
        router.push("/Results");
      }
    } catch (err) {
      console.log("UPLOAD FAILED →", err);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setCapturePic({ uri: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {!capturePic ? (
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
            torch={enableTorch ? "on" : "off"}
            zoom={zoom}
            onTouchEnd={handleFocus}
            onInitialized={() => setIsCameraReady(true)}
          />
        ) : (
          <Image source={{ uri: capturePic.uri }} style={styles.cameraBox} />
        )}

        {!capturePic && (
          <TouchableOpacity
            style={styles.topUtilityBtn}
            onPress={() => setEnableTorch(!enableTorch)}
          >
            <MaterialCommunityIcons
              name={enableTorch ? "flashlight" : "flashlight-off"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        )}
      </View>

      {!capturePic && (
        <View style={styles.sliderContainer}>
          <Text style={styles.zoomText}>Zoom</Text>
          <Slider
            style={{ width: 250, height: 40 }}
            minimumValue={1}
            maximumValue={5}
            minimumTrackTintColor="#00CC99"
            maximumTrackTintColor="#99EBD6"
            thumbTintColor="#00CC99"
            value={zoom}
            onValueChange={setZoom}
          />
        </View>
      )}

      <View style={styles.bottomTabEnclosure}>
        {capturePic && !isLoading ? (
          <View style={styles.previewActionContainer}>
            <TouchableOpacity
              style={styles.previewActionBtn}
              onPress={() => setCapturePic(null)}
            >
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.previewActionBtn, styles.usePhotoBtn]}
              onPress={handleUsePhoto}
            >
              <Text style={styles.previewActionText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.controls}>
            <CircularButton size={65} onPress={pickImage}>
              <MaterialCommunityIcons
                name="image-multiple"
                size={28}
                color="#fff"
              />
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
        )}
      </View>

      <Modal visible={!!failMessage} transparent animationType="fade">
        <View style={styles.failOverlay}>
          <Card>
            <Text style={styles.failTitle}>Alert</Text>
            <Text style={styles.failMsg}>{failMessage}</Text>
            <TouchableOpacity
              style={styles.failBtn}
              onPress={() => {
                setCapturePic(null);
                setFailMessage(null);
              }}
            >
              <Text style={styles.failBtnText}>Okay</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </Modal>

      <CameraLoadingModal
        visible={isLoading}
        onTimeout={() => {
          setIsLoading(false);
          setCapturePic(null);
        }}
      />
    </View>
  );
};

export default SkinCamera;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  cameraContainer: {
    width: "100%",
    aspectRatio: 1,
    marginTop: 60,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  cameraBox: { flex: 1 },
  bottomTabEnclosure: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 180,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    justifyContent: "center",
    paddingBottom: 20,
  },
  topUtilityBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 25,
    zIndex: 10,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  previewActionContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
  previewActionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    width: "40%",
    alignItems: "center",
  },
  usePhotoBtn: { backgroundColor: "#00CC99", borderColor: "#00CC99" },
  previewActionText: { fontWeight: "600", color: "#fff" },
  retakeText: { fontWeight: "600", color: "#333" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  permissionText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  permissionBtn: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#00CC99",
  },
  permissionBtnText: { fontSize: 16, color: "#fff", fontWeight: "600" },
  failOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  failTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  failMsg: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  failBtn: {
    backgroundColor: "#1e7d64",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
  },
  failBtnText: { color: "white", textAlign: "center", fontWeight: "600" },
  sliderContainer: {
    position: "absolute",
    bottom: 180,
    width: "100%",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "rgb(255, 255, 255)",
    paddingVertical: 8,
  },
  zoomText: { color: "#00CC99", fontWeight: "600", marginBottom: -5 },
});
