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
  Alert,
  ScrollView,
  Modal,
  Image
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SERVER_URL, getDomain } from '../constants/env';

import React, { useRef, useState, useEffect } from 'react';
import Header from '../subcomponents/Forms/Header';

import DocumentPicker from 'react-native-document-picker';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as ImagePicker from 'react-native-image-picker';
import Loader from '../Loader';
import DateTimeInput from '../subcomponents/Forms/universal/datetimeinput';
import LabelledInput from '../subcomponents/Forms/universal/labelledinput';
import { firebase } from '@react-native-firebase/functions';
import { ActivityIndicator } from 'react-native';
const { width, height } = Dimensions.get('window');
import auth from '@react-native-firebase/auth';
import s from '../subcomponents/Forms/FlightPreparation/form.styles';
const HeadingTextSize = width / 15;

export default function ArrivalService(props) {
  // const [timerDate, settimerDate] = useState(new Date());
  const timerDate = useRef(new Date());
  const [formReady, setformReady] = useState(true);
  const currentPicker = useRef(0);
  const refRBSheet = useRef();
  const [uid, setuid] = useState(null);
  const FUID = props.route.params.UID;
  //upload funcs
  const [uploadSection, setuploadSection] = useState(0);
  const [imageVisible, setimageVisible] = useState(false);
  const [showImage, setshowImage] = useState(null);
  const [mode, setMode] = useState('time');
  const [loading, setloading] = useState(false);
  const [aService, setaService] = useState({
    "ARS_BAGGAGE": null, "ARS_BAGGAGE_PHOTO": "",
    "ARS_CEC_REMARKS": "", "ARS_CEC_REQ": null,
    "ARS_CREW": null, "ARS_CRM_CAT": "", "ARS_CRM_CCIQ": "",
    "ARS_CRM_CDA": "", "ARS_CRM_CDT": "", "ARS_CRM_CVA": "",
    "ARS_CRM_REM": "", "ARS_CRM_TAT": "", "ARS_CTR_CDT": "",
    "ARS_CTR_CEL": "", "ARS_CTR_CEO": "", "ARS_CTR_NCO": "",
    "ARS_CTR_REM": "", "ARS_CTR_REQ": 0, "ARS_DS_CONTACT_NO": "",
    "ARS_DS_NAME": "", "ARS_FOA_END": "",
    "ARS_FOA_FTAT": "", "ARS_FOA_RECEIPT": "",
    "ARS_FOA_REM": "", "ARS_FOA_REQ": 0,
    "ARS_FOA_START": "", "ARS_GPU_REQ": 0, "ARS_GPU_START": "",
    "ARS_GPU_STOP": "", "ARS_LAS_CT": "",
    "ARS_LAS_ET": "", "ARS_LAS_REM": "",
    "ARS_LAS_REQ": 0, "ARS_LAS_ST": "", "ARS_LC_NR": 0,
    "ARS_LC_PHOTO": '', "ARS_LC_REMARKS": "",
    "ARS_MOVACLANDED": "", "ARS_MOVCHOCKIN": "",
    "ARS_MOV_PXAT": "", "ARS_MOV_PXCIQ": "",
    "ARS_MOV_PXDA": "", "ARS_MOV_PXDT": null, "ARS_MOV_PXTAT": null,
    "ARS_MOV_PXVA": "", "ARS_MOV_REM": null,
    "ARS_MOV_VOA": 0, "ARS_OVB_NUMBER": "",
    "ARS_OVB_REQ": 0, "ARS_PAX": null,
    "ARS_RUS_CT": "", "ARS_RUS_REM": "",
    "ARS_RUS_REQ": 0, "ARS_TOS_END": "", "ARS_TOS_PHOTO": "",
    "ARS_TOS_REM": "", "ARS_TOS_REQ": 0,
    "ARS_TOS_START": "", "ARS_WAS_CT": "", "ARS_WAS_ET": "",
    "ARS_WAS_REM": "", "ARS_WAS_REQ": 0, "CREATED_BY": "",
    "CREATED_DATE": "", "FLIGHT_ARRIVAL_CREW": null,
    "FLIGHT_ARRIVAL_PAX": null, "FUID": "",
    "LAST_UPDATE": "", "STATUS": 1,
    "UID": "", "UPDATE_BY": "",
    "ARS_BAGGAGE_String": [],
    "ARS_CTR_CEL_String": [],
    "ARS_CTR_NCO_String": [],
    "ARS_FOA_FR_String": [],
    "ARS_TOS_PHOTO_STring": [],
    "ARS_LC_PHOTO_STring": [],
    "ARS_CEC_PHOTO_STring": [],
    "ARS_CRM_CVOA": 0,
    ARS_LAS_CT_C: 0,
    ARS_LAS_ET_C: 0,
    ARS_LAS_ST_C: 0,
  })
  const [paxmovement, setpaxmovement] = useState([]);
  const [crewmovement, setcrewmovement] = useState([]);
  const [deleteService, setdeleteService] = useState([]);

  const addMovement = () => {
    const email = auth().currentUser.email;
    setpaxmovement([...paxmovement, { "ARS_PM_ATAT": "", "ARS_PM_PDFT": "", "ARS_PM_REMARK": "", "ARS_PM_TYPE": "Pax", "FUID": FUID, "STATUS": 1, "UID": '', "UPDATE_BY": email }]);
  };
  const onRemoveMovement = index => {
    var service = [...paxmovement];
    var delService = service.splice(index, 1);
    setpaxmovement(service);
    if (delService[0].UID) {
      setdeleteService([...deleteService, { UID: delService[0].UID, TableName: 'ARRIVALSERVICES' }]);
    }
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
      `${domain}/GetArrivalServices?_token=8746A6BE-8BB1-4D08-9E68-A15982110834&_opco=&_fuid=${FUID}&_uid=`,
      requestOptions,
    )
      .then(response => response.text())
      .then(response => {
        console.log(response, 'arrival');
        var packet = JSON.parse(response);
        var res = [...packet.Table];
        if (res[0]) {
          console.log(res)
          setaService(res[0]);
          console.log(res[0]);
          setuid(res[0].UID);
          fetch(
            `${domain}/GetArrivalServicesFiles?_token=CDAC498B-116F-4346-AD72-C3F65A902FFD&_opco=&_fuid=${FUID}&_uid=${res[0].UID}`,
            requestOptions,
          )
            .then(response => response.text())
            .then(result => {
              setcallLoad(false);
              try {
                var packet = JSON.parse(result);
                console.log(packet);
                var temp = { ...res[0] };
                temp.ARS_CTR_CEL_String = packet.ARS_CTR_CEL_String,
                  temp.ARS_BAGGAGE_String = packet.ARS_BAGGAGE_String,
                  temp.ARS_CTR_NCO_String = packet.ARS_CTR_NCO_String,
                  temp.ARS_FOA_FR_String = packet.ARS_FOA_FR_String,
                  temp.ARS_TOS_PHOTO_STring = packet.ARS_TOS_PHOTO_STring,
                  temp.ARS_LC_PHOTO_STring = packet.ARS_LC_PHOTO_STring,
                  temp.ARS_CEC_PHOTO_STring = packet.ARS_CEC_PHOTO_STring,
                  setaService({ ...temp })
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

          fetch(
            `${domain}/GetArrivalServicesPM?_token=8746A6BE-8BB1-4D08-9E68-A15982110834&_opco=&_fuid=${FUID}&_uid=`,
            requestOptions,
          )
            .then(response => response.text())
            .then(response => {
              var packet = JSON.parse(response);
              var res = packet.Table;
              console.log(res, 'res');
              if (res && res.length > 0) {

                var paxmov = [];
                var crewmov = [];
                res.forEach((val, index) => {
                  if (val.STATUS != 5) {
                    if (val.ARS_PM_TYPE == 'Pax') {
                      paxmov.push(val);

                    } else {
                      crewmov.push(val);
                      setcrewmovement([...crewmovement, val]);
                    }
                  }
                });
                setpaxmovement([...paxmov]);
                setcrewmovement([...crewmov]);
              } else {
                console.log(res, 'res');
              }
              setcallLoad(false);
            })
            .catch(error => {
              setcallLoad(false);
              console.log(error, 'Function error');
            });
        } else {
          setcallLoad(false);
          setuid('');
        }
      })
      .catch(error => {
        setcallLoad(false);

        console.log(error, 'Function error');
      });
  }

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = (type, index, arr, pos) => {
    currentPicker.current = [index, arr, pos];
    setMode(type);
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = date => {
    // settimerDate(new Date(date));
    // timerDate.current = new Date(date)
    switch (currentPicker.current[1]) {
      case 'crewmovement':
        var tcheckList = [...crewmovement];
        tcheckList[currentPicker.current[0]][
          currentPicker.current[2]
        ] = tConvert(
          new Date(date).toLocaleString('en-US', {
            hour12: false,
          }),
        );
        setcrewmovement([...tcheckList]); break;
      case 'paxmovement':
        var tcheckList = [...paxmovement];
        tcheckList[currentPicker.current[0]][
          currentPicker.current[2]
        ] = tConvert(
          new Date(date).toLocaleString('en-US', {
            hour12: false,
          }),
        );
        setpaxmovement([...tcheckList]); break;
      case 'aService':
        console.log('aDeparture me aya')
        var tcheckList = { ...aService };
        tcheckList[
          currentPicker.current[2]
        ] = tConvert(
          new Date(date).toLocaleString('en-US', {
            hour12: false,
          }),
        );
        console.log("datetimeset", tcheckList)
        setaService({ ...tcheckList }); break;
    }
    hideDatePicker();
  };
  const tConvert = datetime => {
    var date = datetime.split(',')[0].split('/');
    var time24 = datetime.split(', ')[1];
    var time = time24.split(':');
    if (mode == 'date') {
      return (
        datetime.split(',')[0]
      );
    }
    else if (mode == 'time') {
      return (
        time[0] + ':' + time[1]
      );
    }
    return (
      datetime
    );
  };
  const setNow = (index, arr, pos) => {
    currentPicker.current = [index, arr, pos];
    handleConfirm(new Date());
  };

  const onPressDocPreA_New = async (index, res) => {
    setloading(false);
    RNFetchBlob.fs
      .readFile(res.uri, 'base64')
      .then(encoded => {
        // console.log(encoded, 'reports.base64');
        setloading(false);
        var temp = { ...aService };
        temp[uploadSection] ? temp[uploadSection].push('data:' + res.type + ';base64,' + encoded) : temp[uploadSection] = ['data:' + res.type + ';base64,' + encoded];
        setaService({ ...temp })
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

  const removeFilePreA = (field, index) => {
    var temp = { ...aService };
    temp[field].splice(index, 1);
    setaService({ ...temp });
    console.log(temp);
  };

  const addCrewMovement = () => {
    const email = auth().currentUser.email;
    setcrewmovement([...crewmovement, { "ARS_PM_ATAT": "", "ARS_PM_PDFT": "", "ARS_PM_REMARK": "", "ARS_PM_TYPE": "Crew", "CREATED_BY": email, "CREATED_DATE": "", "FUID": FUID, "LAST_UPDATE": "", "STATUS": 1, "UID": '', "UPDATE_BY": email }])

  };
  const removeCrewMovement = index => {
    var service = [...crewmovement];
    var delService = service.splice(index, 1);
    setcrewmovement(service);
    if (delService[0].UID) {
      setdeleteService([...deleteService, { UID: delService[0].UID, TableName: 'ARRIVALSERVICES' }]);
    }

  };

  const [callLoad, setcallLoad] = useState(false);
  const sendForm = () => {
    var domain = getDomain();
    const email = auth().currentUser.email;
    const payload = {
      ...aService,
      STATUS: 0,
      UID: uid ? uid : '',
      FUID: FUID,
      UPDATE_BY: email
    };
    console.log(payload, 'payload');
    setcallLoad(true);
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(payload)
    };
    fetch(
      `${domain}/PostArrivalServices`,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        Alert.alert('Success');
        setcallLoad(false);
        console.log('All Data', result);
        console.log('movement', paxmovement.concat(crewmovement));
        //   });
        if (paxmovement.concat(crewmovement).length > 0) {

          var requestOptions1 = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(paxmovement.concat(crewmovement))
          };
          fetch(
            `${domain}/PostArrivalServicesPM`,
            requestOptions1,
          )
            .then(response => response.text())
            .then(result => {
              Alert.alert('Success');
              setcallLoad(false);
              console.log('Movement', result);
              readData();
            })
            .catch(error => {
              Alert.alert('Error in updation');
              setcallLoad(false);
              console.log(error, 'Function error');
            });
        }
      })
      .catch(error => {
        Alert.alert('Error in updation');
        setcallLoad(false);
        console.log(error, 'Function error');
      });


    console.log("deleteService", deleteService)
    if (deleteService.length > 0) {
      var requestOptions1 = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(deleteService)
      };
      fetch(
        `${domain}/DeleteAPI`,
        requestOptions1,
      )
        .then(response => response.text())
        .then(result => {
          setdeleteService([])
          setcallLoad(false);
          console.log(result);
        })
        .catch(error => {
          Alert.alert('Error in updation');
          setcallLoad(false);
          console.log(error, 'Function error');
        });
    }

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
      'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64': '.docx',
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
    <View>

      <Header
        headingSize={HeadingTextSize}
        heading={'Arrival'}
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

        <View style={{ padding: 20, marginBottom: 100 }}>
          <Text style={styleSheet.label}>Duty Supervisor Details:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <LabelledInput
              disabled={false}
              label={'Name'} //mark
              data={aService.ARS_DS_NAME}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                setaService({ ...aService, ARS_DS_NAME: text });
              }}
              multiline={false}
              numberOfLines={1}
            />
            <LabelledInput
              disabled={false}
              label={'Contact No.'} //mark
              data={aService.ARS_DS_CONTACT_NO}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                setaService({ ...aService, ARS_DS_CONTACT_NO: text });
              }}
              multiline={false}
              numberOfLines={1}
            />
          </View>
          <DateTimeInput
            label={'Movement (AC Landed) (Local Time)'}
            showDatePickerPostDepart={() => {
              showDatePicker('time', 0, 'aService', "ARS_MOVACLANDED");
            }}
            setNowPostDepart={(indexx, x) => {
              var tcheckList = { ...aService };
              tcheckList.ARS_MOVACLANDED = x
              setaService({ ...tcheckList });
            }}
            size={12}
            type={'time'}
            data={aService.ARS_MOVACLANDED}
            index={12}
          />

          <DateTimeInput
            label={'Movement (Checks In) (Local Time)'}
            showDatePickerPostDepart={() => {
              showDatePicker('time', 0, 'aService', "ARS_MOVCHOCKIN");
            }}
            setNowPostDepart={(indexx, x) => {
              var tcheckList = { ...aService };
              tcheckList.ARS_MOVCHOCKIN = x
              setaService({ ...tcheckList });
            }}
            size={12}
            type={'time'}
            data={aService.ARS_MOVCHOCKIN}
            index={12}
          />

          <Text style={styleSheet.label}>Ground Power Unit (GPU):</Text>
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
              <TouchableOpacity
                onPress={event => {
                  setaService({ ...aService, ARS_GPU_REQ: aService.ARS_GPU_REQ == 1 ? 0 : 1, ARS_GPU_START: "", ARS_GPU_STOP: "" })
                }}>
                <Icons
                  name={
                    aService.ARS_GPU_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aService.ARS_GPU_REQ == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <DateTimeInput
              disabled={aService.ARS_GPU_REQ}
              label={'Start Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_GPU_START");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aService };
                tcheckList.ARS_GPU_START = x
                setaService({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aService.ARS_GPU_START}
              index={12}
            />
            <DateTimeInput
              disabled={aService.ARS_GPU_REQ}
              label={'Stop Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_GPU_STOP");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aService };
                tcheckList.ARS_GPU_STOP = x
                setaService({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aService.ARS_GPU_STOP}
            />
          </View>

          <LabelledInput
            label={'Number of Pax'} //mark
            data={aService.ARS_PAX}
            datatype={'text'}
            index={12}
            setText={(i, text, type, section) => {
              setaService({ ...aService, ARS_PAX: text });
            }}
            multiline={false}
            numberOfLines={1}
          />

          <LabelledInput
            label={'Number of Crew'} //mark
            data={aService.ARS_CREW}
            datatype={'text'}
            index={5}
            setText={(i, text, type, section) => {
              setaService({ ...aService, ARS_CREW: text });
            }}
            multiline={false}
            numberOfLines={1}
          />
          <Text style={styleSheet.label}>Baggage:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <LabelledInput
              label={'Number of Baggage Offloaded'} //mark
              data={aService.ARS_BAGGAGE}
              datatype={'text'}
              index={20}
              setText={(index, text, type, section) => {
                var tcheckList = { ...aService };
                tcheckList.ARS_BAGGAGE = text;
                setaService({ ...tcheckList });
              }}
              multiline={true}
              numberOfLines={1}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 10,

              }}>
              <Text style={styleSheet.label}>
                Baggage Photo
              </Text>
              <TouchableOpacity
                //onPress={event => onPressDocPreA(6)}
                onPress={() => {
                  setuploadSection('ARS_BAGGAGE_String');
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
            {aService.ARS_BAGGAGE_String && aService.ARS_BAGGAGE_String.map((val, indexxx) => {
              return (<TouchableOpacity
                onPress={() => {
                  if (val.split(",")[0].startsWith('data:image')) {
                    setimageVisible(true);
                    setshowImage(val);
                  }
                  else {
                    saveFile(val, `ARS_BAGGAGE_DOCUMENT` + indexxx)
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
                <Text style={{ color: 'black' }}>{`ARS_BAGGAGE_DOCUMENT` + indexxx}</Text>
                <TouchableOpacity onPress={() => removeFilePreA('ARS_BAGGAGE_String', indexxx)}>
                  <Icons
                    style={{ color: 'green', marginLeft: 10 }}
                    name="close"
                    size={30}
                  />
                </TouchableOpacity>
              </TouchableOpacity>)
            })}

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
              label={'Left Aircraft (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_MOV_PXDA");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_MOV_PXDA")}
              size={12}
              type={'time'}
              data={aService.ARS_MOV_PXDA}
            />
            <DateTimeInput
              label={'Pax Arrived at Terminal (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_MOV_PXAT");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_MOV_PXAT")}
              size={12}
              type={'time'}
              data={aService.ARS_MOV_PXAT}
            />


            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={event => setaService({ ...aService, ARS_MOV_PXVA: aService.ARS_MOV_PXVA == 1 ? 0 : 1 })}>
                <Icons
                  name={
                    aService.ARS_MOV_PXVA == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aService.ARS_MOV_PXVA == 1 ? 'green' : 'black'}
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
              <TouchableOpacity onPress={event => setaService({ ...aService, ARS_MOV_VOA: aService.ARS_MOV_VOA == 1 ? 0 : 1 })}>
                <Icons
                  name={
                    aService.ARS_MOV_VOA == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aService.ARS_MOV_VOA == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>VOA Not Required</Text>
            </View>
            <DateTimeInput
              label={'Pax Completed CIQ (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_MOV_PXCIQ");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_MOV_PXCIQ")}
              size={12}
              type={'time'}
              data={aService.ARS_MOV_PXCIQ}
            />


            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => addMovement(true)}
                style={[styleSheet.button]}>
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  Add Movement
                </Text>
              </TouchableOpacity>
            </View>
            {paxmovement.map((val, index) => {
              return (
                <View key={index} style={{ marginTop: 20 }}>
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
                  <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity
                      style={styleSheet.label}
                      onPress={() => onRemoveMovement(index)}>
                      <Icons name="minus-box-outline" color="red" size={30} />
                    </TouchableOpacity>
                  </View>
                  <DateTimeInput
                    label={'Actual Transport Arrival Time at Airport (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', index, 'paxmovement', "ARS_PM_ATAT");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...paxmovement];
                      tcheckList[index].ARS_PM_ATAT = x
                      setpaxmovement([...tcheckList]);
                    }}
                    size={12}
                    type={'time'}
                    data={val.ARS_PM_ATAT}
                    index={12}
                  />
                  <DateTimeInput
                    label={' Left Terminal (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', index, 'paxmovement', "ARS_PM_PDFT");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...paxmovement];
                      tcheckList[index].ARS_PM_PDFT = x
                      setpaxmovement([...tcheckList]);
                    }}
                    size={12}
                    type={'time'}
                    data={val.ARS_PM_PDFT}
                    index={12}
                  />

                  <LabelledInput
                    label={'Remarks'} //mark
                    data={val.ARS_PM_REMARK}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      var tcheckList = [...paxmovement];
                      tcheckList[index].ARS_PM_REMARK = text
                      setpaxmovement([...tcheckList]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
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
              <TouchableOpacity
                onPress={event => {
                  setaService({ ...aService, ARS_CTR_REQ: aService.ARS_CTR_REQ == 1 ? 0 : 1, ARS_CTR_CEO: "", ARS_CTR_CDT: "", ARS_CTR_REM: "", ARS_CTR_CEL_String: [], ARS_CTR_NCO_String: [] })
                }}>
                <Icons
                  name={
                    aService.ARS_CTR_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aService.ARS_CTR_REQ == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Catering Equipment Offloaded</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                editable={!aService.ARS_CTR_REQ ? true : false}
                style={[
                  styleSheet.input,
                  {
                    backgroundColor: aService.ARS_CTR_REQ == 1
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                multiline={true}
                numberOfLines={2}
                value={aService.ARS_CTR_CEO}
                onChangeText={text => {
                  setaService({ ...aService, ARS_CTR_CEO: text })
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
                  setuploadSection('ARS_CTR_CEL_String');
                  refRBSheet.current.open();
                }}
                disabled={!aService.ARS_CTR_REQ ? false : true}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: aService.ARS_CTR_REQ == 1
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{ color: 'green' }}>Upload</Text>
              </TouchableOpacity>
            </View>
            {aService.ARS_CTR_CEL_String && aService.ARS_CTR_CEL_String.map((val, indexxx) => {
              return (<TouchableOpacity
                onPress={() => {
                  if (val.split(",")[0].startsWith('data:image')) {
                    setimageVisible(true);
                    setshowImage(val);
                  }
                  else {
                    saveFile(val, `ARS_CTR_CEL_DOCUMENT` + indexxx)
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
                <Text style={{ color: 'black' }}>{`ARS_CTR_CEL_DOCUMENT` + indexxx}</Text>
                <TouchableOpacity onPress={() => removeFilePreA('ARS_CTR_CEL_String', indexxx)}>
                  <Icons
                    style={{ color: 'green', marginLeft: 10 }}
                    name="close"
                    size={30}
                  />
                </TouchableOpacity>
              </TouchableOpacity>)
            })}
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
                  setuploadSection('ARS_CTR_NCO_String');
                  refRBSheet.current.open();
                }}
                disabled={!aService.ARS_CTR_REQ ? false : true}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: aService.ARS_CTR_REQ == 1
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{ color: 'green' }}>Upload</Text>
              </TouchableOpacity>
            </View>
            {aService.ARS_CTR_NCO_String && aService.ARS_CTR_NCO_String.map((val, indexxx) => {
              return (<TouchableOpacity
                onPress={() => {
                  if (val.split(",")[0].startsWith('data:image')) {
                    setimageVisible(true);
                    setshowImage(val);
                  }
                  else {
                    saveFile(val, `ARS_CTR_NCO_DOCUMENT` + indexxx)
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
                <Text style={{ color: 'black' }}>{`ARS_CTR_NCO_DOCUMENT` + indexxx}</Text>
                <TouchableOpacity onPress={() => removeFilePreA('ARS_CTR_NCO_String', indexxx)}>
                  <Icons
                    style={{ color: 'green', marginLeft: 10 }}
                    name="close"
                    size={30}
                  />
                </TouchableOpacity>
              </TouchableOpacity>)
            })}

            <DateTimeInput
              disabled={aService.ARS_CTR_REQ}
              label={'Catering Delivey Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_CTR_CDT");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_CTR_CDT")}
              size={12}
              type={'time'}
              data={aService.ARS_CTR_CDT}
              index={12}
            />
            <LabelledInput
              disabled={aService.ARS_CTR_REQ}
              label={'Remarks'} //mark
              data={aService.ARS_CTR_REM}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                setaService({ ...aService, ARS_CTR_REM: text });
              }}
              multiline={false}
              numberOfLines={1}
            />
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
              <TouchableOpacity
                onPress={event => {
                  setaService({ ...aService, ARS_WAS_REQ: aService.ARS_WAS_REQ == 1 ? 0 : 1, ARS_WAS_CT: "", ARS_WAS_ET: "", ARS_WAS_REM: "" })
                  // setArrivalcheck(24);
                  // var x = [...arrival];
                  // x[21] = null;
                  // x[22] = null;
                  // x[23] = null;
                  // setArrival(x);
                }}>
                <Icons
                  name={
                    aService.ARS_WAS_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aService.ARS_WAS_REQ == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <DateTimeInput
              disabled={aService.ARS_WAS_REQ}
              label={'Start Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_WAS_CT");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_WAS_CT")}
              size={12}
              type={'time'}
              data={aService.ARS_WAS_CT}
              index={12}
            />
            <DateTimeInput
              disabled={aService.ARS_WAS_REQ}
              label={'End Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_WAS_ET");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_WAS_ET")}
              size={12}
              type={'time'}
              data={aService.ARS_WAS_ET}
              index={12}
            />
            <LabelledInput
              disabled={aService.ARS_WAS_REQ}
              label={'Remarks'} //mark
              data={aService.ARS_WAS_REM}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                setaService({ ...aService, ARS_WAS_REM: text });
              }}
              multiline={false}
              numberOfLines={1}
            />
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
              <TouchableOpacity
                onPress={event => {
                  setaService({ ...aService, ARS_LAS_REQ: aService.ARS_LAS_REQ == 1 ? 0 : 1, ARS_LAS_CT: "", ARS_LAS_ET: "", ARS_LAS_REM: "" })
                }}>
                <Icons
                  name={
                    aService.ARS_LAS_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aService.ARS_LAS_REQ == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not required</Text>
            </View>
            <DateTimeInput
              notrequiredtext={'Completed'}
              notrequiredSection={true}
              isnotrequired={aService.ARS_LAS_CT_C == 1 ? true : false}
              setnotrequired={value => {
                setaService({ ...aService, ARS_LAS_CT_C: value ? 1 : 0 })
              }}
              disabled={aService.ARS_LAS_REQ}
              label={'Completion Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_LAS_CT");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_LAS_CT")}
              size={12}
              type={'time'}
              data={aService.ARS_LAS_CT}
              index={12}
            />
            <DateTimeInput
              notrequiredtext={'Completed'}
              isnotrequired={aService.ARS_LAS_ST_C == 1 ? true : false}
              setnotrequired={value => {
                setaService({ ...aService, ARS_LAS_ST_C: value ? 1 : 0 })
              }}
              notrequiredSection={true}
              disabled={aService.ARS_LAS_REQ}
              label={'Start Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_LAS_ST");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_LAS_ST")}
              size={12}
              type={'time'}
              data={aService.ARS_LAS_ST}
              index={12}
            />
            <DateTimeInput
              notrequiredtext={'Completed'}
              notrequiredSection={true}
              isnotrequired={aService.ARS_LAS_ET_C == 1 ? true : false}
              setnotrequired={value => {
                setaService({ ...aService, ARS_LAS_ET_C: value ? 1 : 0 })
              }}
              disabled={aService.ARS_LAS_REQ}
              label={'End Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_LAS_ET");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_LAS_ET")}
              size={12}
              type={'time'}
              data={aService.ARS_LAS_ET}
              index={12}
            />
            <LabelledInput
              disabled={aService.ARS_LAS_REQ}
              label={'Remarks'} //mark
              data={aService.ARS_LAS_REM}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                setaService({ ...aService, ARS_LAS_REM: text });
              }}
              multiline={false}
              numberOfLines={1}
            />
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
              <TouchableOpacity
                onPress={event => {
                  setaService({ ...aService, ARS_RUS_REQ: aService.ARS_RUS_REQ == 1 ? 0 : 1, ARS_RUS_CT: "", ARS_RUS_REM: "" })
                }}>
                <Icons
                  name={
                    aService.ARS_RUS_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aService.ARS_RUS_REQ == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <DateTimeInput
              disabled={aService.ARS_RUS_REQ}
              label={'Completion Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_RUS_CT");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_RUS_CT")}
              size={12}
              type={'time'}
              data={aService.ARS_RUS_CT}
              index={12}
            />
            <LabelledInput
              disabled={aService.ARS_RUS_REQ}
              label={'Remarks'} //mark
              data={aService.ARS_RUS_REM}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                setaService({ ...aService, ARS_RUS_REM: text });
              }}
              multiline={false}
              numberOfLines={1}
            />
            {/* <Text style={styleSheet.label}>Completion Time (Local Time)</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                <Text style={{ fontSize: 20, color: 'black' }}>
                  {arrival[29] ? arrival[29] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={arrival[31].checked}
                onPress={() => setNow(29)}
                style={{ padding: 10 }}>
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
            </View> */}
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
              <TouchableOpacity
                onPress={event => {
                  setaService({ ...aService, ARS_FOA_REQ: aService.ARS_FOA_REQ == 1 ? 0 : 1, ARS_FOA_FTAT: "", ARS_FOA_START: "", ARS_FOA_END: "", ARS_FOA_REM: "" })
                }}>
                <Icons
                  name={
                    aService.ARS_FOA_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aService.ARS_FOA_REQ == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <DateTimeInput
              disabled={aService.ARS_FOA_REQ}
              label={'Fuel Truck Arrival Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_FOA_FTAT");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_FOA_FTAT")}
              size={12}
              type={'time'}
              data={aService.ARS_FOA_FTAT}
              index={12}
            />
            <DateTimeInput
              disabled={aService.ARS_FOA_REQ}
              label={'Start Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_FOA_START");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_FOA_START")}
              size={12}
              type={'time'}
              data={aService.ARS_FOA_START}
              index={12}
            />
            <DateTimeInput
              disabled={aService.ARS_FOA_REQ}
              label={'End Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_FOA_END");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_FOA_END")}
              size={12}
              type={'time'}
              data={aService.ARS_FOA_END}
              index={12}
            />


            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text style={styleSheet.label}>Fuel Receipt (signed)</Text>
              <TouchableOpacity
                disabled={aService.ARS_FOA_REQ ? true : false}
                onPress={event => {
                  //onPressDocPreA(35)
                  setuploadSection('ARS_FOA_FR_String');
                  refRBSheet.current.open();
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: aService.ARS_FOA_REQ
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{ color: 'green' }}>Upload</Text>
              </TouchableOpacity>
            </View>
            {aService.ARS_FOA_FR_String && aService.ARS_FOA_FR_String.map((val, indexxx) => {
              return (<TouchableOpacity
                onPress={() => {
                  if (val.split(",")[0].startsWith('data:image')) {
                    setimageVisible(true);
                    setshowImage(val);
                  }
                  else {
                    saveFile(val, `ARS_FOA_FR_DOCUMENT` + indexxx)
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
                <Text style={{ color: 'black' }}>{`ARS_FOA_FR_DOCUMENT` + indexxx}</Text>
                <TouchableOpacity onPress={() => removeFilePreA('ARS_FOA_FR_String', indexxx)}>
                  <Icons
                    style={{ color: 'green', marginLeft: 10 }}
                    name="close"
                    size={30}
                  />
                </TouchableOpacity>
              </TouchableOpacity>)
            })}
            <LabelledInput
              disabled={aService.ARS_FOA_REQ}
              label={'Remarks'} //mark
              data={aService.ARS_FOA_REM}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                setaService({ ...aService, ARS_FOA_REM: text });
              }}
              multiline={false}
              numberOfLines={1}
            />
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
              <TouchableOpacity
                onPress={event => {
                  setaService({ ...aService, ARS_TOS_REQ: aService.ARS_TOS_REQ == 1 ? 0 : 1, ARS_TOS_START: "", ARS_TOS_END: "", ARS_TOS_REM: "" })
                }}>
                <Icons
                  name={
                    aService.ARS_TOS_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aService.ARS_TOS_REQ == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <DateTimeInput
              disabled={aService.ARS_TOS_REQ}
              label={'Start Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_TOS_START");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_TOS_START")}
              size={12}
              type={'time'}
              data={aService.ARS_TOS_START}
              index={12}
            />
            <DateTimeInput
              disabled={aService.ARS_TOS_REQ}
              label={'End Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_TOS_END");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_TOS_END")}
              size={12}
              type={'time'}
              data={aService.ARS_TOS_END}
              index={12}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text style={styleSheet.label}>Photo (if required)</Text>
              <TouchableOpacity
                disabled={aService.ARS_TOS_REQ ? true : false}
                //onPress={event => onPressDocPreA(40)}
                onPress={() => {
                  setuploadSection('ARS_TOS_PHOTO_STring');
                  refRBSheet.current.open();
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: aService.ARS_TOS_REQ
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{ color: 'green' }}>Upload</Text>
              </TouchableOpacity>
            </View>
            {aService.ARS_TOS_PHOTO_STring && aService.ARS_TOS_PHOTO_STring.map((val, indexxx) => {
              return (<TouchableOpacity
                onPress={() => {
                  if (val.split(",")[0].startsWith('data:image')) {
                    setimageVisible(true);
                    setshowImage(val);
                  }
                  else {
                    saveFile(val, `ARS_TOS_PHOTO_DOCUMENT` + indexxx)

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
                <Text style={{ color: 'black' }}>{`ARS_TOS_PHOTO_DOCUMENT` + indexxx}</Text>
                <TouchableOpacity onPress={() => removeFilePreA('ARS_TOS_PHOTO_STring', indexxx)}>
                  <Icons
                    style={{ color: 'green', marginLeft: 10 }}
                    name="close"
                    size={30}
                  />
                </TouchableOpacity>
              </TouchableOpacity>)
            })}
            <LabelledInput
              disabled={aService.ARS_TOS_REQ}
              label={'Remarks'} //mark
              data={aService.ARS_TOS_REM}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                setaService({ ...aService, ARS_TOS_REM: text });
              }}
              multiline={false}
              numberOfLines={1}
            />
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
              <TouchableOpacity
                onPress={event => {
                  setaService({ ...aService, ARS_OVB_REQ: aService.ARS_OVB_REQ == 1 ? 0 : 1, ARS_OVB_NUMBER: "" })
                }}>
                <Icons
                  name={
                    aService.ARS_OVB_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aService.ARS_OVB_REQ == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <LabelledInput
              disabled={aService.ARS_OVB_REQ}
              label={'Number'} //mark
              data={aService.ARS_OVB_NUMBER}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                setaService({ ...aService, ARS_OVB_NUMBER: text });
              }}
              multiline={false}
              numberOfLines={1}
            />
          </View>

          {/* ---------------------------Catering Equipment Cleaning-----------------------*/}

          <Text style={styleSheet.label}>Catering Equipment Cleaning:</Text>
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
              <TouchableOpacity
                onPress={event => {
                  setaService({ ...aService, ARS_CEC_REQ: aService.ARS_CEC_REQ == 1 ? 0 : 1, ARS_CEC_REM: "" })
                }}>
                <Icons
                  name={
                    aService.ARS_CEC_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aService.ARS_CEC_REQ == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
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
                disabled={aService.ARS_CEC_REQ ? true : false}
                //onPress={event => onPressDocPreA(40)}
                onPress={() => {
                  setuploadSection('ARS_CEC_PHOTO_STring');
                  refRBSheet.current.open();
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: aService.ARS_CEC_REQ == 1
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{ color: 'green' }}>Upload</Text>
              </TouchableOpacity>
            </View>
            {aService.ARS_CEC_PHOTO_STring && aService.ARS_CEC_PHOTO_STring.map((val, indexxx) => {
              return (<TouchableOpacity
                onPress={() => {
                  if (val.split(",")[0].startsWith('data:image')) {
                    setimageVisible(true);
                    setshowImage(val);
                  }
                  else {
                    saveFile(val, `ARS_CEC_PHOTO_DOCUMENT` + indexxx)

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
                <Text style={{ color: 'black' }}>{`ARS_CEC_PHOTO_DOCUMENT` + indexxx}</Text>
                <TouchableOpacity onPress={() => removeFilePreA('ARS_CEC_PHOTO_STring', indexxx)}>
                  <Icons
                    style={{ color: 'green', marginLeft: 10 }}
                    name="close"
                    size={30}
                  />
                </TouchableOpacity>
              </TouchableOpacity>)
            })}
            <LabelledInput
              disabled={aService.ARS_CEC_REQ}
              label={'Remarks'} //mark
              data={aService.ARS_CEC_REMARKS}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                setaService({ ...aService, ARS_CEC_REMARKS: text });
              }}
              multiline={false}
              numberOfLines={1}
            />
          </View>

          {/* ---------------------------Laundry Cleaning-----------------------*/}

          <Text style={styleSheet.label}>Laundry Cleaning:</Text>
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
              <TouchableOpacity
                onPress={event => {
                  setaService({ ...aService, ARS_LC_NR: aService.ARS_LC_NR == 1 ? 0 : 1, ARS_LC_REM: "" })
                }}>
                <Icons
                  name={
                    aService.ARS_LC_NR == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aService.ARS_LC_NR == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
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
                disabled={aService.ARS_LC_NR == 1 ? true : false}
                //onPress={event => onPressDocPreA(40)}
                onPress={() => {
                  setuploadSection('ARS_LC_PHOTO_STring');
                  refRBSheet.current.open();
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: aService.ARS_LC_NR == 1
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{ color: 'green' }}>Upload</Text>
              </TouchableOpacity>
            </View>
            {aService.ARS_LC_PHOTO_STring && aService.ARS_LC_PHOTO_STring.map((val, indexxx) => {
              return (<TouchableOpacity
                onPress={() => {
                  if (val.split(",")[0].startsWith('data:image')) {
                    setimageVisible(true);
                    setshowImage(val);
                  }
                  else {
                    saveFile(val, `ARS_LC_PHOTO_DOCUMENT` + indexxx)
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
                <Text style={{ color: 'black' }}>{`ARS_LC_PHOTO_DOCUMENT` + indexxx}</Text>
                <TouchableOpacity onPress={() => removeFilePreA('ARS_LC_PHOTO_STring', indexxx)}>
                  <Icons
                    style={{ color: 'green', marginLeft: 10 }}
                    name="close"
                    size={30}
                  />
                </TouchableOpacity>
              </TouchableOpacity>)
            })}
            <LabelledInput
              disabled={aService.ARS_LC_NR == 1 ? true : false}
              label={'Remarks'} //mark
              data={aService.ARS_LC_REMARKS}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                setaService({ ...aService, ARS_LC_REMARKS: text });
              }}
              multiline={false}
              numberOfLines={1}
            />
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
              label={'Left Aircraft (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_CRM_CDA");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_CRM_CDA")}
              size={12}
              type={'time'}
              data={aService.ARS_CRM_CDA}
            />
            <DateTimeInput
              label={'Crew Arrived at Terminal (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_CRM_CAT");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_CRM_CAT")}
              size={12}
              type={'time'}
              data={aService.ARS_CRM_CAT}
            />


            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={event => setaService({ ...aService, ARS_CRM_CVA: aService.ARS_CRM_CVA == 1 ? 0 : 1 })}>
                <Icons
                  name={
                    aService.ARS_CRM_CVA == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aService.ARS_CRM_CVA == 1 ? 'green' : 'black'}
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
              <TouchableOpacity onPress={event => setaService({ ...aService, ARS_CRM_CVOA: aService.ARS_CRM_CVOA == 1 ? 0 : 1 })}>
                <Icons
                  name={
                    aService.ARS_CRM_CVOA == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aService.ARS_CRM_CVOA == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>VOA Not Required</Text>
            </View>
            <DateTimeInput
              label={'Crew Completed CIQ (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'aService', "ARS_CRM_CCIQ");
              }}
              setNowPostDepart={() => setNow(0, 'aService', "ARS_CRM_CCIQ")}
              size={12}
              type={'time'}
              data={aService.ARS_CRM_CCIQ}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => addCrewMovement(true)}
                style={[styleSheet.button]}>
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  Add Movement
                </Text>
              </TouchableOpacity>
            </View>
            {crewmovement.map((val, index) => {
              return (
                <View key={index} style={{ marginTop: 20 }}>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'rgba(0,0,0,0.4)',
                      marginBottom: 20,
                    }}></View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity
                      style={styleSheet.label}
                      onPress={() => removeCrewMovement(index)}>
                      <Icons name="minus-box-outline" color="red" size={30} />
                    </TouchableOpacity>
                  </View>

                  <DateTimeInput
                    label={'Actual Transport Arrival Time at Airport (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', index, 'crewmovement', "ARS_PM_ATAT");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...crewmovement];
                      tcheckList[index].ARS_PM_ATAT = x
                      setcrewmovement([...tcheckList]);
                    }}
                    size={12}
                    type={'time'}
                    data={val.ARS_PM_ATAT}
                    index={12}
                  />
                  <DateTimeInput
                    label={'Left Terminal (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', index, 'crewmovement', "ARS_PM_PDFT");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...crewmovement];
                      tcheckList[index].ARS_PM_PDFT = x
                      setcrewmovement([...tcheckList]);
                    }}
                    size={12}
                    type={'time'}
                    data={val.ARS_PM_PDFT}
                    index={12}
                  />

                  <LabelledInput
                    label={'Remarks'} //mark
                    data={val.ARS_PM_REMARK}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      var tcheckList = [...crewmovement];
                      tcheckList[index].ARS_PM_REMARK = text
                      setcrewmovement([...tcheckList]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                </View>
              );
            })}
          </View>
          {/** CREW MOVE END
           */}
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={mode}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
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
    </View>
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
