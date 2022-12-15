import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useState, useRef} from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Feedback from '../Feedback';
import Loader from '../Loader';

export default function PreDepartureChecklist({navigation}) {
  const [vFeedback, setvFeedback] = useState(false);
  const currentFeedback = useRef(0);
  const [loading, setloading] = useState(false);

  const [mode, setMode] = useState('time');
  const currentDeparture = useRef(0);
  const [pdeparturecheck, setpdeparturecheck] = useState([
    null,
    null,
    {value: null, file: []},
    null,
    null,
    null,
    null,
    {checked: false, remarks: null},
    {value: null, file: []},
    null,
    null,
    null,
    null,
    null,
    null,
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    null,
    null,
    null,
    null,
  ]);
  const getFeedback = index => {
    setvFeedback(true);
    currentFeedback.current = index;
  };
  const onSubmitFeedback = text => {
    var index = currentFeedback.current;
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index].remarks = text;
    setpdeparturecheck(tpdeparturecheck);
    console.log(tpdeparturecheck);
    setvFeedback(false);
  };
  const removeFeedback = index => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index].remarks = null;
    setpdeparturecheck(tpdeparturecheck);
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
          var tpdeparturecheck = [...pdeparturecheck];
          tpdeparturecheck[index].file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setpdeparturecheck(tpdeparturecheck);
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
  const [isDatePickerVisibleDeparture, setDatePickerVisibilityDeparture] =
    useState(false);
  const showDatePickerDeparture = (type, index) => {
    currentDeparture.current = index;
    setMode(type);
    setDatePickerVisibilityDeparture(true);
  };

  const hideDatePickerDeparture = () => {
    setDatePickerVisibilityDeparture(false);
  };
  const tConvert = datetime => {
    var date = datetime.split(',')[0].split('/');
    var time24 = datetime.split(', ')[1];
    var time = time24.split(':');
    return (
      date[1] + '/' + date[0] + '/' + date[2] + ', ' + time[0] + ':' + time[1]
    );
  };

  const handleConfirmDeparture = date => {
    // console.log("A date has been picked: ",date);
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[currentDeparture.current] = tConvert(
      new Date(date).toLocaleString('en-US', {
        hour12: false,
      }),
    );
    setpdeparturecheck(tpdeparturecheck);
    hideDatePickerDeparture();
  };
  const setNowDeparture = index => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index] = tConvert(
      new Date().toLocaleString('en-US', {
        hour12: false,
      }),
    );
    setpdeparturecheck(tpdeparturecheck);
  };
  const setCheckedDeparture = index => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index].checked = !tpdeparturecheck[index].checked;
    setpdeparturecheck(tpdeparturecheck);
    // console.log('triggered', tcheckList);
  };
  const removeFilePreA = (arrayIndex, index) => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[arrayIndex].file.splice(index, 1);
    setpdeparturecheck(tpdeparturecheck);
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
        <TouchableOpacity
          style={{marginLeft: 10}}
          onPress={() => {
            navigation.openDrawer();
          }}>
          <Icons name="menu" color="green" size={30} />
        </TouchableOpacity>
        <Text style={{fontSize: 24, fontWeight: 'bold', color: 'black'}}>
          Pre-Departure Checklist
        </Text>
        <TouchableOpacity style={{marginRight: 20}}>
          <Icons name="content-save" color="green" size={30} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Feedback
          visible={vFeedback}
          onCloseFeedback={() => setvFeedback(false)}
          onSubmitFeedback={onSubmitFeedback}
        />
        <Loader visible={loading} />

        <View style={{padding: 20, marginBottom: 80}}>
          <Text style={styleSheet.label}>Crew Meeting Location</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={pdeparturecheck[0]}
              onChangeText={text => {
                var tpdeparturecheck = [...pdeparturecheck];
                tpdeparturecheck[0] = text;
                setpdeparturecheck(tpdeparturecheck);
              }}
            />
          </View>
          <Text style={styleSheet.label}>Pax Meeting Location</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={pdeparturecheck[1]}
              onChangeText={text => {
                var tpdeparturecheck = [...pdeparturecheck];
                tpdeparturecheck[1] = text;
                setpdeparturecheck(tpdeparturecheck);
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
            <Text style={styleSheet.label}>Photo of Meeting Location</Text>
            <TouchableOpacity
              onPress={event => onPressDocPreA(2)}
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
          {pdeparturecheck[2].file.length > 0 && (
            <View style={{marginBottom: 20}}>
              {pdeparturecheck[2].file.map((value, index) => {
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
                    <TouchableOpacity onPress={() => removeFilePreA(2, index)}>
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
          <Text style={styleSheet.label}>Crew Pickup Time (Local Time)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDeparture('datetime', 3)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {pdeparturecheck[3] ? pdeparturecheck[3] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Pax Pickup Time (Local Time)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDeparture('datetime', 4)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {pdeparturecheck[4] ? pdeparturecheck[4] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>
            Confirm Catering Delivery Time (Local Time)
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDeparture('datetime', 5)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {pdeparturecheck[5] ? pdeparturecheck[5] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDeparture(5)}
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
          <Text style={styleSheet.label}>Fuelling Time (Local Time)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDeparture('datetime', 6)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {pdeparturecheck[6] ? pdeparturecheck[6] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDeparture(6)}
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
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setCheckedDeparture(7)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[7].checked
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[7].checked ? 'white' : 'black',
                  },
                ]}>
                Prepared Departure GenDec
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(7)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdeparturecheck[7].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[7].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(7)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 20,
            }}>
            <Text style={styleSheet.label}>Upload Departure GenDec</Text>
            <TouchableOpacity
              onPress={event => onPressDocPreA(8)}
              style={{
                marginLeft: 10,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 8,
              }}>
              <Text style={{color: 'green'}}>Add Files</Text>
            </TouchableOpacity>
          </View>
          {pdeparturecheck[8].file.length > 0 && (
            <View style={{marginBottom: 20}}>
              {pdeparturecheck[8].file.map((value, index) => {
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
                    <TouchableOpacity onPress={() => removeFilePreA(8, index)}>
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
          {/*   ------------------------------Flight Documents/Admin ----------- */}
          <Text style={styleSheet.label}>Flight Documents / Admin:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <Text style={styleSheet.label}>
              Flight Documents Received (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDeparture('time', 9)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {pdeparturecheck[9] ? pdeparturecheck[9] : 'dd/mm/yy,--:--'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDeparture(9)}
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
              Flight Documents Printed (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDeparture('time', 10)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {pdeparturecheck[10] ? pdeparturecheck[10] : 'dd/mm/yy,--:--'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDeparture(10)}
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
            <Text style={styleSheet.label}>Notams Updated (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDeparture('time', 11)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {pdeparturecheck[11] ? pdeparturecheck[11] : 'dd/mm/yy,--:--'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDeparture(11)}
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
              Weather Information Updated (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDeparture('time', 12)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {pdeparturecheck[12] ? pdeparturecheck[12] : 'dd/mm/yy,--:--'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDeparture(12)}
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
              ATC Flight Plan Filed (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDeparture('time', 13)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {pdeparturecheck[13] ? pdeparturecheck[13] : 'dd/mm/yy,--:--'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDeparture(13)}
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
            <Text style={styleSheet.label}>Slots Confirmed (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDeparture('time', 14)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {pdeparturecheck[14] ? pdeparturecheck[14] : 'dd/mm/yy,--:--'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDeparture(14)}
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
          {/*   ------------------------------Flight Documents/Admin End ----------- */}

          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setCheckedDeparture(15)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[15].checked
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[15].checked ? 'white' : 'black',
                  },
                ]}>
                FBO Reminder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(15)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdeparturecheck[15].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[15].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(15)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setCheckedDeparture(16)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[16].checked
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[16].checked ? 'white' : 'black',
                  },
                ]}>
                Handling Agent Reminder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(16)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdeparturecheck[16].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[16].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(16)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setCheckedDeparture(17)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[17].checked
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[17].checked ? 'white' : 'black',
                  },
                ]}>
                CIQ Reminder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(17)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdeparturecheck[17].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[17].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(17)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setCheckedDeparture(18)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[18].checked
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[18].checked ? 'white' : 'black',
                  },
                ]}>
                Airport Security Reminder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(18)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdeparturecheck[18].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[18].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(18)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setCheckedDeparture(19)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[19].checked
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[19].checked ? 'white' : 'black',
                  },
                ]}>
                Catering Agent Reminder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(19)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdeparturecheck[19].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[19].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(19)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setCheckedDeparture(20)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[20].checked
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[20].checked ? 'white' : 'black',
                  },
                ]}>
                Aircraft Fueller Reminder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(20)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdeparturecheck[20].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[20].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(20)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}
          {/*   ------------------------------Transport Operator Reminder	 ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>
            Transport Operator Reminder:
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <Text style={styleSheet.label}>Driver Name</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                value={pdeparturecheck[21]}
                onChangeText={text => {
                  var tpdeparturecheck = [...pdeparturecheck];
                  tpdeparturecheck[21] = text;
                  setpdeparturecheck(tpdeparturecheck);
                }}
              />
            </View>
            <Text style={styleSheet.label}>Driver Contact Number</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                value={pdeparturecheck[22]}
                onChangeText={text => {
                  var tpdeparturecheck = [...pdeparturecheck];
                  tpdeparturecheck[22] = text;
                  setpdeparturecheck(tpdeparturecheck);
                }}
              />
            </View>
            {/* <Text style={styleSheet.label}>Fuelling Time (Local Time)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDeparture('time', 21)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {pdeparturecheck[21]
                  ? pdeparturecheck[21]
                  : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDeparture(21)}
              style={{padding: 10}}>
              <Text style={{fontSize: Dimensions.get('window').width / 25, color: 'green'}}>Time Now</Text>
            </TouchableOpacity>
          </View> */}
            <Text style={styleSheet.label}>Remarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                multiline={true}
                numberOfLines={2}
                value={pdeparturecheck[23]}
                onChangeText={text => {
                  var tpdeparturecheck = [...pdeparturecheck];
                  tpdeparturecheck[23] = text;
                  setpdeparturecheck(tpdeparturecheck);
                }}
              />
            </View>
          </View>
          {/*   ------------------------------Transport Operator Reminder	 End ----------- */}
          <Text style={styleSheet.label}>Additional Remarks</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              multiline={true}
              numberOfLines={2}
              value={pdeparturecheck[24]}
              onChangeText={text => {
                var tpdeparturecheck = [...pdeparturecheck];
                tpdeparturecheck[24] = text;
                setpdeparturecheck(tpdeparturecheck);
              }}
            />
          </View>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisibleDeparture}
          mode={mode}
          onConfirm={handleConfirmDeparture}
          onCancel={hideDatePickerDeparture}
          is24Hour={true}
        />
      </ScrollView>
    </View>
  );
}

const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
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
