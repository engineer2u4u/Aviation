//import liraries
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Entypo';
const { width, height } = Dimensions.get('window');

// create a component
const LogDetails = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 10,
        }}>
        <TouchableOpacity
          style={{ paddingRight: 10 }}
          onPress={() => navigation.navigate('Home')}>
          <FontAwesome5Icons name="caret-left" color={'black'} size={40} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'black',
          }}>
          Log Details
        </Text>
      </View>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginTop: 20,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('RiskList')}
            style={[styles.card, { marginRight: 15 }]}>
            <Icon color="white" name="magnifying-glass" size={50} />
            <Text style={{ color: 'white', fontSize: width / 40 }}>
              Risk assessment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('LogList')}
            style={styles.card}>
            <Icons color="white" name="sticky-note-2" size={50} />
            <Text style={{ color: 'white', fontSize: width / 40 }}>Log Module</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginTop: 20,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ReportList')}
            style={[styles.card, { marginRight: 15 }]}>
            <Icons color="white" name="text-snippet" size={50} />
            <Text style={{ color: 'white', fontSize: width / 40 }}>Reporting</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0}
            style={{ flex: 1 }}></TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#FFF',
    paddingHorizontal: 30,
  },
  card: {
    paddingVertical: 20,
    backgroundColor: '#3b7dfc',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
    elevation: 10,
    shadowOffset: { width: 0, height: 3 },
  },
});

//make this component available to the app
export default LogDetails;
