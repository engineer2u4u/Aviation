import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  View,
} from 'react-native';

import React, { useState, useEffect } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icons from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
const { width, height } = Dimensions.get('window');

const HeadingTextSize = width / 15;
const labelTextSize = width / 25;
export default function Aircrafts(props) {
  const [listData, setListData] = useState([]);
  const [callLoad, setcallLoad] = useState(false);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };
  useEffect(() => {
    setcallLoad(true)
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    fetch("https://demo.vellas.net:94/arrowdemoapi/api/Values/GetAlAviationAirCraft?_token=AF8C96FB-6D64-4E5D-91C2-F2282EA7DB7C&_opco=&_uid=", requestOptions)
      .then(response => response.text())
      .then(result => { setListData(JSON.parse(result)); setcallLoad(false) })
      .catch(error => { console.log('error', error); setcallLoad(false) });
  }, []);
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
      onPress={() => { props.navigation.navigate('AircraftDetails', { UID: data.item.UID }); console.log(data.item) }}
      style={styles.rowFront}
      underlayColor={'#AAA'}
      activeOpacity={2}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ paddingLeft: 20 }}>
          <Text style={{ fontSize: 15, color: 'white' }}>{data.item.AIRCRAFT_REGISTRATION}</Text>
          <Text style={{ fontSize: 15, color: 'white' }}>{data.item.AIRCRAFT_ICAO} {data.item.AIRCRAFT_TYPE}</Text>
          <Text style={{ fontSize: 15, color: 'white' }}>
            {data.item.AIRCRAFT_MODEL}
          </Text>
        </View>
      </View>
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
        onPress={() => deleteRow(rowMap, data.item.key)}>
        <MaterialIcons color="white" name="edit" size={40} />
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => { props.navigation.navigate("Home") }}
        >
          <FontAwesome5Icons name="caret-left" color={'black'} size={40} />
        </TouchableOpacity>

        <Text style={{
          fontSize: HeadingTextSize, fontWeight: 'bold',
          color: 'black',
          paddingLeft: 10
        }}> Aircrafts </Text>
        {callLoad ? (
          <View style={{ paddingRight: 20 }}>
            <ActivityIndicator color="green" size={'small'} />
          </View>
        ) : (
          <TouchableOpacity onPress={() => props.navigation.navigate('AircraftDetails')} style={{ marginRight: 20 }}>
            <Icons name="plus" color="#6750A4" size={30} />
          </TouchableOpacity>
        )}
      </View>
      <SwipeListView
        data={listData}
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
    backgroundColor: '#10b9d7',
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
    shadowOffset: { width: 0, height: 3 },
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
  headingText: {
    fontWeight: 'bold',
    color: 'black',
    paddingLeft: 10
  }
});
