import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Accordion from "@/components/designs/Accordian";
import { useAnalysis } from "src/contexts/AnalysisContext";
import Api from "@/services/Api";
import RoutineView from "@/components/results/RoutineView";
import DermaAlert, {
  dermaAlertTextStyle,
} from "@/components/designs/feedback/DermaAlert";

const Results = () => {
  const { analysis, analysisDescription, recommendDescription } = useAnalysis();
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
    return (
      <View style={styles.imagePlaceholder}>
        <ActivityIndicator size="small" color="#00CC99" />
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imgWrapper}>{getImageContent()}</View>

      <View style={styles.accordionWrapper}>
        <Accordion title="Analysis" defaultOpen={true}>
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
              <View style={styles.descriptionBlock}>
                <View style={styles.descriptionLabelRow}>
                  <MaterialCommunityIcons
                    name="magnify"
                    size={16}
                    color="#00CC99"
                  />
                  <Text style={styles.descriptionLabel}>Detection</Text>
                </View>
                <Text style={styles.descriptionText}>
                  {analysisDescription}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.descriptionBlock}>
                <View style={styles.descriptionLabelRow}>
                  <MaterialCommunityIcons
                    name="flask-outline"
                    size={16}
                    color="#00CC99"
                  />
                  <Text style={styles.descriptionLabel}>Key Ingredients</Text>
                </View>
                <Text style={styles.descriptionText}>
                  {recommendDescription}
                </Text>
              </View>
            </View>
          )}
        </Accordion>
      </View>

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
  accordionWrapper: { width: "100%", marginTop: 2 },
  analysisContent: { padding: 10 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  flaggedPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  flaggedPlaceholderText: { fontSize: 13, color: "#b0bec5" },
  descriptionBlock: { paddingVertical: 10 },
  descriptionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  descriptionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#00CC99",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  descriptionText: { fontSize: 14, color: "#666", lineHeight: 22 },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 4 },
  imagePlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
});