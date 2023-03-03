import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Loader from '../Loader';
import Feedback from '../Feedback';
import * as ImagePicker from 'react-native-image-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LabelledInput from '../subcomponents/Forms/universal/labelledinput';
import DateTimeInput from '../subcomponents/Forms/universal/datetimeinput';
import TakeCamera from '../subcomponents/Forms/takecamera';
import {firebase} from '@react-native-firebase/functions';
import {ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';
import s from '../subcomponents/Forms/FlightPreparation/form.styles';

const {height} = Dimensions.get('window');

export default function PreArrival(props) {
  const FUID = props.route.params.UID;
  const [uid, setuid] = useState(null);
  const pHotel = useRef();
  const pTransport = useRef();
  const cTransport = useRef();
  const cHotel = useRef();
  const [checkList, setChecklist] = useState([
    {checked: false, remarks: ''},
    {checked: false, remarks: ''},
    {checked: false, remarks: ''},
    {checked: false, remarks: ''},
    {checked: false, remarks: ''},
    {checked: false, remarks: ''},
    {checked: false, remarks: ''},
    {checked: false, remarks: ''},
    {checked: false, remarks: ''},
    {checked: false, remarks: ''},
    {checked: false, file: [], remarks: ''},
    {checked: false, remarks: ''},

    [], //12
    [],
    [],
    [],
    {checked: false, remarks: ''}, //16
    {checked: false, remarks: ''}, //17
  ]);
  const refRBSheet = useRef();
  //upload funcs
  const [uploadSection, setuploadSection] = useState(0);
  const [uploadAddedSection, setuploadAddedSection] = useState(false);
  const [uploadAddedSectionindex, setuploadAddedSectionindex] = useState(0);

  const [vFeedback, setvFeedback] = useState(false);
  const [loading, setloading] = useState(false);
  const currentFeedback = useRef(0);
  const currentPicker = useRef(0);
  const [mode, setMode] = useState('time');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  useEffect(() => {
    setcallLoad(true);
    firebase
      .app()
      .functions('asia-southeast1')
      .httpsCallable(
        'getFlightModule?fuid=' + FUID + '&module=GetPreArrivalChecklist',
      )()
      .then(response => {
        var packet = JSON.parse(response.data.body);
        var res = packet.Table[0];
        if (res) {
          console.log(res, 'Actual');
          var x = checkList;
          x[0].checked = res.PAC_CER == 0 ? false : true;
          x[0].remarks = res.PAC_CER_REM == '""' ? '' : res.PAC_CER_REM;
          x[1].checked = res.PAC_PER == 0 ? false : true;
          x[1].remarks = res.PAC_PER_REM == '""' ? '' : res.PAC_PER_REM;
          x[2].checked = res.PAC_CTA == 0 ? false : true;
          x[2].remarks = res.PAC_CTA_REM == '""' ? '' : res.PAC_CTA_REM;
          x[3].checked = res.PAC_PTA == 0 ? false : true;
          x[3].remarks = res.PAC_PTA_REM == '""' ? '' : res.PAC_PTA_REM;
          x[16].checked = res.PAC_CHA == 0 ? false : true;
          x[16].remarks = res.PAC_CHA_REM == '""' ? '' : res.PAC_CHA_REM;
          x[17].checked = res.PAC_PHA == 0 ? false : true;
          x[17].remarks = res.PAC_PHA_REM == '""' ? '' : res.PAC_PHA_REM;
          x[4].checked = res.PAC_IRP == 0 ? false : true;
          x[4].remarks = res.PAC_IRP_REM == '""' ? '' : res.PAC_IRP_REM;
          x[5].checked = res.PAC_IFBO == 0 ? false : true;
          x[5].remarks = res.PAC_IFBO_REM == '""' ? '' : res.PAC_IFBO_REM;
          x[6].checked = res.PAC_IHA == 0 ? false : true;
          x[6].remarks = res.PAC_IHA_REM == '""' ? '' : res.PAC_IHA_REM;
          x[7].checked = res.PAC_ICAI == 0 ? false : true;
          x[7].remarks = res.PAC_ICAI_REM == '""' ? '' : res.PAC_ICAI_REM;
          x[8].checked = res.PAC_IAS == 0 ? false : true;
          x[8].remarks = res.PAC_IAS_REM == '""' ? '' : res.PAC_IAS_REM;
          x[9].checked = res.PAC_ICC == 0 ? false : true;
          x[9].remarks = res.PAC_ICC_REM == '""' ? '' : res.PAC_ICC_REM;
          x[10].checked = res.PAC_PAGD == 0 ? false : true;
          x[10].remarks = res.PAC_PAGD_REM == '""' ? '' : res.PAC_PAGD_REM;
          x[11].checked = res.PAC_PRA == 0 ? false : true;
          x[11].remarks = res.PAC_PRA_REM == '""' ? '' : res.PAC_PRA_REM;
          setChecklist([...x]);
          setpaxactivesection(res.PAC_PTNR == 0 ? false : true);
          setpaxhotelactivesections(res.PAC_PHNR == 0 ? false : true);
          setcrewactivesections(res.PAC_CTNR == 0 ? false : true);
          setcrewhotelactivesections(res.PAC_CHNR == 0 ? false : true);
          setuid(res.UID);
          console.log(x);
        } else {
          console.log(res, 'Actual');
          setuid('');
        }
        setcallLoad(false);
      })
      .catch(error => {
        setcallLoad(false);
        console.log(error, 'Function error');
      });

    // pax crew hotel

    firebase
      .app()
      .functions('asia-southeast1')
      .httpsCallable(
        'getFlightModule?fuid=' + FUID + '&module=GetPreArrivalHotel',
      )()
      .then(response => {
        var packet = JSON.parse(response.data.body);
        var res = packet.Table;
        // console.log(res);
        if (res.length > 0) {
          var y = checkList;
          y[13] = [];
          y[15] = [];
          res.forEach((val, index) => {
            if (val.PCH_TYPE == 'Pax       ') {
              y[13].push({
                name: val.PCH_HN.trim().replace('""', ''),
                location: val.PCH_HL.trim().replace('""', ''),
                hotelMap: {value: null, file: []},
                transportTime: val.PCH_TT,
                remarks: val.PCH_REM.trim().replace('""', ''),
                type: val.PCH_TYPE,
                UID: val.UID,
              });
            } else {
              y[15].push({
                name: val.PCH_HN.trim().replace('""', ''),
                location: val.PCH_HL.trim().replace('""', ''),
                hotelMap: {value: null, file: []},
                transportTime: val.PCH_TT,
                remarks: val.PCH_REM.trim().replace('""', ''),
                type: val.PCH_TYPE,
                UID: val.UID,
              });
            }
          });
          pHotel.current = y[13];
          cHotel.current = y[15];
          console.log(y[15]);
          setChecklist([...y]);
        } else {
          console.log(checkList[13], checkList[15]);
        }
      })
      .catch(error => {
        setcallLoad(false);
        console.log(error, 'Function error');
      });

    firebase
      .app()
      .functions('asia-southeast1')
      .httpsCallable(
        'getFlightModule?fuid=' + FUID + '&module=GetPreArrivalTransport',
      )()
      .then(response => {
        //get pax & crew transport
        var packet = JSON.parse(response.data.body);
        var res = packet.Table;
        // console.log(res);
        if (res.length > 0) {
          var y = checkList;
          y[12] = [];
          y[14] = [];
          res.forEach((val, index) => {
            // console.log(val.PCT_TYPE);
            if (val.PCT_TYPE == 'Pax       ') {
              y[12].push({
                transportTime: val.PCT_STAT.trim().replace('""', ''),
                name: val.PCT_DN.trim().replace('""', ''),
                number: val.PCT_DCN.trim().replace('""', ''),
                remarks: val.PCT_REM.trim().replace('""', ''),
                type: val.PCT_TYPE,
                UID: val.UID,
              });
            } else {
              y[14].push({
                transportTime: val.PCT_STAT.trim().replace('""', ''),
                name: val.PCT_DN.trim().replace('""', ''),
                number: val.PCT_DCN.trim().replace('""', ''),
                remarks: val.PCT_REM.trim().replace('""', ''),
                type: val.PCT_TYPE,
                UID: val.UID,
              });
            }
          });
          pTransport.current = y[12];
          cTransport.current = y[14];
          setChecklist([...y]);
        } else {
          console.log(checkList[12], checkList[14]);
        }
      })
      .catch(error => {
        setcallLoad(false);
        console.log(error, 'Function error');
      });
  }, []);
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

  const [paxactivesections, setpaxactivesection] = useState(false);
  const [paxhotelactivesections, setpaxhotelactivesections] = useState(false);
  const [crewactivesections, setcrewactivesections] = useState(false);
  const [crewhotelactivesections, setcrewhotelactivesections] = useState(false);

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
    tcheckList[index].remarks = '';
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
      {
        transportTime: null,
        name: null,
        number: null,
        remarks: null,
        type: 'Pax',
      },
    ];
    setChecklist(tcheckList);
  };
  const addTransportCrew = () => {
    var tcheckList = [...checkList];
    tcheckList[14] = [
      ...checkList[14],
      {
        transportTime: null,
        name: null,
        number: null,
        remarks: null,
        type: 'Crew',
      },
    ];
    setChecklist(tcheckList);
  };

  //here
  const [addedimagepaxhotel, setaddedimagepaxhotel] = useState([]);

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
        type: 'Pax',
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
        type: 'Crew',
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
    console.log(index);
    var service = [...checkList];
    console.log(service[13]);
    service[13].splice(index, 1);
    console.log(checkList[13]);

    setChecklist([...service]);
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

  const onPressDocPreA_New = async (index, res, pos) => {
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
            name: res.fileName.replace('rn_image_picker_lib_temp_', ''),
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
        } else {
          console.log('pos', pos);
          tcheckList[index].file.push({
            name: res.fileName.replace('rn_image_picker_lib_temp_', ''),
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
  };

  const getImage = async type => {
    console.log('HERE', uploadSection);
    var options = {
      mediaType: 'image',
      includeBase64: false,
      maxHeight: 800,
      maxWidth: 800,
    };
    var pos;
    //rn_image_picker_lib_temp_29ef0418-6913-493c-882f-bd4acf3b4210.jpg
    //rn_image_picker_lib_temp_ba5ab646-6c3b-4bde-889f-788fc1d07dd8.jpg

    if (uploadSection === 13 && uploadAddedSection)
      pos = uploadAddedSectionindex;
    else if (uploadSection === 13 && uploadAddedSection == false) pos = 0;
    else if (uploadSection === 15 && uploadAddedSection)
      pos = uploadAddedSectionindex;
    else if (uploadSection === 15 && uploadAddedSection == false) pos = 0;
    else pos = undefined;

    console.log(options);
    switch (type) {
      case true:
        try {
          options.mediaType = 'photo';
          const result = await ImagePicker.launchImageLibrary(options);
          const file = result.assets[0];
          console.log(file);
          onPressDocPreA_New(uploadSection, file, pos);
        } catch (error) {
          console.log(error);
        }
        break;
      case false:
        try {
          const result = await ImagePicker.launchCamera(options);
          const file = result.assets[0];
          onPressDocPreA_New(uploadSection, file, pos);
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    }
  };

  const [callLoad, setcallLoad] = useState(false);
  const sendForm = () => {
    //console.log(checkList);
    setcallLoad(true);
    var x = checkList;

    const email = auth().currentUser.email;
    var payload = {
      PAC_CER: x[0].checked == true ? 1 : 0,
      PAC_CER_REM: x[0].remarks == '' ? '""' : x[0].remarks,
      PAC_PER: x[1].checked == true ? 1 : 0,
      PAC_PER_REM: x[1].remarks == '' ? '""' : x[1].remarks,
      PAC_CTA: x[2].checked == true ? 1 : 0,
      PAC_CTA_REM: x[2].remarks == '' ? '""' : x[2].remarks,
      PAC_PTA: x[3].checked == true ? 1 : 0,
      PAC_PTA_REM: x[3].remarks == '' ? '""' : x[3].remarks,
      PAC_CHA: x[16].checked == true ? 1 : 0,
      PAC_CHA_REM: x[16].remarks == '' ? '""' : x[16].remarks,
      PAC_PHA: x[17].checked == true ? 1 : 0,
      PAC_PHA_REM: x[17].remarks == '' ? '""' : x[17].remarks,
      PAC_IRP: x[4].checked == true ? 1 : 0,
      PAC_IRP_REM: x[4].remarks == '' ? '""' : x[4].remarks,
      PAC_IFBO: x[5].checked == true ? 1 : 0,
      PAC_IFBO_REM: x[5].remarks == '' ? '""' : x[5].remarks,
      PAC_IHA: x[6].checked == true ? 1 : 0,
      PAC_IHA_REM: x[6].remarks == '' ? '""' : x[6].remarks,
      PAC_ICAI: x[7].checked == true ? 1 : 0,
      PAC_ICAI_REM: x[7].remarks == '' ? '""' : x[7].remarks,
      PAC_IAS: x[8].checked == true ? 1 : 0,
      PAC_IAS_REM: x[8].remarks == '' ? '""' : x[8].remarks,
      PAC_ICC: x[9].checked == true ? 1 : 0,
      PAC_ICC_REM: x[9].remarks == '' ? '""' : x[9].remarks,
      PAC_PAGD: x[10].checked == true ? 1 : 0,
      PAC_PAGD_REM: x[10].remarks == '' ? '""' : x[10].remarks,
      PAC_PRA: x[11].checked == true ? 1 : 0,
      PAC_PRA_REM: x[11].remarks == '' ? '""' : x[11].remarks,
      PAC_PTNR: paxactivesections == true ? 1 : 0,
      PAC_PHNR: paxhotelactivesections == true ? 1 : 0,
      PAC_CTNR: crewactivesections == true ? 1 : 0,
      PAC_CHNR: crewhotelactivesections == true ? 1 : 0,
      FUID: FUID,
      UID: uid,
      UPDATE_BY: email,
      STATUS: '0',
    };

    // console.log(payload);

    firebase
      .app()
      .functions('asia-southeast1')
      .httpsCallable('updateFlightModule?module=PostPreArrivalChecklist')(
        JSON.stringify(payload),
      )
      .then(response => {
        Alert.alert('Success');
        setcallLoad(false);
        console.log(response);
      })
      .catch(error => {
        Alert.alert('Error in updation');
        setcallLoad(false);
        console.log(error, 'Function error');
      });

    checkList[13].map(val => {
      firebase
        .app()
        .functions('asia-southeast1')
        .httpsCallable('updateFlightModule?module=PostPreArrivalPaxCrewHotel')(
          JSON.stringify({
            PCH_HN: val.name ? val.name : '""',
            PCH_HL: val.location ? val.location : '""',
            PCH_TT: val.transportTime ? val.transportTime : '""',
            PCH_REM: val.remarks ? val.remarks : '""',
            PCH_TYPE: val.type ? val.type : '""',
            UID: val.UID ? val.UID : '',
            STATUS: 0,
            FUID: FUID,
            UPDATE_BY: email,
          }),
        )
        .then(response => {
          // Alert.alert('Success');
          // setcallLoad(false);
          console.log(response);
        })
        .catch(error => {
          // Alert.alert('Error in updation');
          // setcallLoad(false);
          console.log(error, 'Function error');
        });
    });

    checkList[15].map(val => {
      firebase
        .app()
        .functions('asia-southeast1')
        .httpsCallable('updateFlightModule?module=PostPreArrivalPaxCrewHotel')(
          JSON.stringify({
            PCH_HN: val.name ? val.name : '""',
            PCH_HL: val.location ? val.location : '""',
            PCH_TT: val.transportTime ? val.transportTime : '""',
            PCH_REM: val.remarks ? val.remarks : '""',
            PCH_TYPE: val.type ? val.type : '""',
            UID: val.UID ? val.UID : '',
            STATUS: 0,
            FUID: FUID,
            UPDATE_BY: email,
          }),
        )
        .then(response => {
          // Alert.alert('Success');
          // setcallLoad(false);
          console.log(response);
        })
        .catch(error => {
          // Alert.alert('Error in updation');
          // setcallLoad(false);
          console.log(error, 'Function error');
        });
    });

    checkList[12].map(val => {
      firebase
        .app()
        .functions('asia-southeast1')
        .httpsCallable(
          'updateFlightModule?module=PostPreArrivalPaxCrewTransport',
        )(
          JSON.stringify({
            PCT_STAT: val.transportTime,
            PCT_DN: val.name,
            PCT_DCN: val.number,
            PCT_REM: val.remarks,
            PCT_TYPE: val.type,
            STATUS: 0,
            FUID: FUID,
            UPDATE_BY: email,
            UID: val.UID ? val.UID : '',
          }),
        )
        .then(response => {
          // Alert.alert('Success');
          // setcallLoad(false);
          console.log(response);
        })
        .catch(error => {
          // Alert.alert('Error in updation');
          // setcallLoad(false);
          console.log(error, 'Function error');
        });
    });

    checkList[14].map(val => {
      firebase
        .app()
        .functions('asia-southeast1')
        .httpsCallable(
          'updateFlightModule?module=PostPreArrivalPaxCrewTransport',
        )(
          JSON.stringify({
            PCT_STAT: val.transportTime,
            PCT_DN: val.name,
            PCT_DCN: val.number,
            PCT_REM: val.remarks,
            PCT_TYPE: val.type,
            STATUS: 0,
            FUID: FUID,
            UPDATE_BY: email,
          }),
        )
        .then(response => {
          // Alert.alert('Success');
          // setcallLoad(false);
          console.log(response);
        })
        .catch(error => {
          // Alert.alert('Error in updation');
          // setcallLoad(false);
          console.log(error, 'Function error');
        });
    });
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
        <Text
          style={{
            fontSize: Dimensions.get('window').width / 15,
            fontWeight: 'bold',
            color: 'black',
            paddingLeft: 20,
          }}>
          Pre-Arrival Checklist
        </Text>
        {callLoad ? (
          <View style={{paddingRight: 20}}>
            <ActivityIndicator color="green" size={'small'} />
          </View>
        ) : (
          <TouchableOpacity onPress={sendForm} style={{marginRight: 20}}>
            <Icons name="content-save" color="green" size={30} />
          </TouchableOpacity>
        )}
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
              onPress={event => setChecked(16)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: checkList[16].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: checkList[16].checked ? 'white' : 'black',
                  },
                ]}>
                Crew Hotel Arranged
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
          {checkList[16].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{checkList[16].remarks}</Text>
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
              onPress={event => setChecked(17)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: checkList[17].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: checkList[17].checked ? 'white' : 'black',
                  },
                ]}>
                Pax Hotel Arranged
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
          {checkList[17].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{checkList[17].remarks}</Text>
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
          {
            //to be added
            // jphotel arranged ok
            // pax hotel arranged ok
          }
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setChecked(4)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: checkList[4].checked ? 'green' : 'white', //checkList[4].checked
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={addTransport}
                disabled={paxactivesections}
                style={[
                  styleSheet.button,
                  {backgroundColor: paxactivesections ? '#80808080' : 'green'},
                ]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Transport
                </Text>
              </TouchableOpacity>
            </View>
            {checkList[12].map((val, index) => {
              //if (index > 0) {
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
                  <DateTimeInput
                    label={'Scheduled Transport Arrival Time (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', 12, index);
                    }}
                    setNowPostDepart={() => setNow(12, index)}
                    size={12}
                    type={'datetime'}
                    data={checkList[12][index].transportTime}
                    index={12}
                  />

                  <LabelledInput
                    label={'Local Receiving Party / Driver Name'} //mark
                    data={checkList[12][index].name}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      var tcheckList = [...checkList];
                      tcheckList[i][index].name = text;
                      setChecklist(tcheckList);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />

                  <LabelledInput
                    label={'Local Receiving Party / Driver Contact Number'} //mark
                    data={checkList[12][index].number}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      var tcheckList = [...checkList];
                      tcheckList[i][index].number = text;
                      setChecklist(tcheckList);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />

                  <LabelledInput
                    label={'Remarks'} //mark
                    data={checkList[12][index].remarks}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      var tcheckList = [...checkList];
                      tcheckList[i][index].remarks = text;
                      setChecklist(tcheckList);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                </View>
              );
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                disabled={paxhotelactivesections}
                onPress={addHotel}
                style={[
                  styleSheet.button,
                  {
                    backgroundColor: paxhotelactivesections
                      ? '#80808080'
                      : 'green',
                  },
                ]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Hotel
                </Text>
              </TouchableOpacity>
            </View>
            {checkList[13].map((val, index) => {
              // if (index > 0) {
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

                  <>
                    <Text style={s.label}>{'Hotel Name'}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TextInput
                        style={[
                          s.input,
                          {
                            backgroundColor: paxhotelactivesections
                              ? 'rgba(0,0,0,0.1)'
                              : 'white',
                          },
                        ]}
                        value={checkList[13][index].name}
                        multiline={false}
                        numberOfLines={1}
                        onChangeText={text => {
                          var tcheckList = [...checkList];
                          tcheckList[13][index].name = text;
                          setChecklist(tcheckList);
                        }}
                      />
                    </View>
                  </>

                  <LabelledInput
                    label={'Hotel Location'} //mark
                    data={checkList[13][index].location}
                    datatype={'location'}
                    index={13}
                    setText={(i, text, type, section) => {
                      var tcheckList = [...checkList];
                      tcheckList[13][index].location = text;
                      setChecklist([...tcheckList]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />

                  <TakeCamera
                    label={'Map of Route to Hotel'}
                    type={13}
                    uploadInitiator={() => {
                      setuploadAddedSection(true);
                      setuploadAddedSectionindex(index);
                      setuploadSection(13);
                      refRBSheet.current.open();
                    }}
                    removeFilePreA={(type, i) => {
                      //console.log(type,i);
                      var x = [...checkList];
                      //console.log(x[13][index].hotelMap.file.length);
                      //x[13][index].hotelMap.splice(i, 1);
                      if (x[13][index].hotelMap.file.length === 1) {
                        x[13][index].hotelMap.file = [];
                      } else {
                        x[13][index].hotelMap.file.splice(i, 1);
                      }

                      //console.log(x[13][index].hotelMap.file.length);

                      /**
                       * NEW STRUCTURE REQ
                       *  NEW ARRAY FOR ATTACHED FILES
                       */
                    }}
                    attachments={checkList[13][index].hotelMap}
                    Icon={
                      <Icons
                        style={{color: 'green', marginLeft: 10}}
                        name="close"
                        size={30}
                      />
                    }
                  />

                  <DateTimeInput
                    label={'Travel Time (Approximate)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', 13, index);
                    }}
                    setNowPostDepart={() => setNow(13, index)}
                    size={12}
                    type={'time'}
                    data={checkList[13][index].transportTime}
                    index={13}
                  />

                  {/* <LabelledInput
                    label={'Remarks'} //mark
                    data={checkList[13][index].remarks}
                    datatype={'text'}
                    index={13}
                    setText={(i, text, type, section) => {
                      var tcheckList = [...checkList];
                      tcheckList[13][index].remarks = text;
                      setChecklist([...tcheckList]);
                    }}
                    multiline={true}
                    numberOfLines={2}
                  /> */}
                  <Text style={styleSheet.label}>Remarks</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput
                      style={styleSheet.input}
                      multiline={true}
                      placeholder="Vehicle Number, Vehicle Type, Pax Name"
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
              // }
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
            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={event => {
                  var x = crewactivesections;
                  setcrewactivesections(!x);
                  var y = [...checkList];
                  y[14] = [
                    {
                      transportTime: null,
                      name: null,
                      number: null,
                      remarks: null,
                    },
                  ];
                  setChecklist(y);
                }}>
                <Icons
                  name={
                    crewactivesections
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={crewactivesections ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>

            <DateTimeInput
              label={'Scheduled Transport Arrival Time (Local Time)'}
              disabled={crewactivesections}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 14, 0);
              }}
              setNowPostDepart={() => setNow(14, 0)}
              size={12}
              type={'datetime'}
              data={checkList[14][0].transportTime}
              index={15}
            />
            <LabelledInput
              label={'Driver Name'} //mark
              disabled={crewactivesections}
              data={checkList[14][0].name}
              datatype={'text'}
              index={14}
              setText={(index, text, type, section) => {
                var tcheckList = [...checkList];
                tcheckList[index][0].name = text;
                setChecklist(tcheckList);
              }}
              multiline={false}
              numberOfLines={1}
            />

            <LabelledInput
              label={'Driver Contact Number'} //mark
              disabled={crewactivesections}
              data={checkList[14][0].number}
              datatype={'text'}
              index={14}
              setText={(index, text, type, section) => {
                var tcheckList = [...checkList];
                tcheckList[index][0].number = text;
                setChecklist(tcheckList);
              }}
              multiline={false}
              numberOfLines={1}
            />

            {/* <LabelledInput
              label={'Remarks'} //mark
              disabled={crewactivesections}
              data={checkList[14][0].remarks}
              datatype={'text'}
              index={14}
              setText={(index, text, type, section) => {
                var tcheckList = [...checkList];
                tcheckList[index][0].remarks = text;
                setChecklist(tcheckList);
              }}
              multiline={true}
              numberOfLines={2}
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
            </View> */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={addTransportCrew}
                disabled={crewactivesections}
                style={[
                  styleSheet.button,
                  {backgroundColor: crewactivesections ? '#80808080' : 'green'},
                ]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Transport
                </Text>
              </TouchableOpacity>
            </View>
            {checkList[14].map((val, index) => {
              //if (index > 0) {
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
                  <DateTimeInput
                    label={'Scheduled Transport Arrival Time (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', 14, index);
                    }}
                    setNowPostDepart={() => setNow(14, index)}
                    size={12}
                    type={'datetime'}
                    data={checkList[14][index].transportTime}
                    index={15}
                  />
                  <LabelledInput
                    label={'Driver Name'} //mark
                    data={checkList[14][index].name}
                    datatype={'text'}
                    index={14}
                    setText={(x, text, type, section) => {
                      var tcheckList = [...checkList];
                      //console.log(tcheckList[x][index].name);
                      tcheckList[x][index].name = text;
                      setChecklist(tcheckList);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />

                  <LabelledInput
                    label={'Driver Contact Number'} //mark
                    data={checkList[14][index].number}
                    datatype={'text'}
                    index={14}
                    setText={(i, text, type, section) => {
                      var tcheckList = [...checkList];
                      tcheckList[i][index].number = text;
                      setChecklist(tcheckList);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />

                  <LabelledInput
                    label={'Remarks'} //mark
                    data={checkList[14][index].remarks}
                    datatype={'text'}
                    index={14}
                    setText={(i, text, type, section) => {
                      var tcheckList = [...checkList];
                      tcheckList[i][index].remarks = text;
                      setChecklist(tcheckList);
                    }}
                    multiline={true}
                    numberOfLines={2}
                  />
                </View>
              );
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
            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={event => {
                  var x = crewhotelactivesections;
                  setcrewhotelactivesections(!x);
                  var y = [...checkList];

                  y[15] = [
                    {
                      name: null,
                      location: null,
                      hotelMap: {value: null, file: []},
                      time: null,
                      remarks: null,
                    },
                  ];
                  setChecklist(y);
                }}>
                <Icons
                  name={
                    crewhotelactivesections
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={crewhotelactivesections ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>

            <LabelledInput
              label={'Hotel Name'} //mark
              disabled={crewhotelactivesections}
              data={checkList[15][0].name}
              datatype={'text'}
              index={15}
              setText={(index, text, type, section) => {
                var tcheckList = [...checkList];
                tcheckList[index][0].name = text;
                setChecklist(tcheckList);
              }}
              multiline={false}
              numberOfLines={1}
            />

            <LabelledInput
              label={'Hotel Location'} //mark
              disabled={crewhotelactivesections}
              data={checkList[15][0].location}
              datatype={'text'}
              index={15}
              setText={(index, text, type, section) => {
                var tcheckList = [...checkList];
                tcheckList[index][0].location = text;
                setChecklist(tcheckList);
              }}
              multiline={false}
              numberOfLines={1}
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
                disabled={crewhotelactivesections}
                onPress={() => {
                  setuploadAddedSection(false);
                  setuploadSection(15);
                  refRBSheet.current.open();
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    color: crewhotelactivesections ? '#000000' : 'green',
                  }}>
                  Upload
                </Text>
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

            <DateTimeInput
              label={'Travel Time (Approximate)'}
              disabled={crewhotelactivesections}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 15, 0);
              }}
              setNowPostDepart={() => setNow(15, 0)}
              size={12}
              type={'datetime'}
              data={checkList[15][0].transportTime}
              index={15}
            />

            <LabelledInput
              label={'Remarks'} //mark
              disabled={crewhotelactivesections}
              data={checkList[15][0].remarks}
              datatype={'remarks'}
              index={15}
              setText={(index, text, type, section) => {
                var tcheckList = [...checkList];
                tcheckList[index][0].remarks = text;
                setChecklist(tcheckList);
              }}
              multiline={true}
              numberOfLines={2}
            /> */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                disabled={crewhotelactivesections}
                onPress={addHotelCrew}
                style={[
                  [
                    styleSheet.button,
                    {
                      backgroundColor: crewhotelactivesections
                        ? '#80808080'
                        : 'green',
                    },
                  ],
                ]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Hotel
                </Text>
              </TouchableOpacity>
            </View>
            {checkList[15].map((val, index) => {
              //if (index > 0) {
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
                  {/* <LabelledInput
                      label={'Hotel Name'}
                      data={checkList[15][index].name}
                      datatype={'text'}
                      index={15}
                      setText={text => {
                        console.log(text);
                        var tcheckList = [...checkList];
                        tcheckList[15][index].name = text;
                        setChecklist(tcheckList);
                      }}
                      multiline={false}
                      numberOfLines={1}
                    /> */}
                  <Text style={styleSheet.label}>Hotel Name</Text>
                  <TextInput
                    style={styleSheet.input}
                    value={checkList[15][index].name.trim()}
                    onChangeText={text => {
                      console.log(text);
                      var tcheckList = [...checkList];
                      tcheckList[15][index].name = text;
                      setChecklist(tcheckList);
                    }}
                  />

                  {/* <LabelledInput
                      label={'Hotel Location'}
                      data={checkList[15][index].name}
                      datatype={'text'}
                      index={15}
                      setText={text => {
                        var tcheckList = [...checkList];
                        tcheckList[15][index].location = text;
                        setChecklist(tcheckList);
                      }}
                      multiline={false}
                      numberOfLines={1}
                    /> */}

                  <Text style={styleSheet.label}>Hotel Location</Text>
                  <TextInput
                    style={styleSheet.input}
                    value={checkList[15][index].location}
                    onChangeText={text => {
                      console.log(text);
                      var tcheckList = [...checkList];
                      tcheckList[15][index].location = text;
                      setChecklist(tcheckList);
                    }}
                  />

                  <TakeCamera
                    label={'Map of Route to Hotel'}
                    type={15}
                    uploadInitiator={() => {
                      setuploadAddedSection(true);
                      setuploadAddedSectionindex(index);
                      setuploadSection(15);
                      refRBSheet.current.open();
                    }}
                    removeFilePreA={(type, i) => {
                      //console.log(type,i);
                      var x = [...checkList];
                      //console.log(x[13][index].hotelMap.file.length);
                      //x[13][index].hotelMap.splice(i, 1);
                      if (x[15][index].hotelMap.file.length === 1) {
                        x[15][index].hotelMap.file = [];
                      } else {
                        x[15][index].hotelMap.file.splice(i, 1);
                      }

                      //console.log(x[13][index].hotelMap.file.length);

                      /**
                       * NEW STRUCTURE REQ
                       *  NEW ARRAY FOR ATTACHED FILES
                       */
                    }}
                    attachments={checkList[15][index].hotelMap}
                    Icon={
                      <Icons
                        style={{color: 'green', marginLeft: 10}}
                        name="close"
                        size={30}
                      />
                    }
                  />

                  <DateTimeInput
                    label={'Travel Time (Approximate)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', 15, index);
                    }}
                    setNowPostDepart={() => setNow(15, index)}
                    size={12}
                    type={'datetime'}
                    data={checkList[15][index].transportTime}
                    index={15}
                  />
                  <Text style={styleSheet.label}>Remarks</Text>
                  <TextInput
                    style={styleSheet.input}
                    value={checkList[15][index].remarks}
                    onChangeText={text => {
                      console.log(text);
                      var tcheckList = [...checkList];
                      tcheckList[15][index].remarks = text;
                      setChecklist(tcheckList);
                    }}
                  />
                  {/* <LabelledInput
                    label={'Remarks'}
                    data={checkList[15][index].remarks}
                    datatype={'text'}
                    index={15}
                    setText={text => {
                      var tcheckList = [...checkList];
                      tcheckList[15][index].remarks = text;
                      setChecklist(tcheckList);
                    }}
                    multiline={true}
                    numberOfLines={2}
                  /> */}
                </View>
              );
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
    fontSize: 20,
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
