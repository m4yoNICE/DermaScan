import { Stack } from "expo-router";
import { UserProvider } from "src/contexts/UserContext";
import { AnalysisProvider } from "src/contexts/AnalysisContext";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { toastConfig } from "@/components/designs/ToastConfig";
import { ProductProvider } from "src/contexts/ProductContext";

//a lot of contexts needs to enclose the root for it to work globally inside the app
//since their usual code are <context.provider>{children}<context.provider
//given that the root layout should be the children
const RootLayout = () => {
  return (
    //this is for the bottomsheet
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        {/*This is for the tracking of the token to work and the logout*/}
        <UserProvider>
          <AnalysisProvider>
            <ProductProvider>
              <Stack screenOptions={{ headerShown: false }} />
              <Toast config={toastConfig} />
            </ProductProvider>
          </AnalysisProvider>
        </UserProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
