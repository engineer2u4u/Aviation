import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Image
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, { useRef, useState, useEffect } from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as ImagePicker from 'react-native-image-picker';
import Loader from '../Loader';
import Header from '../subcomponents/Forms/Header';
import TakeCamera from '../subcomponents/Forms/takecamera';
import DateTimeInput from '../subcomponents/Forms/universal/datetimeinput';
import LabelledInput from '../subcomponents/Forms/universal/labelledinput';
import { firebase } from '@react-native-firebase/functions';
import auth from '@react-native-firebase/auth';
import { SERVER_URL, getDomain } from '../constants/env';

const { width, height } = Dimensions.get('window');
const HeadingTextSize = width / 15;

export default function PostDeparture(props) {
  const FUID = props.route.params.UID;
  const refRBSheet = useRef();
  const [mode, setMode] = useState('time');
  const [loading, setloading] = useState(false);
  const [uid, setuid] = useState(null);
  const timerDate = useRef(new Date());
  const [imageVisible, setimageVisible] = useState(false);
  const [showImage, setshowImage] = useState(null);
  const [uploadSection, setuploadSection] = useState(0);

  const [postdeparture, setpostdeparture] = useState([
    [],
    null,
    null,
    null,
  ]);
  const tConvert = datetime => {
    var date = datetime.split(',')[0].split('/');
    var time24 = datetime.split(', ')[1];
    var time = time24.split(':');
    return (
      time[0] + ':' + time[1]
    );
  };
  const [isDatePickerVisiblePostDepart, setDatePickerVisibilityPostDepart] =
    useState(false);
  const showDatePickerPostDepart = (type, index) => {
    setMode(type);
    setDatePickerVisibilityPostDepart(true);
  };

  const hideDatePickerPostDepart = () => {
    setDatePickerVisibilityPostDepart(false);
  };

  const handleConfirmPostDepart = date => {
    // console.log("A date has been picked: ",date);
    var tpostdeparture = [...postdeparture];
    tpostdeparture[1] = tConvert(
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

  const removeFilePreA = (index) => {
    var tpostdeparture = [...postdeparture];
    tpostdeparture[0].splice(index, 1);
    setpostdeparture(tpostdeparture);
  };

  const onPressDocPreA_New = async (res) => {
    setloading(false);
    RNFetchBlob.fs
      .readFile(res.uri, 'base64')
      .then(encoded => {
        // console.log(encoded, 'reports.base64');
        setloading(false);
        var tpostdeparture = [...postdeparture];
        tpostdeparture[0].push('data:' + res.type + ';base64,' + encoded);
        setpostdeparture(tpostdeparture);
      })
      .catch(error => {
        setloading(false);
        console.log(error);
      });
    refRBSheet.current.close();
  };

  const getImage = async type => {
    console.log('HERE');
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
          const file = result.assets[0];
          onPressDocPreA_New(file);
        } catch (error) {
          console.log(error);
        }
        break;
      case false:
        try {
          const result = await ImagePicker.launchCamera(options);
          const file = result.assets[0];
          onPressDocPreA_New(file);
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    }
  };

  const [formReady, setformReady] = useState(true);
  const [callLoad, setcallLoad] = useState(false);
  const uploadInitiator = type => {
    setuploadSection(type);
    refRBSheet.current.open();
  };

  const setText = (index, text) => {
    var tpostdeparture = [...postdeparture];
    tpostdeparture[index] = text;
    setpostdeparture([...tpostdeparture]);
  };

  const sendForm = () => {
    setcallLoad(true);
    var domain = getDomain();
    const email = auth().currentUser.email;
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append("Content-Type", "application/json");
    console.log(
      {
        POD_SGD_String: [],
        POD_SEV_TIME: postdeparture[1],
        POD_SEV_NAME: postdeparture[2],
        POD_REM: postdeparture[3],
        UID: uid ? uid : '',
        STATUS: 0,
        FUID: FUID,
        UPDATE_BY: email,
      },
      'ressss',
    );
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        POD_SGD_String: postdeparture[0],
        POD_SEV_TIME: postdeparture[1],
        POD_SEV_NAME: postdeparture[2],
        POD_REM: postdeparture[3],
        UID: uid ? uid : '',
        STATUS: 0,
        FUID: FUID,
        UPDATE_BY: email,
      })
    };
    fetch(
      `${domain}/PostPostDepartureChecklist`,
      requestOptions,
    )
      .then(response => response.text())
      .then(response => {
        Alert.alert('Success');
        readData()
        setcallLoad(false);
        console.log(response);
      })
      .catch(error => {
        Alert.alert('Error in updation');
        setcallLoad(false);
        console.log(error, 'Function error');
      });
  };

  useEffect(() => {
    readData();
  }, []);

  const readData = () => {
    setcallLoad(true);
    var domain = getDomain();
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };
    fetch(
      `${domain}/GetPostDepartureChecklist?_token=59E0D05E-2F33-458E-9769-3884C3ACB9B6&_opco=&_fuid=${FUID}&_uid=`,
      requestOptions,
    )
      .then(response => response.text())
      .then(response => {
        var packet = JSON.parse(response);
        var res = [...packet.Table];
        console.log(res, 'res');
        if (res.length > 0) {
          console.log(res[0]);
          setuid(res[0].UID);
          let x = [...postdeparture];
          x[1] = res[0].POD_SEV_TIME;
          x[2] = res[0].POD_SEV_NAME.trim().replace('""', '');
          x[3] = res[0].POD_REM.trim().replace('""', '');
          setpostdeparture([...x]);
          fetch(
            `${domain}/GetDepartureChecklistFiles?_token=CDAC498B-116F-4346-AD72-C3F65A902FFD&_opco=&_fuid=${FUID}&_uid=${res[0].UID}`,
            requestOptions,
          )
            .then(response => response.text())
            .then(result => {
              setcallLoad(false);
              try {
                var packet = JSON.parse(result);
                console.log('Files', packet);
                // var temp = [...x];
                x[0] = packet.POD_SGD_String;
                setpostdeparture([...x])
              }
              catch (e) {
                setcallLoad(false);
                console.log(e, 'Function error');
              }
            })
            .catch(error => {
              setcallLoad(false);
              console.log(error, 'Function error');
            });
        }
        else {
          setcallLoad(false);
        }

      })
      .catch(error => {
        setcallLoad(false);
        console.log(error, 'Function error');
        // setpostdeparture([...x]);
      });
  }
  const saveFile = (val, fileName) => {
    const DownloadDir =
      Platform.OS == 'ios'
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DownloadDir + '/Aviation';
    const headers = {
      'data:image/png;base64': '.png',
      'data:image/jpeg;base64': '.jpg',
      'data:application/pdf;base64': '.pdf',
      'data:application/msword;base64': '.doc',
      'data:application/octet-stream;base64': '.docx',
      'data:application/vnd.ms-excel;base64': '.xls',
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64': '.xlsx',
      'data:application/vnd.ms-powerpoint;base64': '.ppt',
      'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64': '.pptx',
      'data:application/zip;base64': '.zip',
      // Add more checks for other file types as needed
    };
    var type = headers[val.split(",")[0]];
    var bs64 = val.split(",")[1];
    var pdfLocation = DownloadDir + '/' + fileName + type;
    // console.log(pdfLocation);
    // console.log(val)
    RNFetchBlob.fs
      .isDir(DownloadDir)
      .then(isDir => {
        if (isDir) {
          console.log('iSDir');
          RNFetchBlob.fs
            .writeFile(pdfLocation, bs64, 'base64')
            .then(res => {
              // console.log('saved', res);
              Alert.alert('Saved', 'Document has been saved in Downloads/Aviation folder', [
                {
                  text: 'View', onPress: () => {
                    // console.log(pdfLocation, val.split(',')[0].split(';')[0].split(':')[1])
                    RNFetchBlob.android.actionViewIntent(pdfLocation, val.split(',')[0].split(';')[0].split(':')[1]);
                  }
                },
                { text: 'OK' },
              ])
            })
            .catch(err => {
              console.log(err)
              Alert.alert('Error in saving file')
            });
        } else {
          RNFetchBlob.fs
            .mkdir(DownloadDir)
            .then(() => {
              console.log('Created Folder');
              RNFetchBlob.fs
                .writeFile(pdfLocation, bs64, 'base64')
                .then(res => {
                  console.log('saved');
                  Alert.alert('Saved', 'Document has been saved in Downloads/Aviation folder', [
                    {
                      text: 'View', onPress: () => {
                        // console.log(pdfLocation, val.split(',')[0].split(';')[0].split(':')[1])
                        RNFetchBlob.android.actionViewIntent(pdfLocation, val.split(',')[0].split(';')[0].split(':')[1]);
                      }
                    },
                    { text: 'OK' },
                  ])
                })
                .catch(err => {
                  Alert.alert('Error in saving file')
                });
            })
            .catch(err => {
              console.log('is Not dir', err);
              Alert.alert('Error in saving file')
            });
        }
      })
      .catch(err => {
        Alert.alert('Error in saving file')
      });
  }
  return (
    <ScrollView>
      <Loader visible={loading} />
      <Header
        headingSize={HeadingTextSize}
        heading={'Post-Departure'}
        sendForm={sendForm}
        nav={"IntialScreenView"}
        navigation={props.navigation}
        Icon={
          callLoad ? (
            <ActivityIndicator color="green" size="small" />
          ) : (
            <Icons
              name="content-save"
              color={formReady ? 'green' : '#aeaeae'}
              size={30}
            />
          )
        }
      />
      <View style={{ padding: 20 }}>
        {/* <TakeCamera
          label={'Stamped GenDec'}
          type={0}
          uploadInitiator={uploadInitiator}
          removeFilePreA={(a, b, c) => {
            console.log(a, b, c);
            if (postdeparture[0].file.length === 1) postdeparture[0].file = [];
            else postdeparture[0].file.splice(b, 1);
            //removeFilePreA
          }}
          attachments={postdeparture[0]}
          Icon={
            <Icons
              style={{ color: 'green', marginLeft: 10 }}
              name="close"
              size={30}
            />
          }
        /> */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={styleSheet.label}>
            Stamped GenDec
          </Text>
          <TouchableOpacity
            //onPress={event => onPressDocPreA(16)}
            onPress={() => {
              refRBSheet.current.open();
            }}

            style={{
              marginLeft: 10,
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderRadius: 8,
              backgroundColor: 'white',
            }}>
            <Text style={{ color: 'green' }}>Upload</Text>
          </TouchableOpacity>
        </View>
        {postdeparture[0] && postdeparture[0].map((val, indexxx) => {
          return (<TouchableOpacity onPress={() => {
            if (val.split(",")[0].startsWith('data:image')) {
              setimageVisible(true);
              setshowImage(val);
            }
            else {
              saveFile(val, `Stamped_GENDEC_DOCUMENTS` + indexxx)
            }
          }}
            key={indexxx}
            style={{
              backgroundColor: 'white',
              borderRadius: 8,
              padding: 10,
              marginVertical: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                },
                android: {
                  elevation: 3,
                },
              }),
            }}>
            <Text style={{ color: 'black' }}>{`Stamped_GENDEC_DOCUMENTS` + indexxx}</Text>
            <TouchableOpacity onPress={() => removeFilePreA(indexxx)}>
              <Icons
                style={{ color: 'green', marginLeft: 10 }}
                name="close"
                size={30}
              />
            </TouchableOpacity>
          </TouchableOpacity>)
        })}

        <Text style={[styleSheet.label, { marginTop: 10 }]}>
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
          <DateTimeInput
            label={'Time Verified (Local Time)'}
            showDatePickerPostDepart={showDatePickerPostDepart}
            setNowPostDepart={setNowPostDepart}
            data={postdeparture[1]}
            size={width / 25}
            index={1}
            type={'time'}
          />
          <LabelledInput
            label={'Name of Verifier'}
            data={postdeparture[2]}
            index={2}
            setText={(index, text) => {
              var temp = [...postdeparture];
              temp[2] = text;
              setpostdeparture([...temp])
            }}
            multiline={false}
            numberOfLines={1}
          />
          <LabelledInput
            label={'Remarks'}
            data={postdeparture[3]}
            index={3}
            setText={(index, text) => {
              var temp = [...postdeparture];
              temp[3] = text;
              setpostdeparture([...temp])
            }}
            multiline={true}
            numberOfLines={2}
          />
        </View>
        {/*   ------------------------------Services Verified end ----------- */}

      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisiblePostDepart}
        mode={mode}
        onConfirm={handleConfirmPostDepart}
        onCancel={hideDatePickerPostDepart}
        is24Hour={true}
        date={timerDate.current}
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
        <View style={{ flex: 1, paddingLeft: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'black', fontSize: 22 }}>Upload Image</Text>
          </View>
          <View style={{ flex: 1.5, flexDirection: 'column' }}>
            <TouchableOpacity
              onPress={() => getImage(false)}
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}>
              <Icons name="camera-outline" size={25} color={'black'} />
              <Text style={{ color: 'black', fontSize: 18, paddingLeft: 20 }}>
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
              <Text style={{ color: 'black', fontSize: 18, paddingLeft: 20 }}>
                Upload from Gallery
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
      <Modal transparent={false} visible={imageVisible} style={{ width: '100%', height: '100%', backgroundColor: 'red' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity onPress={() => { setimageVisible(false) }}><Text style={{ color: 'white', backgroundColor: '#3b7dfc', padding: 10, fontSize: 20 }}>Close</Text></TouchableOpacity>
        </View>
        <Image
          style={{ width: '100%', height: 'auto', flex: 1 }}
          source={{ uri: showImage }}
          resizeMode="contain"
        />
      </Modal>
    </ScrollView>
  );
}

const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  imgName: { color: 'black', fontSize: 12, fontWeight: '600' },
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
    fontSize: 20,
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
