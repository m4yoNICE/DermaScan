import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { Dimensions } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import CircularButton from "../CircularButton";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ImageApi from "@/services/ImageApi";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const SkinCamera = () => {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturePic, setCapturePic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [enableTorch, setEnableTorch] = useState(false);
  const [cameraLayout, setCameraLayout] = useState({ width: 0, height: 0 });
  const [analysisResult, setAnalysisResult] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleRetake = () => {
    setCapturePic(null);
  };

  const handleUsePhoto = async () => {
    if (!capturePic) return;
    setIsLoading(true);
    try {
      console.log("✅ Image confirmed:", capturePic.uri);
      const response = await ImageApi.uploadImageAPI(capturePic.uri);
      console.log("✅ Backend response:", response.data);

      router.push({
        pathname: "/Results",
        params: { data: JSON.stringify(response.data) },
      });
      setCapturePic(null);
    } catch (err) {
      console.log("Upload failed:", err.message || err);
    } finally {
      setIsLoading(false);
    }
  };
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setEnableTorch((prev) => !prev);
  };

  const cropToFrame = async (photo) => {
    const { width: previewWidth, height: previewHeight } = cameraLayout;
    if (!previewWidth || !previewHeight) return photo;

    const frameSize = 250;
    const frameWidthRatio = frameSize / previewWidth;
    const frameHeightRatio = frameSize / previewHeight;
    const cropWidth = photo.width * frameWidthRatio;
    const cropHeight = photo.height * frameHeightRatio;
    const cropX = (photo.width - cropWidth) / 2;
    const cropY = (photo.height - cropHeight) / 2;
    const cropRect = {
      originX: Math.round(cropX),
      originY: Math.round(cropY),
      width: Math.round(cropWidth),
      height: Math.round(cropHeight),
    };
    const result = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ crop: cropRect }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    return result;
  };

  const handleCapturePic = async () => {
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });
      const croppedPhoto = await cropToFrame(photo);
      setCapturePic(croppedPhoto);
    } catch (err) {
      console.log("error capturing image....", err);
    }
  };

  return (
    <View style={styles.container}>
      {!capturePic && (
        <>
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing={facing}
            enableTorch={enableTorch}
            onLayout={(e) => setCameraLayout(e.nativeEvent.layout)}
          />

          <View style={styles.overlay}>
            <View style={styles.frame} />
          </View>

          <View style={styles.shutterContainer}>
            <CircularButton size={70} onPress={toggleFlash}>
              <MaterialCommunityIcons
                name="flashlight"
                size={24}
                color="#fff"
              />
            </CircularButton>
            <CircularButton size={100} onPress={handleCapturePic}>
              <FontAwesome6 name="camera" size={28} color="#fff" />
            </CircularButton>
            <CircularButton size={70} onPress={toggleCameraFacing}>
              <FontAwesome6 name="camera-rotate" size={28} color="#fff" />
            </CircularButton>
          </View>
        </>
      )}

      <Modal
        visible={capturePic !== null}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          {isLoading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color="#00CC99" />
              <Text style={styles.loadingText}>
                Skin Analysis Commencing...
              </Text>
            </View>
          ) : (
            <View style={styles.previewCard}>
              <Image
                source={
                  capturePic && capturePic.uri
                    ? { uri: capturePic.uri }
                    : undefined
                }
                style={styles.previewImage}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalBtn}
                  onPress={handleRetake}
                >
                  <Text style={styles.btnText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalBtn}
                  onPress={handleUsePhoto}
                >
                  <Text style={styles.btnText}>Use Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default SkinCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  shutterContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    width: 250,
    height: 250,
    borderColor: "#00CC99",
    borderWidth: 3,
    backgroundColor: "transparent",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  previewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  previewImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalBtn: {
    backgroundColor: "#00CC99",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#00CC99",
    fontSize: 16,
  },
});
