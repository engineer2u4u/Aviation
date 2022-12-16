import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import ScreenMenues from '../../constants/flightdetailsmenuoptions';
import Icons from 'react-native-vector-icons/MaterialIcons';

export default function FlightMenu({navigation}) {
  return (
    <View style={styles.container}>
      {ScreenMenues.map((data, i) => {
        return (
          <TouchableOpacity
            key={i}
            onPress={() => navigation.navigate(data.route)}
            style={styles.card}>
            <Icons color="white" name={data.icon} size={50} />
            <Text style={{color: 'white'}}>{data.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    padding: 10,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#3b7dfc',
    borderRadius: 10,
    width: '45%',
    height: 100,
    marginLeft: 5,
    marginRight: 10,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
    elevation: 10,
    shadowOffset: {width: 0, height: 3},
  },
});
