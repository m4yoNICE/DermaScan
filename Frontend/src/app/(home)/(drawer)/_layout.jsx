import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Drawer } from "expo-router/drawer";
import Logo from "@/components/designs/Logo";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Logo style={{ width: 50, height: 50 }} />
        <Text style={styles.title}>DermaScan+</Text>
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
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
        options={{
          title: "Home",
          headerShown: false,
          drawerLabelStyle: { fontSize: 15, fontWeight: "600" },
        }}
      />
      <Drawer.Screen
        name="Profile"
        options={{
          title: "Settings",
          headerShown: true,
          drawerLabelStyle: { fontSize: 15, fontWeight: "600" },
        }}
      />
      <Drawer.Screen
        name="Logout"
        options={{
          title: "Logout",
          drawerLabelStyle: { fontSize: 15, fontWeight: "600", color: "red" },
        }}
      />
    </Drawer>
  );
};

export default Drawerlayout;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
  },
  title: {
    fontSize: 25,
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
