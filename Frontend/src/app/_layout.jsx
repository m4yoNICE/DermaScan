import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { UserProvider } from "src/contexts/UserContext";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { store } from "src/Store/Store";
import { toastConfig } from "src/config/ToastConfig";

//a lot of contexts needs to enclose the root for it to work globally inside the app
//since their usual code are <context.provider>{children}<context.provider
//given that the root layout should be the children
const RootLayout = () => {
  return (
    //this is for the bottomsheet
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/*This is for the tracking of the token to work and the logout*/}
      <UserProvider>
        <Provider store={store}>
          <Stack screenOptions={{ headerShown: false }} />
          <Toast config={toastConfig} />
        </Provider>
      </UserProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
