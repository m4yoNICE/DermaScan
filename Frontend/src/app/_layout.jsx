import { Stack } from "expo-router";
import { UserProvider } from "src/contexts/UserContext";
import { AnalysisProvider } from "src/contexts/AnalysisContext";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { toastConfig } from "@/components/designs/feedback/ToastConfig";
import { ProductProvider } from "src/contexts/ProductContext";
import { UserDataProvider } from "@/contexts/UserDataContext";
import { HomeDataProvider } from "@/contexts/HomeDataContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
//a lot of contexts needs to enclose the root for it to work globally inside the app
//since their usual code are <context.provider>{children}<context.provider
//given that the root layout should be the children
const RootLayout = () => {
  return (
    //this is for the bottomsheet
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          {/*This is for the tracking of the token to work and the logout*/}
          <UserProvider>
            <UserDataProvider>
              <HomeDataProvider>
                <AnalysisProvider>
                  <ProductProvider>
                    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
                      <Stack screenOptions={{ headerShown: false }} />
                    </SafeAreaView>
                    <Toast config={toastConfig} />
                  </ProductProvider>
                </AnalysisProvider>
              </HomeDataProvider>
            </UserDataProvider>
          </UserProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default RootLayout;
