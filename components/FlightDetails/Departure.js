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
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, {useRef, useState, useEffect} from 'react';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import RBSheet from 'react-native-raw-bottom-sheet';
import Loader from '../Loader';
import LabelledInput from '../subcomponents/Forms/universal/labelledinput';
import DateTimeInput from '../subcomponents/Forms/universal/datetimeinput';
import {firebase} from '@react-native-firebase/functions';
import {ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';

const {height} = Dimensions.get('window');

export default function Departure(props) {
  const FUID = props.route.params.UID;

  const currentDepart = useRef(0);
  const refRBSheet = useRef();

  const [uploadSection, setuploadSection] = useState(0);

  const [loading, setloading] = useState(false);
  const [crewTransport, setcrewTransport] = useState([]);
  const [paxTransport, setpaxTransport] = useState([]);

  const [uid, setuid] = useState(null);

  const [paxarrivaltimeactive, setpaxarrivaltimeactive] = useState(false);
  const [paxboardedtimeactive, setpaxboardedtimeactive] = useState(false);
  const [paxarrivaltimeaddedactive, setpaxarrivaltimeaddedactive] = useState(
    [],
  );

  const [mode, setMode] = useState('time');
  const tConvert = datetime => {
    var date = datetime.split(',')[0].split('/');
    var time24 = datetime.split(', ')[1];
    var time = time24.split(':');
    return (
      date[1] + '/' + date[0] + '/' + date[2] + ', ' + time[0] + ':' + time[1]
    );
  };
  const [departure, setdeparture] = useState([
    null,
    null,
    null,
    {value: null, file: []},
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    null,
    {value: null, file: []},
    {checked: false, remarks: null},
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    {checked: false, remarks: null},
    null,
    {value: null, file: []},
    null,
    null,
    {checked: false, remarks: null},
    null,
    null,
    null,
    {value: null, file: []},
    null,
    {checked: false, remarks: null},
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    {value: null, file: []},
    null,
    null,
    null,
    [],
    [], //55
    [], //56
    null, //57
    null, //58
    null, //59
    null, //60

    //Pax Movement
    //- from Pickup location to airport
    null, //61
    null, //..2
    null, //..3
    {checked: false, remarks: null}, //..4
  ]);
  const [isDatePickerVisibleDepart, setDatePickerVisibilityDepart] =
    useState(false);
  const showDatePickerDepart = (type, index) => {
    currentDepart.current = [index];
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
    setcallLoad(true);
    firebase
      .app()
      .functions('asia-southeast1')
      .httpsCallable(
        'getFlightModule?fuid=' + FUID + '&module=GetDepartureServices',
      )()
      .then(response => {
        var packet = JSON.parse(response.data.body);
        var res = [...packet.Table];
        console.log(res[0], 'res');
        if (res.length > 0) {
          console.log(res[0]);
          setuid(res[0].UID);
          let x = [...departure];
          x[0] = res[0].DES_CREW
            ? res[0].DES_CREW.toString().trim().replace('""', '')
            : '';
          x[1] = res[0].DES_CRM_MAP
            ? res[0].DES_CRM_MAP.toString().trim().replace('""', '')
            : '';
          x[6] = res[0].DES_CRM_FDHC
            ? res[0].DES_CRM_FDHC.toString().trim().replace('""', '')
            : '';
          x[7] = res[0].DES_CRM_TCCIQ
            ? res[0].DES_CRM_TCCIQ.toString().trim().replace('""', '')
            : '';
          x[8] = res[0].DES_CRM_TCCAS
            ? res[0].DES_CRM_TCCAS.toString().trim().replace('""', '')
            : '';
          x[9] = res[0].DES_CRM_TCBTA
            ? res[0].DES_CRM_TCBTA.toString().trim().replace('""', '')
            : '';
          x[10] = res[0].DES_CRM_TCBA
            ? res[0].DES_CRM_TCBA.toString().trim().replace('""', '')
            : '';
          x[57] = res[0].DES_MVN_REM
            ? res[0].DES_MVN_REM.toString().trim().replace('""', '')
            : '';
          x[11] = res[0].DES_GPU_START
            ? res[0].DES_GPU_START.toString().trim().replace('""', '')
            : '';
          x[12] = res[0].DES_GPU_STOP
            ? res[0].DES_GPU_STOP.toString().trim().replace('""', '')
            : '';
          x[13].checked = res[0].DES_GPU_REQ == 1 ? true : false;
          x[14] = res[0].DES_FOD_TFTA
            ? res[0].DES_FOD_TFTA.toString().trim().replace('""', '')
            : '';
          x[15] = res[0].DES_FOD_START
            ? res[0].DES_FOD_START.toString().trim().replace('""', '')
            : '';
          x[16] = res[0].DES_FOD_END
            ? res[0].DES_FOD_END.toString().trim().replace('""', '')
            : '';
          // x[1] = res[0].DES_FOD_RECEIPT;
          x[18].checked = res[0].DES_FOD_REQ == 1 ? true : false;
          x[58] = res[0].DES_FOD_REM
            ? res[0].DES_FOD_REM.toString().trim().replace('""', '')
            : '';
          x[19] = res[0].DES_WAS_CT
            ? res[0].DES_WAS_CT.toString().trim().replace('""', '')
            : '';
          x[59] = res[0].DES_WAS_ET
            ? res[0].DES_WAS_ET.toString().trim().replace('""', '')
            : '';
          x[20] = res[0].DES_WAS_REM
            ? res[0].DES_WAS_REM.toString().trim().replace('""', '')
            : '';
          x[21].checked = res[0].DES_WAS_REQ == 1 ? true : false;
          x[22] = res[0].DES_LAS_CT
            ? res[0].DES_LAS_CT.toString().trim().replace('""', '')
            : '';
          x[60] = res[0].DES_LAS_ET
            ? res[0].DES_LAS_ET.toString().trim().replace('""', '')
            : '';
          x[23] = res[0].DES_LAS_REM
            ? res[0].DES_LAS_REM.toString().trim().replace('""', '')
            : '';
          x[24].checked = res[0].DES_LAS_REQ == 1 ? true : false;
          x[25] = res[0].DES_RUS_CT
            ? res[0].DES_RUS_CT.toString().trim().replace('""', '')
            : '';
          x[26] = res[0].DES_RUS_REM
            ? res[0].DES_RUS_REM.toString().trim().replace('""', '')
            : '';
          x[27].checked = res[0].DES_RUS_REQ == 1 ? true : false;
          x[28] = res[0].DES_CTR_EQUIP
            ? res[0].DES_CTR_EQUIP.toString().trim().replace('""', '')
            : '';
          // x[1] = res[0].DES_CTR_CEL?res[0].DES_CTR_CEL.toString().trim().replace('""', '')
          // : '';
          x[30] = res[0].DES_CTR_CDT
            ? res[0].DES_CTR_CDT.toString().trim().replace('""', '')
            : '';
          x[31] = res[0].DES_CTR_REM
            ? res[0].DES_CTR_REM.toString().trim().replace('""', '')
            : '';
          x[32].checked = res[0].DES_CTR_REQ == 1 ? true : false;
          x[33] = res[0].DES_ARB
            ? res[0].DES_ARB.toString().trim().replace('""', '')
            : '';
          x[34] = res[0].DES_PAX
            ? res[0].DES_PAX.toString().trim().replace('""', '')
            : '';
          x[35] = res[0].DES_BAG_OFFLOAD
            ? res[0].DES_BAG_OFFLOAD.toString().trim().replace('""', '')
            : '';
          // x[1] = res[0].DES_BAG_PHOTO?res[0].DES_BAG_PHOTO.toString().trim().replace('""', '')
          // : '';
          x[40] = res[0].DES_PXM_CIPAD
            ? res[0].DES_PXM_CIPAD.toString().trim().replace('""', '')
            : '';
          x[41] = res[0].DES_PXM_REFUND
            ? res[0].DES_PXM_REFUND.toString().trim().replace('""', '')
            : '';
          x[42] = res[0].DES_PXM_TPCIQ
            ? res[0].DES_PXM_TPCIQ.toString().trim().replace('""', '')
            : '';
          x[43] = res[0].DES_PXM_TPCAS
            ? res[0].DES_PXM_TPCAS.toString().trim().replace('""', '')
            : '';
          x[44] = res[0].DES_PXM_TPBTA
            ? res[0].DES_PXM_TPBTA.toString().trim().replace('""', '')
            : '';
          x[45] = res[0].DES_PXM_TPBA
            ? res[0].DES_PXM_TPBA.toString().trim().replace('""', '')
            : '';
          x[52] = res[0].DES_PXM_REM
            ? res[0].DES_PXM_REM.toString().trim().replace('""', '')
            : '';
          x[46] = res[0].DES_DCT
            ? res[0].DES_DCT.toString().trim().replace('""', '')
            : '';
          x[47] = res[0].DES_MVN_CHOCKS
            ? res[0].DES_MVN_CHOCKS.toString().trim().replace('""', '')
            : '';
          x[48] = res[0].DES_MVN_PUSH
            ? res[0].DES_MVN_PUSH.toString().trim().replace('""', '')
            : '';
          x[49] = res[0].DES_MVN_TAKE
            ? res[0].DES_MVN_TAKE.toString().trim().replace('""', '')
            : '';
          x[51] = res[0].DES_CRM_REM
            ? res[0].DES_CRM_REM.toString().trim().replace('""', '')
            : '';

          setdeparture([...x]);
        }
        // setcallLoad(false);
        firebase
          .app()
          .functions('asia-southeast1')
          .httpsCallable(
            'getFlightModule?fuid=' +
              FUID +
              '&module=GetDepartureServicesMovement',
          )()
          .then(response => {
            //get pax & crew transport

            var packet = JSON.parse(response.data.body);
            var res = packet.Table;
            console.log(res);
            if (res && res.length > 0) {
              var apaxTransport = [];
              var acrewTransport = [];
              res.forEach((val, index) => {
                if (val.DES_TYPE == 'Pax') {
                  apaxTransport.push({
                    atat: val.DES_CRM_TAT.trim().replace('""', ''),
                    tcbt: val.DES_CRM_TCBT.trim().replace('""', ''),
                    tcat: val.DES_CRM_TCAT.trim().replace('""', ''),
                    remarks: val.DES_CRM_REM.trim().replace('""', ''),
                    type: val.DES_TYPE,
                    UID: val.UID,
                  });
                } else {
                  acrewTransport.push({
                    atat: val.DES_CRM_TAT.trim().replace('""', ''),
                    tcbt: val.DES_CRM_TCBT.trim().replace('""', ''),
                    tcat: val.DES_CRM_TCAT.trim().replace('""', ''),
                    remarks: val.DES_CRM_REM.trim().replace('""', ''),
                    type: val.DES_TYPE,
                    UID: val.UID,
                  });
                }
              });
              setcallLoad(false);
              console.log('acrewTransport', acrewTransport);
              console.log('apaxTransport', apaxTransport);
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
      })
      .catch(error => {
        setcallLoad(false);
        console.log(error, 'Function error');
      });
  }, []);
  const handleConfirmDepart = date => {
    console.log('A date has been picked: ', date);

    if (currentDepart.current.length > 1) {
      if (currentDepart.current[1] == 'crewTransport') {
        var tdeparture = [...crewTransport];
        tdeparture[currentDepart.current[0]][currentDepart.current[2]] =
          tConvert(
            new Date(date).toLocaleString('en-US', {
              hour12: false,
            }),
          );
        setcrewTransport(tdeparture);
      } else if (currentDepart.current[1] == 'paxTransport') {
        var tdeparture = [...paxTransport];
        tdeparture[currentDepart.current[0]][currentDepart.current[2]] =
          tConvert(
            new Date(date).toLocaleString('en-US', {
              hour12: false,
            }),
          );
        console.log('sdfsds', tdeparture);
        setpaxTransport(tdeparture);
      }
    } else {
      var tdeparture = [...departure];
      tdeparture[currentDepart.current[0]] = tConvert(
        new Date(date).toLocaleString('en-US', {
          hour12: false,
        }),
      );
      setdeparture(tdeparture);
    }

    hideDatePickerDeparture();
  };
  const setNowDepart = index => {
    var tdeparture = [...departure];
    tdeparture[index] = tConvert(
      new Date().toLocaleString('en-US', {
        hour12: false,
      }),
    );
    setdeparture(tdeparture);
  };
  const setNowTrans = (index, field) => {
    var tdeparture = [...crewTransport];
    tdeparture[index][field] = tConvert(
      new Date().toLocaleString('en-US', {
        hour12: false,
      }),
    );
    console.log(tdeparture);
    setcrewTransport(tdeparture);
  };
  const setNowPaxTrans = (index, field) => {
    var tdeparture = [...paxTransport];
    tdeparture[index][field] = tConvert(
      new Date().toLocaleString('en-US', {
        hour12: false,
      }),
    );
    console.log(tdeparture);
    setpaxTransport([...tdeparture]);
  };
  const setCheckedDepart = index => {
    var tdeparture = [...departure];
    tdeparture[index].checked = !tdeparture[index].checked;
    setdeparture(tdeparture);
    // console.log('triggered', tcheckList);
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
          var tdeparture = [...departure];
          tdeparture[index].file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setdeparture(tdeparture);
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
    var tdeparture = [...departure];
    tdeparture[arrayIndex].file.splice(index, 1);
    setdeparture(tdeparture);
  };
  const onPressDocPreTrans = async index => {
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
          var tdeparture = [...crewTransport];
          tdeparture[index].mapF.file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setcrewTransport(tdeparture);
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
  const removeFilePreTrans = (arrayIndex, index) => {
    var tdeparture = [...crewTransport];
    tdeparture[arrayIndex].mapF.file.splice(index, 1);
    setcrewTransport(tdeparture);
  };
  const addCrewTransport = () => {
    var tcrewTransport = [...crewTransport];
    tcrewTransport.push({
      atat: null,
      tcbt: null,
      tcat: null,
      remarks: null,
      type: 'Crew',
    });
    console.log(tcrewTransport);
    setcrewTransport([...tcrewTransport]);
  };
  const onRemoveCrewTransport = index => {
    var service = [...crewTransport];
    service.splice(index, 1);
    setcrewTransport([...service]);
  };

  const onPressDocPrePaxTrans = async index => {
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
          var tdeparture = [...departure];
          tdeparture[54][index].mapF.file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setdeparture(tdeparture);
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

  const [uploadaddedsection, setuploadaddedsection] = useState(false);
  const [addedpaxindex, setaddedpaxindex] = useState(0);

  const onPressDocPreA_New = async (index, res) => {
    console.log('HEREEEE', uploadSection, index);
    setloading(false);
    RNFetchBlob.fs
      .readFile(res.uri, 'base64')
      .then(encoded => {
        // console.log(encoded, 'reports.base64');
        setloading(false);
        if (uploadaddedsection) {
          var tdeparture = [...crewTransport];
          tdeparture[index].mapF.file.push({
            name: res.fileName.replace('rn_image_picker_lib_temp_', ''),
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setcrewTransport(tdeparture);
        } else if (index === 55) {
          var tdeparture = [...departure];
          tdeparture[55][addedpaxindex].hotelMap.file.push({
            name: res.fileName,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setdeparture(tdeparture);
        } else {
          var tdeparture = [...departure];
          tdeparture[index].file.push({
            name: res.fileName.replace('rn_image_picker_lib_temp_', ''),
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setdeparture(tdeparture);
        }
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

  const removeFilePrePaxTrans = (arrayIndex, index) => {
    var tdeparture = [...departure];
    tdeparture[arrayIndex].mapF.file.splice(index, 1);
    setdeparture(tdeparture);
  };
  const addpaxTransport = () => {
    var tcpaxTransport = [...paxTransport];
    tcpaxTransport.push({
      atat: null,
      tcbt: null,
      tcat: null,
      remarks: null,
      type: 'Pax',
    });
    console.log(tcpaxTransport);
    setpaxTransport([...tcpaxTransport]);
  };
  const onRemovePaxTransport = index => {
    var service = [...paxTransport];
    service.splice(index, 1);
    setpaxTransport([...service]);
  };
  const [callLoad, setcallLoad] = useState(false);
  const sendForm = () => {
    setcallLoad(true);
    const email = auth().currentUser.email;
    var payload = {
      DES_CREW: departure[0] ? departure[0].trim() : '""',
      DES_CRM_MAP: departure[1] ? departure[1].trim() : '""',
      DES_CRM_FDHC: departure[6] ? departure[6].trim() : '""',
      DES_CRM_TCCIQ: departure[7] ? departure[7].trim() : '""',
      DES_CRM_TCCAS: departure[8] ? departure[8].trim() : '""',
      DES_CRM_TCBTA: departure[9] ? departure[9].trim() : '""',
      DES_CRM_TCBA: departure[10] ? departure[10].trim() : '""',
      DES_MVN_REM: departure[57] ? departure[57].trim() : '""',
      DES_GPU_START: departure[11] ? departure[11].trim() : '""',
      DES_GPU_STOP: departure[12] ? departure[12].trim() : '""',
      DES_GPU_REQ: departure[13].checked ? 1 : 0,
      DES_FOD_TFTA: departure[14] ? departure[14].trim() : '""',
      DES_FOD_START: departure[15] ? departure[15].trim() : '""',
      DES_FOD_END: departure[16] ? departure[16].trim() : '""',
      DES_FOD_RECEIPT: '""',
      DES_FOD_REQ: departure[18].checked ? 1 : 0,
      DES_FOD_REM: departure[58] ? departure[58].trim() : '""',
      DES_WAS_CT: departure[19] ? departure[19].trim() : '""',
      DES_WAS_ET: departure[59] ? departure[59].trim() : '""',
      DES_WAS_REM: departure[20] ? departure[20].trim() : '""',
      DES_WAS_REQ: departure[21].checked ? 1 : 0,
      DES_LAS_CT: departure[22] ? departure[22].trim() : '""',
      DES_LAS_ET: departure[60] ? departure[60].trim() : '""',
      DES_LAS_REM: departure[23] ? departure[23].trim() : '""',
      DES_LAS_REQ: departure[24].checked ? 1 : 0,
      DES_RUS_CT: departure[25] ? departure[25].trim() : '""',
      DES_RUS_REM: departure[26] ? departure[26].trim() : '""',
      DES_RUS_REQ: departure[27].checked ? 1 : 0,
      DES_CTR_EQUIP: departure[28] ? departure[28].trim() : '""',
      DES_CTR_CEL: '""',
      DES_CTR_CDT: departure[30] ? departure[30].trim() : '""',
      DES_CTR_REM: departure[31] ? departure[31].trim() : '""',
      DES_CTR_REQ: departure[32].checked ? 1 : 0,
      DES_ARB: departure[33] ? departure[33].trim() : '""',
      DES_PAX: departure[34] ? departure[34].trim() : '""',
      DES_BAG_OFFLOAD: departure[35] ? departure[35].trim() : '""',
      DES_BAG_PHOTO: '""',
      DES_PXM_CIPAD: departure[40] ? departure[40].trim() : '""',
      DES_PXM_REFUND: departure[41] ? departure[41].trim() : '""',
      DES_PXM_TPCIQ: departure[42] ? departure[42].trim() : '""',
      DES_PXM_TPCAS: departure[43] ? departure[43].trim() : '""',
      DES_PXM_TPBTA: departure[44] ? departure[44].trim() : '""',
      DES_PXM_TPBA: departure[45] ? departure[45].trim() : '""',
      DES_PXM_REM: departure[52] ? departure[52].trim() : '""',
      DES_DCT: departure[46] ? departure[46].trim() : '""',
      DES_MVN_CHOCKS: departure[47] ? departure[47].trim() : '""',
      DES_MVN_PUSH: departure[48] ? departure[48].trim() : '""',
      DES_MVN_TAKE: departure[49] ? departure[49].trim() : '""',
      DES_CRM_REM: departure[51] ? departure[51].trim() : '""',
      STATUS: 0,
      UPDATE_BY: email,
      FUID: FUID,
    };
    if (uid) {
      payload.UID = uid;
    }
    console.log(payload, 'payload');
    firebase
      .app()
      .functions('asia-southeast1')
      .httpsCallable('updateFlightModule?module=PostDepartureServices')(
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
    // console.log('paxTransport', paxTransport);
    paxTransport.map(val => {
      firebase
        .app()
        .functions('asia-southeast1')
        .httpsCallable('updateFlightModule?module=PostDepartureMovement')(
          JSON.stringify({
            DES_CRM_TAT: val.atat ? val.atat : '""',
            DES_CRM_TCBT: val.tcbt ? val.tcbt : '""',
            DES_CRM_TCAT: val.tcat ? val.tcat : '""',
            DES_CRM_REM: val.remarks ? val.remarks : '""',
            DES_TYPE: val.type ? val.type : '""',
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
    crewTransport.map(val => {
      firebase
        .app()
        .functions('asia-southeast1')
        .httpsCallable('updateFlightModule?module=PostDepartureMovement')(
          JSON.stringify({
            DES_CRM_TAT: val.atat ? val.atat : '""',
            DES_CRM_TCBT: val.tcbt ? val.tcbt : '""',
            DES_CRM_TCAT: val.tcat ? val.tcat : '""',
            DES_CRM_REM: val.remarks ? val.remarks : '""',
            DES_TYPE: val.type ? val.type : '""',
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
            fontSize: 24,
            fontWeight: 'bold',
            color: 'black',
            paddingLeft: 20,
          }}>
          Departure
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
        <View style={{padding: 20, marginBottom: 100}}>
          <Text style={styleSheet.label}>Number of Crew</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={departure[0]}
              onChangeText={text => {
                var tdeparture = [...departure];
                tdeparture[0] = text;
                setdeparture(tdeparture);
              }}
            />
          </View>
          {/*   ------------------------------Crew Movement	 ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>
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
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Transport
                </Text>
              </TouchableOpacity>
            </View>
            {crewTransport.map((val, index) => {
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
                      onPress={() => onRemoveCrewTransport(index)}>
                      <Icons name="minus-box-outline" color="red" size={30} />
                    </TouchableOpacity>
                  </View>
                  <DateTimeInput
                    label={
                      'Actual Transport Arrival Time at Pickup Location (Local'
                    }
                    showDatePickerPostDepart={() => {
                      showDatePickerTrans('time', index, 'atat');
                    }}
                    setNowPostDepart={() => {
                      setNowTrans(index, 'atat');
                    }}
                    notrequiredSection={true}
                    size={12}
                    added={true}
                    type={'time'}
                    data={val.atat}
                    index={index}
                  />
                  <DateTimeInput
                    label={
                      'Time Crew Boarded Transport at Pickup Location (Local'
                    }
                    showDatePickerPostDepart={() => {
                      showDatePickerTrans('time', index, 'tcbt');
                    }}
                    setNowPostDepart={() => {
                      setNowTrans(index, 'tcbt');
                    }}
                    notrequiredSection={true}
                    size={12}
                    added={true}
                    type={'time'}
                    data={val.tcbt}
                    index={index}
                  />

                  <DateTimeInput
                    label={'Time Crew Arrived at Terminal (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePickerTrans('time', index, 'tcat');
                    }}
                    setNowPostDepart={() => {
                      setNowTrans(index, 'tcat');
                    }}
                    size={12}
                    added={true}
                    type={'time'}
                    data={val.tcat}
                    index={index}
                  />
                  <Text style={styleSheet.label}>Remarks</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput
                      style={[styleSheet.input]}
                      multiline={true}
                      numberOfLines={2}
                      value={val.remarks}
                      onChangeText={text => {
                        var tdeparture = [...crewTransport];
                        tdeparture[index].remarks = text;
                        setcrewTransport([...tdeparture]);
                      }}
                    />
                  </View>
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
            <Text style={[styleSheet.label]}>
              Flight Documents Handover to Crew (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 6)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[6] ? departure[6] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(6)}
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
              Time Crew Cleared CIQ (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 7)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[7] ? departure[7] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(7)}
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
              Time Crew Cleared Airport Security (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 8)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[8] ? departure[8] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(8)}
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
              Time Crew Boarded Transport to Aircraft (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 9)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[9] ? departure[9] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(9)}
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
              Time Crew Boarded Aircraft (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDepart('time', 10)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[10] ? departure[10] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDepart(10)}
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
            <LabelledInput
              label={'Remarks'} //mark
              data={departure[57]}
              datatype={'text'}
              index={57}
              setText={(index, text, type, section) => {
                var tcheckList = [...departure];
                tcheckList[index] = text;
                setdeparture(tcheckList);
              }}
              multiline={true}
              numberOfLines={2}
            />
          </View>
          {/*   ------------------------------Crew Movement	 End ----------- */}

          {/*   ------------------------------Ground Power Unit(GPU) start ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>
            Ground Power Unit(GPU):
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
                  setCheckedDepart(13);
                  var x = [...departure];
                  x[11] = null;
                  x[12] = null;
                  setdeparture(x);
                }}>
                <Icons
                  name={
                    departure[13].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={departure[13].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Start Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[13].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[13].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 11)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[11] ? departure[11] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[13].checked}
                onPress={() => setNowDepart(11)}
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
            <Text style={styleSheet.label}>Stop Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[13].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[13].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 12)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[12] ? departure[12] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[13].checked}
                onPress={() => setNowDepart(12)}
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
          {/*   ------------------------------Ground Power Unit(GPU) end ----------- */}

          {/*   ------------------------------Fuel on Departure start ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>
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
                  setCheckedDepart(18);
                  var x = [...departure];
                  x[14] = null;
                  x[15] = null;
                  x[16] = null;
                  x[17] = {value: false, file: []};
                  x[58] = null;
                  setdeparture(x);
                }}>
                <Icons
                  name={
                    departure[18].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={departure[18].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>
              Time Fuel Truck Arrived (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[18].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[18].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 14)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[14] ? departure[14] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[18].checked}
                onPress={() => setNowDepart(14)}
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
            <Text style={styleSheet.label}>Start Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[18].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[18].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 15)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[15] ? departure[15] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[18].checked}
                onPress={() => setNowDepart(15)}
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
            <Text style={styleSheet.label}>End Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[18].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[18].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 16)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[16] ? departure[16] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[18].checked}
                onPress={() => setNowDepart(16)}
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text style={styleSheet.label}>Fuel Receipt (signed)</Text>
              <TouchableOpacity
                //onPress={event => onPressDocPreA(17)}
                onPress={() => {
                  setuploadaddedsection(false);
                  setuploadSection(17);
                  refRBSheet.current.open();
                }}
                disabled={departure[18].checked}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: departure[18].checked
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{color: 'green'}}>Take Camera</Text>
              </TouchableOpacity>
            </View>
            {departure[17].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {departure[17].file.map((value, index) => {
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
                      <TouchableOpacity
                        onPress={() => removeFilePreA(17, index)}>
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
            <LabelledInput
              label={'Remarks'} //mark
              disabled={departure[18].checked}
              data={departure[58]}
              datatype={'text'}
              index={58}
              setText={(index, text, type, section) => {
                var tcheckList = [...departure];
                tcheckList[index] = text;
                setdeparture([...tcheckList]);
              }}
              multiline={true}
              numberOfLines={2}
            />
          </View>
          {/*   ------------------------------Fuel on Departure end ----------- */}

          {/*   ------------------------------Water Service ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>
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
                  setCheckedDepart(21);
                  var x = [...departure];
                  x[19] = null;
                  x[59] = null;
                  setdeparture(x);
                }}>
                <Icons
                  name={
                    departure[21].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={departure[21].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Start Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[21].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[21].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 19)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[19] ? departure[19] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[21].checked}
                onPress={() => setNowDepart(19)}
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
            <Text style={styleSheet.label}>Stop Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[21].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[21].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 19)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[59] ? departure[59] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[21].checked}
                onPress={() => setNowDepart(59)}
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
            <LabelledInput
              label={'Remarks'} //mark
              disabled={departure[21].checked}
              data={departure[20]}
              datatype={'text'}
              index={20}
              setText={(index, text, type, section) => {
                var tcheckList = [...departure];
                tcheckList[index] = text;
                setdeparture(tcheckList);
              }}
              multiline={true}
              numberOfLines={2}
            />
          </View>
          {/*   ------------------------------Water Service end ----------- */}

          {/*   ------------------------------Lavatory Service ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>
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
                  setCheckedDepart(24);
                  var x = [...departure];
                  x[22] = null;
                  x[60] = null;
                  setdeparture(x);
                }}>
                <Icons
                  name={
                    departure[24].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={departure[24].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Start Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[24].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[24].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 22)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[22] ? departure[22] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[24].checked}
                onPress={() => setNowDepart(22)}
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
            <Text style={styleSheet.label}>Stop Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[24].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[24].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 22)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[60] ? departure[60] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[24].checked}
                onPress={() => setNowDepart(60)}
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
            <LabelledInput
              label={'Remarks'} //mark
              disabled={departure[24].checked}
              data={departure[23]}
              datatype={'text'}
              index={23}
              setText={(index, text, type, section) => {
                var tcheckList = [...departure];
                tcheckList[index] = text;
                setdeparture(tcheckList);
              }}
              multiline={true}
              numberOfLines={2}
            />
          </View>
          {/*   ------------------------------Lavatory Service end ----------- */}

          {/*   ------------------------------Rubbish Service ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>
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
                  setCheckedDepart(27);
                  var x = [...departure];
                  x[25] = null;
                  setdeparture(x);
                }}>
                <Icons
                  name={
                    departure[27].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={departure[27].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Completion Time (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[27].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[27].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 25)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[25] ? departure[25] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[27].checked}
                onPress={() => setNowDepart(25)}
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
            <LabelledInput
              label={'Remarks'} //mark
              disabled={departure[27].checked}
              data={departure[26]}
              datatype={'text'}
              index={26}
              setText={(index, text, type, section) => {
                var tcheckList = [...departure];
                tcheckList[index] = text;
                setdeparture(tcheckList);
              }}
              multiline={true}
              numberOfLines={2}
            />
          </View>
          {/*   ------------------------------Rubbish Service end ----------- */}

          {/*   ------------------------------Catering ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>Catering:</Text>
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
                  setCheckedDepart(32);
                  var x = [...departure];
                  x[28] = null;
                  x[29] = {value: false, file: []};
                  x[30] = null;
                  setdeparture(x);
                }}>
                <Icons
                  name={
                    departure[32].checked
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={departure[32].checked ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>
            <Text style={styleSheet.label}>Catering Equipment Loaded</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                editable={!departure[32].checked}
                style={[
                  styleSheet.input,
                  {
                    backgroundColor: departure[32].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                value={departure[28]}
                onChangeText={text => {
                  var tdeparture = [...departure];
                  tdeparture[28] = text;
                  setdeparture(tdeparture);
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
              <Text style={styleSheet.label}>
                Catering Equipment List / Photo
              </Text>
              <TouchableOpacity
                disabled={departure[32].checked}
                //onPress={event => onPressDocPreA(29)}
                onPress={() => {
                  setuploadaddedsection(false);
                  setuploadSection(29);
                  refRBSheet.current.open();
                }}
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: departure[32].checked
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                }}>
                <Text style={{color: 'green'}}>Take Camera</Text>
              </TouchableOpacity>
            </View>
            {departure[29].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {departure[29].file.map((value, index) => {
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
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        {value.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeFilePreA(29, index)}>
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
            <Text style={styleSheet.label}>
              Catering Delivery Time (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[32].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[32].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 30)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[30] ? departure[30] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[32].checked}
                onPress={() => setNowDepart(30)}
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

            <LabelledInput
              label={'Remarks'} //mark
              disabled={departure[32].checked}
              data={departure[31]}
              datatype={'text'}
              index={31}
              setText={(index, text, type, section) => {
                var tcheckList = [...departure];
                tcheckList[index] = text;
                setdeparture(tcheckList);
              }}
              multiline={true}
              numberOfLines={2}
            />
          </View>
          {/*   ------------------------------Catering end ----------- */}

          <Text style={styleSheet.label}>
            Aircraft Ready For Boarding (Local Time)
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDepart('time', 33)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {departure[33] ? departure[33] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDepart(33)}
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
          <Text style={styleSheet.label}>Number of Pax</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={departure[34]}
              onChangeText={text => {
                var tdeparture = [...departure];
                tdeparture[34] = text;
                setdeparture(tdeparture);
              }}
            />
          </View>
          {/*   ------------------------------Baggage ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>Baggage:</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <Text style={styleSheet.label}>Number of Baggage Offloaded</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styleSheet.input}
                value={departure[35]}
                onChangeText={text => {
                  var tdeparture = [...departure];
                  tdeparture[35] = text;
                  setdeparture(tdeparture);
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
              <Text style={styleSheet.label}>Baggage Photo</Text>
              <TouchableOpacity
                //onPress={event => onPressDocPreA(36)}
                onPress={() => {
                  setuploadaddedsection(false);
                  setuploadSection(36);
                  refRBSheet.current.open();
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
            {departure[36].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {departure[36].file.map((value, index) => {
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
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        {value.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeFilePreA(36, index)}>
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
          </View>
          {/*   ------------------------------Baggage end ----------- */}

          {/*   ------------------------------Pax Movement //here ----------- */}
          <Text style={[styleSheet.label, {marginTop: 10}]}>Pax Movement:</Text>
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
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Movement
                </Text>
              </TouchableOpacity>
            </View>
            {paxTransport.map((val, index) => {
              var arr = [];
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
                      onPress={() => onRemovePaxTransport(index)}>
                      <Icons name="minus-box-outline" color="red" size={30} />
                    </TouchableOpacity>
                  </View>

                  <DateTimeInput
                    label={
                      'Actual Transport Arrival Time at Pickup Location (Local Time)'
                    }
                    notrequiredSection={true}
                    showLabel={true}
                    disabled={paxarrivaltimeaddedactive.includes(index)}
                    showDatePickerPostDepart={() =>
                      showDatePickerPaxTrans('time', index, 'atat')
                    }
                    setNowPostDepart={() => setNowPaxTrans(index, 'atat')}
                    added={true}
                    size={12}
                    type={'datetime'}
                    data={val.atat}
                    index={index}
                  />

                  <DateTimeInput
                    label={
                      'Time Pax Boarded Transport at Terminal (Local Time)'
                    }
                    notrequiredSection={true}
                    disabled={false}
                    showDatePickerPostDepart={() =>
                      showDatePickerPaxTrans('time', index, 'tcbt')
                    }
                    setNowPostDepart={() => setNowPaxTrans(index, 'tcbt')}
                    size={12}
                    type={'datetime'}
                    data={val.tcbt}
                    index={index}
                  />

                  <DateTimeInput
                    label={'Time Pax Arrived at Terminal (Local Time)'}
                    disabled={false}
                    showDatePickerPostDepart={() =>
                      showDatePickerPaxTrans('time', index, 'tcat')
                    }
                    setNowPostDepart={() => setNowPaxTrans(index, 'tcat')}
                    size={12}
                    type={'datetime'}
                    data={val.tcat}
                    index={index}
                  />

                  <Text style={styleSheet.label}>Remarks</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput
                      style={[styleSheet.input]}
                      multiline={true}
                      numberOfLines={2}
                      value={val.remarks}
                      onChangeText={text => {
                        var tdeparture = [...paxTransport];
                        tdeparture[index].remarks = text;
                        setpaxTransport([...tdeparture]);
                      }}
                    />
                  </View>
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
            <Text style={styleSheet.label}>
              Crew Informed of Pax Arrival and Details (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[38].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[38].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 40)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[40] ? departure[40] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[38].checked}
                onPress={() => setNowDepart(40)}
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
              VAT/GST Refund Completed (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[38].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[38].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 41)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[41] ? departure[41] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[38].checked}
                onPress={() => setNowDepart(41)}
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
              Time Pax Cleared CIQ (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[38].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[38].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 42)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[42] ? departure[42] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[38].checked}
                onPress={() => setNowDepart(42)}
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
              Time Pax Cleared Airport Security (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[38].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[38].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 43)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[43] ? departure[43] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[38].checked}
                onPress={() => setNowDepart(43)}
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
              Time Pax Boarded Transport to Aircraft (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[38].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[38].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 44)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[44] ? departure[44] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[38].checked}
                onPress={() => setNowDepart(44)}
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
              Time Pax Boarded Aircraft (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                disabled={departure[38].checked}
                style={[
                  styleSheet.picker,
                  {
                    backgroundColor: departure[38].checked
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}
                onPress={() => showDatePickerDepart('time', 45)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {departure[45] ? departure[45] : 'dd/mm/yy, -- : --'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={departure[38].checked}
                onPress={() => setNowDepart(45)}
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
                style={[styleSheet.input]}
                multiline={true}
                numberOfLines={2}
                value={departure[52]}
                onChangeText={text => {
                  var tdeparture = [...departure];
                  tdeparture[52] = text;
                  setdeparture(tdeparture);
                }}
              />
            </View>
            {
              //mark`
              //ADD
              //REMARKS
            }
          </View>
          {/*   ------------------------------Pax Movement end ----------- */}

          <Text style={styleSheet.label}>Door Close Time (Local Time)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDepart('time', 46)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {departure[46] ? departure[46] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDepart(46)}
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
            Movement (Chocks Off) (Local Time)
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDepart('time', 47)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {departure[47] ? departure[47] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDepart(47)}
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
            Movement (Push Back) (Local Time)
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDepart('time', 48)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {departure[48] ? departure[48] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDepart(48)}
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
          <Text style={styleSheet.label}>Movement (Take Off) (Local Time)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDepart('time', 49)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {departure[49] ? departure[49] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDepart(49)}
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
          <Text style={styleSheet.label}>Additional Remarks</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={[styleSheet.input]}
              multiline={true}
              numberOfLines={2}
              value={departure[51]}
              onChangeText={text => {
                var tdeparture = [...departure];
                tdeparture[51] = text;
                setdeparture(tdeparture);
              }}
            />
          </View>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisibleDepart}
          mode={mode}
          onConfirm={handleConfirmDepart}
          onCancel={hideDatePickerDepart}
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
      </ScrollView>
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
