import React, {useEffect, useState, useRef} from 'react';
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
import {firebase} from '@react-native-firebase/functions';
import Header from '../subcomponents/Forms/Header';
import auth from '@react-native-firebase/auth';
const {width, height} = Dimensions.get('window');

const HeadingTextSize = width / 15;
const labelTextSize = width / 25;
const EditFlight = props => {
  const currentPicker = useRef(0);
  const UID = props.route.params.UID;
  // console.log(UID);
  const [mode, setMode] = useState('time');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  
  const [refno, setrefno] = useState(null);
  const [modalVisible, setmodalVisible] = useState(false);
  const [reg, setreg] = useState(null);
  const [type, settype] = useState(null);
  const [depdate, setdepdate] = useState(null);
  const [arrdate, setarrdate] = useState(null);
  const [deptime, setdeptime] = useState(null);
  const [arrtime, setarrtime] = useState(null);
  const [crewdep, setcrewdep] = useState(0);
  const [crewarr, setcrewArr] = useState(0);
  const [paxdep, setpaxdep] = useState(null);
  const [paxarr, setpaxarr] = useState(null);
  const [crtby, setcrtby] = useState(null);
  const [callLoad, setcallLoad] = useState(false);
  const tConvert = dateT => {
    console.log("HERE",dateT)
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
      fetch(url, {method: 'GET'})
        .then(data => {
          return data.json();
        })
        .then(data => {
          var res = data.Table;
          console.log(res);
          setrefno(res[0].REF_NO);
          setreg(res[0].FLIGHT_REGISTRATION);
          setdepdate(res[0].FLIGHT_DEPARTURE_DATE);
          setarrdate(res[0].FLIGHT_ARRIVAL_DATE);
          setdeptime(res[0].FLIGHT_DEPARTURE_TIME);
          setarrtime(res[0].FLIGHT_ARRIVAL_TIME);
          setcrewdep(res[0].FLIGHT_CREW_DEPARTURE);
          setcrewArr(res[0].FLIGHT_CREW_ARRIVAL);
          setpaxarr(res[0].FLIGHT_PAX_ARRIVAL);
          setpaxdep(res[0].FLIGHT_PAX_DEPARTURE);
          settype(res[0].FLIGHT_TYPE);
          setcrtby(res[0].CREATED_BY);
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
    var payload = {
      REF_NO: refno,
      FLIGHT_REGISTRATION: reg,
      FLIGHT_DEPARTURE_DATE: depdate,
      FLIGHT_ARRIVAL_DATE: arrdate,
      FLIGHT_DEPARTURE_TIME: deptime,
      FLIGHT_ARRIVAL_TIME: arrtime,
      FLIGHT_CREW_DEPARTURE: crewdep.toString(),
      FLIGHT_CREW_ARRIVAL: crewarr.toString(),
      FLIGHT_PAX_ARRIVAL: paxarr.toString(),
      FLIGHT_PAX_DEPARTURE: paxdep.toString(),
      FLIGHT_TYPE: type,
      STATUS: 0,
      UPDATE_BY: email,
      CREATED_BY: crtby,
    };
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
        Alert.alert('Success');
        console.log(response);
      })
      .catch(error => {
        setcallLoad(false);
        Alert.alert('Error in updating');
        console.log(error, 'Function error');
      });
  };
const [fieldType,setfieldType]=useState(0);
  const showDatePicker = (type, index, pos, field) => {
    pos != undefined
      ? (currentPicker.current = [index, pos, field])
      : (currentPicker.current = [index]);
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
    // tarrival= new Date(date).toLocaleString('en-US', {
    //   hour12: false,
    // });
    // if (currentPicker.current.length > 1) {
    //   tarrival[currentPicker.current[0]][currentPicker.current[1]][
    //     currentPicker.current[2]
    //   ] = tConvert(
    //     new Date(date).toLocaleString('en-US', {
    //       hour12: false,
    //     }),
    //   );
    // } else {
    //   tarrival[currentPicker.current[0]] = tConvert(
    //     new Date(date).toLocaleString('en-US', {
    //       hour12: false,
    //     }),
    //   );
    // }
    // console.log(
    //   'A date has been picked: ',
    //   new Date(date).toLocaleString('en-US', {
    //     hour12: false,
    //   }),
    // );
    console.log('Check' ,tarrival);
    switch (fieldType) {
      case 0:
        setdepdate(tarrival);
        break;
      case 1:
        setarrdate(tarrival);
        break;
      case 2:
        setdeptime(tarrival);
        break;
      case 3:
        setarrtime(tarrival);
        break;
      default:
        break;
    }
    
    
    //setArrival(tarrival);
    hideDatePicker();
  };
  
  return (
    <View>
      <Header
        headingSize={HeadingTextSize}
        heading={'Edit Flight'}
        sendForm={sendForm}
        Icon={
          callLoad ? (
            <ActivityIndicator size={'small'} color="green" />
          ) : (
            <Icons name="content-save" color={'green'} size={30} />
          )
        }
      />
      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 20,
        }}>
        <Text
          style={{
            fontSize: Dimensions.get('window').width / 15,
            fontWeight: 'bold',
            color: 'black',
            paddingLeft: 20,
          }}>
          Edit Flight
        </Text>
        <TouchableOpacity style={{marginRight: 20}}>
          <Icons name="content-save" color="green" size={30} />
        </TouchableOpacity>
      </View> */}
      <ScrollView>
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 100,
          }}>
          <LabelledInput
            label={'Reference No.'} //mark
            datatype={'text'}
            data={refno}
            disabled={false}
            index={57}
            setText={(index, text, type, section) => {
              setrefno(text);
            }}
            multiline={true}
            numberOfLines={1}
          />

          <LabelledInput
            label={'Registration'} //mark
            data={reg}
            datatype={'text'}
            index={57}
            setText={(index, text, type, section) => {
              setreg(text);
            }}
            multiline={true}
            numberOfLines={1}
          />

          <DateTimeInput
            label={'Departure Date'}
            showDatePickerPostDepart={data => {
              console.log(data);
              
              showDatePicker('date',0)
            }}
            setNowPostDepart={data => {
              console.log(data);
            }}
            setflightdoc={data => {
              setdepdate(ISOconvert(data));
            }}
            size={12}
            added={true}
            type={'time'}
            data={tConvert(depdate)}
          />

          <DateTimeInput
            label={'Arrival Date'}
            showDatePickerPostDepart={data => {
              console.log(data);
              showDatePicker('date',1)
            }}
            setNowPostDepart={() => {}}
            setflightdoc={data => {
              setarrdate(ISOconvert(data));
            }}
            size={12}
            added={true}
            type={'time'}
            data={tConvert(arrdate)}
          />

          <DateTimeInput
            label={'Departure Time'}
            showDatePickerPostDepart={data => {
              console.log(data);
              showDatePicker('time',2)
            }}
            setNowPostDepart={() => {}}
            setflightdoc={data => {
              setdeptime(ISOconvert());
            }}
            size={12}
            added={true}
            type={'time'}
            data={tConvert(deptime)}
          />

          <DateTimeInput
            label={'Arrival Time'}
            showDatePickerPostDepart={data => {
              console.log(data);
              showDatePicker('time',3)
            }}
            setNowPostDepart={() => {}}
            setflightdoc={data => {
              setarrtime(ISOconvert(data));
            }}
            size={12}
            added={true}
            type={'time'}
            data={tConvert(arrtime)}
          />

          <LabelledInput
            label={'Crew (Departure)'} //mark
            datatype={'text'}
            data={crewdep}
            disabled={false}
            index={57}
            setText={(index, text, type, section) => {
              setcrewdep(text);
            }}
            multiline={true}
            numberOfLines={1}
          />

          <LabelledInput
            label={'Crew (Arrival)'} //mark
            data={crewarr}
            datatype={'text'}
            index={57}
            setText={(index, text, type, section) => {
              setcrewArr(text);
            }}
            multiline={true}
            numberOfLines={1}
          />

          <LabelledInput
            label={'Pax (Departure)'} //mark
            data={paxdep}
            datatype={'text'}
            index={57}
            setText={(index, text, type, section) => {
              setpaxdep(text);
            }}
            multiline={true}
            numberOfLines={1}
          />

          <LabelledInput
            label={'Pax (Arrival)'} //mark
            data={paxarr}
            datatype={'text'}
            index={57}
            setText={(index, text, type, section) => {
              setpaxarr(text);
            }}
            multiline={true}
            numberOfLines={1}
          />

          <Text style={styleSheet.label}>Type</Text>
          <View>
            <TouchableOpacity
              style={styleSheet.input}
              onPress={() => setmodalVisible(true)}>
              <Text style={{fontSize: 20, color: 'black'}}>{type}</Text>
            </TouchableOpacity>
          </View>
          {/* <LabelledInput
            label={'Type'} //mark
            data={type}
            datatype={'text'}
            index={57}
            setText={(index, text, type, section) => {
              settype(text);
            }}
            multiline={true}
            numberOfLines={1}
          /> */}
        </View>
      </ScrollView>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
            paddingTop: 50,
          }}>
          <TouchableOpacity
            onPress={() => {
              settype('Full Ground Handling');
              setmodalVisible(false);
            }}
            style={{
              backgroundColor: 'white',
              width: '90%',
              padding: 20,
              borderBottomWidth: 2,
            }}>
            <Text style={{color: 'black', fontSize: width / 20}}>
              Full Ground Handling
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              settype('Arrival Handling Only');
              setmodalVisible(false);
            }}
            style={{
              backgroundColor: 'white',
              width: '90%',
              padding: 20,
              borderBottomWidth: 2,
            }}>
            <Text style={{color: 'black', fontSize: width / 20}}>
              Arrival Handling Only
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              settype('Departure Handling Only');
              setmodalVisible(false);
            }}
            style={{
              backgroundColor: 'white',
              width: '90%',
              padding: 20,
            }}>
            <Text style={{color: 'black', fontSize: width / 20}}>
              Departure Handling Only
            </Text>
          </TouchableOpacity>
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
    fontSize: Dimensions.get('window').width / 25,
    color: 'black',
  },
});
export default EditFlight;
