import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Drawer } from "expo-router/drawer";
import Logo from "@/components/Logo";
import { DrawerItemList } from "@react-navigation/drawer";

function CustomDrawerContent(props) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Logo style={{ width: 32, height: 32 }} />
        <Text style={styles.title}>DermaScan+</Text>
      </View>
      <DrawerItemList {...props} />
    </View>
  );
}

export const Drawerlayout = () => {
  return (
    <Drawer
      initialRouteName="(tabs)"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#00CC99",
        },
        headerTintColor: "#fff",
        headerTitle: () => null,
        drawerActiveTintColor: "#4F46E5",
        drawerHideStatusBarOnOpen: true,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{ title: "Home", headerShown: false }}
      />
      <Drawer.Screen
        name="Profile"
        options={{ title: "Settings", headerShown: true }}
      />
      <Drawer.Screen
        name="Logout"
        options={{ title: "Logout", drawerLabelStyle: { color: "red" } }}
      />
    </Drawer>
  );
};

export default Drawerlayout;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#081021",
  },
  footer: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 20,
  },
});
