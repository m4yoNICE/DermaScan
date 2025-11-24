import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs, router, useNavigation } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";

const HomeLayout = () => {
  const navigation = useNavigation();

  return (
    <Tabs
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#4F46E5",
        headerStyle: {
          backgroundColor: "#00CC99",
        },
        tabBarStyle: {
          height: 100,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarIconStyle: {
          marginTop: 7,
        },
        headerStyle: {
          backgroundColor: "#00CC99",
        },
        headerTintColor: "fff",
        headerTitle: () => null,
        headerLeft: () => (
          <Ionicons
            name="menu"
            size={28}
            color="#fff"
            style={{ marginLeft: 15 }}
            onPress={() => navigation.openDrawer()} // Opens drawer
          />
        ),
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="CameraPage"
        options={{
          headerShown: true,
          title: () => null,
          tabBarStyle: { display: "none" },
          headerLeft: () => (
            <Ionicons
              name="arrow-back-circle"
              size={30}
              color="white"
              style={{ marginLeft: 15 }}
              onPress={() => router.back()}
            />
          ),
          tabBarIcon: ({ color }) => (
            <View style={styles.cameraButton}>
              <Feather name="camera" size={40} color="white" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="history" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default HomeLayout;

const styles = StyleSheet.create({
  cameraButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#00CC99",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20, // pushes it upward (so it "floats")
  },
});
