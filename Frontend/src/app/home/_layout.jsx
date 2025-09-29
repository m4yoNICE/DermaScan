import React, { useState, createContext, useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Drawer } from "react-native-drawer-layout";
import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Context so children can open/close drawer
export const DrawerContext = createContext();

const HomeLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        drawerStyle={styles.drawer}
        renderDrawerContent={() => (
          <View style={styles.drawerContent}>
            <Text style={styles.drawerTitle}>DermaScan+</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setOpen(false);
                router.push("/home/Home");
              }}
            >
              <Ionicons name="calendar-outline" size={20} color="teal" />
              <Text style={styles.menuText}>Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setOpen(false);
                router.push("/settings");
              }}
            >
              <Ionicons name="settings-outline" size={20} color="teal" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setOpen(false);
                router.push("/support");
              }}
            >
              <Ionicons name="help-circle-outline" size={20} color="teal" />
              <Text style={styles.menuText}>Support</Text>
            </TouchableOpacity>
          </View>
        )}
      >
        <View style={{ flex: 1 }}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: styles.tabBar,
              tabBarShowLabel: true,
              tabBarActiveTintColor: "teal",
              tabBarInactiveTintColor: "gray",
            }}
          >
            <Tabs.Screen
              name="Home"
              options={{
                title: "Calendar",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="calendar-outline" size={size} color={color} />
                ),
              }}
            />

<Tabs.Screen
  name="Camera"
  options={{
    title: "Camera",
    headerShown: false,
    tabBarStyle: { display: "none" }, // hide nav bar when camera is open
    tabBarIcon: ({ focused }) => (
      <View style={{
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: "teal",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,   // lift it above tab bar
      }}>
        <Ionicons name="camera" size={28} color="white" />
      </View>
    ),
  }}
/>



            <Tabs.Screen
              name="Profile"
              options={{
                title: "Profile",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person-outline" size={size} color={color} />
                ),
              }}
            />
          </Tabs>
        </View>
      </Drawer>
    </DrawerContext.Provider>
  );
};

export default HomeLayout;

const styles = StyleSheet.create({
  drawer: {
    width: 250,
  },
  drawerContent: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "teal",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: "black",
  },
  tabBar: {
    height: 70,
    backgroundColor: "white",
    borderTopWidth: 0,
    elevation: 5,
  },
  cameraButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "teal",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
});
