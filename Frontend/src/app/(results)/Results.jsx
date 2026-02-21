import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Accordion from "@/components/designs/Accordian";
import { useAnalysis } from "src/contexts/AnalysisContext";
import Api from "@/services/Api";
import RoutineView from "@/components/results/RoutineView";
import LoadingModal from "@/components/designs/LoadingModal";
import DermaAlert, {
  dermaAlertTextStyle,
} from "@/components/designs/DermaAlert";

const Results = () => {
  const { analysis } = useAnalysis();
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (analysis?.image_url) {
      const url = Api.getSkinImage(analysis.image_url);
      setImageUrl(url);
    }
  }, [analysis]);

  if (!analysis) {
    return (
      <View style={styles.centered}>
        <Text>No analysis data available.</Text>
      </View>
    );
  }

  const getImageContent = () => {
    if (analysis.status === "flagged") {
      return (
        <View style={styles.flaggedPlaceholder}>
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={48}
            color="#b0bec5"
          />
          <Text style={styles.flaggedPlaceholderText}>Image not available</Text>
        </View>
      );
    }
    if (imageUrl) {
      return (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={(e) => console.error("Image load failed:", e.nativeEvent)}
        />
      );
    }

    return <LoadingModal />;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imgWrapper}>{getImageContent()}</View>

      {/* Analysis Accordion */}
      <View style={styles.accordionWrapper}>
        <Accordion title="Analysis">
          {analysis.status === "flagged" ? (
            <DermaAlert>
              <Text style={dermaAlertTextStyle}>
                Our system cannot detect this as it may be outside of scope or
                it may need expert intervention.
              </Text>
              <Text style={dermaAlertTextStyle}>
                Please see a dermatologist for proper care.
              </Text>
            </DermaAlert>
          ) : (
            <View style={styles.analysisContent}>
              <Text style={styles.analysisText}>
                The system has detected signs of
                <Text style={styles.highlight}>{analysis.condition_name}</Text>
                with a confidence level of
                <Text style={styles.highlight}>
                  {(Number(analysis.confidenceScores) * 100).toFixed(2)}%{" "}
                </Text>
              </Text>
            </View>
          )}
        </Accordion>
      </View>

      {/* Recommendation Accordion */}
      <View style={styles.accordionWrapper}>
        <Accordion title="Recommendation">
          {analysis.status === "flagged" || analysis.canRecommend === "No" ? (
            <DermaAlert>
              <Text style={dermaAlertTextStyle}>
                This concern may require professional consultation. Please see a
                dermatologist for proper care.
              </Text>
            </DermaAlert>
          ) : (
            <RoutineView />
          )}
        </Accordion>
      </View>
    </ScrollView>
  );
};

export default Results;

const styles = StyleSheet.create({
  container: { paddingBottom: 40, alignItems: "center" },
  imgWrapper: {
    width: "100%",
    height: 300,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
  },
  image: { width: "100%", height: "100%" },
  accordionWrapper: {
    width: "100%",
    marginTop: 2,
  },
  analysisContent: {
    padding: 10,
  },
  analysisText: {
    fontSize: 18,
    lineHeight: 26,
    color: "#333",
  },
  highlight: {
    fontWeight: "700",
    color: "#00CC99",
  },
  standardContent: {
    padding: 10,
  },
  standardText: {
    fontSize: 16,
    color: "#444",
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  flaggedPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  flaggedPlaceholderText: {
    fontSize: 13,
    color: "#b0bec5",
  },
});
