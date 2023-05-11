import React, {Component} from 'react';
import MainStackNavigator from './FlightDetails/stackScreens';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {SideDrawer} from './SideDrawer';

const Drawer = createDrawerNavigator();

const FlightDetailsRoute = (props) => {
  return (
    <Drawer.Navigator
      drawerContent={props => <SideDrawer {...props} />}
      unmountOnBlur={true}>
      <Drawer.Screen
        name="DashboardStack"
        
        options={{headerShown: false}}
      >
        {()=><MainStackNavigator  {...props} />}
        </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default FlightDetailsRoute;