import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Card from "../Card";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ImageApi from "@/services/ImageApi";
const Camera = () => {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturePic, setCapturePic] = useState(null);

  const cameraRef = useRef(null);
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
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
    try {
      console.log("✅ Image confirmed:", capturePic.uri);
      await ImageApi.uploadImageAPI(capturePic.uri);
    } catch (err) {
      console.log("error why: ", err);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleCapturePic = async () => {
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });
      console.log("Captured photo: ", photo.uri);
      console.log("entire object: ", photo);
      setCapturePic(photo);
    } catch (err) {
      console.log("error uploading image....", err);
    }
  };

  return (
    <View style={styles.container}>
      {!capturePic ? (
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      ) : (
        <Image source={{ uri: capturePic.uri }} style={styles.camera} />
      )}

      {/* Buttons */}
      {!capturePic ? (
        <View style={styles.shutterContainer}>
          <TouchableOpacity
            style={styles.shutterButton}
            onPress={handleCapturePic}
          >
            <FontAwesome6 name="camera" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shutterButton}
            onPress={toggleCameraFacing}
          >
            <FontAwesome6 name="camera-rotate" size={28} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleRetake}>
            <Text style={{ color: "teal", fontWeight: "bold" }}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleUsePhoto}>
            <Text style={{ color: "teal", fontWeight: "bold" }}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Camera;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },

  shutterContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
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
    paddingHorizontal: 40,
  },
});
