import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";

const HomeLayout = () => {
  return (
    <Tabs
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4F46E5",
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
        name="Camera"
        options={{
          title: () => null,
          tabBarIcon: ({ color }) => (
            <View style={styles.cameraButton}>
              <Feather name="camera" size={28} color="white" />
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00CC99",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20, // pushes it upward (so it "floats")
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
});
