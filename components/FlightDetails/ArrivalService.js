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
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, { useRef, useState, useEffect } from 'react';
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
export default function ArrivalService(props) {
  const currentPicker = useRef(0);
  const refRBSheet = useRef();
  const [uid, setuid] = useState(null);
  const FUID = props.route.params.UID;
  //upload funcs
  const [uploadSection, setuploadSection] = useState(0);

  const [mode, setMode] = useState('time');
  const [loading, setloading] = useState(false);
  const [disabled, setdisabled] = useState({
    catering: false,
    water: false,
    lavatory: false,
    rubbish: false,
    fuel: false,
    towing: false,
    overnight: false,
  });
  const [aService, setaService] = useState({
    "ARS_BAGGAGE": null, "ARS_BAGGAGE_PHOTO": "",
    "ARS_CEC_REMARKS": "", "ARS_CEC_REQ": null,
    "ARS_CREW": null, "ARS_CRM_CAT": "", "ARS_CRM_CCIQ": "",
    "ARS_CRM_CDA": "", "ARS_CRM_CDT": "", "ARS_CRM_CVA": "",
    "ARS_CRM_REM": "", "ARS_CRM_TAT": "", "ARS_CTR_CDT": "",
    "ARS_CTR_CEL": "", "ARS_CTR_CEO": "", "ARS_CTR_NCO": "",
    "ARS_CTR_REM": "", "ARS_CTR_REQ": 1, "ARS_DS_CONTACT_NO": "",
    "ARS_DS_NAME": "", "ARS_FOA_END": "",
    "ARS_FOA_FTAT": "", "ARS_FOA_RECEIPT": "",
    "ARS_FOA_REM": "", "ARS_FOA_REQ": 0,
    "ARS_FOA_START": "", "ARS_GPU_REQ": 0, "ARS_GPU_START": "",
    "ARS_GPU_STOP": "", "ARS_LAS_CT": "",
    "ARS_LAS_ET": "", "ARS_LAS_REM": "",
    "ARS_LAS_REQ": 0, "ARS_LAS_ST": "", "ARS_LC_NR": 0,
    "ARS_LC_PHOTO": null, "ARS_LC_REMARKS": "",
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
    "UID": "", "UPDATE_BY": ""
  })
  const [arrival, setArrival] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    { value: '', file: [] },
    null,
    null,
    { checked: false },
    null, //10
    null,
    { checked: false },
    { checked: false },
    null,
    null,
    { value: null, file: [] },
    { value: null, file: [] },
    null,
    null,
    { checked: false },
    null,
    null,
    null,
    { checked: false },
    null,
    null,
    null,
    { checked: false },
    null,
    null,
    { checked: false },
    null,
    null,
    null,
    { value: null, file: [] },
    'For remarks; if the fuel truck needs to  come around a second time, they can put the details of the second time it comes around into the remarks here',
    { checked: false },
    null,
    null,
    { value: null, file: [] },
    null, //41
    { checked: false },
    null,
    { checked: false },
    null,
    null,
    { checked: false },
    null,
    null,
    null,
    null,
    null,
    null,
    { value: null, file: [] },
    null,
    null,
    null,
    null,
    null,
    [],
    [], //61
    [], //62
    {}, //63
    null, //64
    null, //65
  ]);
  const addMovement = () => {
    var tarrival = [...arrival];
    tarrival[60] = [
      ...arrival[60],
      { arrival: null, departed: null, remarks: null, type: 'Pax' },
    ];
    setArrival([...tarrival]);
  };
  const onRemoveMovement = index => {
    var service = [...arrival];
    service[60].splice(index, 1);
    setArrival(service);
  };
  useEffect(() => {
    setcallLoad(true);
    firebase
      .app()
      .functions('asia-southeast1')
      .httpsCallable(
        'getFlightModule?fuid=' + FUID + '&module=GetArrivalServices',
      )()
      .then(response => {
        // console.log(response);
        var packet = JSON.parse(response.data.body);
        var res = [...packet.Table];
        if (res) {
          setaService(res[0]);
          console.log(res[0]);
          setuid(res[0].UID);
          let x = [...arrival];
          x[0] = res[0].ARS_MOVACLANDED
            ? res[0].ARS_MOVACLANDED.toString().trim().replace('""', '')
            : '';
          x[1] = res[0].ARS_MOVCHOCKIN
            ? res[0].ARS_MOVCHOCKIN.toString().trim().replace('""', '')
            : '';
          x[2] = res[0].ARS_GPU_START
            ? res[0].ARS_GPU_START.toString().trim().replace('""', '')
            : '';
          x[3] = res[0].ARS_GPU_STOP
            ? res[0].ARS_GPU_STOP.toString().trim().replace('""', '')
            : '';
          x[4] = res[0].ARS_PAX
            ? res[0].ARS_PAX.toString().trim().replace('""', '')
            : '';
          x[5] = res[0].ARS_CREW
            ? res[0].ARS_CREW.toString().trim().replace('""', '')
            : '';
          x[6].value = res[0].ARS_BAGGAGE
            ? res[0].ARS_BAGGAGE.toString().toString().trim().replace('""', '')
            : '';
          x[7] = res[0].ARS_MOV_PXDA
            ? res[0].ARS_MOV_PXDA.toString().trim().replace('""', '')
            : '';
          x[8] = res[0].ARS_MOV_PXTAT
            ? res[0].ARS_MOV_PXTAT.toString().trim().replace('""', '')
            : '';
          x[9].checked = res[0].ARS_MOV_PXVA;
          x[10] = res[0].ARS_MOV_PXCIQ
            ? res[0].ARS_MOV_PXCIQ.toString().trim().replace('""', '')
            : '';
          // x[11] = res[0].ARS_MOV_PXDT?res[0].ARS_MOV_PXDT.toString().trim().replace('""', ''): '';
          x[12].checked = res[0].ARS_MOV_VOA == 1 ? true : false;
          // x[14] = res[0].ARS_MOV_PXDT?res[0].ARS_MOV_PXDT.toString().trim().replace('""', ''): '';
          x[15] = res[0].ARS_CTR_CEO
            ? res[0].ARS_CTR_CEO.toString().trim().replace('""', '')
            : '';
          // x[16] = res[0].ARS_CTR_CEL?res[0].ARS_CTR_CEL.toString().trim().replace('""', ''): '';
          // x[17] = res[0].ARS_CTR_NCO?res[0].ARS_CTR_NCO.toString().trim().replace('""', ''): '';
          x[18] = res[0].ARS_CTR_CDT
            ? res[0].ARS_CTR_CDT.toString().trim().replace('""', '')
            : '';
          x[19] = res[0].ARS_CTR_REM
            ? res[0].ARS_CTR_REM.toString().trim().replace('""', '')
            : '';
          x[20].checked = res[0].ARS_CTR_REQ == 1 ? true : false;
          x[21] = res[0].ARS_WAS_CT
            ? res[0].ARS_WAS_CT.toString().trim().replace('""', '')
            : '';
          x[22] = res[0].ARS_WAS_ET
            ? res[0].ARS_WAS_ET.toString().trim().replace('""', '')
            : '';
          x[23] = res[0].ARS_WAS_REM
            ? res[0].ARS_WAS_REM.toString().trim().replace('""', '')
            : '';
          x[24].checked = res[0].ARS_WAS_REQ == 1 ? true : false;
          x[25] = res[0].ARS_LAS_CT
            ? res[0].ARS_LAS_CT.toString().trim().replace('""', '')
            : '';
          x[26] = res[0].ARS_LAS_ET
            ? res[0].ARS_LAS_ET.toString().trim().replace('""', '')
            : '';
          x[27] = res[0].ARS_LAS_REM
            ? res[0].ARS_LAS_REM.toString().trim().replace('""', '')
            : '';
          x[28].checked = res[0].ARS_LAS_REQ == 1 ? true : false;
          x[29] = res[0].ARS_RUS_CT
            ? res[0].ARS_RUS_CT.toString().trim().replace('""', '')
            : '';
          x[30] = res[0].ARS_RUS_REM
            ? res[0].ARS_RUS_REM.toString().trim().replace('""', '')
            : '';
          x[31].checked = res[0].ARS_RUS_REQ == 1 ? true : false;
          x[32] = res[0].ARS_FOA_FTAT
            ? res[0].ARS_FOA_FTAT.toString().trim().replace('""', '')
            : '';
          x[33] = res[0].ARS_FOA_START
            ? res[0].ARS_FOA_START.toString().trim().replace('""', '')
            : '';
          x[34] = res[0].ARS_FOA_END
            ? res[0].ARS_FOA_END.toString().trim().replace('""', '')
            : '';
          // x[35] = res[0].ARS_FOA_RECEIPT?res[0].ARS_FOA_RECEIPT.toString().trim().replace('""', ''): '';
          x[36] = res[0].ARS_FOA_REM
            ? res[0].ARS_FOA_REM.toString().trim().replace('""', '')
            : '';
          x[37].checked = res[0].ARS_FOA_REQ == 1 ? true : false;
          x[38] = res[0].ARS_TOS_START
            ? res[0].ARS_TOS_START.toString().trim().replace('""', '')
            : '';
          x[39] = res[0].ARS_TOS_END
            ? res[0].ARS_TOS_END.toString().trim().replace('""', '')
            : '';
          // x[40] = res[0].ARS_TOS_PHOTO?res[0].ARS_TOS_PHOTO.toString().trim().replace('""', ''): '';
          x[41] = res[0].ARS_TOS_REM
            ? res[0].ARS_TOS_REM.toString().trim().replace('""', '')
            : '';
          x[42].checked = res[0].ARS_TOS_REQ == 1 ? true : false;
          x[43] = res[0].ARS_OVB_NUMBER
            ? res[0].ARS_OVB_NUMBER.toString().trim().replace('""', '')
            : '';
          x[44].checked = res[0].ARS_OVB_REQ == 1 ? true : false;
          x[46] = res[0].ARS_CRM_CAT
            ? res[0].ARS_CRM_CAT.toString().trim().replace('""', '')
            : '';
          x[48] = res[0].ARS_CRM_CCIQ
            ? res[0].ARS_CRM_CCIQ.toString().trim().replace('""', '')
            : '';
          x[45] = res[0].ARS_CRM_CDA
            ? res[0].ARS_CRM_CDA.toString().trim().replace('""', '')
            : '';
          x[47] = res[0].ARS_CRM_CVA
            ? res[0].ARS_CRM_CVA.toString().trim().replace('""', '')
            : '';
          // console.log([...x]);
          setArrival([...x]);
          firebase
            .app()
            .functions('asia-southeast1')
            .httpsCallable(
              'getFlightModule?fuid=' + FUID + '&module=GetArrivalServicesPM',
            )()
            .then(response => {
              var packet = JSON.parse(response.data.body);
              var res = packet.Table;
              // console.log(res, 'res');
              if (res && res.length > 0) {
                x[60] = [];
                x[62] = [];
                res.forEach((val, index) => {
                  if (val.ARS_PM_TYPE == 'Pax') {
                    x[60].push({
                      arrival: val.ARS_PM_ATAT.trim().replace('""', ''),
                      departed: val.ARS_PM_PDFT.trim().replace('""', ''),
                      remarks: val.ARS_PM_REMARK.trim().replace('""', ''),
                      type: val.ARS_PM_TYPE,
                      UID: val.UID,
                    });
                  } else {
                    x[62].push({
                      arrival: val.ARS_PM_ATAT.trim().replace('""', ''),
                      departed: val.ARS_PM_PDFT.trim().replace('""', ''),
                      remarks: val.ARS_PM_REMARK.trim().replace('""', ''),
                      type: val.ARS_PM_TYPE,
                      UID: val.UID,
                    });
                  }
                });
                console.log(x, 'res');

                setArrival([...x]);
              } else {
                console.log(x, 'res');

                setArrival([...x]);
              }
              setcallLoad(false);
            })
            .catch(error => {
              setcallLoad(false);
              console.log(error, 'Function error');
              setArrival([...x]);
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

    // pax crew movement
  }, []);
  const setArrivalcheck = index => {
    var tarrival = [...arrival];
    tarrival[index].checked = !tarrival[index].checked;
    setArrival(tarrival);
    // console.log('triggered', tcheckList);
  };
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

    switch (currentPicker.current[1]) {
      case 'aService':
        var tcheckList = {
          ...aService, [currentPicker.current[2]]: tConvert(
            new Date(date).toLocaleString('en-US', {
              hour12: false,
            }),
          )
        };
        console.log(currentPicker.current)
        setaService({ ...tcheckList }); break;
      case 'papaxHotel':
        var tcheckList = [...papaxHotel];
        tcheckList[currentPicker.current[0]][
          currentPicker.current[2]
        ] = tConvert(
          new Date(date).toLocaleString('en-US', {
            hour12: false,
          }),
        );
        setpapaxHotel([...tcheckList]); break;
      case 'pacrewHotel':
        var tcheckList = [...pacrewHotel];
        tcheckList[currentPicker.current[0]][
          currentPicker.current[2]
        ] = tConvert(
          new Date(date).toLocaleString('en-US', {
            hour12: false,
          }),
        );
        setpacrewHotel([...tcheckList]); break;
      case 'pacrewTransport':
        var tcheckList = [...pacrewTransport];
        tcheckList[currentPicker.current[0]][
          currentPicker.current[2]
        ] = tConvert(
          new Date(date).toLocaleString('en-US', {
            hour12: false,
          }),
        );
        setpacrewTransport([...tcheckList]); break;
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
    handleConfirm(new Date())
    // console.log(field);
    // var tarrival = [...arrival];
    // console.log(field);
    // if (pos != undefined) {
    //   tarrival[index][pos][field] = tConvert(
    //     new Date().toLocaleString('en-US', {
    //       hour12: false,
    //     }),
    //   );
    // } else {
    //   tarrival[index] = tConvert(
    //     new Date().toLocaleString('en-US', {
    //       hour12: false,
    //     }),
    //   );
    // }
    // setArrival(tarrival);
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
          var tarrival = [...arrival];
          tarrival[index].file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setArrival(tarrival);
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

  const onPressDocPreA_New = async (index, res) => {
    setloading(false);
    RNFetchBlob.fs
      .readFile(res.uri, 'base64')
      .then(encoded => {
        // console.log(encoded, 'reports.base64');
        setloading(false);
        var tarrival = [...arrival];
        tarrival[index].file.push({
          name: res.fileName.replace('rn_image_picker_lib_temp_', ''),
          base64: 'data:' + res.type + ';base64,' + encoded,
        });
        setArrival(tarrival);
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

  const removeFilePreA = (arrayIndex, index) => {
    var tarrival = [...arrival];
    tarrival[arrayIndex].file.splice(index, 1);
    setArrival(tarrival);
  };

  const [crewmove, setcrewmove] = useState(false);
  const [crewmovenum, setcrewmovenum] = useState(0);
  const addCrewMovement = () => {
    var tarrival = [...arrival];
    tarrival[62] = [
      ...arrival[62],
      { arrival: null, departed: null, remarks: null, type: 'Crew' },
    ];
    setArrival([...tarrival]);
  };
  const removeCrewMovement = index => {
    var service = [...arrival];
    service[62].splice(index, 1);
    setArrival(service);
  };

  const setArrivalData = (index, text, type, section) => {
    var tarrival = [...arrival];
    tarrival[index] = text;
    setArrival(tarrival);
  };
  const [callLoad, setcallLoad] = useState(false);
  const sendForm = () => {
    const email = auth().currentUser.email;
    const payload = {
      ARS_MOVACLANDED: arrival[0] ? arrival[0] : '""',
      ARS_MOVCHOCKIN: arrival[1] ? arrival[1] : '""',
      ARS_GPU_REQ: 0,
      ARS_GPU_START: arrival[2] ? arrival[2] : '""',
      ARS_GPU_STOP: arrival[3] ? arrival[3] : '""',
      ARS_PAX: arrival[4] ? arrival[4] : '""',
      ARS_CREW: arrival[5] ? arrival[5] : '""',
      ARS_BAGGAGE: arrival[6].value ? arrival[6].value : '""',
      ARS_CTR_CEO: arrival[15] ? arrival[15] : '""',
      ARS_CTR_CDT: arrival[18] ? arrival[18] : '""',
      ARS_CTR_REM: arrival[19] ? arrival[19] : '""',
      ARS_CTR_REQ: arrival[20].checked == true ? 1 : 0,
      ARS_WAS_CT: arrival[21] ? arrival[21] : '""',
      ARS_WAS_ET: arrival[22] ? arrival[22] : '""',
      ARS_WAS_REM: arrival[23] ? arrival[23] : '""',
      ARS_WAS_REQ: arrival[24].checked == true ? 1 : 0,
      ARS_LAS_ST: arrival[25] ? arrival[25] : '""',
      ARS_LAS_CT: '""',
      ARS_LAS_ET: arrival[26] ? arrival[26] : '""',
      ARS_LAS_REM: arrival[27] ? arrival[27] : '""',
      ARS_LAS_REQ: arrival[28].checked == true ? 1 : 0,
      ARS_RUS_CT: arrival[29] ? arrival[29] : '""',
      ARS_RUS_REM: arrival[30] ? arrival[30] : '""',
      ARS_RUS_REQ: arrival[31].checked == true ? 1 : 0,
      ARS_FOA_FTAT: arrival[32] ? arrival[32] : '""',
      ARS_FOA_START: arrival[33] ? arrival[33] : '""',
      ARS_FOA_END: arrival[34] ? arrival[34] : '""',
      ARS_FOA_REM: arrival[36] ? arrival[36] : '""',
      ARS_FOA_REQ: arrival[37].checked == true ? 1 : 0,
      ARS_TOS_START: arrival[38] ? arrival[38] : '""',
      ARS_TOS_END: arrival[39] ? arrival[39] : '""',
      ARS_TOS_REM: arrival[41] ? arrival[41] : '""',
      ARS_TOS_REQ: arrival[42].checked == true ? 1 : 0,
      ARS_OVB_NUMBER: arrival[43] ? arrival[43] : '""',
      ARS_OVB_REQ: arrival[44].checked == true ? 1 : 0,
      STATUS: 0,
      UID: uid ? uid : '',
      FUID: FUID,
      UPDATE_BY: email,
      ARS_CRM_CAT: arrival[46] ? arrival[46] : '""',
      ARS_CRM_CCIQ: arrival[48] ? arrival[48] : '""',
      ARS_CRM_CDA: arrival[45] ? arrival[45] : '""',
      ARS_CRM_CVA: arrival[47].checked == true ? 1 : 0,
      ARS_CRM_REM: '""',
      ARS_MOV_PXAT: arrival[8] ? arrival[8] : '""',
      ARS_MOV_PXCIQ: arrival[10] ? arrival[10] : '""',
      ARS_MOV_PXDA: arrival[7] ? arrival[7] : '""',
      ARS_MOV_PXVA: arrival[9].checked == true ? 1 : 0,
      ARS_MOV_VOA: arrival[12].checked == true ? 1 : 0,
    };
    console.log(payload, 'payload');
    setcallLoad(true);
    firebase
      .app()
      .functions('asia-southeast1')
      .httpsCallable('updateFlightModule?module=PostArrivalServices')(
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
    arrival[60].map(val => {
      firebase
        .app()
        .functions('asia-southeast1')
        .httpsCallable('updateFlightModule?module=PostArrivalServicesPM')(
          JSON.stringify({
            ARS_PM_PDFT: val.departed ? val.departed : '""',
            ARS_PM_ATAT: val.arrival ? val.arrival : '""',
            ARS_PM_REMARK: val.remarks ? val.remarks : '""',
            ARS_PM_TYPE: val.type ? val.type : '""',
            UID: val.UID ? val.UID : '',
            STATUS: 0,
            FUID: FUID,
            UPDATE_BY: email,
          }),
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
    });
    arrival[62].map(val => {
      firebase
        .app()
        .functions('asia-southeast1')
        .httpsCallable('updateFlightModule?module=PostArrivalServicesPM')(
          JSON.stringify({
            ARS_PM_PDFT: val.departed ? val.departed : '""',
            ARS_PM_ATAT: val.arrival ? val.arrival : '""',
            ARS_PM_REMARK: val.remarks ? val.remarks : '""',
            ARS_PM_TYPE: val.type ? val.type : '""',
            UID: val.UID ? val.UID : '',
            STATUS: 0,
            FUID: FUID,
            UPDATE_BY: email,
          }),
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
          Arrival Services
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
      </View>
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
            setNowPostDepart={() => setNow(0, 'aService', "ARS_MOVACLANDED")}
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
            setNowPostDepart={() => setNow(0, 'aService', "ARS_MOVCHOCKIN")}
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
                  setaService({ ...aService, ARS_GPU_REQ: !aService.ARS_GPU_REQ, ARS_GPU_START: "", ARS_GPU_STOP: "" })
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
              setNowPostDepart={() => setNow(0, 'aService', "ARS_GPU_START")}
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
              setNowPostDepart={() => setNow(0, 'aService', "ARS_GPU_STOP")}
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
            <Text style={styleSheet.label}>Number of Baggage Offloaded</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={styleSheet.input}
                value={aService.ARS_CREW}
                onChangeText={text => {
                  setaService({ ...aService, ARS_CREW: text });
                }}
              />
              <TouchableOpacity
                //onPress={event => onPressDocPreA(6)}
                onPress={() => {
                  // setuploadSection(6);
                  // refRBSheet.current.open();
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
            {/* {arrival[6].file.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                {arrival[6].file.map((value, index) => {
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
                            shadowOffset: { width: 0, height: 2 },
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
                        onPress={() => removeFilePreA(6, index)}>
                        <Icons
                          style={{ color: 'green', marginLeft: 10 }}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )} */}
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
                showDatePicker('time', 7);
              }}
              setNowPostDepart={() => setNow(7)}
              size={12}
              type={'time'}
              data={arrival[7]}
              index={12}
            />

            <DateTimeInput
              label={'Pax Arrived at Terminal (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 8);
              }}
              setNowPostDepart={() => setNow(8)}
              size={12}
              type={'time'}
              data={arrival[8]}
              index={12}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={event => setArrivalcheck(9)}>
                <Icons
                  name={
                    arrival[9].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={arrival[9].checked ? 'green' : 'black'}
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
              <TouchableOpacity onPress={event => setArrivalcheck(12)}>
                <Icons
                  name={
                    arrival[12].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={arrival[12].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>VOA Not Required</Text>
            </View>
            <DateTimeInput
              label={'Pax Completed CIQ (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 10);
              }}
              setNowPostDepart={() => setNow(10)}
              size={12}
              type={'time'}
              data={arrival[10]}
              index={12}
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
            {arrival[60].map((val, index) => {
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
                    label={
                      'Actual Transport Arrival Time at Airport (Local Time)'
                    }
                    //come here
                    notrequiredSection={false}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', 60, index);
                    }}
                    setNowPostDepart={() => setNow(60, index, 'arrival')}
                    size={12}
                    type={'time'}
                    data={val.arrival}
                    index={60}
                  />
                  <Text style={styleSheet.label}>
                    Left Terminal (Local Time)
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                      style={styleSheet.picker}
                      onPress={() =>
                        showDatePicker('time', 60, index, 'departed')
                      }>
                      <Text style={{ fontSize: 20, color: 'black' }}>
                        {val.departed ? val.departed : 'dd/mm/yy, -- : --'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setNow(60, index, 'departed')}
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
                      style={styleSheet.input}
                      multiline={true}
                      placeholder=""
                      numberOfLines={2}
                      value={val.remarks}
                      onChangeText={text => {
                        var tarrival = [...arrival];
                        tarrival[60][index].remarks = text;
                        setArrival(tarrival);
                      }}
                    />
                  </View>
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
                  setaService({ ...aService, ARS_CTR_REQ: !aService.ARS_CTR_REQ, ARS_CTR_CEO: "", ARS_CTR_CDT: "", ARS_CTR_REM: "" })
                  // setArrivalcheck(20);
                  // var x = [...arrival];
                  // //come here
                  // x[15] = null;
                  // x[16] = { value: null, file: [] };
                  // x[17] = { value: null, file: [] };
                  // x[18] = null;
                  // x[19] = null;
                  // setArrival(x);
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
                  // setuploadSection(16);
                  // refRBSheet.current.open();
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
            {/* {arrival[16].file.length > 0 && (
              <View style={{ marginBottom: 20, marginTop: 10 }}>
                {arrival[16].file.map((value, index) => {
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
                            shadowOffset: { width: 0, height: 2 },
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
                        onPress={() => removeFilePreA(16, index)}>
                        <Icons
                          style={{ color: 'green', marginLeft: 10 }}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )} */}
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
                  // setuploadSection(17);
                  // refRBSheet.current.open();
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
            {/* {arrival[17].file.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                {arrival[17].file.map((value, index) => {
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
                            shadowOffset: { width: 0, height: 2 },
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
                        onPress={() => removeFilePreA(17, index)}>
                        <Icons
                          style={{ color: 'green', marginLeft: 10 }}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )} */}

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
                  setaService({ ...aService, ARS_WAS_REQ: !aService.ARS_WAS_REQ, ARS_WAS_CT: "", ARS_WAS_ET: "", ARS_WAS_REM: "" })
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
                  setaService({ ...aService, ARS_LAS_REQ: !aService.ARS_LAS_REQ, ARS_LAS_CT: "", ARS_LAS_ET: "", ARS_LAS_REM: "" })
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
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <DateTimeInput
              disabled={aService.ARS_LAS_REQ}
              label={'Start Time (Local Time)'}
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
                  setaService({ ...aService, ARS_RUS_REQ: !aService.ARS_RUS_REQ, ARS_RUS_CT: "", ARS_RUS_REM: "" })
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
                  setaService({ ...aService, ARS_FOA_REQ: !aService.ARS_FOA_REQ, ARS_FOA_FTAT: "", ARS_FOA_START: "", ARS_FOA_END: "", ARS_FOA_REM: "" })
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
                disabled={arrival[37].checked}
                onPress={event => {
                  //onPressDocPreA(35)
                  // setuploadSection(35);
                  // refRBSheet.current.open();
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: arrival[37].checked
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{ color: 'green' }}>Upload</Text>
              </TouchableOpacity>
            </View>
            {/* {arrival[35].file.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                {arrival[35].file.map((value, index) => {
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
                            shadowOffset: { width: 0, height: 2 },
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
                        onPress={() => removeFilePreA(35, index)}>
                        <Icons
                          style={{ color: 'green', marginLeft: 10 }}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )} */}
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
                  setaService({ ...aService, ARS_TOS_REQ: !aService.ARS_TOS_REQ, ARS_TOS_START: "", ARS_TOS_END: "", ARS_TOS_REM: "" })
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
                disabled={arrival[42].checked}
                //onPress={event => onPressDocPreA(40)}
                onPress={() => {
                  // setuploadSection(40);
                  // refRBSheet.current.open();
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: arrival[42].checked
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{ color: 'green' }}>Upload</Text>
              </TouchableOpacity>
            </View>
            {/* {arrival[40].file.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                {arrival[40].file.map((value, index) => {
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
                            shadowOffset: { width: 0, height: 2 },
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
                        onPress={() => removeFilePreA(40, index)}>
                        <Icons
                          style={{ color: 'green', marginLeft: 10 }}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )} */}
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
                  setaService({ ...aService, ARS_OVB_REQ: !aService.ARS_OVB_REQ, ARS_OVB_NUMBER: "" })
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
                  setaService({ ...aService, ARS_CEC_REQ: !aService.ARS_CEC_REQ, ARS_CEC_REM: "" })
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
                disabled={aService.ARS_CEC_REQ ? true : true}
                //onPress={event => onPressDocPreA(40)}
                onPress={() => {
                  // setuploadSection(40);
                  // refRBSheet.current.open();
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
            {/* {arrival[40].file.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                {arrival[40].file.map((value, index) => {
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
                            shadowOffset: { width: 0, height: 2 },
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
                        onPress={() => removeFilePreA(40, index)}>
                        <Icons
                          style={{ color: 'green', marginLeft: 10 }}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )} */}
            <LabelledInput
              disabled={aService.ARS_CEC_REQ}
              label={'Remarks'} //mark
              data={aService.ARS_CEC_REM}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                setaService({ ...aService, ARS_CEC_REM: text });
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
                  setaService({ ...aService, ARS_LC_NR: !aService.ARS_LC_NR, ARS_LC_REM: "" })
                }}>
                <Icons
                  name={
                    aService.ARS_LC_REQ == 1
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={aService.ARS_LC_REQ == 1 ? 'green' : 'black'}
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
                disabled={aService.ARS_LC_REQ ? true : true}
                //onPress={event => onPressDocPreA(40)}
                onPress={() => {
                  // setuploadSection(40);
                  // refRBSheet.current.open();
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: aService.ARS_LC_REQ == 1
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{ color: 'green' }}>Upload</Text>
              </TouchableOpacity>
            </View>
            {/* {arrival[40].file.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                {arrival[40].file.map((value, index) => {
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
                            shadowOffset: { width: 0, height: 2 },
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
                        onPress={() => removeFilePreA(40, index)}>
                        <Icons
                          style={{ color: 'green', marginLeft: 10 }}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )} */}
            <LabelledInput
              disabled={aService.ARS_LC_REQ}
              label={'Remarks'} //mark
              data={aService.ARS_LC_REM}
              datatype={'text'}
              index={12}
              setText={(i, text, type, section) => {
                setaService({ ...aService, ARS_LC_REM: text });
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
                showDatePicker('time', 45);
              }}
              setNowPostDepart={() => setNow(45)}
              size={12}
              type={'time'}
              data={arrival[45]}
              index={12}
            />

            <DateTimeInput
              label={'Crew Arrived at Terminal (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 46);
              }}
              setNowPostDepart={() => setNow(46)}
              size={12}
              type={'time'}
              data={arrival[46]}
              index={12}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={event => setArrivalcheck(9)}>
                <Icons
                  name={
                    arrival[9].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={arrival[9].checked ? 'green' : 'black'}
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
              <TouchableOpacity onPress={event => setArrivalcheck(12)}>
                <Icons
                  name={
                    arrival[12].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={arrival[12].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>VOA Not Required</Text>
            </View>

            <DateTimeInput
              label={'Crew Completed CIQ (Local Time)'}
              showDatePickerPostDepart={() => {
                showDatePicker('time', 48);
              }}
              setNowPostDepart={() => setNow(48)}
              size={12}
              type={'time'}
              data={arrival[48]}
              index={12}
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
            {arrival[62].map((data, index) => {
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
                    label={
                      'Actual Transport Arrival Time at Airport (Local Time)'
                    }
                    notrequiredSection={false}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', 62, index, 'arrival');
                    }}
                    setNowPostDepart={() => {
                      setNow(62, index, 'arrival');
                    }}
                    size={12}
                    type={'time'}
                    data={data.arrival}
                    index={62}
                  />
                  <DateTimeInput
                    label={'Left Terminal (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', 62, index, 'departed');
                    }}
                    setNowPostDepart={() => {
                      setNow(62, index, 'departed');
                    }}
                    size={12}
                    type={'time'}
                    data={data.departed}
                    index={index}
                  />
                  <Text style={styleSheet.label}>Remarks</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      style={styleSheet.input}
                      multiline={true}
                      placeholder="Remarks"
                      numberOfLines={2}
                      value={data.remarks}
                      onChangeText={text => {
                        var tarrival = [...arrival];
                        tarrival[62][index].remarks = text;
                        setArrival(tarrival);
                      }}
                    />
                  </View>
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
