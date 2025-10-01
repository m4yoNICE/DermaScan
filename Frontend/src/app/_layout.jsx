import { Stack } from "expo-router";
import { UserProvider } from "src/contexts/UserContext";

const RootLayout = () => {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </UserProvider>
  );
};

export default RootLayout;
