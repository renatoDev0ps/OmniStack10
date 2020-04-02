import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const AppStack = createStackNavigator();

import Main from "./pages/Main";
import Profile from "./pages/Profile";

export default function Routes() {
  return (
    <NavigationContainer>

      <AppStack.Navigator 
        screenOptions={{
          headerTitle: "DevRadar",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#7d40e7" },
          headerTintColor: "#fff"
        }}
      >
        <AppStack.Screen name="Main" component={Main} />
        <AppStack.Screen name="Profile" component={Profile} />
      </AppStack.Navigator>

    </NavigationContainer>
  );
};