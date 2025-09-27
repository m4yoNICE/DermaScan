import { Stack } from "expo-router";
import { UserProvider } from "src/contexts/UserContext";
export default function RootLayout() {
  return (
    <UserProvider>
      <Stack />
    </UserProvider>
  );
}
