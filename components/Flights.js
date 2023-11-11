import React, { useState, useEffect, useRef } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  View,
  Dimensions,
  TextInput,
  Alert
} from 'react-native';
import moment from "moment";
import { SwipeListView } from 'react-native-swipe-list-view';
// import { SERVER_URL } from 'react-native-dotenv';
import Icons from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/functions';
import { SERVER_URL, getDomain } from './constants/env';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
const { width, height } = Dimensions.get('window');
import DateRangePicker from "react-native-daterange-picker";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const HeadingTextSize = width / 15;
const labelTextSize = width / 25;
export default function Flights({ navigation }) {
  const [callLoad, setcallLoad] = useState(false);
  const [isDatePickerVisible, setisDatePickerVisible] = useState(false);
  const [startorEnd, setstartorEnd] = useState('startDate');
  const [query, setQuery] = useState('');
  const [listData, setListData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [dateRange, setdateRange] = useState({ "endDate": new Date(new Date().getFullYear(), new Date().getMonth(), 30), "startDate": new Date(new Date().getFullYear(), new Date().getMonth(), 1) });
  const [flightlist, setflightlist] = useState([]);
  const openRowRef = useRef(null);
  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date);
    if (startorEnd == 'startDate') {
      setdateRange({ ...dateRange, startDate: date });
      dateFilter(getPreviousDay(date), dateRange.endDate)
    }
    else {
      setdateRange({ ...dateRange, endDate: date });
      dateFilter(getPreviousDay(dateRange.startDate), date)

    }

    setisDatePickerVisible(false);
  };
  useEffect(() => {
    var domain = getDomain();
    console.log(domain)
    setcallLoad(true);
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };
    fetch(
      `${domain}/GetGroundHandlingList?_token=66D64C12-2055-4F11-BCF1-9F563ACB032F&_opco=&_uid=`,
      requestOptions,
    )
      .then(response => response.text())
      .then(async result => {
        setcallLoad(false);
        try {
          var packet = JSON.parse(result);
          // console.log(result);
          if (packet && packet.Table) {
            var filteredData = packet.Table.filter(val => val.STATUS != 5);
            setFullData([...filteredData])
            // filteredData = await dateFilter(dateRange.startDate, dateRange.endDate, filteredData);
            setdateRange({ "endDate": new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), "startDate": new Date(new Date().getFullYear(), new Date().getMonth()) })
            dateFilter(new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 30), filteredData)

          }
        }
        catch (e) {
          setcallLoad(false);
          alert(e);
        }
      })
      .catch(error => {
        setcallLoad(false);
        alert(error);
      });
  }, []);


  // useEffect(() => {
  //   if (dateRange) {
  //     dateFilter();
  //   }

  // }, [dateRange])



  const handleSearch = text => {
    console.log('search text', text);
    var filterFinal = [];
    const filteredData = fullData.filter(item => {
      const departureDate = new Date(item.DEPARTURE_DATE);
      const start = getPreviousDay(dateRange.startDate)
      const end = dateRange.endDate;
      const itemDate = new Date(departureDate.getFullYear(), departureDate.getMonth(), departureDate.getDate());
      return itemDate >= start && itemDate <= end;
    });

    console.log(filteredData)
    const formattedQuery = text.toLowerCase();
    filterFinal = filteredData.filter(user => {
      return user.REF_NO.toLowerCase().includes(formattedQuery) || user.FLIGHT_REGISTRATION.toLowerCase().includes(formattedQuery);
    });
    console.log('filtered', dateRange)


    setflightlist([...filterFinal]);
    setQuery(text);
  };

  const dateFilter = (startDate, endDate, data) => {
    console.log('fullData', dateRange);
    var filterFinal = [];
    filData = data ? data : fullData;
    if (query && query.length > 0) {
      const formattedQuery = query.toLowerCase();
      const filteredResults = filData.filter(user => {
        return user.REF_NO.toLowerCase().includes(formattedQuery) || user.FLIGHT_REGISTRATION.toLowerCase().includes(formattedQuery);
      });
      filData = filteredResults;
    }

    filterFinal = filData.filter(item => {
      const departureDate = new Date(item.DEPARTURE_DATE);
      const start = startDate
      const end = endDate;
      const itemDate = new Date(departureDate.getFullYear(), departureDate.getMonth(), departureDate.getDate());
      return itemDate >= start && itemDate <= end;
    });
    // console.log('filteredResults', filteredResults)

    setflightlist([...filterFinal]);
    // setQuery(text);
  };
  const getPreviousDay = (date) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1); // Subtract one day
    return currentDate;
  }
  const addFlights = () => {
    navigation.replace('EditPageFlight', { UID: null });
  };
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey, data) => {
    closeRow(rowMap, rowKey);
    var domain = getDomain();
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append("Content-Type", "application/json");
    var requestOptions1 = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify([{ UID: data.item.UID, TableName: 'FLIGHTHEADER' }])
    };
    fetch(
      `${domain}/DeleteAPI`,
      requestOptions1,
    )
      .then(response => response.text())
      .then(result => {
        console.log(result)
        const newData = flightlist.filter(item => item.UID !== data.item.UID);
        // newData.splice(prevIndex, 1);
        setflightlist([...newData]);
      })
      .catch(error => {
        console.log(error, 'Function error');
      });

  };

  const getColor = val => {
    // return '#000';
    switch (val) {
      case 'Departure':
        return 'green';
      case 'Arrival':
        return 'orange';
      case 'Full Ground Handling':
        return '#000';
    }
  };

  const onRowDidOpen = (rowKey, rowMap) => {
    openRowRef.current = rowMap[rowKey];
  };

  const renderItem = data => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('FlightDetailsRoute', {
          flightName: data.item.FLIGHT_REGISTRATION,
          dataOne: 4,
          dataTwo: 2,
          uid: data.item.UID,
          flights: data.item,
        })
      }
      style={[styles.rowFront]}
      underlayColor={'#AAA'}
      activeOpacity={2}>
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            backgroundColor: getColor(data.item.FLIGHT_TYPE),
            borderRadius: 30,
            height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}>
          <Text style={{ color: 'white', fontSize: 25 }}>
            {data.item.FLIGHT_TYPE.substr(0, 1)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, color: 'white' }}>
            {data.item.FLIGHT_REGISTRATION + ' (' + data.item.REF_NO + ')'}
          </Text>
          <Text style={{ fontSize: 15, color: 'white' }}>
            {data.item.FLIGHT_CREW_DEPARTURE}{' '}
            <Icons color="white" name="user-nurse" size={15} />{' '}
            {data.item.FLIGHT_PAX_DEPARTURE}{' '}
            <Icons color="white" name="user-friends" size={15} />
          </Text>
          <Text style={{ fontSize: 15, color: 'white' }}>
            {data.item.DEPARTURE_DATE ? new Date(data.item.DEPARTURE_DATE).toDateString() : ''}
            {/* {data.item.FLIGHT_TYPE == 'Arrival' ? (data.item.FLIGHT_ARRIVAL_EDD ?
              new Date(data.item.FLIGHT_ARRIVAL_EDD).toDateString() : '') : (data.item.FLIGHT_DEPARTURE_EDD ?
                new Date(data.item.FLIGHT_DEPARTURE_EDD).toDateString() : '')} */}
          </Text>
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Icons color="white" name="chevron-right" size={20} />
        </View>
      </View>

    </TouchableOpacity>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backLeftBtn, styles.backLeftBtnRight]}
        onPress={() => {
          Alert.alert('Confirmation', 'Are you sure you want to delete this Flight?', [
            {
              text: 'Yes', onPress: () => {
                deleteRow(rowMap, data.item.key, data)
              }
            },
            { text: 'No' },
          ])
        }}>
        <MaterialIcons color="white" name="delete-forever" size={40} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => {
          // deleteRow(rowMap, data.item.key, data);
          //console.log("HHERERERR",data.item.UID);
          // rowMap[data.item.key].closeRow();
          navigation.navigate('EditPageFlight', { UID: data.item.UID });
        }}>
        <MaterialIcons color="white" name="edit" size={40} />
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => { navigation.navigate("Home") }}
        >
          <FontAwesome5Icons name="caret-left" color={'black'} size={40} />
        </TouchableOpacity>

        <Text style={{
          fontSize: HeadingTextSize, fontWeight: 'bold',
          color: 'black',
          paddingLeft: 10
        }}>  Flights Details </Text>
        {callLoad ? (
          <View style={{ paddingRight: 20 }}>
            <ActivityIndicator color="green" size={'small'} />
          </View>
        ) : (
          <TouchableOpacity onPress={addFlights} style={{ marginRight: 20 }}>
            <Icons name="plus" color="#6750A4" size={30} />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          backgroundColor: '#fff',
          padding: 10,
          zIndex: 9999
        }}
      >
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          value={query}
          onChangeText={queryText => handleSearch(queryText)}
          placeholder="Search"
          placeholderTextColor='black'
          style={{ backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 10, borderRadius: 5, color: 'black', marginHorizontal: 10 }}
        />
        <View style={{
          // flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => {
              setstartorEnd('startDate');
              setisDatePickerVisible(true);
            }} style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: 10, borderRadius: 8 }}><Text style={{ color: 'black', textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>{new Date(dateRange.startDate).toLocaleDateString()}</Text></TouchableOpacity>
            <Text style={{ color: 'black', fontSize: 20 }}> - </Text>
            <TouchableOpacity onPress={() => {
              setstartorEnd('endDate');
              setisDatePickerVisible(true);
            }} style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: 10, borderRadius: 8 }}><Text style={{ color: 'black', textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>{new Date(dateRange.endDate).toLocaleDateString()}</Text></TouchableOpacity>
          </View>
          {/* <DateRangePicker
            presetButtons
            buttonTextStyle={{ color: 'black' }}
            onChange={(dates) => {
              setdateRange({ ...dateRange, ...dates })

            }}
            endDate={dateRange.endDate}
            startDate={dateRange.startDate}
            displayedDate={moment()}
            range
          >
            
          </DateRangePicker> */}
        </View>

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
      // onRowDidOpen={onRowDidOpen}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={'date'}
        onConfirm={handleConfirm}
        onCancel={() => setisDatePickerVisible(false)}
      // date={dateRange[startorEnd] ? dateRange[startorEnd] : new Date()}
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
    backgroundColor: '#3b7dfc',
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
});
