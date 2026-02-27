import { StyleSheet, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import SkinCamera from "@/components/camera/SkinCamera";

import DirectionCameraModal from "@/components/camera/DirectionCameraModal";
export default function CameraPage() {
  const [isActive, setIsActive] = useState(false);
  const [showModal, setShowModal] = useState(true);
  //unmounts if not in page for performance
  useFocusEffect(
    useCallback(() => {
      setIsActive(true);

      function cleanup() {
        setIsActive(false);
      }
      return cleanup;
    }, []),
  );

  const handleAgree = () => {
    setShowModal(false);
  };
  let cameraContent;
  if (!isActive) {
    cameraContent = null;
  } else if (showModal) {
    cameraContent = (
      <DirectionCameraModal visible={showModal} onClose={handleAgree} />
    );
  } else {
    cameraContent = <SkinCamera />;
  }

  return <View style={styles.container}>{cameraContent}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
