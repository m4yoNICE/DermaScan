import { Stack } from "expo-router";
import { UserProvider } from "src/contexts/UserContext";
import Toast from "react-native-toast-message";
const RootLayout = () => {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </UserProvider>
  );
};

export default RootLayout;
