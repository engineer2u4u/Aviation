import React, { Component } from 'react';
import MainStackNavigator from './FlightDetails/stackScreens';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SideDrawer } from './SideDrawer';

const Drawer = createDrawerNavigator();

const FlightDetailsRoute = (props) => {
  return (
    <MainStackNavigator  {...props} />
  );
};

export default FlightDetailsRoute;