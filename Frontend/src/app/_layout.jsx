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

//a lot of contexts needs to enclose the root for it to work globally inside the app
//since their usual code are <context.provider>{children}<context.provider
//given that the root layout should be the children
const RootLayout = () => {
  return (
    //this is for the bottomsheet
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/*This is for the tracking of the token to work and the logout*/}
      <UserProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast config={toastConfig} />
      </UserProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
