import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAnalysis } from "src/contexts/AnalysisContext";

const AnalysisLayout = () => {
  const { clearAnalysis } = useAnalysis();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#00CC99" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700" },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              clearAnalysis();
              router.back();
            }}
            style={{ marginLeft: 5 }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="Results" options={{ title: "Scan Results" }} />
      <Stack.Screen name="Checkout" options={{ title: "My Routine" }} />
    </Stack>
  );
};

export default AnalysisLayout;