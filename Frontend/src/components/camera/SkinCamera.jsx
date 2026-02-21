import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
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
import CircularButton from "../designs/CircularButton";
import Card from "../designs/Card";
import { router } from "expo-router";
import ImageApi from "@/services/ImageApi";
import { useAnalysis } from "src/contexts/AnalysisContext";

const SkinCamera = () => {
  const { setAnalysis, setRecommendation } = useAnalysis();
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
    console.log("SKIN CAMERA");
    if (!capturePic) return;
    setIsLoading(true);
    console.log("Analysing Image");
    try {
      const res = await ImageApi.uploadSkinImageAPI(capturePic.uri);
      const { analysis, recommendation } = res.data;

      if (analysis.result === "failed") {
        setCapturePic(null);
        setFailMessage(analysis.message);
        return;
      }

      if (analysis.result === "flagged") {
        setAnalysis({ status: "flagged" });
        router.push("/Results");
        return;
      }

      if (analysis.result === "success") {
        const analysisResults = {
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
        };
        console.log("Analysis Results: ", analysisResults);
        setAnalysis(analysisResults);

        const recommendationResults =
          recommendation?.map((item) => ({
            id: item.id,
            productName: item.productName,
            productImage: item.productImage,
            ingredient: item.ingredient,
            description: item.description,
            productType: item.productType,
            locality: item.locality,
            skinType: item.skinType,
            dermaTested: item.dermaTested,
            timeRoutine: item.timeRoutine,
            score: item.score,
          })) ?? [];
        console.log("Recommendation Results: ", recommendationResults);
        setRecommendation(recommendationResults);

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
      aspect: [1, 1], // Match your cameraBox aspect ratio
      quality: 1,
    });

    if (!result.canceled) {
      setCapturePic({ uri: result.assets[0].uri });
    }
  };

  const handleRetake = () => setCapturePic(null);

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {!capturePic ? (
          <CameraView
            ref={cameraRef}
            style={styles.cameraBox}
            facing={facing}
            enableTorch={enableTorch}
          />
        ) : (
          <Image source={{ uri: capturePic.uri }} style={styles.cameraBox} />
        )}

        {/* FLASH/TORCH OVERLAY BUTTON */}
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

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        {capturePic && !isLoading && (
          <View style={styles.previewActionContainer}>
            <TouchableOpacity
              style={styles.previewActionBtn}
              onPress={handleRetake}
            >
              <Text style={styles.previewActionText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.previewActionBtn, styles.usePhotoBtn]}
              onPress={handleUsePhoto}
            >
              <Text style={styles.previewActionText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Tab bar style that encloses the buttons */}
      <View style={styles.bottomTabEnclosure}>
        <View style={styles.controls}>
          {/* GALLERY BUTTON */}
          <CircularButton size={65} onPress={pickImage}>
            <MaterialCommunityIcons
              name="image-multiple"
              size={28}
              color="#fff"
            />
          </CircularButton>

          {/* SHUTTER BUTTON */}
          <Animated.View style={{ transform: [{ scale: shutterAnim }] }}>
            <CircularButton size={95} onPress={handleCapture}>
              <FontAwesome6 name="camera" size={30} color="#fff" />
            </CircularButton>
          </Animated.View>

          {/* CAMERA ROTATE BUTTON */}
          <CircularButton
            size={65}
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
          >
            <FontAwesome6 name="camera-rotate" size={28} color="#fff" />
          </CircularButton>
        </View>
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
    </View>
  );
};

export default SkinCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cameraContainer: {
    width: "100%",
    aspectRatio: 1,
    marginTop: 60,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  cameraBox: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomTabEnclosure: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 180, // Height to sufficiently enclose controls
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
    marginTop: 20,
  },
  previewActionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  usePhotoBtn: {
    backgroundColor: "#00CC99",
    borderColor: "#00CC99",
  },
  previewActionText: {
    fontWeight: "600",
  },
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
  permissionBtnText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  failOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  failTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
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
  failBtnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});
