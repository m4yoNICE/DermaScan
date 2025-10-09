import { Stack } from "expo-router";
import { UserProvider } from "src/contexts/UserContext";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

{
  /* ALERT CONFIG */
}
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
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast config={toastConfig} />
    </UserProvider>
  );
};

export default RootLayout;
