import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
  Image
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DocumentPicker from 'react-native-document-picker';
import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Feedback from '../Feedback';
import Loader from '../Loader';

import DateTimeInput from '../subcomponents/Forms/universal/datetimeinput';
import LabelledInput from '../subcomponents/Forms/universal/labelledinput';
import TakeCamera from '../subcomponents/Forms/takecamera';
import Header from '../subcomponents/Forms/Header';
import { firebase } from '@react-native-firebase/functions';
import auth from '@react-native-firebase/auth';
import { SERVER_URL, getDomain } from '../constants/env';

const { width, height } = Dimensions.get('window');
const HeadingTextSize = width / 15;

export default function PreDepartureChecklist(props) {
  const FUID = props.route.params.UID;
  const refRBSheet = useRef();
  const timerDate = useRef(new Date());
  const [uid, setuid] = useState(null);
  const currentPicker = useRef(0);
  const [imageVisible, setimageVisible] = useState(false);
  const [showImage, setshowImage] = useState(null);
  const [uploadSection, setuploadSection] = useState(0);
  const [uploadaddedSection, setuploadAddedSection] = useState(false);
  const [uploadaddedSectionindex, setuploadAddedSectionindex] = useState(false);
  const [deleteService, setdeleteService] = useState([]);
  const [pdaddmovement, setpdaddmovement] = useState(false);
  const [pdaddmovementnum, setpdaddmovementnum] = useState(0);
  const [paxpdaddmovement, setpaxpdaddmovement] = useState(false);
  const [paxpdaddmovementnum, setpaxpdaddmovementnum] = useState(0);
  const [activeSection, setactiveSection] = useState('crew');

  const [vFeedback, setvFeedback] = useState(false);
  const currentFeedback = useRef(0);
  const [loading, setloading] = useState(false);

  const [mode, setMode] = useState('time');
  const currentDeparture = useRef(0);
  const [pdchecklist, setpdchecklist] = useState({ "CREATED_BY": "", "CREATED_DATE": "", "FUID": "", "LAST_UPDATE": "", "PDC_AFR": 0, "PDC_AFR_REM": "", "PDC_ASR": 0, "PDC_ASR_REM": "", "PDC_CAR": 0, "PDC_CAR_REM": "", "PDC_CCDD": null, "PDC_CCDT": "", "PDC_CIQ": 0, "PDC_CIQ_REM": "", "PDC_CML": "", "PDC_CML_PHOTO": "", "PDC_CNML": 0, "PDC_CNML_REM": "", "PDC_CTA": 0, "PDC_CTA_REM": "", "PDC_CTNR": 0, "PDC_CTPD": "", "PDC_CTPT": "", "PDC_FBO": 0, "PDC_FBO_REM": "", "PDC_FD": null, "PDC_FD_ATC": "", "PDC_FD_FDP": "", "PDC_FD_FDR": "", "PDC_FD_NOTAMS": "", "PDC_FD_SLOTS": "", "PDC_FD_WIU": "", "PDC_FT": "", "PDC_HAR": 0, "PDC_HAR_REM": "", "PDC_PAGD": 0, "PDC_PAGD_REM": "", "PDC_PNML": 0, "PDC_PNML_REM": "", "PDC_PTA": 0, "PDC_PTA_REM": "", "PDC_PTNR": 0, "PDC_REM": "", "PDC_TOR_CONTACT": "", "PDC_TOR_DRIVER": "", "PDC_TOR_REM": "", "PDC_TOR_TIME": "", "PDC_UDGD": "", "STATUS": 0, "UID": "", "UPDATE_BY": "", 'PDC_UDGD_String': [], PDC_FD_NOTAMS_C: 0, PDC_FD_WIU_C: 0 })
  const [crewtransport, setcrewtransport] = useState([]);
  const [paxtransport, setpaxtransport] = useState([]);


  const [pdeparturecheck, setpdeparturecheck] = useState([
    {
      name: null,
      location: null,
      hotelMap: { value: null, file: [] },
      time: null,
      contact: null,
      remarks: null,
    }, //32 -> 0 for crew
    {
      name: null,
      location: null,
      hotelMap: { value: null, file: [] },
      time: null,
      contact: null,
      remarks: null,
    }, //1 -> 1 for pax
    {
      flight_and_admin_documents: {
        recieved: null,
        printed: null,
        notams: null,
        weather_info_updated: null,
        atc_flight_plan: null,
        slot_confirmed: null,
      },
      catering: {
        delivery: null,
      },
      fueling_time: null,
    }, //2 -> 2 for flight and admin documentation time - Local
    { checked: false, remarks: null }, //3 -> 3 gendec
    { hotelMap: { value: null, file: [] } }, //4 -> 4 gendec upload <- 1 issue noted
    { checked: false, remarks: null }, //5 FBO -> 5
    { checked: false, remarks: null }, //6 -> 6 Handling Agent
    { checked: false, remarks: null }, //7 -> 7 CIQ
    { checked: false, remarks: null }, //8 -> 8 Airport sec
    { checked: false, remarks: null }, //9 -> 9 Catering agent
    { checked: false, remarks: null }, //10 -> 10 Aircraft Fueller
    { checked: false, remarks: null }, //11
    { checked: false, remarks: null }, //12
    { checked: false, remarks: null },
    { checked: false, remarks: null },
  ]);

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
    console.log(`${domain}/GetPreDepartureChecklist?_token=C3FD9690-0EB3-4DEA-B4E9-CF9469E0F91C&_opco=&_fuid=${FUID}&_uid=`)
    fetch(
      `${domain}/GetPreDepartureChecklist?_token=C3FD9690-0EB3-4DEA-B4E9-CF9469E0F91C&_opco=&_fuid=${FUID}&_uid=`,
      requestOptions,
    )
      .then(response => response.text())
      .then(response => {

        var packet = JSON.parse(response);
        var res = [...packet.Table];
        if (res && res.length > 0) {
          console.log(res, 'pre-depart');
          setpdchecklist(res[0])
          setuid(res[0].UID);
          // setcallLoad(false);
          fetch(
            `${domain}/GetDepartureChecklistValueFiles?_token=CDAC498B-116F-4346-AD72-C3F65A902FFD&_opco=&_fuid=${FUID}&_uid=${res[0].UID}`,
            requestOptions,
          )
            .then(response => response.text())
            .then(result => {
              setcallLoad(false);
              try {
                var packet = JSON.parse(result);
                console.log('upload gendec', packet);
                var temp = { ...res[0] };
                if (packet.PDCT_PL_Files && packet.PDCT_PL_Files.length > 0) {
                  temp.PDC_UDGD_String = packet.PDCT_PL_Files[0].PDCT_PL_String,
                    setpdchecklist({ ...temp })
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
      })
      .catch(error => {
        setcallLoad(false);
        console.log(error, 'Function error');
      });


    fetch(
      `${domain}/GetPreDepartureTransport?_token=C3FD9690-0EB3-4DEA-B4E9-CF9469E0F91C&_opco=&_fuid=${FUID}&_uid=`,
      requestOptions,
    )
      .then(response => response.text())
      .then(response => {
        //get pax & crew transport

        var packet = JSON.parse(response);
        var res = packet.ds.Table;
        var resFile = packet.PDCT_PL_Files;
        console.log('Transport', packet);
        if (res && res.length > 0) {
          var apaxTransport = [];
          var acrewTransport = [];
          res.forEach((val, index) => {
            if (val.STATUS != 5) {
              val.PDCT_PL_String = [];
              resFile.map(file => {
                if (file.uid == val.UID) {
                  val.PDCT_PL_String = [...file.PDCT_PL_String];
                }
              })

              if (val.PDCT_TYPE.trim() == 'Pax') {
                apaxTransport.push(val);
              } else {
                acrewTransport.push(val);
              }

            }
          });
          setpaxtransport([...apaxTransport]);
          setcrewtransport([...acrewTransport]);
          setcallLoad(false);
        } else {
          setcallLoad(false);
        }
      })
      .catch(error => {
        setcallLoad(false);
        console.log(error, 'Function error');
      });
  }


  const getFeedback = index => {
    setvFeedback(true);
    currentFeedback.current = index;
  };
  const onSubmitFeedback = text => {
    var index = currentFeedback.current;
    setpdchecklist({ ...pdchecklist, [index]: text })
    setvFeedback(false);
  };
  const removeFeedback = index => {
    setpdchecklist({ ...pdchecklist, [index]: '' })
  };
  const [isDatePickerVisibleDeparture, setDatePickerVisibilityDeparture] =
    useState(false);
  const showDatePicker = (type, index, arr, pos) => {
    currentPicker.current = [index, arr, pos];
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
    handleConfirmDeparture(new Date());
  };
  const handleConfirmDeparture = date => {
    switch (currentPicker.current[1]) {
      case 'pdchecklist':
        var tcheckList = {
          ...pdchecklist, [currentPicker.current[2]]: tConvert(
            new Date(date).toLocaleString('en-US', {
              hour12: false,
            }),
          )
        };
        setpdchecklist({ ...tcheckList }); break;
      case 'crewtransport':
        var tcheckList = [...crewtransport];
        tcheckList[currentPicker.current[0]][
          currentPicker.current[2]
        ] = tConvert(
          new Date(date).toLocaleString('en-US', {
            hour12: false,
          }),
        );
        setcrewtransport([...tcheckList]); break;
      case 'paxtransport':
        var tcheckList = [...paxtransport];
        tcheckList[currentPicker.current[0]][
          currentPicker.current[2]
        ] = tConvert(
          new Date(date).toLocaleString('en-US', {
            hour12: false,
          }),
        );
        setpaxtransport([...tcheckList]); break;
    }
    hideDatePickerDeparture();
  };
  const setNowDeparture = (index, time, type, section = 'crew') => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index].time = time;
    tConvert(
      new Date().toLocaleString('en-US', {
        hour12: false,
      }),
    );
    setpdeparturecheck(tpdeparturecheck);
  };
  const setNowflight_and_admin_documents = field => {
    var tdeparture = [...pdeparturecheck];
    tdeparture[2].flight_and_admin_documents[field] = tConvert(
      new Date().toLocaleString('en-US', {
        hour12: false,
      }),
    );
    console.log(tdeparture);
    setpdeparturecheck([...tdeparture]);
  };
  const setNowcatering = field => {
    var tdeparture = [...pdeparturecheck];
    tdeparture[2].catering.delivery = tConvert(
      new Date().toLocaleString('en-US', {
        hour12: false,
      }),
    );
    console.log(tdeparture);
    setpdeparturecheck([...tdeparture]);
  };
  const setNowfuel = field => {
    var tdeparture = [...pdeparturecheck];
    tdeparture[2].fueling_time = tConvert(
      new Date().toLocaleString('en-US', {
        hour12: false,
      }),
    );
    console.log(tdeparture);
    setpdeparturecheck([...tdeparture]);
  };
  const setCheckedDeparture = index => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index].checked = !tpdeparturecheck[index].checked;
    setpdeparturecheck(tpdeparturecheck);
    // console.log('triggered', tcheckList);
  };
  const removeFilePreA = (field, type, index, aindex) => {
    if (type == "Crew") {
      var temp = [...crewtransport];

      temp[index].PDCT_PL_String.splice(aindex, 1);
      setcrewtransport([...temp])
    }
    else if (type == "Pax") {
      var temp = [...paxtransport];
      temp[index].PDCT_PL_String.splice(aindex, 1);
      setpaxtransport([...temp])
    }
    else {
      var temp = { ...pdchecklist };
      temp[field].splice(aindex, 1);
      setpdchecklist({ ...temp })
    }
  };

  const [addedtestSection, setaddedtestsection] = useState([]);
  const [addedtestSectionval, setaddedtestSectionval] = useState([]);
  const [testmovement, settestmovement] = useState(false);

  //CREW SECTION
  const [addedcrewSection, setaddedcrewSection] = useState([]);
  const [addedcrewSectionval, setaddedcrewSectionval] = useState([]);
  const [crewmovement, setcrewmovement] = useState(false);

  //PAX SECTION
  const [addedpaxSection, setaddedpaxSection] = useState([]);
  const [addedpaxSectionval, setaddedpaxSectionval] = useState([]);
  const [paxmovement, setpaxmovement] = useState(false);

  const onPressDocPreA_New = async (index, res) => {
    setloading(false);
    RNFetchBlob.fs
      .readFile(res.uri, 'base64')
      .then(encoded => {
        // console.log(encoded, 'reports.base64');
        setloading(false);
        if (uploadSection.type == "Crew") {
          var temp = [...crewtransport];
          temp[uploadSection.index].PDCT_PL_String ? temp[uploadSection.index].PDCT_PL_String.push('data:' + res.type + ';base64,' + encoded) : temp[uploadSection.index].PDCT_PL_String = ['data:' + res.type + ';base64,' + encoded];
          console.log(temp)
          setcrewtransport([...temp])
        }
        else if (uploadSection.type == "Pax") {
          var temp = [...paxtransport];
          temp[uploadSection.index].PDCT_PL_String ? temp[uploadSection.index].PDCT_PL_String.push('data:' + res.type + ';base64,' + encoded) : temp[uploadSection.index].PDCT_PL_String = ['data:' + res.type + ';base64,' + encoded];
          setpaxtransport([...temp])
        }
        else {
          var temp = { ...pdchecklist };
          temp[uploadSection] ? temp[uploadSection].push('data:' + res.type + ';base64,' + encoded) : temp[uploadSection] = ['data:' + res.type + ';base64,' + encoded];
          setpdchecklist({ ...temp })
        }
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

  const addnewpaxSection = () => {
    const email = auth().currentUser.email;
    setpaxtransport([...paxtransport, { "CREATED_BY": email, "CREATED_DATE": new Date().toLocaleDateString().to, "FUID": FUID, "LAST_UPDATE": "", "PDCT_ADDRESS": "", "PDCT_DCN": "", "PDCT_DD_NR": 0, "PDCT_DN": "", "PDCT_DOD_ADDRESS": "", "PDCT_DOD_LOCATION": "", "PDCT_DOD_TIME": "", "PDCT_LEAD_NAME": "", "PDCT_PASSENGER_NO": 0, "PDCT_PD_NR": 0, "PDCT_PL": "", "PDCT_REMARK": "", "PDCT_SPT": "", "PDCT_TYPE": "Pax", "PDCT_VEHICLE_NO": "", "PDCT_VEHICLE_TYPE": "", "STATUS": 0, "UID": '', "UPDATE_BY": email, PDCT_PL_String: [] }])

  };

  const addnewcrewSection = () => {
    const email = auth().currentUser.email;
    setcrewtransport([...crewtransport, { "CREATED_BY": email, "CREATED_DATE": new Date().toLocaleDateString(), "FUID": FUID, "LAST_UPDATE": "", "PDCT_ADDRESS": "", "PDCT_DCN": "", "PDCT_DD_NR": 0, "PDCT_DN": "", "PDCT_DOD_ADDRESS": "", "PDCT_DOD_LOCATION": "", "PDCT_DOD_TIME": "", "PDCT_LEAD_NAME": "", "PDCT_PASSENGER_NO": 0, "PDCT_PD_NR": 0, "PDCT_PL": "", "PDCT_REMARK": "", "PDCT_SPT": "", "PDCT_TYPE": "Crew", "PDCT_VEHICLE_NO": "", "PDCT_VEHICLE_TYPE": "", "STATUS": 0, "UID": '', "UPDATE_BY": email, PDCT_PL_String: [] }])
  };
  const [ini, setini] = useState(false);

  const removepaxSection = index => {
    var service = [...paxtransport];
    var delService = service.splice(index, 1);
    if (delService[0].UID) {
      setdeleteService([...deleteService, { UID: delService[0].UID, TableName: 'PREDEPARTURECHECKLIST' }]);
    }
    setpaxtransport(service);
  };

  const removecrewSection = index => {
    var service = [...crewtransport];
    var delService = service.splice(index, 1);
    if (delService[0].UID) {
      setdeleteService([...deleteService, { UID: delService[0].UID, TableName: 'PREDEPARTURECHECKLIST' }]);
    }
    setcrewtransport(service);
  };


  const [formReady, setformReady] = useState(true);
  const [callLoad, setcallLoad] = useState(false);
  const sendForm = data => {
    setcallLoad(true);
    let x = [...pdeparturecheck];
    const email = auth().currentUser.email;
    var domain = getDomain();

    var payload = {
      ...pdchecklist,
      STATUS: 0,
      FUID: FUID,
      UPDATE_BY: email,
    };
    if (uid) {
      payload.UID = uid;
    }
    console.log('OK', payload);
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(payload)
    };
    fetch(
      `${domain}/PostPreDepartureChecklist`,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        console.log('Transport', crewtransport.concat(paxtransport));

        if (crewtransport.concat(paxtransport).length > 0) {
          var requestOptions1 = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(crewtransport.concat(paxtransport))
          };
          fetch(
            `${domain}/PostPreDepartureChecklistTransport`,
            requestOptions1,
          )
            .then(response => response.text())
            .then(result => {
              Alert.alert('Success');
              readData();
              setcallLoad(false);
              console.log(result);
            })
            .catch(error => {
              Alert.alert('Error in updation');
              setcallLoad(false);
              console.log(error, 'Function error');
            });

        }
        Alert.alert('Success');
        setcallLoad(false);
        console.log(result);
      })
      .catch(error => {
        Alert.alert('Error in updation');
        setcallLoad(false);
        console.log(error, 'Function error');
      });
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
          // Alert.alert('Success');
          setcallLoad(false);
          console.log(result);
        })
        .catch(error => {
          Alert.alert('Error in updation');
          setcallLoad(false);
          console.log(error, 'Function error');
        });
    }
    // console.log('addedcrewSectionval', addedcrewSectionval);

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
        heading={'Pre-Departure'}
        nav={"IntialScreenView"}
        navigation={props.navigation}
        sendForm={() => sendForm(pdeparturecheck[2])}
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
      <ScrollView>
        <Feedback
          visible={vFeedback}
          onCloseFeedback={() => setvFeedback(false)}
          onSubmitFeedback={onSubmitFeedback}
        />
        <Loader visible={loading} />

        <View style={[styleSheet.toggleContainer, { paddingHorizontal: 20 }]}>
          <TouchableOpacity
            onPress={event => setpdchecklist({ ...pdchecklist, PDC_CTA: pdchecklist.PDC_CTA ? 0 : 1 })}
            style={[
              styleSheet.toggleButton,
              {
                backgroundColor: pdchecklist.PDC_CTA == 1
                  ? 'green'
                  : 'white',
              },
            ]}>
            <Text
              style={[
                styleSheet.label,
                {
                  textAlign: 'center',
                  color: pdchecklist.PDC_CTA == 1 ? 'white' : 'black',
                },
              ]}>
              Crew Transport Arranged
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getFeedback('PDC_CTA_REM')}>
            <Icons
              style={{ marginLeft: 10 }}
              name="comment-processing-outline"
              color={'green'}
              size={30}
            />
          </TouchableOpacity>
        </View>
        {pdchecklist.PDC_CTA_REM && (
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 20,
              paddingHorizontal: 20,
            }}>
            <View style={styleSheet.remarks}>
              <Text>{pdchecklist.PDC_CTA_REM}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFeedback('PDC_CTA_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="delete-circle-outline"
                color="red"
                size={30}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={[styleSheet.toggleContainer, { paddingHorizontal: 20 }]}>
          <TouchableOpacity
            onPress={event => setpdchecklist({ ...pdchecklist, PDC_CNML: pdchecklist.PDC_CNML ? 0 : 1 })}
            style={[
              styleSheet.toggleButton,
              {
                backgroundColor: pdchecklist.PDC_CNML == 1
                  ? 'green'
                  : 'white',
              },
            ]}>
            <Text
              style={[
                styleSheet.label,
                {
                  textAlign: 'center',
                  color: pdchecklist.PDC_CNML == 1 ? 'white' : 'black',
                },
              ]}>
              Crew Notified on Meeting Location
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getFeedback('PDC_CNML_REM')}>
            <Icons
              style={{ marginLeft: 10 }}
              name="comment-processing-outline"
              color={'green'}
              size={30}
            />
          </TouchableOpacity>
        </View>
        {pdchecklist.PDC_CNML_REM && (
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 20,
              paddingHorizontal: 20,
            }}>
            <View style={styleSheet.remarks}>
              <Text>{pdchecklist.PDC_CNML_REM}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFeedback('PDC_CNML_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="delete-circle-outline"
                color="red"
                size={30}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={{ padding: 20, marginBottom: 80 }}>
          {/** CREW TRANSPPORT
           *
           * ADD
           * CREW TRANSPORT ARRANGED - cheklist with remark
           * CREW NOTIFIED ON MEETING LOCATION - checklist with remark
           *
           *
           */}

          <Text style={styleSheet.label}>Crew Transport:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            {/*   ------------------------------Transport Operator Reminder	 End ----------- */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={event => {
                  { setpdchecklist({ ...pdchecklist, PDC_CTNR: pdchecklist.PDC_CTNR == 1 ? 0 : 1 }), setcrewtransport([]) }
                }}>
                <Icons
                  name={
                    pdchecklist.PDC_CTNR == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={pdchecklist.PDC_CTNR == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                //onPress={() => addMovement(true, 27)}
                disabled={pdchecklist.PDC_CTNR ? true : false}
                onPress={addnewcrewSection}
                style={[
                  styleSheet.button,
                  { backgroundColor: pdchecklist.PDC_CTNR == 1 ? '#80808080' : 'green' },
                ]}>
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  Add Transport
                </Text>
              </TouchableOpacity>
            </View>
            {crewtransport.map((val, index) => {
              //if (index > 0) {
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
                      onPress={() => removecrewSection(index)}>
                      <Icons name="minus-box-outline" color="red" size={30} />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Pick-up Details:
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        var tcheckList = [...crewtransport];
                        tcheckList[index].PDCT_PD_NR = tcheckList[index].PDCT_PD_NR == 1 ? 0 : 1
                        setcrewtransport([...tcheckList]);
                      }}
                    >
                      <Icons
                        name={
                          val.PDCT_PD_NR == 1
                            ? 'checkbox-marked-outline'
                            : 'checkbox-blank-outline'
                        }
                        color={val.PDCT_PD_NR == 1 ? 'green' : 'black'}
                        size={40}
                      />
                    </TouchableOpacity>
                    <Text style={styleSheet.label}>Not Required</Text>
                  </View>
                  <LabelledInput
                    disabled={val.PDCT_PD_NR}
                    label={'Pickup Location'} //mark
                    data={val.PDCT_PL}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...crewtransport];
                      markers[index] = { ...markers[index], PDCT_PL: text };
                      setcrewtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    disabled={val.PDCT_PD_NR}
                    label={'Address'} //mark
                    data={val.PDCT_ADDRESS}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...crewtransport];
                      markers[index] = { ...markers[index], PDCT_ADDRESS: text };
                      setcrewtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 10,
                      marginBottom: 10,
                    }}>
                    <Text style={styleSheet.label}>
                      Photo of Pickup Location
                    </Text>
                    <TouchableOpacity
                      //onPress={event => onPressDocPreA(16)}
                      onPress={() => {
                        setuploadSection({ field: 'PDCT_PL_String', type: "Crew", index: index });
                        refRBSheet.current.open();
                      }}
                      disabled={val.PDCT_PD_NR == 1 ? true : false}
                      style={{
                        marginLeft: 10,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderRadius: 8,
                        backgroundColor: val.PDCT_PD_NR == 1
                          ? 'rgba(0,0,0,0.1)'
                          : 'white',
                      }}>
                      <Text style={{ color: 'green' }}>Take Camera</Text>
                    </TouchableOpacity>
                  </View>
                  {val.PDCT_PL_String && val.PDCT_PL_String.map((val, indexxx) => {
                    return (<TouchableOpacity onPress={() => {
                      if (val.split(",")[0].startsWith('data:image')) {
                        setimageVisible(true);
                        setshowImage(val);
                      }
                      else {
                        saveFile(val, `PDCT_PL_DOCUMENT` + indexxx)
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
                      <Text style={{ color: 'black' }}>{`PDCT_PL_DOCUMENT` + indexxx}</Text>
                      <TouchableOpacity onPress={() => removeFilePreA('PDCT_PL_String', "Crew", index, indexxx)}>
                        <Icons
                          style={{ color: 'green', marginLeft: 10 }}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>)
                  })}

                  <DateTimeInput
                    disabled={val.PDCT_PD_NR}
                    label={'Scheduled Pick-up Time (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', index, 'crewtransport', "PDCT_SPT");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...crewtransport];
                      tcheckList[index].PDCT_SPT = x
                      setcrewtransport([...tcheckList]);
                    }}
                    size={12}
                    type={'time'}
                    data={val.PDCT_SPT}
                    index={12}
                  />
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Drop-off Details:
                  </Text>

                  <LabelledInput

                    label={'Drop-off Location'} //mark
                    data={val.PDCT_DOD_LOCATION}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...crewtransport];
                      markers[index] = { ...markers[index], PDCT_DOD_LOCATION: text };
                      setcrewtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'Address'} //mark
                    data={val.PDCT_DOD_ADDRESS}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...crewtransport];
                      markers[index] = { ...markers[index], PDCT_DOD_ADDRESS: text };
                      setcrewtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <DateTimeInput
                    label={'Scheduled Drop-off Time (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', index, 'crewtransport', "PDCT_DOD_TIME");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...crewtransport];
                      tcheckList[index].PDCT_DOD_TIME = x
                      setcrewtransport([...tcheckList]);
                    }}
                    size={12}
                    type={'time'}
                    data={val.PDCT_DOD_TIME}
                    index={12}
                  />
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Driver Details:
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        var tcheckList = [...crewtransport];
                        tcheckList[index].PDCT_DD_NR = tcheckList[index].PDCT_DD_NR == 1 ? 0 : 1
                        setcrewtransport([...tcheckList]);
                      }}
                    >
                      <Icons
                        name={
                          val.PDCT_DD_NR == 1
                            ? 'checkbox-marked-outline'
                            : 'checkbox-blank-outline'
                        }
                        color={val.PDCT_DD_NR == 1 ? 'green' : 'black'}
                        size={40}
                      />
                    </TouchableOpacity>
                    <Text style={styleSheet.label}>Not Required</Text>
                  </View>

                  <LabelledInput
                    disabled={val.PDCT_DD_NR}
                    label={'Driver Name'} //mark
                    data={val.PDCT_DN}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...crewtransport];
                      markers[index] = { ...markers[index], PDCT_DN: text };
                      setcrewtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    disabled={val.PDCT_DD_NR}
                    label={'Driver Contact Number'} //mark
                    data={val.PDCT_DCN}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...crewtransport];
                      markers[index] = { ...markers[index], PDCT_DCN: text };
                      setcrewtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    disabled={val.PDCT_DD_NR}
                    label={'Vehicle Number'} //mark
                    data={val.PDCT_VEHICLE_NO}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...crewtransport];
                      markers[index] = { ...markers[index], PDCT_VEHICLE_NO: text };
                      setcrewtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    disabled={val.PDCT_DD_NR}
                    label={'Vehicle Type'} //mark
                    data={val.PDCT_VEHICLE_TYPE}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...crewtransport];
                      markers[index] = { ...markers[index], PDCT_VEHICLE_TYPE: text };
                      setcrewtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Crew Details:
                  </Text>
                  <LabelledInput

                    label={'Lead Crew Name'} //mark
                    data={val.PDCT_LEAD_NAME}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...crewtransport];
                      markers[index] = { ...markers[index], PDCT_LEAD_NAME: text };
                      setcrewtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'No. of Crew'} //mark
                    data={val.PDCT_PASSENGER_NO}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...crewtransport];
                      markers[index] = { ...markers[index], PDCT_PASSENGER_NO: text };
                      setcrewtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'Remarks'} //mark
                    data={val.PDCT_REMARK}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...crewtransport];
                      markers[index] = { ...markers[index], PDCT_REMARK: text };
                      setcrewtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                </View>
              );
            })}
          </View>
          {/**CREW END */}
          {/** PAX TRANSPort //mark */}

          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setpdchecklist({ ...pdchecklist, PDC_PTA: pdchecklist.PDC_PTA ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdchecklist.PDC_PTA
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdchecklist.PDC_PTA ? 'white' : 'black',
                  },
                ]}>
                Pax Transport Arranged
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PDC_PTA_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdchecklist.PDC_PTA_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text style={{ color: 'black' }}>{pdchecklist.PDC_PTA_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PDC_PTA_REM')}>
                <Icons
                  style={{ marginLeft: 10 }}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setpdchecklist({ ...pdchecklist, PDC_PNML: pdchecklist.PDC_PNML ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdchecklist.PDC_PNML
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdchecklist.PDC_PNML ? 'white' : 'black',
                  },
                ]}>
                Pax Notifed on Meeting Location
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PDC_PNML_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdchecklist.PDC_PNML_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text style={{ color: 'black' }}>{pdchecklist.PDC_PNML_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PDC_PNML_REM')}>
                <Icons
                  style={{ marginLeft: 10 }}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styleSheet.label}>Pax Transport :</Text>

          {
            // ADD
            // SAME ADDITioN AS Crew section
          }
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
                  { setpdchecklist({ ...pdchecklist, PDC_PTNR: pdchecklist.PDC_PTNR == 1 ? 0 : 1 }), setpaxtransport([]) }
                }}>
                <Icons
                  name={
                    pdchecklist.PDC_PTNR == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={pdchecklist.PDC_PTNR == 1 ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                //onPress={() => addMovement(true, 27)}
                disabled={pdchecklist.PDC_PTNR ? true : false}
                onPress={addnewpaxSection}
                style={[
                  styleSheet.button,
                  { backgroundColor: pdchecklist.PDC_PTNR == 1 ? '#80808080' : 'green' },
                ]}>
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  Add Transport
                </Text>
              </TouchableOpacity>
            </View>
            {paxtransport.map((val, index) => {
              //if (index > 0) {
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
                      onPress={() => removepaxSection(index)}>
                      <Icons name="minus-box-outline" color="red" size={30} />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Pick-up Details:
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        var tcheckList = [...paxtransport];
                        tcheckList[index].PDCT_PD_NR = tcheckList[index].PDCT_PD_NR == 1 ? 0 : 1
                        setpaxtransport([...tcheckList]);
                      }}
                    >
                      <Icons
                        name={
                          val.PDCT_PD_NR == 1
                            ? 'checkbox-marked-outline'
                            : 'checkbox-blank-outline'
                        }
                        color={val.PDCT_PD_NR == 1 ? 'green' : 'black'}
                        size={40}
                      />
                    </TouchableOpacity>
                    <Text style={styleSheet.label}>Not Required</Text>
                  </View>
                  <LabelledInput
                    disabled={val.PDCT_PD_NR}
                    label={'Pickup Location'} //mark
                    data={val.PDCT_PL}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...paxtransport];
                      markers[index] = { ...markers[index], PDCT_PL: text };
                      setpaxtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    disabled={val.PDCT_PD_NR}
                    label={'Address'} //mark
                    data={val.PDCT_ADDRESS}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...paxtransport];
                      markers[index] = { ...markers[index], PDCT_ADDRESS: text };
                      setpaxtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 10,
                      marginBottom: 10,
                    }}>
                    <Text style={styleSheet.label}>
                      Photo of Pickup Location
                    </Text>
                    <TouchableOpacity
                      //onPress={event => onPressDocPreA(16)}
                      onPress={() => {
                        setuploadSection({ field: 'PDCT_PL_String', type: "Pax", index: index });
                        refRBSheet.current.open();
                      }}
                      disabled={val.PDCT_PD_NR == 1 ? true : false}
                      style={{
                        marginLeft: 10,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderRadius: 8,
                        backgroundColor: val.PDCT_PD_NR == 1
                          ? 'rgba(0,0,0,0.1)'
                          : 'white',
                      }}>
                      <Text style={{ color: 'green' }}>Take Camera</Text>
                    </TouchableOpacity>
                  </View>
                  {val.PDCT_PL_String && val.PDCT_PL_String.map((val, indexxx) => {
                    return (<TouchableOpacity onPress={() => {
                      if (val.split(",")[0].startsWith('data:image')) {
                        setimageVisible(true);
                        setshowImage(val);
                      }
                      else {
                        saveFile(val, `PDCT_PL_DOCUMENT` + indexxx)

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
                      <Text style={{ color: 'black' }}>{`PDCT_PL_DOCUMENT` + indexxx}</Text>
                      <TouchableOpacity onPress={() => removeFilePreA('PDCT_PL_String', "Pax", index, indexxx)}>
                        <Icons
                          style={{ color: 'green', marginLeft: 10 }}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>)
                  })}
                  {/* <TakeCamera
                    label={'Photo of Pickup Location'}
                    disabled={true}
                    type={index}
                    addedsection={true}
                    init={ini}
                    sectionName={'pax'}
                    uploadInitiator={uploadInitiator}
                    removeFilePreA={(a, b, c) => {
                      //removeFilePreA

                      //removeFilePreA(arrayIndex, index, added)
                      if (addedpaxSectionval[index].hotelMap.file.length === 1)
                        addedpaxSectionval[index].hotelMap.file = [];
                      else addedpaxSectionval[index].hotelMap.file.splice(b, 1);

                      //setpdeparturecheck(x);
                      //console.log(arrayIndex,index)
                    }}
                    attachments={{ file: [] }}
                    Icon={
                      <Icons
                        style={{ color: 'green', marginLeft: 10 }}
                        name="close"
                        size={30}
                      />
                    }
                  /> */}

                  <DateTimeInput
                    disabled={val.PDCT_PD_NR}
                    label={'Scheduled Pick-up Time (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', index, 'paxtransport', "PDCT_SPT");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...paxtransport];
                      tcheckList[index].PDCT_SPT = x
                      setpaxtransport([...tcheckList]);
                    }}
                    size={12}
                    type={'time'}
                    data={val.PDCT_SPT}
                    index={12}
                  />
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Drop-off Details:
                  </Text>

                  <LabelledInput

                    label={'Drop-off Location'} //mark
                    data={val.PDCT_DOD_LOCATION}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...paxtransport];
                      markers[index] = { ...markers[index], PDCT_DOD_LOCATION: text };
                      setpaxtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'Address'} //mark
                    data={val.PDCT_DOD_ADDRESS}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...paxtransport];
                      markers[index] = { ...markers[index], PDCT_DOD_ADDRESS: text };
                      setpaxtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <DateTimeInput
                    label={'Scheduled Drop-off Time (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', index, 'paxtransport', "PDCT_DOD_TIME");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...paxtransport];
                      tcheckList[index].PDCT_DOD_TIME = x
                      setpaxtransport([...tcheckList]);
                    }}
                    size={12}
                    type={'time'}
                    data={val.PDCT_DOD_TIME}
                    index={12}
                  />
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Driver Details:
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        var tcheckList = [...paxtransport];
                        tcheckList[index].PDCT_DD_NR = tcheckList[index].PDCT_DD_NR == 1 ? 0 : 1
                        setpaxtransport([...tcheckList]);
                      }}
                    >
                      <Icons
                        name={
                          val.PDCT_DD_NR == 1
                            ? 'checkbox-marked-outline'
                            : 'checkbox-blank-outline'
                        }
                        color={val.PDCT_DD_NR == 1 ? 'green' : 'black'}
                        size={40}
                      />
                    </TouchableOpacity>
                    <Text style={styleSheet.label}>Not Required</Text>
                  </View>

                  <LabelledInput
                    disabled={val.PDCT_DD_NR}
                    label={'Driver Name'} //mark
                    data={val.PDCT_DN}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...paxtransport];
                      markers[index] = { ...markers[index], PDCT_DN: text };
                      setpaxtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    disabled={val.PDCT_DD_NR}
                    label={'Driver Contact Number'} //mark
                    data={val.PDCT_DCN}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...paxtransport];
                      markers[index] = { ...markers[index], PDCT_DCN: text };
                      setpaxtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    disabled={val.PDCT_DD_NR}
                    label={'Vehicle Number'} //mark
                    data={val.PDCT_VEHICLE_NO}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...paxtransport];
                      markers[index] = { ...markers[index], PDCT_VEHICLE_NO: text };
                      setpaxtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    disabled={val.PDCT_DD_NR}
                    label={'Vehicle Type'} //mark
                    data={val.PDCT_VEHICLE_TYPE}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...paxtransport];
                      markers[index] = { ...markers[index], PDCT_VEHICLE_TYPE: text };
                      setpaxtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Pax Details:
                  </Text>
                  <LabelledInput

                    label={'Lead Pax Name'} //mark
                    data={val.PDCT_LEAD_NAME}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...paxtransport];
                      markers[index] = { ...markers[index], PDCT_LEAD_NAME: text };
                      setpaxtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'No. of Pax'} //mark
                    data={val.PDCT_PASSENGER_NO}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...paxtransport];
                      markers[index] = { ...markers[index], PDCT_PASSENGER_NO: text };
                      setpaxtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'Remarks'} //mark
                    data={val.PDCT_REMARK}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...paxtransport];
                      markers[index] = { ...markers[index], PDCT_REMARK: text };
                      setpaxtransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                </View>
              );
            })}
          </View>
          {/**PAX TRANS END //catering.delivery=data */}
          <DateTimeInput
            label={'Confirm Catering Delivery Time (Local Time)'}
            showDatePickerPostDepart={() => {
              showDatePicker('time', 0, 'pdchecklist', "PDC_CCDT");
            }}
            setNowPostDepart={() => setNow(0, 'pdchecklist', "PDC_CCDT")}
            size={12}
            type={'time'}
            data={pdchecklist.PDC_CCDT}
            index={12}
          />
          <DateTimeInput
            label={'Fueling Time (Local Time)'}
            showDatePickerPostDepart={() => {
              showDatePicker('time', 0, 'pdchecklist', "PDC_FT");
            }}
            setNowPostDepart={() => setNow(0, 'pdchecklist', "PDC_FT")}
            size={12}
            type={'time'}
            data={pdchecklist.PDC_FT}
            index={12}
          />


          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setpdchecklist({ ...pdchecklist, PDC_PAGD: pdchecklist.PDC_PAGD ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdchecklist.PDC_PAGD
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdchecklist.PDC_PAGD ? 'white' : 'black',
                  },
                ]}>
                Prepared Departure GenDec
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PDC_PAGD_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdchecklist.PDC_PAGD_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text style={{ color: 'black' }}>{pdchecklist.PDC_PAGD_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PDC_PAGD_REM')}>
                <Icons
                  style={{ marginLeft: 10 }}
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
              marginTop: 10,
              marginBottom: 10,
            }}>
            <Text style={styleSheet.label}>
              Upload Departure GenDec
            </Text>
            <TouchableOpacity
              //onPress={event => onPressDocPreA(16)}
              onPress={() => {
                setuploadSection('PDC_UDGD_String');
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
              <Text style={{ color: 'green' }}>Take Camera</Text>
            </TouchableOpacity>
          </View>
          {pdchecklist.PDC_UDGD_String && pdchecklist.PDC_UDGD_String.map((val, indexxx) => {
            return (<TouchableOpacity
              onPress={() => {
                if (val.split(",")[0].startsWith('data:image')) {
                  setimageVisible(true);
                  setshowImage(val);
                }
                else {
                  saveFile(val, `PDC_UDGD_DOCUMENT` + indexxx)

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
              <Text style={{ color: 'black' }}>{`PDC_UDGD_DOCUMENT` + indexxx}</Text>
              <TouchableOpacity onPress={() => removeFilePreA('PDC_UDGD_String', null, null, indexxx)}>
                <Icons
                  style={{ color: 'green', marginLeft: 10 }}
                  name="close"
                  size={30}
                />
              </TouchableOpacity>
            </TouchableOpacity>)
          })}


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
            <DateTimeInput
              label={'Flight Documents Received (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'pdchecklist', "PDC_FD_FDR");
              }}
              setNowPostDepart={() => setNow(0, 'pdchecklist', "PDC_FD_FDR")}
              size={12}
              type={'time'}
              data={pdchecklist.PDC_FD_FDR}
              index={12}
            />
            <DateTimeInput
              label={'Flight Documents Printed (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'pdchecklist', "PDC_FD_FDP");
              }}
              setNowPostDepart={() => setNow(0, 'pdchecklist', "PDC_FD_FDP")}
              size={12}
              type={'time'}
              data={pdchecklist.PDC_FD_FDP}
              index={12}
            />
            <DateTimeInput
              label={'Notams Updated (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'pdchecklist', "PDC_FD_NOTAMS");
              }}
              setNowPostDepart={() => setNow(0, 'pdchecklist', "PDC_FD_NOTAMS")}
              size={12}
              type={'time'}
              data={pdchecklist.PDC_FD_NOTAMS}
              index={12}
            />
            <DateTimeInput
              label={'Weather Information Updated (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'pdchecklist', "PDC_FD_WIU");
              }}
              setNowPostDepart={() => setNow(0, 'pdchecklist', "PDC_FD_WIU")}
              size={12}
              type={'time'}
              data={pdchecklist.PDC_FD_WIU}
              index={12}
            />
            <DateTimeInput
              label={'ATC Flight Plan Filed (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'pdchecklist', "PDC_FD_ATC");
              }}
              setNowPostDepart={() => setNow(0, 'pdchecklist', "PDC_FD_ATC")}
              size={12}
              type={'time'}
              data={pdchecklist.PDC_FD_ATC}
              index={12}
            />
            <DateTimeInput
              label={'Slots Confirmed (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 0, 'pdchecklist', "PDC_FD_SLOTS");
              }}
              setNowPostDepart={() => setNow(0, 'pdchecklist', "PDC_FD_SLOTS")}
              size={12}
              type={'time'}
              data={pdchecklist.PDC_FD_SLOTS}
              index={12}
            />
          </View>
          {/*   ------------------------------Flight Documents/Admin End ----------- */}

          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setpdchecklist({ ...pdchecklist, PDC_FBO: pdchecklist.PDC_FBO ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdchecklist.PDC_FBO
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdchecklist.PDC_FBO ? 'white' : 'black',
                  },
                ]}>
                FBO Reminder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PDC_FBO_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdchecklist.PDC_FBO_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text style={{ color: 'black' }}>{pdchecklist.PDC_FBO_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PDC_FBO_REM')}>
                <Icons
                  style={{ marginLeft: 10 }}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setpdchecklist({ ...pdchecklist, PDC_HAR: pdchecklist.PDC_HAR ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdchecklist.PDC_HAR
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdchecklist.PDC_HAR ? 'white' : 'black',
                  },
                ]}>
                Handling Agent Reminder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PDC_HAR_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdchecklist.PDC_HAR_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text style={{ color: 'black' }}>{pdchecklist.PDC_HAR_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PDC_HAR_REM')}>
                <Icons
                  style={{ marginLeft: 10 }}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setpdchecklist({ ...pdchecklist, PDC_CIQ: pdchecklist.PDC_CIQ ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdchecklist.PDC_CIQ
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdchecklist.PDC_CIQ ? 'white' : 'black',
                  },
                ]}>
                CIQ Reminder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PDC_CIQ_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdchecklist.PDC_CIQ_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text style={{ color: 'black' }}>{pdchecklist.PDC_CIQ_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PDC_CIQ_REM')}>
                <Icons
                  style={{ marginLeft: 10 }}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setpdchecklist({ ...pdchecklist, PDC_ASR: pdchecklist.PDC_ASR ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdchecklist.PDC_ASR
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdchecklist.PDC_ASR ? 'white' : 'black',
                  },
                ]}>
                Airport Security Reminder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PDC_ASR_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdchecklist.PDC_ASR_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text style={{ color: 'black' }}>{pdchecklist.PDC_ASR_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PDC_ASR_REM')}>
                <Icons
                  style={{ marginLeft: 10 }}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setpdchecklist({ ...pdchecklist, PDC_CAR: pdchecklist.PDC_CAR ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdchecklist.PDC_CAR
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdchecklist.PDC_CAR ? 'white' : 'black',
                  },
                ]}>
                Catering Agent Reminder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PDC_CAR_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdchecklist.PDC_CAR_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text style={{ color: 'black' }}>{pdchecklist.PDC_CAR_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PDC_CAR_REM')}>
                <Icons
                  style={{ marginLeft: 10 }}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setpdchecklist({ ...pdchecklist, PDC_AFR: pdchecklist.PDC_AFR ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdchecklist.PDC_AFR
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdchecklist.PDC_AFR ? 'white' : 'black',
                  },
                ]}>
                Aircraft Fueller Reminder
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PDC_AFR_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdchecklist.PDC_AFR_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text style={{ color: 'black' }}>{pdchecklist.PDC_AFR_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PDC_AFR_REM')}>
                <Icons
                  style={{ marginLeft: 10 }}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}

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
        <DateTimePickerModal
          isVisible={isDatePickerVisibleDeparture}
          mode={mode}
          onConfirm={handleConfirmDeparture}
          onCancel={hideDatePickerDeparture}
          is24Hour={true}
          date={timerDate.current}
        />
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
    width: 8,
    height: 8,
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
