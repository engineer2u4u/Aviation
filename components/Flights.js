import React, {useState, useEffect} from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  View,
} from 'react-native';

import {SwipeListView} from 'react-native-swipe-list-view';
import Icons from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/functions';

export default function Flights({navigation}) {
  const [callLoad, setcallLoad] = useState(false);

  const [listData, setListData] = useState(
    Array(20)
      .fill('')
      .map((_, i) => ({key: `${i}`, text: `item #${i}`})),
  );

  const [flightlist, setflightlist] = useState([]);

  useEffect(() => {
    setcallLoad(true);
    firebase
      .app()
      .functions('asia-southeast1')
      .httpsCallable('getFlights')()
      .then(response => {
        console.log(response);
        setcallLoad(false);

        var packet = JSON.parse(response.data.body);
        // //console.log(packet.Table);
        setflightlist(packet.Table);
      })
      .catch(error => {
        setcallLoad(false);

        console.log(error, 'Function error');
      });
  }, []);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
  };

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };

  const renderItem = data => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('FlightDetailsRoute', {
          flightName: data.item.FLIGHT_REGISTRATION,
          dataOne: 4,
          dataTwo: 2,
          uid: data.item.UID,
        })
      }
      style={styles.rowFront}
      underlayColor={'#AAA'}
      activeOpacity={2}>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            backgroundColor: '#6750A4',
            borderRadius: 30,
            height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}>
          <Text style={{color: 'white', fontSize: 25}}>A</Text>
        </View>
        <View>
          <Text style={{fontSize: 15, color: 'black'}}>
            {data.item.FLIGHT_REGISTRATION}
          </Text>
          <Text style={{fontSize: 15, color: 'black'}}>
            4 <Icons color="black" name="user-nurse" size={15} />4{' '}
            <Icons color="black" name="user-friends" size={15} />
          </Text>
          <Text style={{fontSize: 15, color: 'black'}}>
            20 Aug 2022, 13:00:00
          </Text>
        </View>
      </View>
      <Icons color="black" name="chevron-right" size={20} />
    </TouchableOpacity>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backLeftBtn, styles.backLeftBtnRight]}
        onPress={() => deleteRow(rowMap, data.item.key)}>
        <MaterialIcons color="white" name="delete-forever" size={40} />
      </TouchableOpacity>
      {/* <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => closeRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Close</Text>
            </TouchableOpacity> */}
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => {
          deleteRow(rowMap, data.item.key);
          //console.log("HHERERERR",data.item.UID);
          navigation.navigate('EditPageFlight', {UID: data.item.UID});
        }}>
        <MaterialIcons color="white" name="edit" size={40} />
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      {/* <Text style={{fontSize: 30, marginLeft: 10, color: 'black'}}>
        Flights Details
      </Text> */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 20,
        }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'black',
            paddingLeft: 20,
          }}>
          Flights Details
        </Text>
        {callLoad && (
          <View style={{paddingRight: 20}}>
            <ActivityIndicator color="green" size={'small'} />
          </View>
        )}
      </View>
      <SwipeListView
        data={flightlist}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-75}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={2000}
        onRowDidOpen={onRowDidOpen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingTop: 20,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    backgroundColor: '#E4E7FF',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    height: 100,
    borderColor: '#000',
    borderRadius: 8,
    margin: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
    elevation: 10,
    shadowOffset: {width: 0, height: 3},
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
  },
  backRightBtn: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 80,
    paddingRight: 17,
  },
  backLeftBtn: {
    alignItems: 'flex-start',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 80,
    paddingLeft: 17,
  },
  backRightBtnLeft: {
    backgroundColor: 'red',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: '#105cd7',
    right: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  backLeftBtnRight: {
    backgroundColor: 'red',
    left: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
});
