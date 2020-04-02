import React from "react";
import { useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";

import styles from "./styles";

export default function Profile() {
  const route = useRoute();

  const dev = route.params.github_username;
  return (
    <WebView
      style={{ flex: 1 }}
      source={{ uri: `https://github.com/${dev}` }}
    />
  );
};