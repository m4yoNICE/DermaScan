import React from "react";
import { Text, View, StyleSheet } from "react-native";
import DermaAlert, { getDermaAlertTextStyle } from "@/components/designs/feedback/DermaAlert";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function formatConditionName(raw) {
  if (!raw) {
    return "Unknown Condition";
  }

  const severities = ["mild", "moderate", "severe"];
  const words = raw.split("-");
  const filtered = [];

  for (let i = 0; i < words.length; i++) {
    if (!severities.includes(words[i])) {
      filtered.push(words[i].charAt(0).toUpperCase() + words[i].slice(1));
    }
  }

  return filtered.join(" ");
}

function FlaggedAnalysisContent() {
  return (
    <DermaAlert variant="danger">
      <Text style={getDermaAlertTextStyle("danger")}>
        Our system cannot detect this as it may be outside of scope or it may need expert intervention.
      </Text>
      <Text style={[getDermaAlertTextStyle("danger"), { marginTop: 6 }]}>
        Please see a dermatologist for proper care.
      </Text>
    </DermaAlert>
  );
}

function FlaggedRecommendContent() {
  return (
    <DermaAlert variant="danger">
      <Text style={getDermaAlertTextStyle("danger")}>
        This concern may require professional consultation. Please see a dermatologist for proper care.
      </Text>
    </DermaAlert>
  );
}

function ConsultAnalysisContent({ analysis }) {
  const conditionName = formatConditionName(analysis.condition_name);
  const confidence = (analysis.confidenceScores * 100).toFixed(1);

  return (
    <DermaAlert variant="warning">
      <View style={consultStyles.row}>
        <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#8a6000" />
        <Text style={[getDermaAlertTextStyle("warning"), consultStyles.label]}>
          Detected Condition
        </Text>
      </View>
      <Text style={[getDermaAlertTextStyle("warning"), consultStyles.conditionName]}>
        {conditionName}
      </Text>
      <Text style={[getDermaAlertTextStyle("warning"), consultStyles.confidence]}>
        Confidence: {confidence}%
      </Text>
      <View style={consultStyles.divider} />
      <Text style={getDermaAlertTextStyle("warning")}>
        This condition appears severe. Results are shown for awareness only.
        Please consult a dermatologist for accurate diagnosis.
      </Text>
    </DermaAlert>
  );
}

function ConsultRecommendContent() {
  return (
    <DermaAlert variant="warning">
      <Text style={getDermaAlertTextStyle("warning")}>
        Over-the-counter products may not be sufficient for this condition.
        Professional dermatological treatment is recommended.
      </Text>
    </DermaAlert>
  );
}

export function getResultConfig(status) {
  if (status === "flagged") {
    return {
      showImage: false,
      analysisContent: () => <FlaggedAnalysisContent />,
      recommendContent: () => <FlaggedRecommendContent />,
    };
  }

  if (status === "consult") {
    return {
      showImage: true,
      analysisContent: (analysis) => <ConsultAnalysisContent analysis={analysis} />,
      recommendContent: () => <ConsultRecommendContent />,
    };
  }

  if (status === "success") {
    return {
      showImage: true,
      analysisContent: null,
      recommendContent: null,
    };
  }

  // fallback — treat unknown status same as flagged
  return {
    showImage: false,
    analysisContent: () => <FlaggedAnalysisContent />,
    recommendContent: () => <FlaggedRecommendContent />,
  };
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