import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useContext } from "react";
import { UserContext } from "src/contexts/UserContext";

const Index = () => {
  const { token, loading } = useContext(UserContext);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00CC99" />
      </View>
    );

  if (token) {
    return <Redirect href="/Home" />;
  } else {
    return <Redirect href="/LandingPage" />;
  }
};
export default Index;
