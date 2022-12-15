import React, {Component, useState} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Drawer = createDrawerNavigator();
export function SideDrawer(props) {
  const [current, setcurrent] = useState(0);
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'black',
            padding: 10,
          }}>
          Flight Section
        </Text>
        <DrawerItem
          // icon={({color, size}) => (
          //   <Icon name="home" color={color} size={size} />
          // )}
          label="Flight Preparation"
          labelStyle={[
            styles.drawerLabel,
            current == 0 ? {color: 'green'} : {color: 'black'},
          ]}
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'FlightPreparation'}],
            });
            props.navigation.closeDrawer();
            setcurrent(0);
          }}
        />
        <DrawerItem
          // icon={({color, size}) => (
          //   <Icon name="home" color={color} size={size} />
          // )}
          label="Pre Arrival"
          labelStyle={[
            styles.drawerLabel,
            current == 1 ? {color: 'green'} : {color: 'black'},
          ]}
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'PreArrival'}],
            });
            props.navigation.closeDrawer();
            setcurrent(1);
          }}
        />
        <DrawerItem
          // icon={({color, size}) => (
          //   <Icon name="home" color={color} size={size} />
          // )}
          label="Arrival Services"
          labelStyle={[
            styles.drawerLabel,
            current == 2 ? {color: 'green'} : {color: 'black'},
          ]}
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'ArrivalService'}],
            });
            props.navigation.closeDrawer();
            setcurrent(2);
          }}
        />
        <DrawerItem
          label="Interim Service"
          labelStyle={[
            styles.drawerLabel,
            current == 3 ? {color: 'green'} : {color: 'black'},
          ]}
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'InterimService'}],
            });
            props.navigation.closeDrawer();
            setcurrent(3);
          }}
        />
        <DrawerItem
          label="Pre-Departure Checklist"
          labelStyle={[
            styles.drawerLabel,
            current == 4 ? {color: 'green'} : {color: 'black'},
          ]}
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'PreDepartureChecklist'}],
            });
            props.navigation.closeDrawer();
            setcurrent(4);
          }}
        />
        <DrawerItem
          label="Departure"
          labelStyle={[
            styles.drawerLabel,
            current == 5 ? {color: 'green'} : {color: 'black'},
          ]}
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'Departure'}],
            });
            props.navigation.closeDrawer();
            setcurrent(5);
          }}
        />
        <DrawerItem
          label="Post Departure"
          labelStyle={[
            styles.drawerLabel,
            current == 6 ? {color: 'green'} : {color: 'black'},
          ]}
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'PostDeparture'}],
            });
            props.navigation.closeDrawer();
            setcurrent(6);
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    flexShrink: 1,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerLabel: {
    fontSize: Dimensions.get('window').width / 24,
    fontFamily: 'sans-serif-condensed',
  },
});
