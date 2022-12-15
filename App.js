/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import Home from './components/Home';
import GroundHandling from './components/GroundHandling';
import FlightDetails from './components/FlightDetails';
import Scanner from './components/Scanner';
import FlightDetailsRoute from './components/FlightDetailsRoute';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        {/* <Stack.Screen name="FlightDetails" component={FlightDetails} /> */}
        <Stack.Screen name="GroundHandling" component={GroundHandling} />
        <Stack.Screen
          name="FlightDetailsRoute"
          component={FlightDetailsRoute}
        />
        <Stack.Screen name="Scanner" component={Scanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
