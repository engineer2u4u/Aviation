import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimeInput from '../subcomponents/Forms/universal/datetimeinput';
import LabelledInput from '../subcomponents/Forms/universal/labelledinput';
import { firebase } from '@react-native-firebase/functions';
import Header from '../subcomponents/Forms/Header';
import auth from '@react-native-firebase/auth';
const { width } = Dimensions.get('window');

const HeadingTextSize = width / 15;
const EditFlight = props => {
  const UID = props.route.params.UID;
  // console.log(UID);
  const [mode, setMode] = useState('time');
  const [regList, setregList] = useState([]);
  const [hasUnsavedChanges, sethasUnsavedChanges] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [modalVisible, setmodalVisible] = useState(false);
  const [modalVisibleList, setmodalVisibleList] = useState(false);
  const [reg, setreg] = useState(null);
  const [callLoad, setcallLoad] = useState(false);


  const [formpayload, setformpayload] = useState({

    "MAINFOLDER": "",
    "DESCRIPTION": "",
    "FULLPATH": "",
    "SYSTEMNO": "",
    "REF_NO": "",
    "BOOKING_NO": "",
    "SCHEDULED_FLIGHT": "",
    "SCHEDULED_TIME": "",
    "SCHEDULED_FLIGHT_NO": "",
    "SCHEDULED_AIRBUS": "",
    "SCHEDULED_AIRBUS_NAME": "",
    "ACTUAL_FLIGHT": "",
    "ACTUAL_FLIGHT_NO": "",
    "ACTUAL_TIME": "",
    "ACTUAL_AIRBUS": "",
    "ACTUAL_AIRBUS_NAME": "",
    "FLIGHT_REGISTRATION": "",
    "AIRCRAFT_TYPE": "",
    "AIRCRAFT_OPERATOR": "",
    "FLIGHT_NO": "",
    "FLIGHT_BILLING_PARTY": "",
    "FLIGHT_PURPOSE": "",
    "FLIGHT_ARRIVAL_ORIGIN": "",
    "FLIGHT_ARRIVAL_DESTINATION": "",
    "FLIGHT_ARRIVAL_FROM_ICAO": "",
    "FLIGHT_ARRIVAL_TO_ICAO": "",
    "FLIGHT_ARRIVAL_TO_HANDLER": "",
    "FLIGHT_ARRIVAL_FROM_HANDLER": "",
    "FLIGHT_ARRIVAL_EDD": "",
    "FLIGHT_ARRIVAL_EDA": "",
    "FLIGHT_DEPARTURE_ORIGIN": "",
    "FLIGHT_DEPARTURE_DESTINATION": "",
    "FLIGHT_DEPARTURE_FROM_ICAO": "",
    "FLIGHT_DEPARTURE_TO_ICAO": "",
    "FLIGHT_DEPARTURE_TO_HANDLER": "",
    "FLIGHT_DEPARTURE_FROM_HANDLER": "",
    "FLIGHT_DEPARTURE_EDD": "",
    "FLIGHT_DEPARTURE_EDA": "",
    "FLIGHT_ARRIVAL_CREW": "",
    "FLIGHT_DEPARTURE_CREW": "",
    "FLIGHT_ARRIVAL_PAX": null,
    "FLIGHT_DEPARTURE_PAX": null,
    "FLIGHT_TYPE": "",
    "STATUS": "Active",
    "CREATED_BY": "",
    "CREATED_DATE": "",
    "UPDATE_BY": "",
    "LAST_UPDATE": ""
  })


  useEffect(
    () =>
      props.navigation.addListener('beforeRemove', (e) => {
        if (!hasUnsavedChanges) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          'Discard changes?',
          'You have unsaved changes. Are you sure to discard them and leave the screen?',
          [
            { text: "Don't leave", style: 'cancel', onPress: () => { } },
            {
              text: 'Discard',
              style: 'destructive',
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => props.navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [props.navigation, hasUnsavedChanges]
  );

  const tConvert = dateT => {
    // console.log('HERE', dateT);
    if (dateT) {
      // console.log(typeof dateT);
      if (typeof dateT !== 'string') {
        var datetime = dateT.toLocaleString('en-US', {
          hour12: false,
        });
      } else {
        var datetime = new Date(dateT).toLocaleString('en-US', {
          hour12: false,
        });
      }
      console.log(datetime);
      var date = datetime.split(',')[0].split('/');
      var time24 = datetime.split(', ')[1];
      var time = time24.split(':');

      var ret =
        date[1] +
        '/' +
        date[0] +
        '/' +
        date[2] +
        ', ' +
        time[0] +
        ':' +
        time[1];
      console.log('time', ret);
      return ret;
    }
    return null;
  };
  const ISOconvert = dateT => {
    return new Date();
  };
  useEffect(() => {
    if (UID) {
      setcallLoad(true);
      const url =
        'https://demo.vellas.net:94/arrowdemoapi/api/Values/GetGroundHandlingList?_token=66D64C12-2055-4F11-BCF1-9F563ACB032F&_opco=&_uid=' +
        UID;
      fetch(url, { method: 'GET' })
        .then(data => {
          return data.json();
        })
        .then(data => {
          var res = data.Table;
          console.log(res[0].FLIGHT_TYPE);
          if (res[0]) {
            setformpayload(res[0])
          }
          setcallLoad(false);
        })
        .catch(e => {
          setcallLoad(false);

          console.log(e);
        });
    } else {
      setcallLoad(true);

      const url =
        'https://demo.vellas.net:94/arrowdemoapi/api/Values/getAIRCRAFT?_token=CB9A5812-B894-469A-8CA4-15055DA6D7D6&_opco=&_an=';
      fetch(url, { method: 'GET' })
        .then(data => {
          return data.json();
        })
        .then(data => {
          var res = data;
          console.log(res);
          setregList(res);
          setcallLoad(false);
        })
        .catch(e => {
          setcallLoad(false);
          console.log(e);
        });
    }
  }, []);

  const sendForm = () => {
    setcallLoad(true);
    const email = auth().currentUser.email;
    var payload = formpayload;
    if (UID) {
      payload.UID = UID;
    } else {
      payload.CREATED_BY = email;
    }
    console.log(payload);
    firebase
      .app()
      .functions('asia-southeast1')
      .httpsCallable('updateFlightModule?module=PostFlightHeader')(
        JSON.stringify(payload),
      )
      .then(response => {
        setcallLoad(false);
        Alert.alert('Success', 'Flight successfully created', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        console.log(response);
        sethasUnsavedChanges(false)
      })
      .catch(error => {
        setcallLoad(false);
        Alert.alert('Error in updating');
        console.log(error, 'Function error');
      });
  };
  const [fieldType, setfieldType] = useState(0);
  const showDatePicker = (type, index, pos, field) => {
    // pos != undefined
    //   ? (currentPicker.current = [index, pos, field])
    //   : (currentPicker.current = [index]);
    setMode(type);
    setfieldType(index);
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = date => {
    console.log('A date has been picked: ', date, fieldType);
    var tarrival = date;
    console.log('Check', tarrival);
    setformpayload({ ...formpayload, [fieldType]: tarrival });
    // switch (fieldType) {
    //   case 0:
    //     setdepdate(tarrival);
    //     break;
    //   case 1:
    //     setarrdate(tarrival);
    //     break;
    //   case 2:
    //     setdeptime(tarrival);
    //     break;
    //   case 3:
    //     setarrtime(tarrival);
    //     break;
    //   default:
    //     break;
    // }

    //setArrival(tarrival);
    hideDatePicker();
  };


  return (
    <View>
      <Header
        headingSize={HeadingTextSize}
        heading={UID ? 'Edit Flight' : 'Add Flight'}
        sendForm={sendForm}
        nav={"GroundHandling"}
        navigation={props.navigation}
        Icon={
          callLoad ? (
            <ActivityIndicator size={'small'} color="green" />
          ) : (
            <Icons name="content-save" color={'green'} size={30} />
          )
        }
      />
      <ScrollView>
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 100,
          }}>
          <LabelledInput
            label={'Reference No.'} //mark
            datatype={'text'}
            data={formpayload.REF_NO}
            disabled={false}
            setText={(index, text, type, section) => {
              sethasUnsavedChanges(true);
              setformpayload({ ...formpayload, REF_NO: text });
            }}
            multiline={true}
            numberOfLines={1}
          />
          <LabelledInput
            label={'Flight No.'} //mark
            datatype={'text'}
            data={formpayload.FLIGHT_NO}
            disabled={false}
            setText={(index, text, type, section) => {
              sethasUnsavedChanges(true);
              setformpayload({ ...formpayload, FLIGHT_NO: text });
            }}
            multiline={true}
            numberOfLines={1}
          />
          {UID ? (
            <LabelledInput
              label={'Aircraft Registration'} //mark
              data={formpayload.FLIGHT_REGISTRATION}
              datatype={'text'}
              index={57}
              setText={(index, text, type, section) => {
                sethasUnsavedChanges(true);
                setformpayload({ ...formpayload, FLIGHT_REGISTRATION: text });
              }}
              multiline={true}
              numberOfLines={1}
            />
          ) : (
            <>
              <Text style={styleSheet.label}>Aircraft Registration</Text>
              <View>
                <TouchableOpacity
                  style={styleSheet.input}
                  onPress={() => {
                    console.log(regList);
                    setmodalVisibleList(true);
                  }}>
                  <Text style={{ fontSize: 20, color: 'black' }}>{formpayload.FLIGHT_REGISTRATION}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {reg && (<View

            style={[styleSheet.rowFront]}
            underlayColor={'#AAA'}
            activeOpacity={2}>
            <View >
              <Text style={{ color: 'white' }}>
                {reg.AIRCRAFT_TYPE} {reg.AIRCRAFT_MODEL ? '(' + reg.AIRCRAFT_MODEL + ')' : ''}
              </Text>
              <Text style={{ color: 'white' }}>
                {reg.AIRCRAFT_OWNER}
              </Text>
              <Text style={{ color: 'white' }}>
                {reg.AIRCRAFT_PHONE}
              </Text>
            </View>
          </View>)}
          <LabelledInput
            label={'Billing Party'} //mark
            data={formpayload.FLIGHT_BILLING_PARTY}
            datatype={'text'}
            index={57}
            setText={(index, text, type, section) => {
              sethasUnsavedChanges(true);
              setformpayload({ ...formpayload, FLIGHT_BILLING_PARTY: text });
            }}
            multiline={true}
            numberOfLines={1}
          />
          <LabelledInput
            label={'Flight Purpose'} //mark
            datatype={'text'}
            data={formpayload.FLIGHT_PURPOSE}
            disabled={false}
            setText={(index, text, type, section) => {
              sethasUnsavedChanges(true);
              setformpayload({ ...formpayload, FLIGHT_PURPOSE: text });
            }}
            multiline={true}
            numberOfLines={1}
          />
          <Text style={styleSheet.label}>Handling Service required</Text>
          <View>
            <TouchableOpacity
              style={styleSheet.input}
              onPress={() => setmodalVisible(true)}>
              <Text style={{ fontSize: 20, color: 'black' }}>{formpayload.FLIGHT_TYPE}</Text>
            </TouchableOpacity>
          </View>
          {(formpayload.FLIGHT_TYPE == 'Full Ground Handling' || formpayload.FLIGHT_TYPE == 'Arrival') && <><Text style={styleSheet.label}>Arrival Schedule</Text>
            <View style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}>
              <LabelledInput
                label={'Origin'} //mark
                datatype={'text'}
                data={formpayload.FLIGHT_ARRIVAL_ORIGIN}
                disabled={false}
                index={57}
                setText={(index, text, type, section) => {
                  sethasUnsavedChanges(true);
                  setformpayload({ ...formpayload, FLIGHT_ARRIVAL_ORIGIN: text });
                }}
                multiline={true}
                numberOfLines={1}
              />
              <LabelledInput
                label={'Destination'} //mark
                datatype={'text'}
                data={formpayload.FLIGHT_ARRIVAL_DESTINATION}
                disabled={false}
                index={57}
                setText={(index, text, type, section) => {
                  sethasUnsavedChanges(true);
                  setformpayload({ ...formpayload, FLIGHT_ARRIVAL_DESTINATION: text });
                }}
                multiline={true}
                numberOfLines={1}
              />
              <DateTimeInput
                label={'Departure Date Time'}
                showDatePickerPostDepart={data => {
                  showDatePicker('datetime', 'FLIGHT_ARRIVAL_EDD');
                }}
                setNowPostDepart={data => {
                  console.log(data, "sfsdfsd");
                }}
                setflightdoc={data => {
                  console.log(data, "sfsdfsd");
                  sethasUnsavedChanges(true);
                  setformpayload({ ...formpayload, FLIGHT_ARRIVAL_EDD: ISOconvert(data) });
                }}
                size={12}
                added={true}
                type={'time'}
                data={tConvert(formpayload.FLIGHT_ARRIVAL_EDD)}
              />

              <DateTimeInput
                label={'Arrival Date Time'}
                showDatePickerPostDepart={data => {
                  console.log(data);
                  showDatePicker('datetime', 'FLIGHT_ARRIVAL_EDA');
                }}
                setNowPostDepart={() => { }}
                setflightdoc={data => {
                  sethasUnsavedChanges(true);
                  setformpayload({ ...formpayload, FLIGHT_ARRIVAL_EDA: ISOconvert(data) });
                }}
                size={12}
                added={true}
                type={'time'}
                data={tConvert(formpayload.FLIGHT_ARRIVAL_EDA)}
              />
              <LabelledInput
                label={'No. of Crew'} //mark
                datatype={'text'}
                data={formpayload.FLIGHT_ARRIVAL_CREW}
                disabled={false}
                index={57}
                setText={(index, text, type, section) => {
                  sethasUnsavedChanges(true);
                  setformpayload({ ...formpayload, FLIGHT_ARRIVAL_CREW: text });
                }}
                multiline={true}
                numberOfLines={1}
              />
              <LabelledInput
                label={'No. of Pax'} //mark
                datatype={'text'}
                data={formpayload.FLIGHT_ARRIVAL_PAX}
                disabled={false}
                index={57}
                setText={(index, text, type, section) => {
                  sethasUnsavedChanges(true);
                  setformpayload({ ...formpayload, FLIGHT_ARRIVAL_PAX: text });
                }}
                multiline={true}
                numberOfLines={1}
              />
            </View></>}
          {(formpayload.FLIGHT_TYPE == 'Full Ground Handling' || formpayload.FLIGHT_TYPE == 'Departure') && <><Text style={styleSheet.label}>Departure Schedule</Text>
            <View style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}>
              <LabelledInput
                label={'Origin'} //mark
                datatype={'text'}
                data={formpayload.FLIGHT_DEPARTURE_ORIGIN}
                disabled={false}
                index={57}
                setText={(index, text, type, section) => {
                  sethasUnsavedChanges(true);
                  setformpayload({ ...formpayload, FLIGHT_DEPARTURE_ORIGIN: text });
                }}
                multiline={true}
                numberOfLines={1}
              />
              <LabelledInput
                label={'Destination'} //mark
                datatype={'text'}
                data={formpayload.FLIGHT_DEPARTURE_DESTINATION}
                disabled={false}
                index={57}
                setText={(index, text, type, section) => {
                  sethasUnsavedChanges(true);
                  setformpayload({ ...formpayload, FLIGHT_DEPARTURE_DESTINATION: text });
                }}
                multiline={true}
                numberOfLines={1}
              />
              <DateTimeInput
                label={'Departure Date Time'}
                showDatePickerPostDepart={data => {
                  showDatePicker('datetime', 'FLIGHT_DEPARTURE_EDD');
                }}
                setNowPostDepart={data => {
                  console.log(data);
                }}
                setflightdoc={data => {
                  sethasUnsavedChanges(true);
                  setformpayload({ ...formpayload, FLIGHT_DEPARTURE_EDD: ISOconvert(data) });
                }}
                size={12}
                added={true}
                type={'time'}
                data={tConvert(formpayload.FLIGHT_DEPARTURE_EDD)}
              />

              <DateTimeInput
                label={'Arrival Date Time'}
                showDatePickerPostDepart={data => {
                  console.log(data);
                  showDatePicker('datetime', 'FLIGHT_DEPARTURE_EDA');
                }}
                setNowPostDepart={() => { }}
                setflightdoc={data => {
                  sethasUnsavedChanges(true);
                  setformpayload({ ...formpayload, FLIGHT_DEPARTURE_EDA: ISOconvert(data) });
                }}
                size={12}
                added={true}
                type={'time'}
                data={tConvert(formpayload.FLIGHT_DEPARTURE_EDA)}
              />
              <LabelledInput
                label={'No. of Crew'} //mark
                datatype={'text'}
                data={formpayload.FLIGHT_DEPARTURE_CREW}
                disabled={false}
                index={57}
                setText={(index, text, type, section) => {
                  sethasUnsavedChanges(true);
                  setformpayload({ ...formpayload, FLIGHT_DEPARTURE_CREW: text });
                }}
                multiline={true}
                numberOfLines={1}
              />
              <LabelledInput
                label={'No. of Pax'} //mark
                datatype={'text'}
                data={formpayload.FLIGHT_DEPARTURE_PAX}
                disabled={false}
                index={57}
                setText={(index, text, type, section) => {
                  sethasUnsavedChanges(true);
                  setformpayload({ ...formpayload, FLIGHT_DEPARTURE_PAX: text });
                }}
                multiline={true}
                numberOfLines={1}
              />
            </View></>}

        </View>
      </ScrollView>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <TouchableOpacity
          style={{
            top: 20,
            right: 20,
            position: 'absolute',
            backgroundColor: 'white',
            zIndex: 99,
            padding: 10,
          }}
          onPress={() => setmodalVisible(false)}>
          <Text style={{ color: 'black', fontSize: 20 }}>Close</Text>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.8)',
            paddingTop: 80,
          }}>
          <ScrollView contentContainerStyle={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                sethasUnsavedChanges(true);
                setformpayload({ ...formpayload, FLIGHT_TYPE: 'Full Ground Handling' });
                setmodalVisible(false);
              }}
              style={{
                backgroundColor: 'white',
                width: width * 0.9,
                padding: 20,
                borderBottomWidth: 2,
              }}>
              <Text style={{ color: 'black', fontSize: width / 20 }}>
                Full Ground Handling
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                sethasUnsavedChanges(true);
                setformpayload({ ...formpayload, FLIGHT_TYPE: 'Arrival' });
                setmodalVisible(false);
              }}
              style={{
                backgroundColor: 'white',
                width: width * 0.9,
                padding: 20,
                borderBottomWidth: 2,
              }}>
              <Text style={{ color: 'black', fontSize: width / 20 }}>
                Arrival Handling Only
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                sethasUnsavedChanges(true);
                setformpayload({ ...formpayload, FLIGHT_TYPE: 'Departure' });
                setmodalVisible(false);
              }}
              style={{
                backgroundColor: 'white',
                width: width * 0.9,
                padding: 20,
              }}>
              <Text style={{ color: 'black', fontSize: width / 20 }}>
                Departure Handling Only
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={modalVisibleList}>
        <TouchableOpacity
          style={{
            top: 20,
            right: 20,
            position: 'absolute',
            backgroundColor: 'white',
            zIndex: 99,
            padding: 10,
          }}
          onPress={() => setmodalVisibleList(false)}>
          <Text style={{ color: 'black', fontSize: 20 }}>Close</Text>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.8)',
            paddingTop: 80,
          }}>
          <ScrollView contentContainerStyle={{ flex: 1 }}>
            {regList.map((val, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    sethasUnsavedChanges(true);
                    setformpayload({ ...formpayload, FLIGHT_REGISTRATION: val.AIRCRAFT_REGISTRATION });
                    setreg(val);
                    console.log(val)
                    setmodalVisibleList(false);
                  }}
                  style={{
                    backgroundColor: 'white',
                    width: width * 0.9,
                    padding: 20,
                    borderBottomWidth: 2,
                  }}>
                  <Text style={{ color: 'black', fontSize: width / 20 }}>
                    {val.AIRCRAFT_REGISTRATION}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        is24Hour={true}
      />
    </View>
  );
};
const styleSheet = StyleSheet.create({
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    textAlignVertical: 'top',
    color: 'black',
    backgroundColor: 'white',
    marginBottom: 20,
    fontSize: 20,
    padding: 10,
  },
  label: {
    // fontSize: Dimensions.get('window').width / 25,
    color: 'black',
  },
  rowFront: {
    backgroundColor: '#3b7dfc',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    height: 100,
    borderColor: '#000',
    borderRadius: 8,
    flexDirection: 'row',
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
    elevation: 10,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 20,
  },
});
export default EditFlight;
