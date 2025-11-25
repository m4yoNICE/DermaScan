import { Stack } from "expo-router";
import { UserProvider } from "src/contexts/UserContext";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

/* ALERT CONFIG */
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#00CC99", height: 80 }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      text1Style={{
        fontSize: 18,
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 16,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red", height: 80 }}
      text1Style={{
        fontSize: 18,
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 16,
      }}
    />
  ),
};

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast config={toastConfig} />
      </UserProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
