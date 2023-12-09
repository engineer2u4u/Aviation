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
  Alert,
  Modal,
  Image
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, { useRef, useState, useEffect } from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import RBSheet from 'react-native-raw-bottom-sheet';
import LabelledInput from '../subcomponents/Forms/universal/labelledinput';
import DateTimeInput from '../subcomponents/Forms/universal/datetimeinput';
import { ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { getDomain } from '../constants/env';
import Header from '../subcomponents/Forms/Header';

const { height, width } = Dimensions.get('window');

export default function Departure(props) {
  const FUID = props.route.params.UID;
  const [formReady, setformReady] = useState(true);
  const [imageVisible, setimageVisible] = useState(false);
  const [showImage, setshowImage] = useState(null);
  const currentDepart = useRef(0);
  const refRBSheet = useRef();
  const timerDate = useRef(new Date());

  const [uploadSection, setuploadSection] = useState(0);

  const [loading, setloading] = useState(false);
  const [crewTransport, setcrewTransport] = useState([]);
  const [paxTransport, setpaxTransport] = useState([]);

  const [uid, setuid] = useState(null);

  const [paxarrivaltimeaddedactive, setpaxarrivaltimeaddedactive] = useState(
    [],
  );

  const [mode, setMode] = useState('time');
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
  const [aDeparture, setaDeparture] = useState({ "DES_DS_NAME": null, "CREATED_BY": "", "CREATED_DATE": "", "DES_ARB": "", "DES_BAG_OFFLOAD": null, "DES_BAG_PHOTO": "", "DES_CREW": null, "DES_CRM_FDHC": "", "DES_CRM_MAP": "", "DES_CRM_REM": "", "DES_CRM_TAT": "", "DES_CRM_TCAT": "", "DES_CRM_TCBA": "", "DES_CRM_TCBT": "", "DES_CRM_TCBTA": "", "DES_CRM_TCCAS": "", "DES_CRM_TCCIQ": "", "DES_CRM_TRAVELTIME": "", "DES_CTR_CDT": "", "DES_CTR_EQUIP": "", "DES_CTR_EQUIP": "", "DES_CTR_REM": "", "DES_CTR_REQ": 0, "DES_DCT": "", "DES_DS_CONTACT_NO": "", "DES_DS_NAME": "", "DES_FOD_END": "", "DES_FOD_RECEIPT": "", "DES_FOD_REM": "", "DES_FOD_REQ": 0, "DES_FOD_START": "", "DES_FOD_TFTA": "", "DES_GPU_REQ": 0, "DES_GPU_START": "", "DES_GPU_STOP": "", "DES_LAS_CT": "", "DES_LAS_ET": "", "DES_LAS_REM": "", "DES_LAS_REQ": 0, "DES_MVN_CHOCKS": "", "DES_MVN_PUSH": "", "DES_MVN_REM": "", "DES_MVN_TAKE": "", "DES_PAX": null, "DES_PXM_CIPAD": "", "DES_PXM_PAT": "", "DES_PXM_PPT": "", "DES_PXM_PPT_REQ": 0, "DES_PXM_REFUND": "", "DES_PXM_REM": "", "DES_PXM_TPBA": "", "DES_PXM_TPBTA": "", "DES_PXM_TPCAS": "", "DES_PXM_TPCIQ": "", "DES_REM": "", "DES_RUS_CT": "", "DES_RUS_REM": "", "DES_RUS_REQ": 0, "DES_WAS_CT": "", "DES_WAS_ET": "", "DES_WAS_REM": "", "DES_WAS_REQ": 0, "FUID": "", "LAST_UPDATE": "", "STATUS": 0, "UID": "", "UPDATE_BY": "" })
  const [paxmovement, setpaxmovement] = useState([]);
  const [crewmovement, setcrewmovement] = useState([]);

  const [isDatePickerVisibleDepart, setDatePickerVisibilityDepart] =
    useState(false);
  const showDatePickerDepart = (type, index, arr, pos) => {
    currentDepart.current = [index, arr, pos];
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
      `${domain}/GetDepartureServices?_token=84BF3586-E3FF-4125-BBDA-E8F413471C82&_opco=&_fuid=${FUID}&_uid=`,
      requestOptions,
    )
      .then(response => response.text())
      .then(response => {
        // console.log(response)
        var packet = JSON.parse(response);
        console.log(packet, 'res');
        var res = [...packet.Table];

        if (res.length > 0) {
          console.log(res[0]);
          setaDeparture(res[0]);
          setuid(res[0].UID);


          fetch(
            `${domain}/GetDepartureServicesFiles?_token=CDAC498B-116F-4346-AD72-C3F65A902FFD&_opco=&_fuid=${FUID}&_uid=${res[0].UID}`,
            requestOptions,
          )
            .then(response => response.text())
            .then(result => {
              setcallLoad(false);
              try {
                var packet = JSON.parse(result);
                console.log('Files', packet);
                var temp = { ...res[0] };
                temp.POD_FOD_FR_String = packet.POD_FOD_FR_String;
                temp.POD_CT_CEL_String = packet.POD_CT_CEL_String;
                temp.POD_BG_PHOTO_String = packet.POD_BG_PHOTO_String;
                setaDeparture({ ...temp })
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
          // setcallLoad(false);
          console.log('Movement', `${domain}/GetDepartureServicesMovement?_token=5A501247-C3F2-48AD-B761-F317C8A0F232&_opco=&_fuid=${FUID}&_uid=`)
          fetch(
            `${domain}/GetDepartureServicesMovement?_token=5A501247-C3F2-48AD-B761-F317C8A0F232&_opco=&_fuid=${FUID}&_uid=`,
            requestOptions,
          )
            .then(response => response.text())
            .then(response => {
              //get pax & crew transport

              var packet = JSON.parse(response);
              var res = packet.Table;
              console.log('Movement', res);
              if (res && res.length > 0) {

                var paxmov = [];
                var crewmov = [];
                res.forEach((val, index) => {
                  if (val.STATUS != 5) {
                    if (val.DES_TYPE == 'Pax') {
                      paxmov.push(val);

                    } else {
                      crewmov.push(val);
                    }
                  }
                });
                setpaxmovement([...paxmov]);
                setcrewmovement([...crewmov]);
                var apaxTransport = [];
                var acrewTransport = [];
                res.forEach((val, index) => {
                  if (val.STATUS != 5) {
                    if (val.DES_TYPE == 'Pax') {
                      apaxTransport.push(val);
                    } else {
                      acrewTransport.push(val);
                    }
                  }
                });
                setcallLoad(false);
                setcrewTransport([...acrewTransport]);
                setpaxTransport([...apaxTransport]);
              } else {
                setcallLoad(false);
              }
            })
            .catch(error => {
              setcallLoad(false);
              console.log(error, 'Function error');
            });
        }
        else {
          setcallLoad(false);
          // setaDeparture({})
        }
      })
      .catch(error => {
        setcallLoad(false);
        console.log(error, 'Function error');
      });
  }


  const handleConfirm = date => {
    console.log(currentDepart.current[1])
    switch (currentDepart.current[1]) {
      case 'crewTransport':
        var tcheckList = [...crewTransport];
        tcheckList[currentDepart.current[0]][
          currentDepart.current[2]
        ] = tConvert(
          new Date(date).toLocaleString('en-US', {
            hour12: false,
          }),
        );
        console.log(tcheckList)
        setcrewTransport([...tcheckList]); break;
      case 'paxTransport':
        var tcheckList = [...paxTransport];
        tcheckList[currentDepart.current[0]][
          currentDepart.current[2]
        ] = tConvert(
          new Date(date).toLocaleString('en-US', {
            hour12: false,
          }),
        );
        setpaxTransport([...tcheckList]); break;

      case 'aDeparture':
        console.log('aDeparture me aya')
        var tcheckList = { ...aDeparture };
        tcheckList[
          currentDepart.current[2]
        ] = tConvert(
          new Date(date).toLocaleString('en-US', {
            hour12: false,
          }),
        );
        console.log("datetimeset", tcheckList)
        setaDeparture({ ...tcheckList }); break;
    }
    hideDatePickerDepart();
  };

  const removeFilePreA = (arrayIndex, index) => {
    var temp = { ...aDeparture };
    temp[arrayIndex].splice(index, 1);
    setaDeparture({ ...temp });
  };

  const addCrewTransport = () => {
    const email = auth().currentUser.email;
    var tcrewTransport = [...crewTransport];
    tcrewTransport.push({
      DES_CRM_TAT: '',
      DES_CRM_TCBT: '',
      DES_CRM_TCAT: '',
      DES_CRM_REM: '',
      DES_TYPE: 'Crew',
      UID: '',
      STATUS: 0,
      FUID: FUID,
      UPDATE_BY: email,
    });
    console.log(tcrewTransport);
    setcrewTransport([...tcrewTransport]);
  };
  const [deleteService, setdeleteService] = useState([]);

  const onRemoveCrewTransport = index => {
    var service = [...crewTransport];
    var delService = service.splice(index, 1);
    setcrewTransport([...service]);
    if (delService[0].UID) {
      setdeleteService([...deleteService, { UID: delService[0].UID, TableName: 'DEPARTURESERVICES' }]);
    }
  };


  const onPressDocPreA_New = async (index, res) => {
    setloading(false);
    RNFetchBlob.fs
      .readFile(res.uri, 'base64')
      .then(encoded => {
        // console.log(encoded, 'reports.base64');
        setloading(false);
        var temp = { ...aDeparture };
        temp[uploadSection] ? temp[uploadSection].push('data:' + res.type + ';base64,' + encoded) : temp[uploadSection] = ['data:' + res.type + ';base64,' + encoded];
        setaDeparture({ ...temp })
      })
      .catch(error => {
        setloading(false);
        console.log(error);
      });
    refRBSheet.current.close();
  };
  //mark
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
          const file = result.assets[0];
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

  const addpaxTransport = () => {
    const email = auth().currentUser.email;
    var tcpaxTransport = [...paxTransport];
    tcpaxTransport.push({
      DES_CRM_TAT: '',
      DES_CRM_TCBT: '',
      DES_CRM_TCAT: '',
      DES_CRM_REM: '',
      DES_TYPE: 'Pax',
      UID: '',
      STATUS: 0,
      FUID: FUID,
      UPDATE_BY: email,
    });
    console.log(tcpaxTransport);
    setpaxTransport([...tcpaxTransport]);
  };
  const onRemovePaxTransport = index => {
    var service = [...paxTransport];
    var delService = service.splice(index, 1);
    setpaxTransport([...service]);
    if (delService[0].UID) {
      setdeleteService([...deleteService, { UID: delService[0].UID, TableName: 'DEPARTURESERVICES' }]);
    }

  };
  const [callLoad, setcallLoad] = useState(false);
  const sendForm = () => {
    var domain = getDomain();
    setcallLoad(true);
    const email = auth().currentUser.email;
    const payload = {
      ...aDeparture,
      STATUS: 0,
      UID: uid ? uid : '',
      FUID: FUID,
      UPDATE_BY: email,
    };
    console.log(payload, 'payload');
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(payload)
    };
    fetch(
      `${domain}/PostDepartureServices`,
      requestOptions,
    )
      .then(response => response.text())
      .then(response => {
        console.log('paxTransport', paxTransport.concat(crewTransport));
        // paxTransport.map(val => {

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(paxTransport.concat(crewTransport))
        };
        fetch(
          `${domain}/PostDepartureMovement`,
          requestOptions,
        )
          .then(response => response.text())
          .then(response => {
            Alert.alert('Success');
            readData();
            setcallLoad(false);
            console.log('movement', response);
          })
          .catch(error => {
            Alert.alert('Error in updation');
            setcallLoad(false);
            console.log(error, 'Function error');
          });
        Alert.alert('Success');
        setcallLoad(false);
        console.log(response);
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
    <View>
      <Header
        headingSize={width / 15}
        heading={'Departure'}
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
      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 20,
        }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'black',
            paddingLeft: 20,
          }}>
          Departure
        </Text>
        {callLoad ? (
          <View style={{ paddingRight: 20 }}>
            <ActivityIndicator color="green" size={'small'} />
          </View>
        ) : (
          <TouchableOpacity onPress={sendForm} style={{ marginRight: 20 }}>
            <Icons name="content-save" color="green" size={30} />
          </TouchableOpacity>
        )}
      </View> */}
      <ScrollView>
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
              data={aDeparture.DES_DS_NAME}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                // setaService({ ...aService, DES_DS_NAME: text });
                setaDeparture({ ...aDeparture, DES_DS_NAME: text });
              }}
              multiline={false}
              numberOfLines={1}
            />
            <LabelledInput
              disabled={false}
              label={'Contact No.'} //mark
              data={aDeparture.DES_DS_CONTACT_NO}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                setaDeparture({ ...aDeparture, DES_DS_CONTACT_NO: text });
              }}
              multiline={false}
              numberOfLines={1}
            />
            <LabelledInput
              disabled={false}
              label={'No. of Crew'} //mark
              data={aDeparture.DES_CREW}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                setaDeparture({ ...aDeparture, DES_CREW: text });
              }}
              multiline={false}
              numberOfLines={1}
            />
          </View>

          {/* <Text style={styleSheet.label}>No. of Crew</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={styleSheet.input}
              value={aDeparture.DES_CREW}
              onChangeText={text => {
                setaDeparture({ ...aDeparture, DES_CREW: text });

              }}
            />
          </View> */}
          {/*   ------------------------------Crew Movement	 ----------- */}
          <Text style={[styleSheet.label, { marginTop: 10 }]}>
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

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={addCrewTransport}
                style={[styleSheet.button]}>
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  Add Movement
                </Text>
              </TouchableOpacity>
            </View>
            {crewTransport.map((val, index) => {
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
                      onPress={() => onRemoveCrewTransport(index)}>
                      <Icons name="minus-box-outline" color="red" size={30} />
                    </TouchableOpacity>
                  </View>
                  <DateTimeInput
                    label={
                      'Actual Transport Arrival Time at Pickup Location (Local Time)'
                    }
                    showDatePickerPostDepart={() => {
                      showDatePickerTrans('time', index, 'DES_CRM_TAT');
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...crewTransport];
                      tcheckList[index].DES_CRM_TAT = x
                      setcrewTransport([...tcheckList]);
                    }}
                    notrequiredSection={true}
                    isnotrequired={crewTransport[index].DES_CRM_NRTAT == 1 ? true : false}
                    setnotrequired={value => {
                      var tcheckList = [...crewTransport];
                      tcheckList[index].DES_CRM_NRTAT = value ? 1 : 0;
                      setcrewTransport([...tcheckList]);
                    }}
                    size={12}
                    added={true}
                    type={'time'}
                    data={val.DES_CRM_TAT}
                    index={index}
                  />
                  <DateTimeInput
                    label={
                      'Time Crew Boarded Transport at Pickup Location (Local Time)'
                    }
                    showDatePickerPostDepart={() => {
                      console.log('TCBT')
                      showDatePickerTrans('time', index, 'DES_CRM_TCBT');
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...crewTransport];
                      tcheckList[index].DES_CRM_TCBT = x
                      setcrewTransport([...tcheckList]);
                    }}
                    notrequiredSection={true}
                    isnotrequired={crewTransport[index].DES_CRM_NRTCBT == 1 ? true : false}
                    setnotrequired={value => {
                      var tcheckList = [...crewTransport];
                      tcheckList[index].DES_CRM_NRTCBT = value ? 1 : 0;
                      setcrewTransport([...tcheckList]);
                    }}
                    size={12}
                    added={true}
                    type={'time'}
                    data={val.DES_CRM_TCBT}
                    index={index}
                  />

                  <DateTimeInput
                    label={'Time Crew Arrived at Terminal (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePickerTrans('time', index, 'DES_CRM_TCAT');
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...crewTransport];
                      tcheckList[index].DES_CRM_TCAT = x
                      setcrewTransport([...tcheckList]);
                    }}
                    size={12}
                    added={true}
                    type={'time'}
                    data={val.DES_CRM_TCAT}
                    index={index}
                  />
                  <LabelledInput
                    label={'Remarks'} //mark
                    data={val.DES_CRM_REM}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      var tcheckList = [...crewTransport];
                      tcheckList[index].DES_CRM_REM = text
                      setcrewTransport([...tcheckList]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={event => {
                  setaDeparture({ ...aDeparture, DES_CRM_FDHC_C: aDeparture.DES_CRM_FDHC_C == 1 ? 0 : 1, DES_CRM_FDHC: "", DES_CRM_TCCIQ: "", DES_CRM_TCCAS: "", DES_CRM_TCBTA: "", DES_CRM_TCBA: "", })
                }}>
                <Icons
                  name={
                    aDeparture.DES_CRM_FDHC_C == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aDeparture.DES_CRM_FDHC_C == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={event => {
                  setaDeparture({ ...aDeparture, DES_CRM_C: aDeparture.DES_CRM_C == 1 ? 0 : 1 })
                }}>
                <Icons
                  name={
                    aDeparture.DES_CRM_C == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aDeparture.DES_CRM_C == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Completed</Text>
            </View>
            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={event => {
                  setaDeparture({ ...aDeparture, DES_CRM_FDHC_C: aDeparture.DES_CRM_FDHC_C == 1 ? 0 : 1 })
                }}>
                <Icons
                  name={
                    aDeparture.DES_CRM_FDHC_C == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aDeparture.DES_CRM_FDHC_C == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Completed</Text>
            </View> */}
            <DateTimeInput
              disabled={aDeparture.DES_CRM_FDHC_C}
              label={'Flight Documents Handover to Crew (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_CRM_FDHC");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_CRM_FDHC = x
                setaDeparture({ ...tcheckList });
              }}
              // notrequiredSection={true}
              // isnotrequired={aDeparture.DES_CRM_FDHC_C == 1 ? true : false}
              // setnotrequired={value => {
              //   var tcheckList = { ...aDeparture };
              //   tcheckList.DES_CRM_FDHC_C = value ? 1 : 0;
              //   setaDeparture({ ...tcheckList });
              // }}
              size={12}
              type={'time'}
              data={aDeparture.DES_CRM_FDHC}
              index={12}
            />
            <DateTimeInput
              disabled={aDeparture.DES_CRM_FDHC_C}
              label={'Time Crew Cleared CIQ (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_CRM_TCCIQ");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_CRM_TCCIQ = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_CRM_TCCIQ}
              index={12}
            />
            <DateTimeInput
              disabled={aDeparture.DES_CRM_FDHC_C}
              label={'Time Crew Cleared Airport Security (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_CRM_TCCAS");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_CRM_TCCAS = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_CRM_TCCAS}
              index={12}
            />
            <DateTimeInput
              disabled={aDeparture.DES_CRM_FDHC_C}
              label={'Time Crew Boarded Transport to Aircraft (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_CRM_TCBTA");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_CRM_TCBTA = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_CRM_TCBTA}
              index={12}
            />
            <DateTimeInput
              disabled={aDeparture.DES_CRM_FDHC_C}
              label={'Time Crew Boarded Aircraft (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_CRM_TCBA");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_CRM_TCBA = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_CRM_TCBA}
              index={12}
            />
            <LabelledInput
              label={'Remarks'} //mark
              data={aDeparture.DES_CRM_REM}
              datatype={'text'}
              index={57}
              setText={(index, text, type, section) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_CRM_REM = text
                setaDeparture({ ...tcheckList });
              }}
              multiline={true}
              numberOfLines={2}
            />
          </View>
          {/*   ------------------------------Crew Movement	 End ----------- */}

          {/*   ------------------------------Ground Power Unit(GPU) start ----------- */}
          <Text style={[styleSheet.label, { marginTop: 10 }]}>
            Ground Power Unit (GPU):
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
              <TouchableOpacity
                onPress={event => {
                  setaDeparture({ ...aDeparture, DES_GPU_REQ: aDeparture.DES_GPU_REQ == 1 ? 0 : 1, DES_GPU_START: "", DES_GPU_STOP: "" });
                  console.log(aDeparture.DES_GPU_REQ);
                }}>
                <Icons
                  name={
                    aDeparture.DES_GPU_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aDeparture.DES_GPU_REQ == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={event => {
                  setaDeparture({ ...aDeparture, DES_GPU_C: aDeparture.DES_GPU_C == 1 ? 0 : 1 })
                }}>
                <Icons
                  name={
                    aDeparture.DES_GPU_C == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aDeparture.DES_GPU_C == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Completed</Text>
            </View>
            <DateTimeInput
              disabled={aDeparture.DES_GPU_REQ == 1 ? true : false}
              label={'Start Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_GPU_START");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_GPU_START = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_GPU_START}
              index={12}
            />
            <DateTimeInput
              disabled={aDeparture.DES_GPU_REQ == 1 ? true : false}
              label={'Stop Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_GPU_STOP");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_GPU_STOP = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_GPU_STOP}
              index={12}
            />
          </View>
          {/*   ------------------------------Ground Power Unit(GPU) end ----------- */}

          {/*   ------------------------------Fuel on Departure start ----------- */}
          <Text style={[styleSheet.label, { marginTop: 10 }]}>
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
              <TouchableOpacity
                onPress={event => {
                  setaDeparture({ ...aDeparture, DES_FOD_REQ: aDeparture.DES_FOD_REQ == 1 ? 0 : 1, DES_FOD_TFTA: "", DES_FOD_START: "", DES_FOD_END: "", DES_FOD_REM: "", POD_FOD_FR_String: [] });
                }}>
                <Icons
                  name={
                    aDeparture.DES_FOD_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aDeparture.DES_FOD_REQ == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={event => {
                  setaDeparture({ ...aDeparture, DES_FOD_C: aDeparture.DES_FOD_C == 1 ? 0 : 1 })
                }}>
                <Icons
                  name={
                    aDeparture.DES_FOD_C == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aDeparture.DES_FOD_C == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Completed</Text>
            </View>
            <DateTimeInput
              disabled={aDeparture.DES_FOD_REQ == 1 ? true : false}
              label={'Time Fuel Truck Arrived (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_FOD_TFTA");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_FOD_TFTA = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_FOD_TFTA}
              index={12}
            />
            <DateTimeInput
              disabled={aDeparture.DES_FOD_REQ == 1 ? true : false}
              label={'Start Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_FOD_START");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_FOD_START = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_FOD_START}
              index={12}
            />
            <DateTimeInput
              disabled={aDeparture.DES_FOD_REQ == 1 ? true : false}
              label={'End Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_FOD_END");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_FOD_END = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_FOD_END}
              index={12}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 10,

              }}>
              <Text style={styleSheet.label}>
                Fuel Receipt (signed)
              </Text>
              <TouchableOpacity
                //onPress={event => onPressDocPreA(16)}
                onPress={() => {
                  setuploadSection('POD_FOD_FR_String');
                  refRBSheet.current.open();
                }}
                disabled={!aDeparture.DES_FOD_REQ ? false : true}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: aDeparture.DES_FOD_REQ == 1
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{ color: 'green' }}>Take Camera</Text>
              </TouchableOpacity>
            </View>
            {aDeparture.POD_FOD_FR_String && aDeparture.POD_FOD_FR_String.map((val, indexxx) => {
              return (<TouchableOpacity onPress={() => {
                if (val.split(",")[0].startsWith('data:image')) {
                  setimageVisible(true);
                  setshowImage(val);
                }
                else {
                  saveFile(val, `POD_FOD_FR_DOCUMENT` + indexxx)
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
                <Text style={{ color: 'black' }}>{`POD_FOD_FR_DOCUMENT` + indexxx}</Text>
                <TouchableOpacity onPress={() => removeFilePreA('POD_FOD_FR_String', indexxx)}>
                  <Icons
                    style={{ color: 'green', marginLeft: 10 }}
                    name="close"
                    size={30}
                  />
                </TouchableOpacity>
              </TouchableOpacity>)
            })}

            <LabelledInput
              label={'Remarks'} //mark
              disabled={aDeparture.DES_FOD_REQ == 1 ? true : false}
              data={aDeparture.DES_FOD_REM}
              datatype={'text'}
              index={58}
              setText={(index, text, type, section) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_FOD_REM = text;
                setaDeparture({ ...tcheckList });
              }}
              multiline={true}
              numberOfLines={2}
            />
          </View>
          {/*   ------------------------------Fuel on Departure end ----------- */}

          {/*   ------------------------------Water Service ----------- */}
          <Text style={[styleSheet.label, { marginTop: 10 }]}>
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
              <TouchableOpacity
                onPress={event => {
                  setaDeparture({ ...aDeparture, DES_WAS_REQ: aDeparture.DES_WAS_REQ == 1 ? 0 : 1, DES_WAS_CT: "", DES_WAS_ET: "", DES_WAS_REM: '' })
                }}>
                <Icons
                  name={
                    aDeparture.DES_WAS_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aDeparture.DES_WAS_REQ == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={event => {
                  setaDeparture({
                    ...aDeparture, DES_WAS_C
                      : aDeparture.DES_WAS_C
                        == 1 ? 0 : 1
                  })
                }}>
                <Icons
                  name={
                    aDeparture.DES_WAS_C
                      == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aDeparture.DES_WAS_C
                    == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Completed</Text>
            </View>
            <DateTimeInput
              disabled={aDeparture.DES_WAS_REQ == 1 ? true : false}
              label={'Start Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_WAS_CT");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_WAS_CT = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_WAS_CT}
              index={12}
            />
            <DateTimeInput
              disabled={aDeparture.DES_WAS_REQ == 1 ? true : false}
              label={'Stop Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_WAS_ET");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_WAS_ET = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_WAS_ET}
              index={12}
            />
            <LabelledInput
              label={'Remarks'} //mark
              disabled={aDeparture.DES_WAS_REQ == 1 ? true : false}
              data={aDeparture.DES_WAS_REM}
              datatype={'text'}
              index={20}
              setText={(index, text, type, section) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_WAS_REM = text;
                setaDeparture({ ...tcheckList });
              }}
              multiline={true}
              numberOfLines={2}
            />
          </View>
          {/*   ------------------------------Water Service end ----------- */}

          {/*   ------------------------------Lavatory Service ----------- */}
          <Text style={[styleSheet.label, { marginTop: 10 }]}>
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
              <TouchableOpacity
                onPress={event => {
                  setaDeparture({ ...aDeparture, DES_LAS_REQ: aDeparture.DES_LAS_REQ == 1 ? 0 : 1, DES_LAS_CT: "", DES_LAS_ET: "", DES_LAS_REM: '' })
                }}>
                <Icons
                  name={
                    aDeparture.DES_LAS_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aDeparture.DES_LAS_REQ == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={event => {
                  setaDeparture({
                    ...aDeparture, DES_LAS_C
                      : aDeparture.DES_LAS_C
                        == 1 ? 0 : 1
                  })
                }}>
                <Icons
                  name={
                    aDeparture.DES_LAS_C
                      == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aDeparture.DES_LAS_C
                    == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Completed</Text>
            </View>
            <DateTimeInput
              disabled={aDeparture.DES_LAS_REQ == 1 ? true : false}
              label={'Start Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_LAS_CT");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_LAS_CT = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_LAS_CT}
              index={12}
            />
            <DateTimeInput
              disabled={aDeparture.DES_LAS_REQ == 1 ? true : false}
              label={'Stop Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_LAS_ET");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_LAS_ET = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_LAS_ET}
              index={12}
            />
            <LabelledInput
              label={'Remarks'} //mark
              disabled={aDeparture.DES_LAS_REQ == 1 ? true : false}
              data={aDeparture.DES_LAS_REM}
              datatype={'text'}
              index={20}
              setText={(index, text, type, section) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_LAS_REM = text;
                setaDeparture({ ...tcheckList });
              }}
              multiline={true}
              numberOfLines={2}
            />
          </View>
          {/*   ------------------------------Lavatory Service end ----------- */}

          {/*   ------------------------------Rubbish Service ----------- */}
          <Text style={[styleSheet.label, { marginTop: 10 }]}>
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
              <TouchableOpacity
                onPress={event => {
                  setaDeparture({ ...aDeparture, DES_RUS_REQ: aDeparture.DES_RUS_REQ == 1 ? 0 : 1, DES_RUS_CT: "", DES_RUS_REM: "" })
                }}>
                <Icons
                  name={
                    aDeparture.DES_RUS_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aDeparture.DES_RUS_REQ == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={event => {
                  setaDeparture({
                    ...aDeparture, DES_RUS_C
                      : aDeparture.DES_RUS_C
                        == 1 ? 0 : 1
                  })
                }}>
                <Icons
                  name={
                    aDeparture.DES_RUS_C
                      == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aDeparture.DES_RUS_C
                    == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Completed</Text>
            </View>
            <DateTimeInput
              disabled={aDeparture.DES_RUS_REQ == 1 ? true : false}
              label={'Completion Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_RUS_CT");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_RUS_CT = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_RUS_CT}
              index={12}
            />
            <LabelledInput
              label={'Remarks'} //mark
              disabled={aDeparture.DES_RUS_REQ == 1 ? true : false}
              data={aDeparture.DES_RUS_REM}
              datatype={'text'}
              index={20}
              setText={(index, text, type, section) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_RUS_REM = text;
                setaDeparture({ ...tcheckList });
              }}
              multiline={true}
              numberOfLines={2}
            />
          </View>
          {/*   ------------------------------Rubbish Service end ----------- */}

          {/*   ------------------------------Catering ----------- */}
          <Text style={[styleSheet.label, { marginTop: 10 }]}>Catering:</Text>
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
                  setaDeparture({ ...aDeparture, DES_CTR_REQ: aDeparture.DES_CTR_REQ == 1 ? 0 : 1, DES_CTR_EQUIP: "", DES_CTR_CDT: "", DES_CTR_REM: "", POD_CT_CEL_String: [] })
                }}>
                <Icons
                  name={
                    aDeparture.DES_CTR_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aDeparture.DES_CTR_REQ == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={event => {
                  setaDeparture({ ...aDeparture, DES_CRM_C: aDeparture.DES_CRM_C == 1 ? 0 : 1 })
                }}>
                <Icons
                  name={
                    aDeparture.DES_CRM_C == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aDeparture.DES_CRM_C == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Completed</Text>
            </View>
            <LabelledInput
              label={'Catering Equipment Loaded'} //mark
              disabled={aDeparture.DES_CTR_REQ == 1 ? true : false}
              data={aDeparture.DES_CTR_EQUIP}
              datatype={'text'}
              index={20}
              setText={(index, text, type, section) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_CTR_EQUIP = text;
                setaDeparture({ ...tcheckList });
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
              <Text style={[styleSheet.label, { flex: 1 }]}>
                Catering Equipment List / Photo
              </Text>
              <TouchableOpacity
                //onPress={event => onPressDocPreA(16)}
                onPress={() => {
                  setuploadSection('POD_CT_CEL_String');
                  refRBSheet.current.open();
                }}
                disabled={!aDeparture.DES_FOD_REQ ? false : true}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: aDeparture.DES_FOD_REQ == 1
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{ color: 'green' }}>Take Camera</Text>
              </TouchableOpacity>
            </View>
            {aDeparture.POD_CT_CEL_String && aDeparture.POD_CT_CEL_String.map((val, indexxx) => {
              return (<TouchableOpacity onPress={() => {
                if (val.split(",")[0].startsWith('data:image')) {
                  setimageVisible(true);
                  setshowImage(val);
                }
                else {
                  saveFile(val, `POD_CT_CEL_DOCUMENT` + indexxx)

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
                <Text style={{ color: 'black' }}>{`POD_CT_CEL_DOCUMENT` + indexxx}</Text>
                <TouchableOpacity onPress={() => removeFilePreA('POD_CT_CEL_String', indexxx)}>
                  <Icons
                    style={{ color: 'green', marginLeft: 10 }}
                    name="close"
                    size={30}
                  />
                </TouchableOpacity>
              </TouchableOpacity>)
            })}

            <DateTimeInput
              disabled={aDeparture.DES_CTR_REQ == 1 ? true : false}
              label={'Catering Delivery Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_CTR_CDT");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_CTR_CDT = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_CTR_CDT}
              index={12}
            />
            <LabelledInput
              label={'Remarks'} //mark
              disabled={aDeparture.DES_CTR_REQ == 1 ? true : false}
              data={aDeparture.DES_CTR_REM}
              datatype={'text'}
              index={20}
              setText={(index, text, type, section) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_CTR_REM = text;
                setaDeparture({ ...tcheckList });
              }}
              multiline={true}
              numberOfLines={2}
            />


          </View>
          {/*   ------------------------------Catering end ----------- */}
          <DateTimeInput
            label={'Aircraft Ready For Boarding (Local Time)'}
            showDatePickerPostDepart={() => {
              showDatePickerDepart('time', 0, 'aDeparture', "DES_ARB");
            }}
            setNowPostDepart={(indexx, x) => {
              var tcheckList = { ...aDeparture };
              tcheckList.DES_ARB = x
              setaDeparture({ ...tcheckList });
            }}
            size={12}
            type={'time'}
            data={aDeparture.DES_ARB}
            index={12}
          />
          <LabelledInput
            label={'No. of Pax'} //mark
            data={aDeparture.DES_PAX}
            datatype={'text'}
            index={20}
            setText={(index, text, type, section) => {
              var tcheckList = { ...aDeparture };
              tcheckList.DES_PAX = text;
              setaDeparture({ ...tcheckList });
            }}
            multiline={true}
            numberOfLines={1}
          />
          {/*   ------------------------------Baggage ----------- */}
          <Text style={[styleSheet.label, { marginTop: 10 }]}>Baggage:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <LabelledInput
              label={'No. of Baggage Offloaded'} //mark
              data={aDeparture.DES_BAG_OFFLOAD}
              datatype={'text'}
              index={20}
              setText={(index, text, type, section) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_BAG_OFFLOAD = text;
                setaDeparture({ ...tcheckList });
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
                //onPress={event => onPressDocPreA(16)}
                onPress={() => {
                  setuploadSection('POD_BG_PHOTO_String');
                  refRBSheet.current.open();
                }}
                disabled={!aDeparture.DES_FOD_REQ ? false : true}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: aDeparture.DES_FOD_REQ == 1
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{ color: 'green' }}>Take Camera</Text>
              </TouchableOpacity>
            </View>
            {aDeparture.POD_BG_PHOTO_String && aDeparture.POD_BG_PHOTO_String.map((val, indexxx) => {
              return (<TouchableOpacity onPress={() => {
                if (val.split(",")[0].startsWith('data:image')) {
                  setimageVisible(true);
                  setshowImage(val);
                }
                else {
                  saveFile(val, `POD_BG_PHOTO_DOCUMENT` + indexxx)

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
                <Text style={{ color: 'black' }}>{`POD_BG_PHOTO_DOCUMENT` + indexxx}</Text>
                <TouchableOpacity onPress={() => removeFilePreA('POD_BG_PHOTO_String', indexxx)}>
                  <Icons
                    style={{ color: 'green', marginLeft: 10 }}
                    name="close"
                    size={30}
                  />
                </TouchableOpacity>
              </TouchableOpacity>)
            })}
          </View>
          {/*   ------------------------------Baggage end ----------- */}

          {/*   ------------------------------Pax Movement //here ----------- */}
          <Text style={[styleSheet.label, { marginTop: 10 }]}>Pax Movement:</Text>
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
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={addpaxTransport}
                style={[styleSheet.button]}>
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  Add Movement
                </Text>
              </TouchableOpacity>
            </View>
            {paxTransport.map((val, index) => {
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
                      onPress={() => onRemovePaxTransport(index)}>
                      <Icons name="minus-box-outline" color="red" size={30} />
                    </TouchableOpacity>
                  </View>

                  <DateTimeInput
                    label={
                      'Actual Transport Arrival Time at Pickup Location (Local Time)'
                    }
                    notrequiredSection={true}
                    isnotrequired={paxTransport[index].DES_CRM_NRTAT == 1 ? true : false}
                    setnotrequired={value => {
                      var tcheckList = [...paxTransport];
                      tcheckList[index].DES_CRM_NRTAT = value ? 1 : 0;
                      setpaxTransport([...tcheckList]);
                    }}
                    showLabel={true}
                    disabled={paxarrivaltimeaddedactive.includes(index)}
                    showDatePickerPostDepart={() =>
                      showDatePickerPaxTrans('time', index, 'DES_CRM_TAT')
                    }
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...paxTransport];
                      tcheckList[index].DES_CRM_TAT = x
                      setpaxTransport([...tcheckList]);
                    }}
                    added={true}
                    size={12}
                    type={'time'}
                    data={val.DES_CRM_TAT}
                    index={index}
                  />

                  <DateTimeInput
                    label={
                      'Time Pax Boarded Transport at Pickup Location (Local Time)'
                    }
                    notrequiredSection={true}
                    isnotrequired={paxTransport[index].DES_CRM_NRTCBT == 1 ? true : false}
                    setnotrequired={value => {
                      var tcheckList = [...paxTransport];
                      tcheckList[index].DES_CRM_NRTCBT = value ? 1 : 0;
                      setpaxTransport([...tcheckList]);
                    }}
                    disabled={false}
                    showDatePickerPostDepart={() =>
                      showDatePickerPaxTrans('time', index, 'DES_CRM_TCBT')
                    }
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...paxTransport];
                      tcheckList[index].DES_CRM_TCBT = x
                      setpaxTransport([...tcheckList]);
                    }}
                    size={12}
                    type={'time'}
                    data={val.DES_CRM_TCBT}
                    index={index}
                  />

                  <DateTimeInput
                    label={'Time Pax Arrived at Terminal (Local Time)'}
                    disabled={false}
                    showDatePickerPostDepart={() =>
                      showDatePickerPaxTrans('time', index, 'DES_CRM_TCAT')
                    }
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...paxTransport];
                      tcheckList[index].DES_CRM_TCAT = x
                      setpaxTransport([...tcheckList]);
                    }}
                    size={12}
                    type={'time'}
                    data={val.DES_CRM_TCAT}
                    index={index}
                  />
                  <LabelledInput
                    label={'Remarks'} //mark
                    data={val.DES_CRM_REM}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      var tcheckList = [...paxTransport];
                      tcheckList[index].DES_CRM_REM = text
                      setpaxTransport([...tcheckList]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
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
            <DateTimeInput
              label={'Crew Informed of Pax Arrival and Details (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_PXM_CIPAD");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_PXM_CIPAD = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_PXM_CIPAD}
              index={12}
            />
            <DateTimeInput
              label={'VAT/GST Refund Completed (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_PXM_REFUND");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_PXM_REFUND = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_PXM_REFUND}
              index={12}
            />
            <DateTimeInput
              label={'Time Pax Cleared CIQ (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_PXM_TPCIQ");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_PXM_TPCIQ = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_PXM_TPCIQ}
              index={12}
            />
            <DateTimeInput
              label={'Time Pax Cleared Airport Security (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_PXM_TPCAS");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_PXM_TPCAS = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_PXM_TPCAS}
              index={12}
            />
            <DateTimeInput
              label={'Time Pax Boarded Transport to Aircraft (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_PXM_TPBTA");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_PXM_TPBTA = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_PXM_TPBTA}
              index={12}
            />

            <DateTimeInput
              label={'Time Pax Boarded Aircraft (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_PXM_TPBA");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_PXM_TPBA = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_PXM_TPBA}
              index={12}
            />
            <LabelledInput
              label={'Remarks'} //mark
              data={aDeparture.DES_PXM_REM}
              datatype={'text'}
              index={20}
              setText={(index, text, type, section) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_PXM_REM = text;
                setaDeparture({ ...tcheckList });
              }}
              multiline={true}
              numberOfLines={2}
            />

            <DateTimeInput
              label={'Door Close Time (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_DCT");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_DCT = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_DCT}
              index={12}
            />
            <DateTimeInput
              label={'Movement (Chocks Off) (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_MVN_CHOCKS");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_MVN_CHOCKS = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_MVN_CHOCKS}
              index={12}
            />
            <DateTimeInput
              label={'Movement (Push Back) (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_MVN_PUSH");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_MVN_PUSH = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_MVN_PUSH}
              index={12}
            />
            <DateTimeInput
              label={'Movement (Take Off) (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePickerDepart('time', 0, 'aDeparture', "DES_MVN_TAKE");
              }}
              setNowPostDepart={(indexx, x) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_MVN_TAKE = x
                setaDeparture({ ...tcheckList });
              }}
              size={12}
              type={'time'}
              data={aDeparture.DES_MVN_TAKE}
              index={12}
            />
            <LabelledInput
              label={'Remarks'} //mark
              data={aDeparture.DES_MVN_REM}
              datatype={'text'}
              index={20}
              setText={(index, text, type, section) => {
                var tcheckList = { ...aDeparture };
                tcheckList.DES_MVN_REM = text;
                setaDeparture({ ...tcheckList });
              }}
              multiline={true}
              numberOfLines={2}
            />
          </View>
          {/*   ------------------------------Pax Movement end ----------- */}
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisibleDepart}
          mode={mode}
          onConfirm={handleConfirm}
          onCancel={hideDatePickerDepart}
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
      </ScrollView >
    </View >
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
