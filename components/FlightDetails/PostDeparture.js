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
import RNFetchBlob from 'rn-fetch-blob';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as ImagePicker from 'react-native-image-picker';
import Loader from '../Loader';

const {height} = Dimensions.get('window');

export default function PostDeparture({navigation}) {
  const refRBSheet = useRef();
  const [mode, setMode] = useState('time');
  const [loading, setloading] = useState(false);
  
  const [uploadSection,setuploadSection]=useState(0);

  const [postdeparture, setpostdeparture] = useState([
    {value: null, file: []},
    null,
    null,
    null,
  ]);
  const tConvert = datetime => {
    var date = datetime.split(',')[0].split('/');
    var time24 = datetime.split(', ')[1];
    var time = time24.split(':');
    return (
      date[1] + '/' + date[0] + '/' + date[2] + ', ' + time[0] + ':' + time[1]
    );
  };
  const [isDatePickerVisiblePostDepart, setDatePickerVisibilityPostDepart] =
    useState(false);
  const showDatePickerPostDepart = (type, index) => {
    currentPostDepart.current = index;
    setMode(type);
    setDatePickerVisibilityPostDepart(true);
  };

  const hideDatePickerPostDepart = () => {
    setDatePickerVisibilityPostDepart(false);
  };

  const handleConfirmPostDepart = date => {
    // console.log("A date has been picked: ",date);
    var tpostdeparture = [...postdeparture];
    tpostdeparture[currentDepart.current] = tConvert(
      new Date(date).toLocaleString('en-US', {
        hour12: false,
      }),
    );
    setpostdeparture(tpostdeparture);
    hideDatePickerPostDepart();
  };
  const setNowPostDepart = index => {
    var tpostdeparture = [...postdeparture];
    tpostdeparture[index] = tConvert(
      new Date().toLocaleString('en-US', {
        hour12: false,
      }),
    );
    setpostdeparture(tpostdeparture);
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
          var tpostdeparture = [...postdeparture];
          tpostdeparture[index].file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setpostdeparture(tpostdeparture);
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
    var tpostdeparture = [...postdeparture];
    tpostdeparture[arrayIndex].file.splice(index, 1);
    setpostdeparture(tpostdeparture);
  };

  const onPressDocPreA_New = async (index,res) => {
    setloading(false);
    RNFetchBlob.fs
  .readFile(res.uri, 'base64')
  .then(encoded => {
    // console.log(encoded, 'reports.base64');
    setloading(false);
    var tpostdeparture = [...postdeparture];
      tpostdeparture[index].file.push({
      name: res.fileName.replace('rn_image_picker_lib_temp_',''),
      base64: 'data:' + res.type + ';base64,' + encoded,
    });
    setpostdeparture(tpostdeparture);
    
  })
  .catch(error => {
    setloading(false);
    console.log(error);
  });
  refRBSheet.current.close();
}

  const getImage=async (type)=>{
    console.log("HERE")
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
  return (
    <ScrollView>
      <Loader visible={loading} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 20,
        }}>
        <Text style={{fontSize: 24, fontWeight: 'bold', color: 'black',paddingLeft:20}}>
          Post-Departure
        </Text>
        <TouchableOpacity style={{marginRight: 20}}>
          <Icons name="content-save" color="green" size={30} />
        </TouchableOpacity>
      </View>
      <View style={{padding: 20}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 20,
          }}>
          <Text style={styleSheet.label}>Stamped GenDec</Text>
          <TouchableOpacity
            //onPress={event => onPressDocPreA(0)}
            onPress={() => {
              setuploadSection(0)
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
        {postdeparture[0].file.length > 0 && (
          <View style={{marginBottom: 20}}>
            {postdeparture[0].file.map((value, index) => {
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
                  <TouchableOpacity onPress={() => removeFilePreA(0, index)}>
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
        {/*   ------------------------------Services Verified ----------- */}
        <Text style={[styleSheet.label, {marginTop: 10}]}>
          Services Verified:
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Text style={styleSheet.label}>Time Verified (Local Time)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerPostDepart('time', 1)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {postdeparture[1] ? postdeparture[1] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowPostDepart(1)}
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
          <Text style={styleSheet.label}>Name of Verifier</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={postdeparture[2]}
              onChangeText={text => {
                var tpostdeparture = [...postdeparture];
                tpostdeparture[2] = text;
                setpostdeparture(tpostdeparture);
              }}
            />
          </View>
        </View>
        {/*   ------------------------------Services Verified end ----------- */}
        <Text style={styleSheet.label}>Additional Remarks</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={styleSheet.input}
            multiline={true}
            numberOfLines={2}
            value={postdeparture[3]}
            onChangeText={text => {
              var tpostdeparture = [...postdeparture];
              tpostdeparture[3] = text;
              setpostdeparture(tpostdeparture);
            }}
          />
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisiblePostDepart}
        mode={mode}
        onConfirm={handleConfirmPostDepart}
        onCancel={hideDatePickerPostDepart}
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
