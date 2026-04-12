import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Drawer } from "expo-router/drawer";
import Logo from "@/components/designs/Logo";
import { DrawerItemList } from "@react-navigation/drawer";
import { useUser } from "@/contexts/UserContext";

function CustomDrawerContent(props) {
  const { logout } = useUser();
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Logo style={{ width: 32, height: 32 }} />
        <Text style={styles.title}>DermaScan+</Text>
      </View>
      <DrawerItemList {...props} />

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  logoutBtn: {
    marginTop: "auto",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  logoutText: {
    color: "red",
    fontWeight: "600",
    fontSize: 15,
  },
});
