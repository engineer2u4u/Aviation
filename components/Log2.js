//import liraries
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';
const { width, height } = Dimensions.get('window');
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from 'accordion-collapse-react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import { SERVER_URL, getDomain } from './constants/env';
import Header from './subcomponents/Forms/Header';

// create a component
const Log2 = (props) => {
  const [LogHeader, setLogHeader] = useState(null);
  const [LogDetail, setLogDetail] = useState([]);
  const [callLoad, setcallLoad] = useState(false);
  const [formReady, setformReady] = useState(true);

  const UID = props.route.params.UID;
  useEffect(() => {
    setcallLoad(true);
    var domain = getDomain();
    if (UID) {
      var myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'GET',
        headers: myHeaders
      };
      fetch(
        `${domain}/GetFlightLog?_token=F4CD8DF6-9D96-40EF-A9D0-1EBFA93D92B2&_uid=${UID}`,
        requestOptions,
      )
        .then(response => response.text())
        .then(result => {
          setcallLoad(false);
          try {
            var packet = JSON.parse(result);
            // console.log(packet);
            if (packet && packet.length > 0) {
              setLogHeader(packet[0]);
            }
            else {
              props.navigation.pop();
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

      var myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'GET',
        headers: myHeaders
      };
      fetch(
        `${domain}/GetFlightLogReport?_token=84247CEB-DB75-4A3C-BE0A-76C617A03A9A&_uid=${UID}`,
        requestOptions,
      )
        .then(response => response.text())
        .then(result => {
          setcallLoad(false);
          try {
            var packet = JSON.parse(result);
            console.log(packet.length);
            if (packet) {
              setLogDetail(packet);
            }
            else {
              props.navigation.pop();
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
    }
    else {
      setcallLoad(false);
      setLogHeader({ "AC_TYPE": "", "AIRCRAFT_NAME": "", "AIRCRAFT_UID": "", "CABIN_ATTENDANT": "", "CABIN_OFF": "", "CABIN_ON": "", "CREATED_BY": "", "CREATED_DATE": "", "ENG_NAME": "", "ENG_OFF": "", "ENG_ON": "", "ENG_UID": "", "FLIGHT_NO": null, "LAST_UPDATE": "", "LEG_UID": "", "LOG_NO": 11, "OWNER": "ow", "PIC_NAME": "", "PIC_OFF": "", "PIC_ON": "", "PIC_UID": "", "PILOT2_NAME": "", "PILOT2_OFF": "", "PILOT2_ON": "", "PILOT2_UID": "", "PILOT_NAME": "", "PILOT_OFF": "", "PILOT_ON": "", "PILOT_UID": "", "REG_NO": "", "START_DATE": "", "STATUS": 0, "STATUS_LH": null, "TRIP_NO": "", "TRIP_NO_LH": null, "TRIP_UID": "", "UID": "", "UPDATE_BY": "" });
      setLogDetail([{ "FLH_UID": "", "FLR_LICENSE": "", "FLR_NAME": "", "FLR_PN": "", "FLR_REMARKS": "", "FLR_SN": "", "START_DATE": "", "UID": "" }])
    }
  }, []);


  return (
    <ScrollView>
      <View style={{ backgroundColor: 'white' }}>
        <Header
          headingSize={width / 25}
          heading={'Log Report'}
          // sendForm={sendForm}
          nav={"LogList"}
          navigation={props.navigation}
          Icon={
            callLoad ? (
              <ActivityIndicator size={'small'} color="green" />
            ) : (
              <Icons
                name="content-save"
                color={formReady ? 'green' : '#aeaeae'}
                size={30}
              />
            )
          }
        />
      </View>
      <View style={styles.container}>
        {LogHeader &&
          <View
            style={{
              width: width - 60,
              borderWidth: 2,
              borderColor: 'black',
              borderRadius: 8,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 24,
                fontWeight: 'bold',
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}>
              {LogHeader.AIRCRAFT_NAME}
            </Text>
            <View style={{}}>
              <View
                style={{
                  borderBottomWidth: 2,
                  borderTopWidth: 2,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    flex: 1,
                    borderRightWidth: 2,
                    padding: 5,
                  }}>
                  {LogHeader.START_DATE && new Date(LogHeader.START_DATE).toLocaleDateString()}
                </Text>
                <Text style={{ color: 'black', fontSize: 20, flex: 1, padding: 5 }}>
                  Registration: {LogHeader.REG_NO}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 2,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    flex: 1,
                    borderRightWidth: 2,
                    padding: 5,
                  }}>
                  Trip#: {LogHeader.TRIP_NO}
                </Text>
                <Text style={{ color: 'black', fontSize: 20, flex: 1, padding: 5 }}>
                  A/C Type:  {LogHeader.AC_TYPE}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    flex: 1,
                    padding: 5,
                  }}>
                  Log#: {LogHeader.LOG_NO}
                </Text>
              </View>
            </View>
          </View>
        }

        <Text
          style={{
            marginTop: 20,
            fontSize: 24,
            fontWeight: 'bold',
            color: 'black',
          }}>
          Pilot Reports
        </Text>
        {LogDetail !== null && LogDetail.map((val, index) => {
          return (<View key={index}>
            <Text style={{ color: 'black', fontSize: 20, marginTop: 20 }}> By {val.FLR_NAME}</Text>
            <View
              style={{
                width: width - 60,
                borderWidth: 2,
                borderColor: 'black',
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderBottomWidth: 0,
                marginTop: 10,
                flexDirection: 'row',
              }}>

              <View style={{ borderRightWidth: 3, padding: 10 }}>
                <Text
                  style={{
                    fontSize: 24,
                    color: 'black',
                  }}>
                  {index + 1}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            borderBottomWidth: 2,
            padding: 10,
          }}>
          <TouchableOpacity>
            <Icons name="checkbox-marked-outline" color="green" size={40} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              color: 'black',
            }}>
            Check if Null
          </Text>
        </View> */}
                <TextInput
                  placeholder="Specify your report"
                  placeholderTextColor={'gray'}
                  multiline
                  numberOfLines={5}
                  style={{
                    textAlignVertical: 'top',
                    fontSize: 24,
                    padding: 5,
                    color: 'black',
                  }}
                  value={val.FLR_REMARKS}
                  editable={false}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderTopWidth: 2,
                  }}>
                  <Text
                    style={{
                      borderRightWidth: 2,
                      flex: 1,
                      fontSize: 24,
                      color: 'black',
                      padding: 5,
                    }}>
                    P/N {val.FLR_PN}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 24,
                      color: 'black',
                      padding: 5,
                      paddingLeft: 10,
                    }}>
                    S/N {val.FLR_SN}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Rectification')}
              style={{
                backgroundColor: '#3b7dfc',
                padding: 5,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                borderWidth: 2,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                }}>
                Rectification Actions
              </Text>
              <Icons name="chevron-right" color={'white'} size={30} />
            </TouchableOpacity>
          </View>)
        })}

        {/* } */}


      </View>
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#FFF',
    padding: 30,
  },
});

//make this component available to the app
export default Log2;
