
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  Switch,
  Dimensions,
  ScrollView,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, {useRef, useState, useEffect} from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import RBSheet from 'react-native-raw-bottom-sheet';
import Loader from '../Loader';
const {height} = Dimensions.get('window');

export default function Departure({navigation}) {
  const currentDepart = useRef(0);
  const refRBSheet = useRef();

  const [uploadSection,setuploadSection]=useState(0);

  const [loading, setloading] = useState(false);
  const [crewTransport, setcrewTransport] = useState([]);
  const [paxTransport, setpaxTransport] = useState([]);

  const [mode, setMode] = useState('time');
  const tConvert = datetime => {
    var date = datetime.split(',')[0].split('/');
    var time24 = datetime.split(', ')[1];
    var time = time24.split(':');
    return (
      date[1] + '/' + date[0] + '/' + date[2] + ', ' + time[0] + ':' + time[1]
    );
  };
  const [departure, setdeparture] = useState([
    null,
    null,
    null,
    {value: null, file: []},
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    null,
    {value: null, file: []},
    {checked: false, remarks: null},
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    {checked: false, remarks: null},
    null,
    {value: null, file: []},
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    null,
    {value: null, file: []},
    null,
    {checked: false, remarks: null},
    null,
    null,
    null,
    null,
    null,
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
    [],
    [
      {
        name: null,
        location: null,
        hotelMap: {value: null, file: []},
        time: null,
        remarks: null,
      },
    ], //55
    [
      {
        name: null,
        location: null,
        hotelMap: {value: null, file: []},
        time: null,
        remarks: null,
      },
    ], //56
  ]);
  const [isDatePickerVisibleDepart, setDatePickerVisibilityDepart] =
    useState(false);
  const showDatePickerDepart = (type, index) => {
    currentDepart.current = [index];
    setMode(type);
    setDatePickerVisibilityDepart(true);
  };
  const showDatePickerTrans = (type, index, field) => {
    currentDepart.current = [index, 'crewTransport', field];
    setMode(type);
    setDatePickerVisibilityDepart(true);
  };
  const showDatePickerPaxTrans = (type, index, field) => {
    currentDepart.current = [index, 'paxTransport', field];
    setMode(type);
    setDatePickerVisibilityDepart(true);
  };

  const hideDatePickerDepart = () => {
    setDatePickerVisibilityDepart(false);
  };

  const handleConfirmDepart = date => {
    console.log('A date has been picked: ', date);

    if (currentDepart.current.length > 1) {
      if (currentDepart.current[1] == 'crewTransport') {
        var tdeparture = [...crewTransport];
        tdeparture[currentDepart.current[0]][currentDepart.current[2]] =
          tConvert(
            new Date(date).toLocaleString('en-US', {
              hour12: false,
            }),
          );
        setcrewTransport(tdeparture);
      } else if (currentDepart.current[1] == 'paxTransport') {
        var tdeparture = [...departure];
        tdeparture[54][currentDepart.current[0]][currentDepart.current[2]] =
          tConvert(
            new Date(date).toLocaleString('en-US', {
              hour12: false,
            }),
          );
        setdeparture(tdeparture);
      }
    } else {
      var tdeparture = [...departure];
      tdeparture[currentDepart.current[0]] = tConvert(
        new Date(date).toLocaleString('en-US', {
          hour12: false,
        }),
      );
      setdeparture(tdeparture);
    }

    hideDatePickerDeparture();
  };
  const setNowDepart = index => {
    var tdeparture = [...departure];
    tdeparture[index] = tConvert(
      new Date().toLocaleString('en-US', {
        hour12: false,
      }),
    );
    setdeparture(tdeparture);
  };
  const setNowTrans = (index, field) => {
    var tdeparture = [...crewTransport];
    tdeparture[index][field] = tConvert(
      new Date().toLocaleString('en-US', {
        hour12: false,
      }),
    );
    console.log(tdeparture);
    setcrewTransport(tdeparture);
  };
  const setNowPaxTrans = (index, field) => {
    var tdeparture = [...departure];
    tdeparture[54][index][field] = tConvert(
      new Date().toLocaleString('en-US', {
        hour12: false,
      }),
    );
    console.log(tdeparture);
    setdeparture(tdeparture);
  };
  const setCheckedDepart = index => {
    var tdeparture = [...departure];
    tdeparture[index].checked = !tdeparture[index].checked;
    setdeparture(tdeparture);
    // console.log('triggered', tcheckList);
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
          var tdeparture = [...departure];
          tdeparture[index].file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setdeparture(tdeparture);
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
  const removeFilePreA = (arrayIndex, index) => {
    var tdeparture = [...departure];
    tdeparture[arrayIndex].file.splice(index, 1);
    setdeparture(tdeparture);
  };
  const onPressDocPreTrans = async index => {
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
          var tdeparture = [...crewTransport];
          tdeparture[index].mapF.file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setcrewTransport(tdeparture);
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
  const removeFilePreTrans = (arrayIndex, index) => {
    var tdeparture = [...crewTransport];
    tdeparture[arrayIndex].mapF.file.splice(index, 1);
    setcrewTransport(tdeparture);
  };
  const addCrewTransport = () => {
    var tcrewTransport = [...crewTransport];
    tcrewTransport = [
      ...crewTransport,
      {
        arrival: null,
        boarded: null,
        mapF: {value: null, file: []},
        travel: null,
        timeCrew: null,
        remarks: null,
      },
    ];
    console.log(tcrewTransport);
    setcrewTransport(tcrewTransport);
  };
  const onRemoveCrewTransport = index => {
    var service = [...crewTransport];
    service.splice(index, 1);
    setcrewTransport(service);
  };

  const onPressDocPrePaxTrans = async index => {
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
          var tdeparture = [...departure];
          tdeparture[54][index].mapF.file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setdeparture(tdeparture);
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

  const [uploadaddedsection,setuploadaddedsection]=useState(false);
  const [addedpaxindex,setaddedpaxindex]=useState(0);

  const onPressDocPreA_New = async (index,res) => {
    console.log('HEREEEE',uploadSection,index);
    setloading(false);
    RNFetchBlob.fs
  .readFile(res.uri, 'base64')
  .then(encoded => {
    // console.log(encoded, 'reports.base64');
    setloading(false);
    if(uploadaddedsection){
      var tdeparture = [...crewTransport];
      tdeparture[index].mapF.file.push({
      name: res.fileName.replace('rn_image_picker_lib_temp_',''),
      base64: 'data:' + res.type + ';base64,' + encoded,
    });
    setcrewTransport(tdeparture);
    }else if(index===55){
      var tdeparture = [...departure];
      tdeparture[55][addedpaxindex].hotelMap.file.push({
        name: res.fileName,
        base64: 'data:' + res.type + ';base64,' + encoded,
      });
      setdeparture(tdeparture);
    }else{
      var tdeparture = [...departure];
      tdeparture[index].file.push({
        name: res.fileName.replace('rn_image_picker_lib_temp_',''),
        base64: 'data:' + res.type + ';base64,' + encoded,
      });
      setdeparture(tdeparture);
    }
    
    
  })
  .catch(error => {
    setloading(false);
    console.log(error);
  });
  refRBSheet.current.close();
}
//mark
const getImage=async (type)=>{
console.log("HERE",uploadSection)
var options={mediaType:'image',includeBase64: false,maxHeight: 800,maxWidth: 800};
console.log(options);
switch(type){
case true:
  try {
    options.mediaType='photo';
    const result = await ImagePicker.launchImageLibrary(options);  
    const file=result.assets[0];
    onPressDocPreA_New(uploadSection,file)
  } catch (error) {
    console.log(error);
  }
  break;
  case false:
    try {
      const result = await ImagePicker.launchCamera(options);  
      const file=result.assets[0];
      onPressDocPreA_New(uploadSection,file)
    } catch (error) {
      console.log(error);
    }
    break;
    default:
      break;
}

}

  const removeFilePrePaxTrans = (arrayIndex, index) => {
    var tdeparture = [...departure];
    tdeparture[arrayIndex].mapF.file.splice(index, 1);
    setdeparture(tdeparture);
  };
  const addpaxTransport = () => {
    var tpaxTransport = [...departure];
    tpaxTransport[54] = [
      ...tpaxTransport[54],
      {
        arrival: null,
        boarded: null,
        mapF: {value: null, file: []},
        travel: null,
        timeCrew: null,
        remarks: null,
      },
    ];
    var x=tpaxTransport[55];
    x.push({
      name: null,
      location: null,
      hotelMap: {value: null, file: []},
      time: null,
      remarks: null,
    });
    setdeparture(x);
    setdeparture(tpaxTransport);
  };
  const onRemovePaxTransport = index => {
    var service = [...departure];
    service[54].splice(index, 1);
    setdeparture(service);
  };

  
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 20,
        }}>
        <Text style={{fontSize: 24, fontWeight: 'bold', color: 'black',paddingLeft:20}}>
          Departure
        </Text>
        <TouchableOpacity style={{marginRight: 20}}>
          <Icons name="content-save" color="green" size={30} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={{padding: 20, marginBottom: 100}}>
          <Text style={styleSheet.label}>Number of Crew</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={departure[0]}
              onChangeText={text => {
                var tdeparture = [...departure];
                tdeparture[0] = text;
                setdeparture(tdeparture);
              }}
            />
          </View>
          {/*   ------------------------------Crew Movement	 ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>
            Crew Movement:
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <Text
              style={[
                styleSheet.label,
                {
                  fontWeight: 'bold',
                  borderBottomWidth: 1,
                  marginBottom: 10,
                  paddingBottom: 10,
                  borderBottomColor: 'rgba(0,0,0,0.7)',
                },
              ]}>
              From Pickup Location to Airport
            </Text>
            <Text style={styleSheet.label}>
              Actual Transport Arrival Time at Pickup Location (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 1)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[1] ? departure[1] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(1)}
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
            <Text style={styleSheet.label}>
              Time Crew Boarded Transport at Pickup Location (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 2)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[2] ? departure[2] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(2)}
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
              <Text style={styleSheet.label}>Map of Route to Airport</Text>
              <TouchableOpacity
                //onPress={event => onPressDocPreA(3)}
                onPress={() => {
                  setuploadaddedsection(false);
                  setuploadSection(3)
                  refRBSheet.current.open()
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text style={{color: 'green'}}>Take Camera</Text>
              </TouchableOpacity>
            </View>
            {departure[3].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {departure[3].file.map((value, index) => {
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
                      <Text style={{color: 'black'}}>{value.name}</Text>
                      <TouchableOpacity
                        onPress={() => removeFilePreA(3, index)}>
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
            <Text style={styleSheet.label}>Travel Time (Approximate)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                value={departure[4]}
                onChangeText={text => {
                  var tdeparture = [...departure];
                  tdeparture[4] = text;
                  setdeparture(tdeparture);
                }}
              />
            </View>
            <Text style={styleSheet.label}>Time Crew Arrived at Terminal</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 5)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[5] ? departure[5] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(5)}
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
                style={[styleSheet.input]}
                multiline={true}
                numberOfLines={2}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={addCrewTransport}
                style={[styleSheet.button]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Transport
                </Text>
              </TouchableOpacity>
            </View>
            {crewTransport.map((val, index) => {
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
                      onPress={onRemoveCrewTransport}>
                      <Icons name="minus-box-outline" color="red" size={30} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styleSheet.label}>
                    Actual Transport Arrival Time at Pickup Location (Local
                    Time)
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={styleSheet.picker}
                      onPress={() =>
                        showDatePickerTrans('time', index, 'arrival')
                      }>
                      <Text style={{fontSize: 20, color: 'black'}}>
                        {val.arrival ? val.arrival : 'dd/mm/yy, -- : --'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setNowTrans(index, 'arrival')}
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
                  <Text style={styleSheet.label}>
                    Time Crew Boarded Transport at Pickup Location (Local Time)
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={styleSheet.picker}
                      onPress={() =>
                        showDatePickerTrans('time', index, 'boarded')
                      }>
                      <Text style={{fontSize: 20, color: 'black'}}>
                        {val.boarded ? val.boarded : 'dd/mm/yy, -- : --'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setNowTrans(index, 'boarded')}
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
                    <Text style={styleSheet.label}>
                      Map of Route to Airport
                    </Text>
                    <TouchableOpacity
                      //onPress={event => onPressDocPreTrans(index)}
                      onPress={() => {
                        setuploadaddedsection(true);
                        setuploadSection(index)
                        refRBSheet.current.open()
                      }}
                      style={{
                        marginLeft: 10,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderRadius: 8,
                      }}>
                      <Text style={{color: 'green'}}>Take Camera</Text>
                    </TouchableOpacity>
                  </View>
                  {val.mapF && val.mapF.file.length > 0 && (
                    <View style={{marginBottom: 20}}>
                      {val.mapF &&
                        val.mapF.file.map((value, pos) => {
                          return (
                            <View
                              key={pos}
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
                              <Text style={{color: 'black'}}>{value.name}</Text>
                              <TouchableOpacity
                                onPress={() => removeFilePreTrans(index, pos)}>
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
                  <Text style={styleSheet.label}>
                    Travel Time (Approximate)
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput
                      style={styleSheet.input}
                      value={val.travel}
                      onChangeText={text => {
                        var tdeparture = [...crewTransport];
                        tdeparture[index].travel = text;
                        setcrewTransport(tdeparture);
                      }}
                    />
                  </View>
                  <Text style={styleSheet.label}>
                    Time Crew Arrived at Terminal
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={styleSheet.picker}
                      onPress={() =>
                        showDatePickerTrans('time', index, 'timeCrew')
                      }>
                      <Text style={{fontSize: 20, color: 'black'}}>
                        {val.timeCrew ? val.timeCrew : 'dd/mm/yy, -- : --'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setNowTrans(index, 'timeCrew')}
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
                      style={[styleSheet.input]}
                      multiline={true}
                      numberOfLines={2}
                    />
                  </View>
                </View>
              );
            })}
            <Text
              style={[
                styleSheet.label,
                {
                  fontWeight: 'bold',
                  borderBottomWidth: 1,
                  marginTop: 20,
                  marginBottom: 10,
                  paddingBottom: 10,
                  borderBottomColor: 'rgba(0,0,0,0.7)',
                },
              ]}>
              At Airport
            </Text>
            <Text style={[styleSheet.label]}>
              Flight Documents Handover to Crew
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 6)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[6] ? departure[6] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(6)}
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
            <Text style={styleSheet.label}>Time Crew Cleared CIQ</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 7)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[7] ? departure[7] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(7)}
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
            <Text style={styleSheet.label}>
              Time Crew Cleared Airport Security
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 8)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[8] ? departure[8] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(8)}
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
            <Text style={styleSheet.label}>
              Time Crew Boarded Transport to Aircraft
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 9)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[9] ? departure[9] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(9)}
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
            <Text style={styleSheet.label}>Time Crew Boarded Aircraft</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 10)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[10] ? departure[10] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(10)}
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
          </View>
          {/*   ------------------------------Crew Movement	 End ----------- */}

          {/*   ------------------------------Ground Power Unit(GPU) start ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>
            Ground Power Unit(GPU):
          </Text>
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
              <TouchableOpacity onPress={event => setCheckedDepart(13)}>
                <Icons
                  name={
                    departure[13].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={departure[13].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Start Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[13].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[13].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 11)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[11] ? departure[11] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[13].checked}
                onPress={() => setNowDepart(11)}
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
            <Text style={styleSheet.label}>Stop Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[13].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[13].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 12)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[12] ? departure[12] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[13].checked}
                onPress={() => setNowDepart(12)}
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
          </View>
          {/*   ------------------------------Ground Power Unit(GPU) end ----------- */}

          {/*   ------------------------------Fuel on Departure start ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>
            Fuel on Departure:
          </Text>
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
              <TouchableOpacity onPress={event => setCheckedDepart(18)}>
                <Icons
                  name={
                    departure[18].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={departure[18].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>
              Time Fuel Truck Arrived (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[18].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[18].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 14)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[14] ? departure[14] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[18].checked}
                onPress={() => setNowDepart(14)}
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
                disabled={departure[18].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[18].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 15)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[15] ? departure[15] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[18].checked}
                onPress={() => setNowDepart(15)}
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
            <Text style={styleSheet.label}>Stop Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[18].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[18].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 16)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[16] ? departure[16] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[18].checked}
                onPress={() => setNowDepart(16)}
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
                //onPress={event => onPressDocPreA(17)}
                onPress={() => {
                  setuploadaddedsection(false);
                  setuploadSection(17)
                  refRBSheet.current.open()
                }}
                disabled={departure[18].checked}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: departure[18].checked
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{color: 'green'}}>Take Camera</Text>
              </TouchableOpacity>
            </View>
            {departure[17].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {departure[17].file.map((value, index) => {
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
                      <Text style={{color: 'black'}}>{value.name}</Text>
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
          </View>
          {/*   ------------------------------Fuel on Departure end ----------- */}

          {/*   ------------------------------Water Service ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>
            Water Service:
          </Text>
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
              <TouchableOpacity onPress={event => setCheckedDepart(21)}>
                <Icons
                  name={
                    departure[21].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={departure[21].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Completion Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[21].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[21].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 19)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[19] ? departure[19] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[21].checked}
                onPress={() => setNowDepart(19)}
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
                editable={!departure[21].checked}
                style={[
                  styleSheet.input,
                  {
                    backgroundColor: departure[21].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                multiline={true}
                numberOfLines={2}
                value={departure[20]}
                onChangeText={text => {
                  var tdeparture = [...departure];
                  tdeparture[20] = text;
                  setdeparture(tdeparture);
                }}
              />
            </View>
          </View>
          {/*   ------------------------------Water Service end ----------- */}

          {/*   ------------------------------Lavatory Service ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>
            Lavatory Service:
          </Text>
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
              <TouchableOpacity onPress={event => setCheckedDepart(24)}>
                <Icons
                  name={
                    departure[24].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={departure[24].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Completion Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[24].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[24].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 22)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[22] ? departure[22] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[24].checked}
                onPress={() => setNowDepart(22)}
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
                editable={!departure[24].checked}
                style={[
                  styleSheet.input,
                  {
                    backgroundColor: departure[24].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                multiline={true}
                numberOfLines={2}
                value={departure[23]}
                onChangeText={text => {
                  var tdeparture = [...departure];
                  tdeparture[23] = text;
                  setdeparture(tdeparture);
                }}
              />
            </View>
          </View>
          {/*   ------------------------------Lavatory Service end ----------- */}

          {/*   ------------------------------Rubbish Service ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>
            Rubbish Service:
          </Text>
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
              <TouchableOpacity onPress={event => setCheckedDepart(27)}>
                <Icons
                  name={
                    departure[27].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={departure[27].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Completion Time</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[27].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[27].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 25)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[25] ? departure[25] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[27].checked}
                onPress={() => setNowDepart(25)}
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
                editable={!departure[27].checked}
                style={[
                  styleSheet.input,
                  {
                    backgroundColor: departure[27].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                multiline={true}
                numberOfLines={2}
                value={departure[26]}
                onChangeText={text => {
                  var tdeparture = [...departure];
                  tdeparture[26] = text;
                  setdeparture(tdeparture);
                }}
              />
            </View>
          </View>
          {/*   ------------------------------Rubbish Service end ----------- */}

          {/*   ------------------------------Catering ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>Catering:</Text>
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
              <TouchableOpacity onPress={event => setCheckedDepart(32)}>
                <Icons
                  name={
                    departure[32].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={departure[32].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Catering Equipment Loaded</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                editable={!departure[32].checked}
                style={[
                  styleSheet.input,
                  {
                    backgroundColor: departure[32].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                value={departure[28]}
                onChangeText={text => {
                  var tdeparture = [...departure];
                  tdeparture[28] = text;
                  setdeparture(tdeparture);
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text style={styleSheet.label}>
                Catering Equipment List / Photo
              </Text>
              <TouchableOpacity
                disabled={departure[32].checked}
                //onPress={event => onPressDocPreA(29)}
                onPress={() => {
                  setuploadaddedsection(false);
                  setuploadSection(29)
                  refRBSheet.current.open()
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: departure[32].checked
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{color: 'green'}}>Take Camera</Text>
              </TouchableOpacity>
            </View>
            {departure[29].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {departure[29].file.map((value, index) => {
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
                      <Text style={{color: 'black'}}>{value.name}</Text>
                      <TouchableOpacity
                        onPress={() => removeFilePreA(29, index)}>
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
            <Text style={styleSheet.label}>
              Catering Delivery Time (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[32].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[32].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 30)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[30] ? departure[30] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[32].checked}
                onPress={() => setNowDepart(30)}
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
                editable={!departure[32].checked}
                style={[
                  styleSheet.input,
                  {
                    backgroundColor: departure[32].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                multiline={true}
                numberOfLines={2}
                value={departure[31]}
                onChangeText={text => {
                  var tdeparture = [...departure];
                  tdeparture[31] = text;
                  setdeparture(tdeparture);
                }}
              />
            </View>
          </View>
          {/*   ------------------------------Catering end ----------- */}

          <Text style={styleSheet.label}>
            Aircraft Ready For Boarding (Local Time)
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDepart('time', 33)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {departure[33] ? departure[33] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDepart(33)}
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
          <Text style={styleSheet.label}>Number of Pax</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={departure[34]}
              onChangeText={text => {
                var tdeparture = [...departure];
                tdeparture[34] = text;
                setdeparture(tdeparture);
              }}
            />
          </View>
          {/*   ------------------------------Baggage ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>Baggage:</Text>
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
                value={departure[35]}
                onChangeText={text => {
                  var tdeparture = [...departure];
                  tdeparture[35] = text;
                  setdeparture(tdeparture);
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text style={styleSheet.label}>Baggage Photo</Text>
              <TouchableOpacity
                //onPress={event => onPressDocPreA(36)}
                onPress={() => {
                  setuploadaddedsection(false);
                  setuploadSection(36)
                  refRBSheet.current.open()
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text style={{color: 'green'}}>Take Camera</Text>
              </TouchableOpacity>
            </View>
            {departure[36].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {departure[36].file.map((value, index) => {
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
                      <Text style={{color: 'black'}}>{value.name}</Text>
                      <TouchableOpacity
                        onPress={() => removeFilePreA(36, index)}>
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
          {/*   ------------------------------Baggage end ----------- */}

          {/*   ------------------------------Pax Movement ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>Pax Movement:</Text>
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
              <TouchableOpacity onPress={event => setCheckedDepart(38)}>
                <Icons
                  name={
                    departure[38].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={departure[38].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text
              style={[
                styleSheet.label,
                {
                  fontWeight: 'bold',
                  borderBottomWidth: 1,
                  marginBottom: 10,
                  paddingBottom: 10,
                  borderBottomColor: 'rgba(0,0,0,0.7)',
                },
              ]}>
              From Pickup Location to Airport
            </Text>
            <Text style={styleSheet.label}>
              Actual Transport Arrival Time at Pickup Location (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[38].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[38].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 37)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[37] ? departure[37] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[38].checked}
                onPress={() => setNowDepart(37)}
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

            <Text style={styleSheet.label}>
              Time Crew Boarded Transport at Pickup Location (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[38].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[38].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 39)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[39] ? departure[39] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[38].checked}
                onPress={() => setNowDepart(39)}
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
              <Text style={styleSheet.label}>Map of Route to Airport</Text>
              <TouchableOpacity
                //onPress={event => onPressDocPreA(50)}
                onPress={() =>{
                  setuploadSection(50)
                   refRBSheet.current.open()
                  }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text style={{color: 'green'}}>Take Camera</Text>
              </TouchableOpacity>
            </View>
            {departure[50].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {departure[50].file.map((value, index) => {
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
                      <Text style={{color: 'black'}}>{value.name}</Text>
                      <TouchableOpacity
                        onPress={() => removeFilePreA(50, index)}>
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
            <Text style={styleSheet.label}>Travel Time (Approximate)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                value={departure[51]}
                onChangeText={text => {
                  var tdeparture = [...departure];
                  tdeparture[51] = text;
                  setdeparture(tdeparture);
                }}
              />
            </View>
            <Text style={styleSheet.label}>Time Crew Arrived at Terminal</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 52)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[52] ? departure[52] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(52)}
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
                style={[styleSheet.input]}
                multiline={true}
                numberOfLines={2}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={addpaxTransport}
                style={[styleSheet.button]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Transport
                </Text>
              </TouchableOpacity>
            </View>
            {departure[54].map((val, index) => {
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
                      onPress={onRemovePaxTransport}>
                      <Icons name="minus-box-outline" color="red" size={30} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styleSheet.label}>
                    Actual Transport Arrival Time at Pickup Location (Local
                    Time)
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={styleSheet.picker}
                      onPress={() =>
                        showDatePickerPaxTrans('time', index, 'arrival')
                      }>
                      <Text style={{fontSize: 20, color: 'black'}}>
                        {val.arrival ? val.arrival : 'dd/mm/yy, -- : --'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setNowPaxTrans(index, 'arrival')}
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
                  <Text style={styleSheet.label}>
                    Time Crew Boarded Transport at Pickup Location (Local Time)
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={styleSheet.picker}
                      onPress={() =>
                        showDatePickerPaxTrans('time', index, 'boarded')
                      }>
                      <Text style={{fontSize: 20, color: 'black'}}>
                        {val.boarded ? val.boarded : 'dd/mm/yy, -- : --'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setNowPaxTrans(index, 'boarded')}
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
                    <Text style={styleSheet.label}>
                      Map of Route to Airport
                    </Text>
                    <TouchableOpacity
                      //onPress={event => onPressDocPrePaxTrans(index)}
                      onPress={() => {
                        //mark
                        setuploadaddedsection(false);
                        setaddedpaxindex(index);
                        setuploadSection(55)
                        refRBSheet.current.open()
                      }}
                      style={{
                        marginLeft: 10,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderRadius: 8,
                      }}>
                      <Text style={{color: 'green'}}>Take Camera</Text>
                    </TouchableOpacity>
                  </View>
                  {departure[55][index].hotelMap.file.length>0 && (
                    <View style={{marginBottom: 20}}>
                      { departure[55][index].hotelMap.file.map((value, pos) => {
                          return (
                            <View
                              key={pos}
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
                              <Text style={{color: 'black'}}>{value.name}</Text>
                              <TouchableOpacity
                                onPress={() =>
                                  removeFilePrePaxTrans(index, pos)
                                }>
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
                  <Text style={styleSheet.label}>
                    Travel Time (Approximate)
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput
                      style={styleSheet.input}
                      value={val.travel}
                      onChangeText={text => {
                        var tdeparture = [...departure];
                        tdeparture[54][index].travel = text;
                        setcrewTransport(tdeparture);
                      }}
                    />
                  </View>
                  <Text style={styleSheet.label}>
                    Time Crew Arrived at Terminal
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={styleSheet.picker}
                      onPress={() =>
                        showDatePickerPaxTrans('time', index, 'timeCrew')
                      }>
                      <Text style={{fontSize: 20, color: 'black'}}>
                        {val.timeCrew ? val.timeCrew : 'dd/mm/yy, -- : --'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setNowPaxTrans(index, 'timeCrew')}
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
                      style={[styleSheet.input]}
                      multiline={true}
                      numberOfLines={2}
                    />
                  </View>
                </View>
              );
            })}

            <Text
              style={[
                styleSheet.label,
                {
                  fontWeight: 'bold',
                  borderBottomWidth: 1,
                  marginTop: 20,
                  marginBottom: 10,
                  paddingBottom: 10,
                  borderBottomColor: 'rgba(0,0,0,0.7)',
                },
              ]}>
              At Airport
            </Text>
            <Text style={styleSheet.label}>
              Crew Informed of Pax Arrival and Details (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[38].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[38].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 40)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[40] ? departure[40] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[38].checked}
                onPress={() => setNowDepart(40)}
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
            <Text style={styleSheet.label}>
              VAT/GST Refund Completed (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[38].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[38].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 41)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[41] ? departure[41] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[38].checked}
                onPress={() => setNowDepart(41)}
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
            <Text style={styleSheet.label}>
              Time Pax Cleared CIQ (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[38].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[38].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 42)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[42] ? departure[42] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[38].checked}
                onPress={() => setNowDepart(42)}
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
            <Text style={styleSheet.label}>
              Time Pax Cleared Airport Security (Local Time) (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[38].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[38].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 43)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[43] ? departure[43] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[38].checked}
                onPress={() => setNowDepart(43)}
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
            <Text style={styleSheet.label}>
              Time Pax Boarded Transport to Aircraft (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[38].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[38].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 44)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[44] ? departure[44] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[38].checked}
                onPress={() => setNowDepart(44)}
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
            <Text style={styleSheet.label}>
              Time Pax Boarded Aircraft (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[38].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[38].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 45)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[45] ? departure[45] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[38].checked}
                onPress={() => setNowDepart(45)}
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
          </View>
          {/*   ------------------------------Pax Movement end ----------- */}

          <Text style={styleSheet.label}>Door Close Time (Local Time)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDepart('time', 46)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {departure[46] ? departure[46] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDepart(46)}
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
          <Text style={styleSheet.label}>
            Movement (Chocks Off) (Local Time)
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDepart('time', 47)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {departure[47] ? departure[47] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDepart(47)}
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
          <Text style={styleSheet.label}>
            Movement (Push Back) (Local Time)
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDepart('time', 48)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {departure[48] ? departure[48] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDepart(48)}
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
          <Text style={styleSheet.label}>Movement (Take Off) (Local Time)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDepart('time', 49)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {departure[49] ? departure[49] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDepart(49)}
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
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisibleDepart}
          mode={mode}
          onConfirm={handleConfirmDepart}
          onCancel={hideDatePickerDepart}
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
                onPress={()=>getImage(false)}
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
                onPress={()=>getImage(true)}
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
  imgName:{color: 'black',fontSize:12,fontWeight:'600'},
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
