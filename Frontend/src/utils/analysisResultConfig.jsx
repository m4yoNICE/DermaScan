import React from "react";
import { Text, View, StyleSheet } from "react-native";
import DermaAlert, {
  getDermaAlertTextStyle,
} from "@/components/designs/feedback/DermaAlert";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function formatConditionName(raw) {
  if (!raw) return "Unknown Condition";
  const severities = ["mild", "moderate", "severe"];
  return raw
    .split("-")
    .filter((p) => !severities.includes(p))
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const resultConfig = {
  flagged: {
    showImage: false,
    analysisContent: () => (
      <DermaAlert variant="danger">
        <Text style={getDermaAlertTextStyle("danger")}>
          Our system cannot detect this as it may be outside of scope or it may
          need expert intervention.
        </Text>
        <Text style={[getDermaAlertTextStyle("danger"), { marginTop: 6 }]}>
          Please see a dermatologist for proper care.
        </Text>
      </DermaAlert>
    ),
    recommendContent: () => (
      <DermaAlert variant="danger">
        <Text style={getDermaAlertTextStyle("danger")}>
          This concern may require professional consultation. Please see a
          dermatologist for proper care.
        </Text>
      </DermaAlert>
    ),
  },

  consult: {
    showImage: true,
    analysisContent: (analysis) => (
      <DermaAlert variant="warning">
        <View style={consultStyles.row}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={16}
            color="#8a6000"
          />
          <Text
            style={[getDermaAlertTextStyle("warning"), consultStyles.label]}
          >
            Detected Condition
          </Text>
        </View>
        <Text
          style={[
            getDermaAlertTextStyle("warning"),
            consultStyles.conditionName,
          ]}
        >
          {formatConditionName(analysis.condition_name)}
        </Text>
        <Text
          style={[getDermaAlertTextStyle("warning"), consultStyles.confidence]}
        >
          Confidence: {(analysis.confidenceScores * 100).toFixed(1)}%
        </Text>
        <View style={consultStyles.divider} />
        <Text style={getDermaAlertTextStyle("warning")}>
          This condition appears severe. Results are shown for awareness only.
          Please consult a dermatologist for accurate diagnosis.
        </Text>
      </DermaAlert>
    ),
    recommendContent: () => (
      <DermaAlert variant="warning">
        <Text style={getDermaAlertTextStyle("warning")}>
          Over-the-counter products may not be sufficient for this condition.
          Professional dermatological treatment is recommended.
        </Text>
      </DermaAlert>
    ),
  },

  success: {
    showImage: true,
    analysisContent: null,
    recommendContent: null,
  },
};

export function getResultConfig(status) {
  return resultConfig[status] ?? resultConfig.flagged;
}

const consultStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  label: {
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: 11,
    letterSpacing: 1,
  },
  conditionName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  confidence: {
    fontSize: 13,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#F5A623",
    opacity: 0.3,
    marginVertical: 8,
  },
});
