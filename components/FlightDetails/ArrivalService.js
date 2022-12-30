import {
  View,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  Switch,
  ScrollView,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, {useRef, useState, useEffect} from 'react';
import DocumentPicker from 'react-native-document-picker';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as ImagePicker from 'react-native-image-picker';
import Loader from '../Loader';
import DateTimeInput from '../subcomponents/Forms/universal/datetimeinput';
import LabelledInput from '../subcomponents/Forms/universal/labelledinput';

const {width, height} = Dimensions.get('window');

export default function ArrivalService({navigation}) {
  const currentPicker = useRef(0);
  const refRBSheet = useRef();

  //upload funcs
  const [uploadSection, setuploadSection] = useState(0);

  const [mode, setMode] = useState('time');
  const [loading, setloading] = useState(false);
  const [disabled, setdisabled] = useState({
    catering: false,
    water: false,
    lavatory: false,
    rubbish: false,
    fuel: false,
    towing: false,
    overnight: false,
  });

  const [arrival, setArrival] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    {value: null, file: []},
    null,
    null,
    {checked: false},
    null,//10
    null,
    {checked: false},
    {checked: false},
    null,
    null,
    {value: null, file: []},
    {value: null, file: []},
    null,
    null,
    {checked: true},
    null,
    null,
    null,
    {checked: true},
    null,
    null,
    null,
    {checked: true},
    null,
    null,
    {checked: true},
    null,
    null,
    null,
    {value: null, file: []},
    'For remarks; if the fuel truck needs to  come around a second time, they can put the details of the second time it comes around into the remarks here',
    {checked: true},
    null,
    null,
    {value: null, file: []},
    null, //41
    {checked: true},
    null,
    {checked: true},
    null,
    null,
    {checked: false},
    null,
    null,
    null,
    null,
    null,
    null,
    {value: null, file: []},
    null,
    null,
    null,
    null,
    null,
    [],
    [], //61
    [], //62
    {},//63
    null,//64
    null,//65
  ]);
  const addMovement = () => {
    var tarrival = [...arrival];
    tarrival[60] = [
      ...arrival[60],
      {arrival: null, boarded: null, departed: null, remarks: null},
    ];
    setArrival(tarrival);
  };
  const onRemoveMovement = index => {
    var service = [...arrival];
    service[60].splice(index, 1);
    setArrival(service);
  };
  useEffect(() => {}, []);
  const setArrivalcheck = index => {
    var tarrival = [...arrival];
    tarrival[index].checked = !tarrival[index].checked;
    setArrival(tarrival);
    // console.log('triggered', tcheckList);
  };
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = (type, index, pos, field) => {
    pos != undefined
      ? (currentPicker.current = [index, pos, field])
      : (currentPicker.current = [index]);
    setMode(type);
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = date => {
    // console.log('A date has been picked: ', date);
    var tarrival = [...arrival];
    if (currentPicker.current.length > 1) {
      tarrival[currentPicker.current[0]][currentPicker.current[1]][
        currentPicker.current[2]
      ] = tConvert(
        new Date(date).toLocaleString('en-US', {
          hour12: false,
        }),
      );
    } else {
      tarrival[currentPicker.current[0]] = tConvert(
        new Date(date).toLocaleString('en-US', {
          hour12: false,
        }),
      );
    }
    console.log(
      'A date has been picked: ',
      new Date(date).toLocaleString('en-US', {
        hour12: false,
      }),
    );
    setArrival(tarrival);
    hideDatePicker();
  };
  const tConvert = datetime => {
    var date = datetime.split(',')[0].split('/');
    var time24 = datetime.split(', ')[1];
    var time = time24.split(':');
    return (
      date[1] + '/' + date[0] + '/' + date[2] + ', ' + time[0] + ':' + time[1]
    );
  };
  const setNow = (index, pos, field) => {
    console.log(field);
    var tarrival = [...arrival];
    console.log(field);
    if (pos != undefined) {
      tarrival[index][pos][field] = tConvert(
        new Date().toLocaleString('en-US', {
          hour12: false,
        }),
      );
    } else {
      tarrival[index] = tConvert(
        new Date().toLocaleString('en-US', {
          hour12: false,
        }),
      );
    }
    setArrival(tarrival);
  };
  const onPressDocPreA = async index => {
    try {
      setloading(true);
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      // console.log(res);
      RNFetchBlob.fs
        .readFile(res.uri, 'base64')
        .then(encoded => {
          // console.log(encoded, 'reports.base64');
          setloading(false);
          var tarrival = [...arrival];
          tarrival[index].file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setArrival(tarrival);
        })
        .catch(error => {
          setloading(false);
          console.log(error);
        });

      // }
    } catch (err) {
      setloading(false);
      console.log(JSON.stringify(err), 'Errorss');
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        // throw err;
      }
    }
  };

  const onPressDocPreA_New = async (index, res) => {
    setloading(false);
    RNFetchBlob.fs
      .readFile(res.uri, 'base64')
      .then(encoded => {
        // console.log(encoded, 'reports.base64');
        setloading(false);
        var tarrival = [...arrival];
        tarrival[index].file.push({
          name: res.fileName.replace('rn_image_picker_lib_temp_', ''),
          base64: 'data:' + res.type + ';base64,' + encoded,
        });
        setArrival(tarrival);
      })
      .catch(error => {
        setloading(false);
        console.log(error);
      });
    refRBSheet.current.close();
  };

  const getImage = async type => {
    console.log('HERE', uploadSection);
    var options = {
      mediaType: 'image',
      includeBase64: false,
      maxHeight: 800,
      maxWidth: 800,
    };
    console.log(options);
    switch (type) {
      case true:
        try {
          options.mediaType = 'photo';
          const result = await ImagePicker.launchImageLibrary(options);
          console.log(result);
          const file = result.assets[0];
          onPressDocPreA_New(uploadSection, file);
        } catch (error) {
          console.log(error);
        }
        break;
      case false:
        try {
          const result = await ImagePicker.launchCamera(options);
          console.log(result);

          const file = result.assets[0];
          onPressDocPreA_New(uploadSection, file);
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    }
  };

  const removeFilePreA = (arrayIndex, index) => {
    var tarrival = [...arrival];
    tarrival[arrayIndex].file.splice(index, 1);
    setArrival(tarrival);
  };

  const [crewmove, setcrewmove] = useState(false);
  const [crewmovenum, setcrewmovenum] = useState(0);
  const addCrewMovement = () => {
    setcrewmove(true);
    setcrewmovenum(crewmovenum + 1);
  };

  const removeCrewMovement = () => {
    var x = crewmovenum;
    x = x - 1;
    if (x == 0) {
      setcrewmove(false);
      setcrewmovenum(0);
    } else {
      setcrewmovenum(x);
    }
  };

  const setArrivalData=(index,text,type,section)=>{
    var tarrival = [...arrival];
    tarrival[index] = text;
    setArrival(tarrival);  
  }

  return (
    <View>
      <View
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
          Arrival Services
        </Text>
        <TouchableOpacity style={{marginRight: 20}}>
          <Icons name="content-save" color="green" size={30} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Loader visible={loading} />

        <View style={{padding: 20, marginBottom: 100}}>
        <DateTimeInput 
                label={'Movement (AC Landed) (Local Time)'}
                showDatePickerPostDepart={()=>{showDatePicker('time', 0)}}
                setNowPostDepart={()=>setNow(0)}
                size={12}
                type={'time'}
                data={arrival[0]}
                index={12}
              />
          {/* <Text style={styleSheet.label}>Movement (AC Landed (Local Time)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 0)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[0] ? arrival[0] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(0)} style={{padding: 10}}>
              <Text
                style={{
                  fontSize: Dimensions.get('window').width / 25,
                  color: 'green',
                }}>
                Time Now
              </Text>
            </TouchableOpacity>
          </View> */}
          <DateTimeInput 
                label={'Movement (Checks In) (Local Time)'}
                showDatePickerPostDepart={()=>{showDatePicker('time', 1)}}
                setNowPostDepart={()=>setNow(1)}
                size={12}
                type={'time'}
                data={arrival[1]}
                index={12}
              />
          {/* <Text style={styleSheet.label}>Movement (Chocks in (Local Time)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePicker('time', 1)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {arrival[1] ? arrival[1] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNow(1)} style={{padding: 10}}>
              <Text
                style={{
                  fontSize: Dimensions.get('window').width / 25,
                  color: 'green',
                }}>
                Time Now
              </Text>
            </TouchableOpacity>
          </View> */}
          <Text style={styleSheet.label}>Ground Power Unit (GPU):</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
              <DateTimeInput 
                label={'Start Time (Local Time)'}
                showDatePickerPostDepart={()=>{showDatePicker('time', 2)}}
                setNowPostDepart={()=>setNow(2)}
                size={12}
                type={'time'}
                data={arrival[2]}
                index={12}
              />
            {/* //mark <Text style={styleSheet.label}>Start Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 2)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[2] ? arrival[2] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNow(2)} style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View> */}
            <DateTimeInput 
                label={'Stop Time (Local Time)'}
                showDatePickerPostDepart={()=>{showDatePicker('time', 3)}}
                setNowPostDepart={()=>setNow(3)}
                size={12}
                type={'time'}
                data={arrival[3]}
              />
            {/* <Text style={styleSheet.label}>Stop Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 3)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[3] ? arrival[3] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNow(3)} style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
          <LabelledInput
                label={'Number of Pax'} //mark
                data={arrival[4]}
                datatype={'text'}
                index={4}
                setText={(index,text,type,section)=>{
                  var tarrival = [...arrival];
                  tarrival[index] = text;
                  setArrival(tarrival);  
                }} 
                multiline={false}
                numberOfLines={1}
              />
          {/* <Text style={styleSheet.label}>Number of Pax</Text>
          <TextInput
            style={styleSheet.input}
            value={arrival[4]}
            onChangeText={text => {
              var tarrival = [...arrival];
              tarrival[4] = text;
              setArrival(tarrival);
            }}
          /> //mark */}
          <LabelledInput
                label={'Number of Crew'} //mark
                data={arrival[5]}
                datatype={'text'}
                index={5}
                setText={setArrivalData} 
                multiline={false}
                numberOfLines={1}
              />
          {/* <Text style={styleSheet.label}>Number of Crew</Text>
          <TextInput
            style={styleSheet.input}
            value={arrival[5]}
            onChangeText={text => {
              var tarrival = [...arrival];
              tarrival[5] = text;
              setArrival(tarrival);
            }}
          /> */}
          <Text style={styleSheet.label}>Baggage:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <Text style={styleSheet.label}>Number of Baggage Offloaded</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                value={arrival[6].value}
                onChangeText={text => {
                  var tarrival = [...arrival];
                  tarrival[6].value = text;
                  setArrival(tarrival);
                }}
              />
              <TouchableOpacity
                //onPress={event => onPressDocPreA(6)}
                onPress={() => {
                  setuploadSection(6);
                  refRBSheet.current.open();
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    color: 'green',
                    fontSize: Dimensions.get('window').width / 25,
                  }}>
                  Add photo
                </Text>
              </TouchableOpacity>
            </View>
            {arrival[6].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {arrival[6].file.map((value, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 20,
                        marginHorizontal: 5,
                        ...Platform.select({
                          ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                          },
                          android: {
                            elevation: 3,
                          },
                        }),
                      }}>
                      <Text style={styleSheet.imgName}>{value.name}</Text>
                      <TouchableOpacity
                        onPress={() => removeFilePreA(6, index)}>
                        <Icons
                          style={{color: 'green', marginLeft: 10}}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
          {/* ---------------------------Pax Movement-----------------------*/}
          <Text style={styleSheet.label}>Pax Movement :</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>

<DateTimeInput 
                label={'Pax Departed from Aircraft (Local Time)'}
                showDatePickerPostDepart={()=>{showDatePicker('time', 7)}}
                setNowPostDepart={()=>setNow(7)}
                size={12}
                type={'time'}
                data={arrival[7]}
                index={12}
              />

            {/* <Text style={styleSheet.label}>
              Pax Departed from Aircraft (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 7)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[7] ? arrival[7] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNow(7)} style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View> */}
            <DateTimeInput 
                label={'Pax Arrived at Terminal (Local Time)'}
                showDatePickerPostDepart={()=>{showDatePicker('time', 8)}}
                setNowPostDepart={()=>setNow(8)}
                size={12}
                type={'time'}
                data={arrival[8]}
                index={12}
              />
            {/* <Text style={styleSheet.label}>
              Pax Arrived at Terminal (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 8)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[8] ? arrival[8] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNow(8)} style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View> */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={event => setArrivalcheck(9)}>
                <Icons
                  name={
                    arrival[9].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={arrival[9].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Pax Visa on Arrival</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <TouchableOpacity onPress={event => setArrivalcheck(12)}>
                <Icons
                  name={
                    arrival[12].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={arrival[12].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>VOA Not Required</Text>
            </View>
            <DateTimeInput 
                label={'Pax Completed CIQ (Local Time)'}
                showDatePickerPostDepart={()=>{showDatePicker('time', 10)}}
                setNowPostDepart={()=>setNow(10)}
                size={12}
                type={'time'}
                data={arrival[10]}
                index={12}
              />
            {/* <Text style={styleSheet.label}>Pax Completed CIQ (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 10)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[10] ? arrival[10] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNow(10)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View> */}
            
            <DateTimeInput 
                label={'Actual Transport Arrival Time at Airport (Local Time)'}
                notrequiredSection={true}
                showDatePickerPostDepart={()=>{showDatePicker('time', 58)}}
                setNowPostDepart={()=>setNow(58)}
                size={12}
                type={'time'}
                data={arrival[58]}
                index={12}
              />
            {/* <Text style={styleSheet.label}>
              Actual Transport Arrival Time at Airport (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 58)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[58] ? arrival[58] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNow(58)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View> */}
            
            {/* <Text style={styleSheet.label}>
              Time Pax Boarded Transport at Airport (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 59)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[59] ? arrival[59] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNow(59)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View> */}
            <DateTimeInput 
                label={'Pax Departed from Terminal (Local Time)'}
                showDatePickerPostDepart={()=>{showDatePicker('time', 11)}}
                setNowPostDepart={()=>setNow(11)}
                size={12}
                type={'time'}
                data={arrival[11]}
                index={12}
              />
            {/* <Text style={styleSheet.label}>
              Pax Departed from Terminal (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 11)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[11] ? arrival[11] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNow(11)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View> */}

            <LabelledInput
              label={'Remarks'} //mark
              data={arrival[14]}
              datatype={'text'}
              index={14}
              setText={setArrivalData} 
              multiline={true}
              numberOfLines={2}
            />
            {/* <Text style={styleSheet.label}>Remarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                multiline={true}
                placeholder="Pax Name"
                numberOfLines={2}
                value={arrival[14]}
                onChangeText={text => {
                  var tarrival = [...arrival];
                  tarrival[14] = text;
                  setArrival(tarrival);
                }}
              />
            </View> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => addMovement(true)}
                style={[styleSheet.button]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Movement
                </Text>
              </TouchableOpacity>
            </View>
            {arrival[60].map((val, index) => {
              return (
                <View key={index} style={{marginTop: 20}}>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'rgba(0,0,0,0.4)',
                      marginBottom: 20,
                    }}></View>
                    {
                      //remove old fields


                      //add 

                      //

                    }
                  <View style={{alignItems: 'flex-end'}}>
                    <TouchableOpacity
                      style={styleSheet.label}
                      onPress={() => onRemoveMovement(index)}>
                      <Icons name="minus-box-outline" color="red" size={30} />
                    </TouchableOpacity>
                  </View>

                  
                  <DateTimeInput 
                label={'Actual Transport Arrival Time at Airport (Local Time)'}
//come here
                notrequiredSection={true}
                showDatePickerPostDepart={()=>{showDatePicker('time', 60, index, 'departed')}}
                setNowPostDepart={()=>setNow(65)}
                size={12}
                type={'time'}
                data={arrival[65]}
                index={12}
              />
                  <Text style={styleSheet.label}>
                    Pax Departed from Terminal (Local Time)
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={styleSheet.picker}
                      onPress={() =>
                        showDatePicker('time', 60, index, 'departed')
                      }>
                      <Text style={{fontSize: 20, color: 'black'}}>
                        {val.departed ? val.departed : 'dd/mm/yy, -- : --'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setNow(60, index, 'departed')}
                      style={{padding: 10}}>
                      <Text
                        style={{
                          fontSize: Dimensions.get('window').width / 25,
                          color: 'green',
                        }}>
                        Time Now
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styleSheet.label}>Remarks</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput
                      style={styleSheet.input}
                      multiline={true}
                      placeholder="Pax Name"
                      numberOfLines={2}
                      value={val.remarks}
                      onChangeText={text => {
                        var tarrival = [...arrival];
                        tarrival[60][index].remarks = text;
                        setArrival(tarrival);
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          {/* ---------------------------Catering-----------------------*/}

          <Text style={styleSheet.label}>Catering:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={event => {
                  setArrivalcheck(20);
                  var x=[...arrival];
                  //come here
                  x[15]=null;
                  x[16]={value: null, file: []};
                  x[17]={value: null, file: []};
                  x[18]=null;
                  x[19]=null;
                  setArrival(x); 
                }}>
                <Icons
                  name={
                    arrival[20].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={arrival[20].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Catering Equipment Offloaded</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                editable={!arrival[20].checked}
                style={[
                  styleSheet.input,
                  {
                    backgroundColor: arrival[20].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                multiline={true}
                numberOfLines={2}
                value={arrival[15]}
                onChangeText={text => {
                  var tarrival = [...arrival];
                  tarrival[15] = text;
                  setArrival(tarrival);
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Text style={styleSheet.label}>
                Catering Equipment List / Photo
              </Text>
              <TouchableOpacity
                //onPress={event => onPressDocPreA(16)}
                onPress={() => {
                  setuploadSection(16);
                  refRBSheet.current.open();
                }}
                disabled={arrival[20].checked}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: arrival[20].checked
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{color: 'green'}}>Upload</Text>
              </TouchableOpacity>
            </View>
            {arrival[16].file.length > 0 && (
              <View style={{marginBottom: 20, marginTop: 10}}>
                {arrival[16].file.map((value, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 20,
                        marginHorizontal: 5,
                        ...Platform.select({
                          ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                          },
                          android: {
                            elevation: 3,
                          },
                        }),
                      }}>
                      <Text style={styleSheet.imgName}>{value.name}</Text>
                      <TouchableOpacity
                        onPress={() => removeFilePreA(16, index)}>
                        <Icons
                          style={{color: 'green', marginLeft: 10}}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text style={styleSheet.label}>Next Catering Order</Text>
              <TouchableOpacity
                //onPress={event => onPressDocPreA(17)}
                onPress={() => {
                  setuploadSection(17);
                  refRBSheet.current.open();
                }}
                disabled={arrival[20].checked}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: arrival[20].checked
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{color: 'green'}}>Upload</Text>
              </TouchableOpacity>
            </View>
            {arrival[17].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {arrival[17].file.map((value, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 20,
                        marginHorizontal: 5,
                        ...Platform.select({
                          ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                          },
                          android: {
                            elevation: 3,
                          },
                        }),
                      }}>
                      <Text style={styleSheet.imgName}>{value.name}</Text>
                      <TouchableOpacity
                        onPress={() => removeFilePreA(17, index)}>
                        <Icons
                          style={{color: 'green', marginLeft: 10}}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
            <Text style={styleSheet.label}>Catering Delivey Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={arrival[20].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: arrival[20].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePicker('time', 18)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[18] ? arrival[18] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={arrival[20].checked}
                onPress={() => setNow(18)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>Remarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                editable={!arrival[20].checked}
                style={[
                  styleSheet.input,
                  {
                    backgroundColor: arrival[20].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                multiline={true}
                numberOfLines={2}
                value={arrival[19]}
                onChangeText={text => {
                  var tarrival = [...arrival];
                  tarrival[19] = text;
                  setArrival(tarrival);
                }}
              />
            </View>
          </View>
          <Text style={styleSheet.label}>Water Service:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={event =>{
                 setArrivalcheck(24)
                 var x=[...arrival];
                 x[21]=null;
                 x[22]=null;
                 x[23]=null;
                 setArrival(x);
                }}>
                <Icons
                  name={
                    arrival[24].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={arrival[24].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Start Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={arrival[24].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: arrival[24].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePicker('time', 21)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[21] ? arrival[21] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={arrival[24].checked}
                onPress={() => setNow(21)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>End Time (Local TIme)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={arrival[24].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: arrival[24].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePicker('time', 22)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[22] ? arrival[22] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={arrival[24].checked}
                onPress={() => setNow(22)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View>
          
            <Text style={styleSheet.label}>Remarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                editable={!arrival[24].checked}
                style={[
                  styleSheet.input,
                  {
                    backgroundColor: arrival[24].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                multiline={true}
                numberOfLines={2}
                value={arrival[23]}
                onChangeText={text => {
                  var tarrival = [...arrival];
                  tarrival[23] = text;
                  setArrival(tarrival);
                }}
              />
            </View>
          </View>
          <Text style={styleSheet.label}>Lavatory Service:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={event =>{
                 setArrivalcheck(28)
                  var x= [...arrival];
                  x[25]=null;
                  x[26]=null;
                  x[27]=null;
                  setArrival(x);
                }}>
                <Icons
                  name={
                    arrival[28].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={arrival[28].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Start Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={arrival[28].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: arrival[28].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePicker('time', 25)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[25] ? arrival[25] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={arrival[28].checked}
                onPress={() => setNow(25)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>End Time (Local TIme)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={arrival[28].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: arrival[28].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePicker('time', 26)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[26] ? arrival[26] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={arrival[28].checked}
                onPress={() => setNow(26)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View>
          
            <Text style={styleSheet.label}>Remarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                editable={!arrival[28].checked}
                style={[
                  styleSheet.input,
                  {
                    backgroundColor: arrival[28].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                multiline={true}
                numberOfLines={2}
                value={arrival[27]}
                onChangeText={text => {
                  var tarrival = [...arrival];
                  tarrival[27] = text;
                  setArrival(tarrival);
                }}
              />
            </View>
          </View>
          <Text style={styleSheet.label}>Rubbish Service:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={event =>{
                  setArrivalcheck(31)
                  var x=[...arrival];
                  x[29]=null;
                  x[30]=null;
                  setArrival(x);
                }}>
                <Icons
                  name={
                    arrival[31].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={arrival[31].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Completion Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={arrival[31].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: arrival[31].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePicker('time', 29)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[29] ? arrival[29] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={arrival[31].checked}
                onPress={() => setNow(29)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>Remarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                editable={!arrival[31].checked}
                style={[
                  styleSheet.input,
                  {
                    backgroundColor: arrival[31].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                multiline={true}
                numberOfLines={2}
                value={arrival[30]}
                onChangeText={text => {
                  var tarrival = [...arrival];
                  tarrival[30] = text;
                  setArrival(tarrival);
                }}
              />
            </View>
          </View>
          {/* ---------------------------Fuel on Arriva -----------------------*/}

          <Text style={styleSheet.label}>Fuel on Arrival:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={event =>{ 
                  setArrivalcheck(37)
                  var x=[...arrival];
                  x[32]=null;
                  x[33]=null;
                  x[34]=null;
                  x[35]={value:false,file:[]};
                  x[36]=null;
                  setArrival(x);
                }}>
                <Icons
                  name={
                    arrival[37].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={arrival[37].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Fuel Truck Arrival Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={arrival[37].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: arrival[37].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePicker('time', 32)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[32] ? arrival[32] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={arrival[37].checked}
                onPress={() => setNow(32)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>Start Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={arrival[37].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: arrival[37].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePicker('time', 33)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[33] ? arrival[33] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={arrival[37].checked}
                onPress={() => setNow(33)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>End Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={arrival[37].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: arrival[37].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePicker('time', 34)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[34] ? arrival[34] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={arrival[37].checked}
                onPress={() => setNow(34)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text style={styleSheet.label}>Fuel Receipt (signed)</Text>
              <TouchableOpacity
                disabled={arrival[37].checked}
                onPress={event => {
                  //onPressDocPreA(35)
                  setuploadSection(35);
                  refRBSheet.current.open();
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: arrival[37].checked
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{color: 'green'}}>Upload</Text>
              </TouchableOpacity>
            </View>
            {arrival[35].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {arrival[35].file.map((value, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 20,
                        marginHorizontal: 5,
                        ...Platform.select({
                          ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                          },
                          android: {
                            elevation: 3,
                          },
                        }),
                      }}>
                      <Text style={styleSheet.imgName}>{value.name}</Text>
                      <TouchableOpacity
                        onPress={() => removeFilePreA(35, index)}>
                        <Icons
                          style={{color: 'green', marginLeft: 10}}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
            <Text style={styleSheet.label}>Remarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                editable={!arrival[37].checked}
                style={[
                  styleSheet.input,
                  {
                    backgroundColor: arrival[37].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                multiline={true}
                numberOfLines={2}
                value={arrival[36]}
                onChangeText={text => {
                  var tarrival = [...arrival];
                  tarrival[36] = text;
                  setArrival(tarrival);
                }}
              />
            </View>
          </View>
          {/* ---------------------------Towing Service -----------------------*/}
          <Text style={styleSheet.label}>Towing Service:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={event =>{
                  setArrivalcheck(42)
                  var x=[...arrival];
                  x[38]=null;
                  x[39]=null;
                  //x[34]=null;
                  x[40]={value:false,file:[]};
                  x[41]=null;
                  setArrival(x);
                 }}>
                <Icons
                  name={
                    arrival[42].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={arrival[42].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Start Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={arrival[42].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: arrival[42].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePicker('time', 38)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[38] ? arrival[38] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={arrival[42].checked}
                onPress={() => setNow(38)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styleSheet.label}>End Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={arrival[42].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: arrival[42].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePicker('time', 39)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[39] ? arrival[39] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={arrival[42].checked}
                onPress={() => setNow(39)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text style={styleSheet.label}>Photo (if required)</Text>
              <TouchableOpacity
                disabled={arrival[42].checked}
                //onPress={event => onPressDocPreA(40)}
                onPress={() => {
                  setuploadSection(40);
                  refRBSheet.current.open();
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: arrival[42].checked
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{color: 'green'}}>Upload</Text>
              </TouchableOpacity>
            </View>
            {arrival[40].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {arrival[40].file.map((value, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 20,
                        marginHorizontal: 5,
                        ...Platform.select({
                          ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                          },
                          android: {
                            elevation: 3,
                          },
                        }),
                      }}>
                      <Text style={styleSheet.imgName}>{value.name}</Text>
                      <TouchableOpacity
                        onPress={() => removeFilePreA(40, index)}>
                        <Icons
                          style={{color: 'green', marginLeft: 10}}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
            <Text style={styleSheet.label}>Remarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={[
                  styleSheet.input,
                  {
                    backgroundColor: arrival[42].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                editable={!arrival[42].checked}
                multiline={true}
                numberOfLines={2}
                value={arrival[41]}
                onChangeText={text => {
                  var tarrival = [...arrival];
                  tarrival[41] = text;
                  setArrival(tarrival);
                }}
              />
            </View>
          </View>

          {/* ---------------------------Overnight Bay-----------------------*/}
          <Text style={styleSheet.label}>Overnight Bay:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={event =>{
                  setArrivalcheck(44)
                  var x=[...arrival];
                  x[43]=null;
                  setArrival(x)
                }}>

                <Icons
                  name={
                    arrival[44].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={arrival[44].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Number</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                editable={!arrival[44].checked}
                style={[
                  styleSheet.input,
                  {
                    backgroundColor: arrival[44].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                value={arrival[43]}
                onChangeText={text => {
                  var tarrival = [...arrival];
                  tarrival[43] = text;
                  setArrival(tarrival);
                }}
              />
            </View>
          </View>

          {/* ---------------------------Crew Movement	-----------------------*/}

          <Text style={styleSheet.label}>Crew Movement:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
              <DateTimeInput 
                label={'Crew Departed from Aircraft (Local Time)'}
                showDatePickerPostDepart={()=>{showDatePicker('time', 45)}}
                setNowPostDepart={()=>setNow(45)}
                size={12}
                type={'time'}
                data={arrival[45]}
                index={12}
              />
            {/* <Text style={styleSheet.label}>
              Crew Departed from Aircraft (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 45)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[45] ? arrival[45] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNow(45)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View> */}
            <DateTimeInput 
                label={'Crew Arrived at Terminal (Local Time)'}
                showDatePickerPostDepart={()=>{showDatePicker('time', 46)}}
                setNowPostDepart={()=>setNow(46)}
                size={12}
                type={'time'}
                data={arrival[46]}
                index={12}
              />
            {/* <Text style={styleSheet.label}>
              Crew Arrived at Terminal (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 46)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[46] ? arrival[46] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNow(46)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View> */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={event => setArrivalcheck(9)}>
                <Icons
                  name={
                    arrival[9].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={arrival[9].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Crew Visa on Arrival</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <TouchableOpacity onPress={event => setArrivalcheck(12)}>
                <Icons
                  name={
                    arrival[12].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={arrival[12].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>VOA Not Required</Text>
            </View>

            <DateTimeInput 
                label={'Crew Completed CIQ (Local Time)'}
                showDatePickerPostDepart={()=>{showDatePicker('time', 48)}}
                setNowPostDepart={()=>setNow(48)}
                size={12}
                type={'time'}
                data={arrival[48]}
                index={12}
              />
            {/* <Text style={styleSheet.label}>
              Crew Completed CIQ (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 48)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[48] ? arrival[48] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNow(48)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View> */}
          

            <DateTimeInput 
                label={'Actual Transport Arrival Time at Airport (Local Time)'}
                notrequiredSection={true}
                showDatePickerPostDepart={()=>{showDatePicker('time', 49)}}
                setNowPostDepart={()=>setNow(49)}
                size={12}
                type={'time'}
                data={arrival[49]}
                index={12}
              />
            {/* <Text style={styleSheet.label}>
              Actual Transport Arrival Time (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 49)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[49] ? arrival[49] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNow(49)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View> */}


            {/* <Text style={styleSheet.label}>
              Time Crew Boarded Transport (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 50)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[50] ? arrival[50] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNow(50)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View> */}

<DateTimeInput 
                label={'Crew Departed from Terminal (Local Time)'}
                showDatePickerPostDepart={()=>{showDatePicker('time', 61)}}
                setNowPostDepart={()=>setNow(61)}
                size={12}
                type={'time'}
                data={arrival[61]}
                index={12}
              />
            {/* <Text style={styleSheet.label}>
              Crew Departed from Terminal (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 61)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {arrival[61] ? arrival[61] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNow(61)}
                style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width / 25,
                    color: 'green',
                  }}>
                  Time Now
                </Text>
              </TouchableOpacity>
            </View> */}
            <LabelledInput
                label={'Remarks'} //mark
                data={arrival[41]}
                datatype={'text'}
                index={41}
                setText={setArrivalData} 
                multiline={false}
                numberOfLines={1}
              />
            {/* <Text style={styleSheet.label}>Remarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={[styleSheet.input]}
                multiline={true}
                numberOfLines={2}
                value={arrival[41]}
                onChangeText={text => {
                  var tarrival = [...arrival];
                  tarrival[41] = text;
                  setArrival(tarrival);
                }}
              />
            </View> */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => addCrewMovement(true)}
                style={[styleSheet.button]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Movement
                </Text>
              </TouchableOpacity>
            </View>
            {crewmove &&
              [...Array(crewmovenum)].map((data, index) => {
                return (
                  <View key={index} style={{marginTop: 20}}>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(0,0,0,0.4)',
                        marginBottom: 20,
                      }}></View>
                    <View style={{alignItems: 'flex-end'}}>
                      <TouchableOpacity
                        style={styleSheet.label}
                        onPress={() => removeCrewMovement()}>
                        <Icons name="minus-box-outline" color="red" size={30} />
                      </TouchableOpacity>
                    </View>
                    
                    <DateTimeInput 
                label={'Actual Transport Arrival Time at Airport (Local Time)'}
                notrequiredSection={true}
                showDatePickerPostDepart={()=>{showDatePicker('time', 62, index, 'arrival')}}
                setNowPostDepart={(a,time)=>{
                  var options={
                    arrival:time
                  }
                  var x=[...arrival];
                  x[62][index]=options;
                  setArrival(x);
                }}
                size={12}
                type={'time'}
                data={null}
                index={index}
              />
                    {/* <Text style={styleSheet.label}>
                      Actual Transport Arrival Time at Terminal (Local Time)
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        style={styleSheet.picker}
                        onPress={() =>
                          showDatePicker('time', 60, index, 'arrival')
                        }>
                        <Text style={{fontSize: 20, color: 'black'}}>
                          {'dd/mm/yy'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setNow(60, index, 'arrival')}
                        style={{padding: 10}}>
                        <Text
                          style={{
                            fontSize: Dimensions.get('window').width / 25,
                            color: 'green',
                          }}>
                          Time Now
                        </Text>
                      </TouchableOpacity>
                    </View> */}
                    {/* <Text style={styleSheet.label}>
                      Crew Departed from Terminal (Local Time)
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        style={styleSheet.picker}
                        onPress={() =>
                          showDatePicker('time', 61, index, 'arrival')
                        }>
                        <Text style={{fontSize: 20, color: 'black'}}>
                          {//arrival[61][index]!==null 
                          false? arrival[61][index] :'dd/mm/yy here'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setNow(61, index, 'arrival')}
                        style={{padding: 10}}>
                        <Text
                          style={{
                            fontSize: Dimensions.get('window').width / 25,
                            color: 'green',
                          }}>
                          Time Now
                        </Text>
                      </TouchableOpacity>
                    </View> */}
                    <DateTimeInput 
                      label={'Crew Departed from Terminal (Local Time)'}
                      showDatePickerPostDepart={()=>{showDatePicker('time', 62, index, 'departed')}}
                      setNowPostDepart={(a,time)=>{
                        var options={
                          departed:time
                        }
                        var x=[...arrival];
                        x[62][index]=options;
                        setArrival(x);
                      }}
                      size={12}
                      type={'time'}
                      data={null}
                      index={index}
                    />
<LabelledInput
              label={'Remarks'} //mark
              data={arrival[64]}
              datatype={'text'}
              index={64}
              setText={setArrivalData} 
              multiline={true}
              numberOfLines={2}
            />
                    
                    
                  </View>
                );
              })}
          </View>
          {/** CREW MOVE END 
          */}
         
          {/* <Text style={styleSheet.label}>Driver Contact Number</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={arrival[51]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[51] = text;
                setArrival(tarrival);
              }}
            />
          </View> */}
         
          {/* <Text style={styleSheet.label}>Hotel Name</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={arrival[52]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[52] = text;
                setArrival(tarrival);
              }}
            />
          </View> */}
      
          {/* <Text style={styleSheet.label}>Hotel Location</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={arrival[53]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[53] = text;
                setArrival(tarrival);
              }}
            />
          </View> */}
         

          {/* <Text style={styleSheet.label}>Additional Remarks</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              multiline={true}
              numberOfLines={2}
              value={arrival[57]}
              onChangeText={text => {
                var tarrival = [...arrival];
                tarrival[57] = text;
                setArrival(tarrival);
              }}
            />
          </View> */}
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={mode}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          is24Hour={true}
        />
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={height / 4}
          customStyles={{
            wrapper: {
              backgroundColor: '#00000056',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
          }}>
          <View style={{flex: 1, paddingLeft: 20}}>
            <View style={{flex: 1}}>
              <Text style={{color: 'black', fontSize: 22}}>Upload Image</Text>
            </View>
            <View style={{flex: 1.5, flexDirection: 'column'}}>
              <TouchableOpacity
                onPress={() => getImage(false)}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}>
                <Icons name="camera-outline" size={25} color={'black'} />
                <Text style={{color: 'black', fontSize: 18, paddingLeft: 20}}>
                  Upload from Camera
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                //onPress={() => onPressDocPreA(6)}
                onPress={() => getImage(true)}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}>
                <Icons name="image-outline" size={25} color={'black'} />
                <Text style={{color: 'black', fontSize: 18, paddingLeft: 20}}>
                  Upload from Gallery
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
      </ScrollView>
    </View>
  );
}

const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  imgName: {color: 'black', fontSize: 12, fontWeight: '600'},
  checkbox: {
    width: 40,
    height: 40,
    backgroundColor: 'red',
  },
  label: {
    fontSize: Dimensions.get('window').width / 25,
    color: 'black',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'green',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },

  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 12,
    marginVertical: 20,
    paddingHorizontal: 20,
    color: 'black',
  },

  item: {
    padding: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  itemText: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    textAlignVertical: 'top',
    color: 'black',
    backgroundColor: 'white',
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginVertical: 10,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  remarks: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    flex: 1,
    color: 'black',
  },
});
