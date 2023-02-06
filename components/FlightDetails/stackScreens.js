import React from "react";
import {createStackNavigator} from '@react-navigation/stack';
import FlightPreparation from './FlightPreparation';
import PreArrival from './PreArrival';
import ArrivalService from './ArrivalService';
import InterimService from './InterimService';
import PreDepartureChecklist from './PreDepartureChecklist';
import Departure from './Departure';
import PostDeparture from './PostDeparture';
import InitialScreen from './initialScreen';
const Stack = createStackNavigator();

export default function MainStackNavigator({navigation,route}){
    return(
    <Stack.Navigator initialRouteName='InitialScreenView' options={{headerShown: false}}>
      <Stack.Screen
        name="IntialScreenView"
        options={{
          headerShown: false,
        }}
      >
        {(props)=><InitialScreen {...props} {...route} />}
        </Stack.Screen>
      <Stack.Screen
        name="FlightPreparation"
        component={FlightPreparation}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PreArrival"
        component={PreArrival}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ArrivalService"
        component={ArrivalService}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="InterimService"
        component={InterimService}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PreDepartureChecklist"
        component={PreDepartureChecklist}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Departure"
        component={Departure}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PostDeparture"
        component={PostDeparture}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
    )
}