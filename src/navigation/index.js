import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import * as Screens from '../screens'

const Stack = createNativeStackNavigator();

const Router = () => {
  return (
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name='Login'
          component={Screens.Login}
        />

        <Stack.Screen
          options={{ headerShown: false, headerBackVisible: false }}
          name='Home'
          component={Screens.Home}
        />



      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;