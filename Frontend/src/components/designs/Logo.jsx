import React from "react";
import { Image } from "react-native";
const Logo = (props) => (
  <Image
    source={require("../../../assets/logo/Logo3.png")}
    style={{ width: 32, height: 32 }}
    resizeMode="contain"
    {...props}
  />
);

export default Logo;
