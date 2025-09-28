import { Stack } from "expo-router";
import { UserProvider } from "src/contexts/UserContext";

const RootLayout = () => {
  return (
    <UserProvider>
      <Stack />
    </UserProvider>
  );
};

export default RootLayout;
