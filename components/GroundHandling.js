import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Flights from '../components/Flights';
import Aircrafts from '../components/Aircrafts';
import Icons from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        tabBarIcon=""
        name="Flights"
        component={Flights}
        options={{
          headerShown: false,
          tabBarLabel: 'Flights',
          tabBarIcon: ({color, size}) => (
            <Icons name="flight-takeoff" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Aircrafts"
        component={Aircrafts}
        options={{
          headerShown: false,
          tabBarLabel: 'Aircraft',
          tabBarIcon: ({color, size}) => (
            <Icons name="flight" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
