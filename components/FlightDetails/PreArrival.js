import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Loader from '../Loader';
import Feedback from '../Feedback';
import * as ImagePicker from 'react-native-image-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
const {height} = Dimensions.get('window');

export default function PreArrival({navigation}) {
  const refRBSheet = useRef();
  //upload funcs
  const [uploadSection,setuploadSection]=useState(0);
  const [uploadAddedSection,setuploadAddedSection]=useState(false);
  const [uploadAddedSectionindex,setuploadAddedSectionindex]=useState(0);

  const [vFeedback, setvFeedback] = useState(false);
  const [loading, setloading] = useState(false);
  const currentFeedback = useRef(0);
  const currentPicker = useRef(0);
  const [mode, setMode] = useState('time');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = (type, index, pos) => {
    currentPicker.current = [index, pos];
    setMode(type);
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = date => {
    // console.log('A date has been picked: ', date);
    var tcheckList = [...checkList];
    tcheckList[currentPicker.current[0]][
      currentPicker.current[1]
    ].transportTime = tConvert(
      new Date(date).toLocaleString('en-US', {
        hour12: false,
      }),
    );
    console.log(
      'A date has been picked: ',
      new Date(date).toLocaleString('en-US', {
        hour12: false,
      }),
    );
    setChecklist(tcheckList);
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
  const setNow = (index, pos) => {
    var tcheckList = [...checkList];

    tcheckList[index][pos].transportTime = tConvert(
      new Date().toLocaleString('en-US', {
        hour12: false,
      }),
    );
    setChecklist(tcheckList);
  };
  const [checkList, setChecklist] = useState([
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, remarks: null},
    {checked: false, file: [], remarks: null},
    {checked: false, remarks: null},
    [{transportTime: null, name: null, number: null, remarks: null}],
    [
      {
        name: null,
        location: null,
        hotelMap: {value: null, file: []},
        time: null,
        remarks: null,
      },
    ],
    [{transportTime: null, name: null, number: null, remarks: null}],
    [
      {
        name: null,
        location: null,
        hotelMap: {value: null, file: []},
        time: null,
        remarks: null,
      },
    ],
    {checked: false, file: [], remarks: null},
  ]);

  const setChecked = index => {
    var tcheckList = [...checkList];
    tcheckList[index].checked = !tcheckList[index].checked;
    setChecklist(tcheckList);
    // console.log('triggered', tcheckList);
  };
  const getFeedback = index => {
    setvFeedback(true);
    currentFeedback.current = index;
    console.log(checkList[currentFeedback.current]);
  };
  const onSubmitFeedback = text => {
    var index = currentFeedback.current;
    var tcheckList = [...checkList];
    tcheckList[index].remarks = text;
    setChecklist(tcheckList);
    console.log(tcheckList);
    setvFeedback(false);
  };
  const removeFeedback = index => {
    var tcheckList = [...checkList];
    tcheckList[index].remarks = null;
    setChecklist(tcheckList);
  };
  const onPressDocPreA = async (index, pos) => {
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
          var tcheckList = [...checkList];
          if (pos != undefined) {
            console.log(tcheckList[index][pos].hotelMap.file);
            tcheckList[index][pos].hotelMap.file.push({
              name: res.name,
              base64: 'data:' + res.type + ';base64,' + encoded,
            });
          } else {
            console.log('pos', pos);
            tcheckList[index].file.push({
              name: res.name,
              base64: 'data:' + res.type + ';base64,' + encoded,
            });
          }
          setChecklist(tcheckList);
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
  const addTransport = () => {
    var tcheckList = [...checkList];
    tcheckList[12] = [
      ...checkList[12],
      {transportTime: null, name: null, number: null, remarks: null},
    ];
    setChecklist(tcheckList);
  };
  const addTransportCrew = () => {
    var tcheckList = [...checkList];
    tcheckList[14] = [
      ...checkList[14],
      {transportTime: null, name: null, number: null, remarks: null},
    ];
    setChecklist(tcheckList);
  };
  const addHotel = () => {
    var tcheckList = [...checkList];
    tcheckList[13] = [
      ...checkList[13],
      {
        name: null,
        location: null,
        hotelMap: {value: null, file: []},
        time: null,
        remarks: null,
      },
    ];
    setChecklist(tcheckList);
  };
  const addHotelCrew = () => {
    var tcheckList = [...checkList];
    tcheckList[15] = [
      ...checkList[15],
      {
        name: null,
        location: null,
        hotelMap: {value: null, file: []},
        time: null,
        remarks: null,
      },
    ];
    setChecklist(tcheckList);
  };
  const onRemoveService = index => {
    var service = [...checkList];
    service[12].splice(index, 1);
    setChecklist(service);
  };
  const onRemoveServiceCrew = index => {
    var service = [...checkList];
    service[14].splice(index, 1);
    setChecklist(service);
  };
  const onRemoveHotel = index => {
    var service = [...checkList];
    service[13].splice(index, 1);
    setChecklist(service);
  };
  const onRemoveHotelCrew = index => {
    var service = [...checkList];
    service[15].splice(index, 1);
    setChecklist(service);
  };
  const removeFilePreA = (arrayIndex, index, pos) => {
    var tcheckList = [...checkList];
    if (pos != undefined) {
      tcheckList[arrayIndex][pos].hotelMap.file.splice(index, 1);
    } else {
      tcheckList[arrayIndex].file.splice(index, 1);
    }
    setChecklist(tcheckList);
  };

  const onPressDocPreA_New = async (index,res,pos) => {
    setloading(false);
    RNFetchBlob.fs
  .readFile(res.uri, 'base64')
  .then(encoded => {
    // console.log(encoded, 'reports.base64');
    setloading(false);
    var tcheckList = [...checkList];
    if (pos != undefined) {
      console.log(tcheckList[index][pos].hotelMap.file);
      tcheckList[index][pos].hotelMap.file.push({
        name: res.fileName.replace('rn_image_picker_lib_temp_',''),
        base64: 'data:' + res.type + ';base64,' + encoded,
      });
    } else {
      console.log('pos', pos);
      tcheckList[index].file.push({
        name: res.fileName.replace('rn_image_picker_lib_temp_',''),
        base64: 'data:' + res.type + ';base64,' + encoded,
      });
    }
    setChecklist(tcheckList);
    refRBSheet.current.close();
    
  })
  .catch(error => {
    setloading(false);
    console.log(error);
  });

}

const getImage=async (type)=>{
console.log("HERE",uploadSection)
var options={mediaType:'image',includeBase64: false,maxHeight: 800,maxWidth: 800};
var pos;
//rn_image_picker_lib_temp_29ef0418-6913-493c-882f-bd4acf3b4210.jpg
//rn_image_picker_lib_temp_ba5ab646-6c3b-4bde-889f-788fc1d07dd8.jpg

if(uploadSection===13 && uploadAddedSection) pos=uploadAddedSectionindex;
else if(uploadSection===13 && uploadAddedSection==false) pos=0;
else if(uploadSection===15 && uploadAddedSection) pos=uploadAddedSectionindex;
else if(uploadSection===15 && uploadAddedSection==false) pos=0;
else pos=undefined;

console.log(options);
switch(type){
case true:
  try {
    options.mediaType='photo';
    const result = await ImagePicker.launchImageLibrary(options);  
    const file=result.assets[0];
    console.log(file);
    onPressDocPreA_New(uploadSection,file,pos)
  } catch (error) {
    console.log(error);
  }
  break;
  case false:
    try {
      const result = await ImagePicker.launchCamera(options);  
      const file=result.assets[0];
      onPressDocPreA_New(uploadSection,file,pos)
    } catch (error) {
      console.log(error);
    }
    break;
    default:
      break;
}

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
            paddingLeft:20
          }}>
          Pre-Arrival Checklist
        </Text>
        <TouchableOpacity style={{marginRight: 20}}>
          <Icons name="content-save" color="green" size={30} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Loader visible={loading} />
        <Feedback
          visible={vFeedback}
          onCloseFeedback={() => setvFeedback(false)}
          onSubmitFeedback={onSubmitFeedback}
          value={
            checkList[currentFeedback.current]
              ? checkList[currentFeedback.current].remarks
              : null
          }
        />

        <View style={{padding: 20, marginBottom: 100}}>
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setChecked(0)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: checkList[0].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: checkList[0].checked ? 'white' : 'black',
                  },
                ]}>
                Crew Entry Requirements
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(0)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {checkList[0].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{checkList[0].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(0)}>
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
              onPress={event => setChecked(1)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: checkList[1].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: checkList[1].checked ? 'white' : 'black',
                  },
                ]}>
                Pax Entry Requirements
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(1)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {checkList[1].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{checkList[1].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(1)}>
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
              onPress={event => setChecked(2)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: checkList[2].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: checkList[2].checked ? 'white' : 'black',
                  },
                ]}>
                Crew Transport Arranged
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(2)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {checkList[2].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{checkList[2].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(2)}>
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
              onPress={event => setChecked(3)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: checkList[3].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: checkList[3].checked ? 'white' : 'black',
                  },
                ]}>
                Pax Transport Arranged
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(3)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {checkList[3].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{checkList[3].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(3)}>
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
              onPress={event => setChecked(4)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: checkList[4].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: checkList[4].checked ? 'white' : 'black',
                  },
                ]}>
                Informed Recieving Party
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(4)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {checkList[4].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{checkList[4].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(4)}>
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
              onPress={event => setChecked(5)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: checkList[5].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: checkList[5].checked ? 'white' : 'black',
                  },
                ]}>
                Informed FBO
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(5)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {checkList[5].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{checkList[5].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(5)}>
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
              onPress={event => setChecked(6)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: checkList[6].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: checkList[6].checked ? 'white' : 'black',
                  },
                ]}>
                Informed Handling Agent
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(6)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {checkList[6].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{checkList[6].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(6)}>
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
              onPress={event => setChecked(7)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: checkList[7].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: checkList[7].checked ? 'white' : 'black',
                  },
                ]}>
                Informed Customs & Immigration
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
          {checkList[7].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{checkList[7].remarks}</Text>
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
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setChecked(8)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: checkList[8].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: checkList[8].checked ? 'white' : 'black',
                  },
                ]}>
                Informed Airport Security
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(8)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {checkList[8].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{checkList[8].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(8)}>
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
              onPress={event => setChecked(9)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: checkList[9].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: checkList[9].checked ? 'white' : 'black',
                  },
                ]}>
                Informed Catering Company
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(9)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {checkList[9].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{checkList[9].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(9)}>
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
            }}>
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setChecked(10)}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: checkList[10].checked ? 'green' : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: checkList[10].checked ? 'white' : 'black',
                    },
                  ]}>
                  Prepared Arrival GenDec
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              //onPress={() => onPressDocPreA(10)}
              onPress={() => {
                setuploadSection(10);
                setuploadAddedSection(false);
                refRBSheet.current.open();
              }}
              style={{
                marginLeft: 10,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 8,
              }}>
              <Text style={{color: 'green'}}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(10)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {checkList[10].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 5}}>
              <View style={styleSheet.remarks}>
                <Text>{checkList[10].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(10)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}
          {checkList[10].file.length > 0 && (
            <View style={{marginBottom: 20}}>
              {checkList[10].file.map((value, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 8,
                      padding: 10,
                      marginTop: 20,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
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
                    <TouchableOpacity onPress={() => removeFilePreA(10, index)}>
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
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setChecked(11)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: checkList[11].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: checkList[11].checked ? 'white' : 'black',
                  },
                ]}>
                In Position to Receive Aircraft
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(11)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {checkList[11].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{checkList[11].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(11)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}
          <Text style={[styleSheet.label, {marginTop: 20}]}>
            Pax Transport:
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <Text style={styleSheet.label}>
              Scheduled Transport Arrival time(Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 12, 0)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {checkList[12][0].transportTime
                    ? checkList[12][0].transportTime
                    : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNow(12, 0)}
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
              Local Receiving Party / Driver Name
            </Text>
            <TextInput
              style={styleSheet.input}
              value={checkList[12][0].name}
              onChangeText={text => {
                var tcheckList = [...checkList];
                tcheckList[12][0].name = text;
                setChecklist(tcheckList);
              }}
            />
            <Text style={styleSheet.label}>
              Local Receiving Party / Driver Contact Number
            </Text>
            <TextInput
              style={styleSheet.input}
              value={checkList[12][0].number}
              onChangeText={text => {
                var tcheckList = [...checkList];
                tcheckList[12][0].number = text;
                setChecklist(tcheckList);
              }}
            />
            <Text style={styleSheet.label}>Remarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                multiline={true}
                placeholder="Vehicle Number, Vehicle Type, Pax Name"
                numberOfLines={2}
                value={checkList[12][0].remarks}
                onChangeText={text => {
                  var tcheckList = [...checkList];
                  tcheckList[12][0].remarks = text;
                  setChecklist(tcheckList);
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={addTransport}
                style={[styleSheet.button]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Transport
                </Text>
              </TouchableOpacity>
            </View>
            {checkList[12].map((val, index) => {
              if (index > 0) {
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
                        onPress={() => onRemoveService(index)}>
                        <Icons name="minus-box-outline" color="red" size={30} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styleSheet.label}>
                      Scheduled Transport Arrival time(Local Time)
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        style={styleSheet.picker}
                        onPress={() => showDatePicker('time', 12, index)}>
                        <Text style={{fontSize: 20, color: 'black'}}>
                          {checkList[12][index].transportTime
                            ? checkList[12][index].transportTime
                            : 'dd/mm/yy, -- : --'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setNow(12, index)}
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
                      Local Receiving Party / Driver Name
                    </Text>
                    <TextInput
                      style={styleSheet.input}
                      value={checkList[12][index].name}
                      onChangeText={text => {
                        var tcheckList = [...checkList];
                        tcheckList[12][index].name = text;
                        setChecklist(tcheckList);
                      }}
                    />
                    <Text style={styleSheet.label}>
                      Local Receiving Party / Driver Contact Number
                    </Text>
                    <TextInput
                      style={styleSheet.input}
                      value={checkList[12][index].number}
                      onChangeText={text => {
                        var tcheckList = [...checkList];
                        tcheckList[12][index].number = text;
                        setChecklist(tcheckList);
                      }}
                    />
                    <Text style={styleSheet.label}>Remarks</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TextInput
                        style={styleSheet.input}
                        multiline={true}
                        placeholder="Vehicle Number, Vehicle Type, Pax Name"
                        numberOfLines={2}
                        value={checkList[12][index].remarks}
                        onChangeText={text => {
                          var tcheckList = [...checkList];
                          tcheckList[12][index].remarks = text;
                          setChecklist(tcheckList);
                        }}
                      />
                    </View>
                  </View>
                );
              }
            })}
          </View>
          <Text style={[styleSheet.label, {marginTop: 20}]}>Pax Hotel:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <Text style={styleSheet.label}>Hotel Name</Text>
            <TextInput
              style={styleSheet.input}
              value={checkList[13][0].name}
              onChangeText={text => {
                var tcheckList = [...checkList];
                tcheckList[13][0].name = text;
                setChecklist(tcheckList);
              }}
            />
            <Text style={styleSheet.label}>Hotel Location</Text>
            <TextInput
              style={styleSheet.input}
              value={checkList[13][0].location}
              onChangeText={text => {
                var tcheckList = [...checkList];
                tcheckList[13][0].location = text;
                setChecklist(tcheckList);
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text style={styleSheet.label}>Map of Route to Hotel</Text>
              <TouchableOpacity
                //onPress={event => onPressDocPreA(13, 0)}
                onPress={() =>{
                  setuploadAddedSection(false)
                  setuploadSection(13)
                  refRBSheet.current.open();
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text style={{color: 'green'}}>Upload</Text>
              </TouchableOpacity>
            </View>
            {checkList[13][0].hotelMap.file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {checkList[13][0].hotelMap.file.map((value, index) => {
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
                        onPress={() => removeFilePreA(13, index, 0)}>
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

            <Text style={styleSheet.label}>Travel Time( Approximate)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 13, 0)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {checkList[13][0].transportTime
                    ? checkList[13][0].transportTime
                    : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNow(13, 0)}
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
                value={checkList[13][0].remarks}
                onChangeText={text => {
                  var tcheckList = [...checkList];
                  tcheckList[13][0].remarks = text;
                  setChecklist(tcheckList);
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={addHotel} style={[styleSheet.button]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Hotel
                </Text>
              </TouchableOpacity>
            </View>
            {checkList[13].map((val, index) => {
              if (index > 0) {
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
                        onPress={() => onRemoveHotel(index)}>
                        <Icons name="minus-box-outline" color="red" size={30} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styleSheet.label}>Hotel Name</Text>
                    <TextInput
                      style={styleSheet.input}
                      value={checkList[13][index].name}
                      onChangeText={text => {
                        var tcheckList = [...checkList];
                        tcheckList[13][index].name = text;
                        setChecklist(tcheckList);
                      }}
                    />
                    <Text style={styleSheet.label}>Hotel Location</Text>
                    <TextInput
                      style={styleSheet.input}
                      value={checkList[13][index].location}
                      onChangeText={text => {
                        var tcheckList = [...checkList];
                        tcheckList[13][index].location = text;
                        setChecklist(tcheckList);
                      }}
                    />

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginVertical: 20,
                      }}>
                      <Text style={styleSheet.label}>
                        Map of Route to Hotel
                      </Text>
                      <TouchableOpacity
                        //onPress={event => onPressDocPreA(13, index)}
                        onPress={() => {
                          
                          setuploadAddedSection(true)
                          setuploadAddedSectionindex(index)
                          setuploadSection(13)
                          ////ok
                          refRBSheet.current.open()
                        }}
                        style={{
                          marginLeft: 10,
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          borderWidth: 1,
                          borderRadius: 8,
                        }}>
                        <Text style={{color: 'green'}}>Upload</Text>
                      </TouchableOpacity>
                    </View>
                    {checkList[13][index].hotelMap.file.length > 0 && (
                      <View style={{marginBottom: 20}}>
                        {checkList[13][index].hotelMap.file.map(
                          (value, index) => {
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

                                  <Text style={styleSheet.imgName}>
                                    {value.name}
                                  </Text>
                                <TouchableOpacity
                                  onPress={() =>
                                    removeFilePreA(13, index, index)
                                  }>
                                  <Icons
                                    style={{color: 'green', marginLeft: 10}}
                                    name="close"
                                    size={30}
                                  />
                                </TouchableOpacity>
                              </View>
                            );
                          },
                        )}
                      </View>
                    )}

                    <Text style={styleSheet.label}>
                      Travel Time( Approximate)
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        style={styleSheet.picker}
                        onPress={() => showDatePicker('time', 13, index)}>
                        <Text style={{fontSize: 20, color: 'black'}}>
                          {checkList[13][index].transportTime
                            ? checkList[13][index].transportTime
                            : 'dd/mm/yy, -- : --'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setNow(13, index)}
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
                        value={checkList[13][index].remarks}
                        onChangeText={text => {
                          var tcheckList = [...checkList];
                          tcheckList[13][index].remarks = text;
                          setChecklist(tcheckList);
                        }}
                      />
                    </View>
                  </View>
                );
              }
            })}
          </View>
          <Text style={[styleSheet.label, {marginTop: 20}]}>
            Crew Transport:
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <Text style={styleSheet.label}>
              Scheduled Transport Arrival time(Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 14, 0)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {checkList[14][0].transportTime
                    ? checkList[14][0].transportTime
                    : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNow(14, 0)}
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
            <Text style={styleSheet.label}>Driver Name</Text>
            <TextInput
              style={styleSheet.input}
              value={checkList[14][0].name}
              onChangeText={text => {
                var tcheckList = [...checkList];
                tcheckList[14][0].name = text;
                setChecklist(tcheckList);
              }}
            />
            <Text style={styleSheet.label}>Driver Contact Number</Text>
            <TextInput
              style={styleSheet.input}
              value={checkList[14][0].number}
              onChangeText={text => {
                var tcheckList = [...checkList];
                tcheckList[14][0].number = text;
                setChecklist(tcheckList);
              }}
            />
            <Text style={styleSheet.label}>Remarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                multiline={true}
                placeholder="Vehicle Number, Vehicle Type, Pax Name"
                numberOfLines={2}
                value={checkList[14][0].remarks}
                onChangeText={text => {
                  var tcheckList = [...checkList];
                  tcheckList[14][0].remarks = text;
                  setChecklist(tcheckList);
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={addTransportCrew}
                style={[styleSheet.button]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Transport
                </Text>
              </TouchableOpacity>
            </View>
            {checkList[14].map((val, index) => {
              if (index > 0) {
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
                        onPress={() => onRemoveServiceCrew(index)}>
                        <Icons name="minus-box-outline" color="red" size={30} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styleSheet.label}>
                      Scheduled Transport Arrival time(Local Time)
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        style={styleSheet.picker}
                        onPress={() => showDatePicker('time', 14, index)}>
                        <Text style={{fontSize: 20, color: 'black'}}>
                          {checkList[14][index].transportTime
                            ? checkList[14][index].transportTime
                            : 'dd/mm/yy, -- : --'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setNow(14, index)}
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
                    <Text style={styleSheet.label}>Driver Name</Text>
                    <TextInput
                      style={styleSheet.input}
                      value={checkList[14][index].name}
                      onChangeText={text => {
                        var tcheckList = [...checkList];
                        tcheckList[14][index].name = text;
                        setChecklist(tcheckList);
                      }}
                    />
                    <Text style={styleSheet.label}>Driver Contact Number</Text>
                    <TextInput
                      style={styleSheet.input}
                      value={checkList[14][index].number}
                      onChangeText={text => {
                        var tcheckList = [...checkList];
                        tcheckList[14][index].number = text;
                        setChecklist(tcheckList);
                      }}
                    />
                    <Text style={styleSheet.label}>Remarks</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TextInput
                        style={styleSheet.input}
                        multiline={true}
                        placeholder="Vehicle Number, Vehicle Type, Pax Name"
                        numberOfLines={2}
                        value={checkList[14][index].remarks}
                        onChangeText={text => {
                          var tcheckList = [...checkList];
                          tcheckList[14][index].remarks = text;
                          setChecklist(tcheckList);
                        }}
                      />
                    </View>
                  </View>
                );
              }
            })}
          </View>
          <Text style={[styleSheet.label, {marginTop: 20}]}>Crew Hotel:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <Text style={styleSheet.label}>Hotel Name</Text>
            <TextInput
              style={styleSheet.input}
              value={checkList[15][0].name}
              onChangeText={text => {
                var tcheckList = [...checkList];
                tcheckList[15][0].name = text;
                setChecklist(tcheckList);
              }}
            />
            <Text style={styleSheet.label}>Hotel Location</Text>
            <TextInput
              style={styleSheet.input}
              value={checkList[15][0].location}
              onChangeText={text => {
                var tcheckList = [...checkList];
                tcheckList[15][0].location = text;
                setChecklist(tcheckList);
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text style={styleSheet.label}>Map of Route to Hotel</Text>
              <TouchableOpacity
                //onPress={event => onPressDocPreA(15, 0)}
                onPress={() =>{ 
                  //okok
                  setuploadSection(15);
                  setuploadAddedSection(false);
                  refRBSheet.current.open()
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text style={{color: 'green'}}>Upload</Text>
              </TouchableOpacity>
            </View>
            {checkList[15][0].hotelMap.file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {checkList[15][0].hotelMap.file.map((value, index) => {
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
                        onPress={() => removeFilePreA(15, index, 0)}>
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

            <Text style={styleSheet.label}>Travel Time( Approximate)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePicker('time', 15, 0)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {checkList[15][0].transportTime
                    ? checkList[15][0].transportTime
                    : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNow(15, 0)}
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
                value={checkList[15][0].remarks}
                onChangeText={text => {
                  var tcheckList = [...checkList];
                  tcheckList[15][0].remarks = text;
                  setChecklist(tcheckList);
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={addHotelCrew}
                style={[styleSheet.button]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Hotel
                </Text>
              </TouchableOpacity>
            </View>
            {checkList[15].map((val, index) => {
              if (index > 0) {
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
                        onPress={() => onRemoveHotelCrew(index)}>
                        <Icons name="minus-box-outline" color="red" size={30} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styleSheet.label}>Hotel Name</Text>
                    <TextInput
                      style={styleSheet.input}
                      value={checkList[15][index].name}
                      onChangeText={text => {
                        var tcheckList = [...checkList];
                        tcheckList[15][index].name = text;
                        setChecklist(tcheckList);
                      }}
                    />
                    <Text style={styleSheet.label}>Hotel Location</Text>
                    <TextInput
                      style={styleSheet.input}
                      value={checkList[15][index].location}
                      onChangeText={text => {
                        var tcheckList = [...checkList];
                        tcheckList[15][index].location = text;
                        setChecklist(tcheckList);
                      }}
                    />

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginVertical: 20,
                      }}>
                      <Text style={styleSheet.label}>
                        Map of Route to Hotel
                      </Text>
                      <TouchableOpacity
                        //onPress={event => onPressDocPreA(15, index)}
                        onPress={() => {
                          //refRBSheet.current.open()
                          setuploadAddedSection(true)
                          setuploadAddedSectionindex(index)
                          setuploadSection(15)
                          ////ok
                          refRBSheet.current.open()
                        }}
                        style={{
                          marginLeft: 10,
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          borderWidth: 1,
                          borderRadius: 8,
                        }}>
                        <Text style={{color: 'green'}}>Upload</Text>
                      </TouchableOpacity>
                    </View>
                    {checkList[15][index].hotelMap.file.length > 0 && (
                      <View style={{marginBottom: 20}}>
                        {checkList[15][index].hotelMap.file.map(
                          (value, index) => {
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
                                  <Text style={styleSheet.imgName}>
                                    {value.name}
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() =>
                                      removeFilePreA(15, index, index)
                                    }>
                                    <Icons
                                      style={{color: 'green', marginLeft: 10}}
                                      name="close"
                                      size={30}
                                    />
                                  </TouchableOpacity>
                              </View>
                            );
                          },
                        )}
                      </View>
                    )}

                    <Text style={styleSheet.label}>
                      Travel Time( Approximate)
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        style={styleSheet.picker}
                        onPress={() => showDatePicker('time', 15, index)}>
                        <Text style={{fontSize: 20, color: 'black'}}>
                          {checkList[15][index].transportTime
                            ? checkList[15][index].transportTime
                            : 'dd/mm/yy, -- : --'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setNow(15, index)}
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
                        value={checkList[15][index].remarks}
                        onChangeText={text => {
                          var tcheckList = [...checkList];
                          tcheckList[15][index].remarks = text;
                          setChecklist(tcheckList);
                        }}
                      />
                    </View>
                  </View>
                );
              }
            })}
          </View>
        </View>
      </ScrollView>
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

  item: {
    padding: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    textAlignVertical: 'top',
    color: 'black',
    backgroundColor: 'white',
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'white',
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
