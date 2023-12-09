import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  Image,
  Platform
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Loader from '../Loader';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as ImagePicker from 'react-native-image-picker';

import RNFetchBlob from 'rn-fetch-blob';
import Header from '../subcomponents/Forms/Header';
import BroadTextInput from '../subcomponents/Forms/FlightPreparation/broadTextInput';
import BroadImageUpload from '../subcomponents/Forms/FlightPreparation/broadImageUpload';
import { firebase } from '@react-native-firebase/functions';
import auth from '@react-native-firebase/auth';
import s from '../subcomponents/Forms/FlightPreparation/form.styles';
import m from '../styles/layouts/main.style';
import { SERVER_URL, getDomain } from '../constants/env';

// if (true) functions().useEmulator('192.168.29.75', 5001);
const { width, height } = Dimensions.get('window');

const HeadingTextSize = width / 15;
const labelTextSize = width / 25;
const uploadMenu = [
  { id: 1, name: 'Slots:', textId: 3 },
  { id: 2, name: 'Parking:', textId: 4 },
  { id: 3, name: 'Landing Permit', textId: 5 },
];

export default function FlightPreparation(props) {

  const refRBSheet = useRef();
  const [uploadSection, setuploadSection] = useState(0);
  const [loading, setloading] = useState(false);
  const [uid, setuid] = useState(null);
  const [imageVisible, setimageVisible] = useState(false);
  const [showImage, setshowImage] = useState(null);
  const [fpreparation, setfpreparation] = useState([
    { value: null, file: [], label: 'NOTAMs' },
    { value: null, file: [], label: 'Slots' },
    { value: null, file: [], label: 'Parking' },
    { value: null, file: [], label: 'Landing permit' },
  ]);
  const FUID = props.route.params.UID;
  const [hasUnsavedChanges, sethasUnsavedChanges] = useState(false);
  const removeFileFP = (arrayIndex, index) => {
    var tfpreparation = [...fpreparation];
    tfpreparation[arrayIndex].file.splice(index, 1);
    setfpreparation(tfpreparation);
  };

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
      'data:application/vnd.ms-excel;base64': '.xls',
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64': '.xlsx',
      'data:application/vnd.ms-powerpoint;base64': '.ppt',
      'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64': '.pptx',
      'data:application/zip;base64': '.zip',
      'data:application/octet-stream;base64': '.docx',
      // Add more checks for other file types as needed
    };
    var type = headers[val.split(",")[0]];
    var bs64 = val.split(",")[1];
    var pdfLocation = DownloadDir + '/' + fileName + type;
    // console.log(pdfLocation);
    // console.log(val)
    if (type) {
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
    else {
      Alert.alert('Unsupported format.')
    }
  }

  const onPressDocPreA_New = async (index, res) => {
    setloading(false);
    // res.map(value => {
    RNFetchBlob.fs
      .readFile(res.uri, 'base64')
      .then(encoded => {
        // console.log(encoded, 'reports.base64');
        setloading(false);
        var tfpreparation = [...fpreparation];
        tfpreparation[index].file.push('data:' + res.type + ';base64,' + encoded);
        setfpreparation([...tfpreparation]);
      })
      .catch(error => {
        setloading(false);
        console.log(error);
      });
    // })

    refRBSheet.current.close();
  };

  const getImage = async type => {
    console.log('HERE', uploadSection);
    var options = {
      mediaType: 'image',
      includeBase64: false,
      maxHeight: 800,
      maxWidth: 800,
      // selectionLimit: 0
    };
    console.log(options);
    switch (type) {
      case true:
        try {
          options.mediaType = 'photo';
          const result = await ImagePicker.launchImageLibrary(options);
          const file = result.assets[0];
          console.log(file)
          onPressDocPreA_New(uploadSection, file);
        } catch (error) {
          console.log(error);
        }
        break;
      case false:
        try {
          const result = await ImagePicker.launchCamera(options);
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

  useEffect(
    () =>
      props.navigation.addListener('beforeRemove', e => {
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
          ],
        );
      }),
    [props.navigation, hasUnsavedChanges],
  );
  //NEW STRUCTURE

  const [airinfo, setAirInfo] = useState('');
  const [notams, setnotams] = useState('');
  const [specialproc, setspecialproc] = useState('');

  const [slot, setSlot] = useState('');
  const [parking, setParking] = useState('');
  const [landingperm, setlandingperm] = useState('');

  const [formReady, setformReady] = useState(true);

  const validate = () => { };

  const textSeeker = (type, event) => {
    console.log(type.event);
    validate();
    sethasUnsavedChanges(true);
    switch (type) {
      case 0:
        setAirInfo(event);
        break;
      case 1:
        setnotams(event);
        break;
      case 2:
        setspecialproc(event);
        break;
      case 3:
        setSlot(event);
        break;
      case 4:
        setParking(event);
        break;
      case 5:
        setlandingperm(event);
        break;
      default:
        return false;
        break;
    }
  };

  const uploadInitiator = type => {
    setuploadSection(type);
    refRBSheet.current.open();
  };
  const [callLoad, setcallLoad] = useState(false);
  const sendtoApi = data => {

    setcallLoad(true);
    const email = auth().currentUser.email;
    var domain = getDomain();
    var send = {
      FLP_AP: airinfo,
      FLP_NOTAMS: notams,
      FLP_SPECIAL: specialproc,
      FLP_SLOTS: slot,
      FLP_PARKING: parking,
      FLP_PERMIT: landingperm,
      FUID: FUID,
      UID: uid,
      STATUS: '0',
      UPDATE_BY: email,
      FLP_NOTAMS_String: fpreparation[0]?.file,
      FLP_SLOTS_String: fpreparation[1]?.file,
      FLP_PARKING_String: fpreparation[2].file,
      FLP_PERMIT_String: fpreparation[3]?.file,
    };
    console.log(send);
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(send)
    };
    fetch(
      `${domain}/PostFlightPreparation`,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        setcallLoad(false);
        Alert.alert('Success');
        console.log(result);
        sethasUnsavedChanges(false);
        getAllData();
      })
      .catch(error => {
        setcallLoad(false);
        Alert.alert('Error in updating');
        console.log(error, 'Function error');
      });
  };

  const sendForm = () => {
    //fields
    // setcallLoad(true);
    var formFields = {
      textFields: {
        Airport_Information: airinfo,
        Notams: notams,
        Special_Procedures: specialproc,
      },
      uploadFields: {
        Slots: {
          text: slot,
          files: fpreparation[0],
        },
        Parking: {
          text: parking,
          files: fpreparation[1],
        },
        LandingPermit: {
          text: landingperm,
          files: fpreparation[2],
        },
      },
    };
    sendtoApi(formFields);
    //console.log("READY TO BE SENT",formFields);
  };

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = () => {
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
      `${domain}/GetFlightPreparation?_token=CDAC498B-116F-4346-AD72-C3F65A902FFD&_opco=&_fuid=${FUID}&_uid=`,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        // setcallLoad(false);
        try {
          var packet = JSON.parse(result);
          console.log('flightPreparation', result);
          var res = packet.Table[0];
          if (res) {
            setuid(res.UID);
            setSlot(res.FLP_SLOTS);
            setParking(res.FLP_PARKING);
            setlandingperm(res.FLP_PERMIT);
            setnotams(res.FLP_NOTAMS);
            setAirInfo(res.FLP_AP);
            setspecialproc(res.FLP_SPECIAL);
            fetch(
              `${domain}/GetFlightPreparationFiles?_token=CDAC498B-116F-4346-AD72-C3F65A902FFD&_opco=&_fuid=${FUID}&_uid=${res.UID}`,
              requestOptions,
            )
              .then(response => response.text())
              .then(result => {
                setcallLoad(false);
                try {
                  setcallLoad(false);
                  var packet = JSON.parse(result);
                  console.log(packet);
                  if (packet) {
                    var temp = [...fpreparation];
                    temp[0].file = packet.FLP_NOTAMS_String;
                    temp[1].file = packet.FLP_SLOTS_String;
                    temp[2].file = packet.FLP_PARKING_String;
                    temp[3].file = packet.FLP_PERMIT_String;
                    setfpreparation([...temp])
                  }
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
          } else {
            setcallLoad(false);
            setuid('');
          }
          // setcallLoad(false);
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

  //NEW STRUCtURE ENDS

  return (
    <>
      <Header
        headingSize={HeadingTextSize}
        heading={'Flight Preparation'}
        sendForm={sendForm}
        nav={"IntialScreenView"}
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
      <ScrollView>
        <Loader visible={loading} />

        <View style={{ padding: 20 }}>
          <BroadTextInput
            type={0}
            label={'Airport Information:'}
            labelSize={labelTextSize}
            text={airinfo}
            textSeeker={textSeeker}
          />
          {/* <BroadTextInput
            type={1}
            label={'NOTAMs'}
            labelSize={labelTextSize}
            text={notams}
            textSeeker={textSeeker}
          /> */}
          <View>
            <Text style={s.label}>{'NOTAMs:'}</Text>
            <View style={[m.row, m.alighItemCenter]}>
              <TextInput
                style={s.input}
                multiline={true}
                numberOfLines={2}
                value={notams}
                onChangeText={(e) => textSeeker(1, e)}
              />
              <TouchableOpacity
                //onPress={() => onPressDocFPreparation(3)}
                onPress={() => uploadInitiator(0)}
                style={{ justifyContent: 'flex-end', alignSelf: 'flex-end', marginBottom: 20 }}
              >
                <Icons
                  style={{ marginLeft: 10 }}
                  color={'green'}
                  name="upload"
                  size={40}
                />
              </TouchableOpacity>
            </View>
            {fpreparation[0].file.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                {fpreparation[0].file.map((value, index) => {
                  return (
                    <TouchableOpacity onPress={() => {

                      if (value.split(",")[0].startsWith('data:image')) {
                        setimageVisible(true);
                        setshowImage(value);
                      }
                      else {
                        // saveFile(value, 'Notams Document' + (index + 1))
                        saveFile(value, 'Notams Document' + (index + 1))
                      }
                    }} key={index} style={styleSheet.attachment}>
                      <Text style={{ color: 'black' }}>{'Notams Document' + (index + 1)}</Text>
                      <TouchableOpacity
                        onPress={() => removeFileFP(0, index)}>
                        <Icons
                          style={{ color: 'green', marginLeft: 10 }}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

          </View>
          <BroadTextInput
            type={2}
            label={'Special Procedures:'}
            labelSize={labelTextSize}
            text={specialproc}
            textSeeker={textSeeker}
          />
          {uploadMenu.map((data, index) => {
            return (
              <BroadImageUpload
                key={data.id}
                type={data.id}
                textId={data.textId}
                label={data.name}
                text={data.id === 1 ? slot : data.id === 2 ? parking : landingperm}
                textSeeker={textSeeker}
                uploadType={data.id}
                uploadInitiator={uploadInitiator}
                icon={
                  <Icons
                    style={{ marginLeft: 10 }}
                    color={'green'}
                    name="upload"
                    size={40}
                  />
                }
                attachMents={
                  <>
                    {fpreparation[data.id].file.length > 0 && (
                      <View style={{ marginBottom: 20 }}>
                        {fpreparation[data.id].file.map((value, index) => {
                          return (
                            <TouchableOpacity onPress={() => {
                              if (value.split(",")[0].startsWith('data:image')) {
                                setimageVisible(true);
                                setshowImage(value);
                              }
                              else {
                                saveFile(value, fpreparation[data.id].label + ' ' + (index + 1))
                                // Alert.alert('This file type cannot be opened')
                              }
                            }} key={index} style={styleSheet.attachment}>
                              <Text style={{ color: 'black' }}>{fpreparation[data.id].label + ' ' + (index + 1)}</Text>
                              <TouchableOpacity
                                onPress={() => removeFileFP(data.id, index)}>
                                <Icons
                                  style={{ color: 'green', marginLeft: 10 }}
                                  name="close"
                                  size={30}
                                />
                              </TouchableOpacity>
                            </TouchableOpacity >
                          );
                        })}
                      </View>
                    )}
                  </>
                }
              />
            );
          })}

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
                <Text style={{ color: 'black', fontSize: 22 }}>Upload</Text>
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
        </View>
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
    </>
  );
}

const styleSheet = StyleSheet.create({
  attachment: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    // marginHorizontal: 5,
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
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
  },
});
