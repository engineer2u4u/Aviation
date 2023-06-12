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
import React, { useRef, useState, useEffect } from 'react';
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
import { firebase } from '@react-native-firebase/functions';
import { ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import s from '../subcomponents/Forms/FlightPreparation/form.styles';

const { height } = Dimensions.get('window');

export default function PreArrival(props) {
  const FUID = props.route.params.UID;
  const [uid, setuid] = useState(null);
  const pHotel = useRef();
  const pTransport = useRef();
  const cTransport = useRef();
  const cHotel = useRef();
  const [pacheck, setpacheck] = useState({ "CREATED_BY": "", "CREATED_DATE": "", "FUID": "", "LAST_UPDATE": "", "PAC_CER": 0, "PAC_CER_REM": "", "PAC_CHA": 0, "PAC_CHA_REM": "", "PAC_CHNR": null, "PAC_CTA": 0, "PAC_CTA_REM": "", "PAC_CTNR": null, "PAC_IAS": 0, "PAC_IAS_REM": "", "PAC_ICAI": 0, "PAC_ICAI_REM": "", "PAC_ICC": 0, "PAC_ICC_REM": "", "PAC_IFBO": 0, "PAC_IFBO_REM": "", "PAC_IHA": 0, "PAC_IHA_REM": "", "PAC_IRP": 0, "PAC_IRP_REM": "", "PAC_PAGD": 0, "PAC_PAGD_REM": "", "PAC_PER": 0, "PAC_PER_REM": "Pax entry", "PAC_PHA": 0, "PAC_PHA_REM": "", "PAC_PHNR": 0, "PAC_PRA": 0, "PAC_PRA_REM": "", "PAC_PTA": 0, "PAC_PTA_REM": "", "PAC_PTNR": 0, "PAC_UAGD": 0, "STATUS": 0, "UID": "", "UPDATE_BY": "" })

  const [papaxHotel, setpapaxHotel] = useState([]);
  const [pacrewHotel, setpacrewHotel] = useState([]);
  const [papaxTransport, setpapaxTransport] = useState([]);
  const [pacrewTransport, setpacrewTransport] = useState([]);

  const [checkList, setChecklist] = useState([
    { checked: false, remarks: '' },
    { checked: false, remarks: '' },
    { checked: false, remarks: '' },
    { checked: false, remarks: '' },
    { checked: false, remarks: '' },
    { checked: false, remarks: '' },
    { checked: false, remarks: '' },
    { checked: false, remarks: '' },
    { checked: false, remarks: '' },
    { checked: false, remarks: '' },
    { checked: false, file: [], remarks: '' },
    { checked: false, remarks: '' },

    [], //12
    [],
    [],
    [],
    { checked: false, remarks: '' }, //16
    { checked: false, remarks: '' }, //17
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
          setpacheck(res)
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
          // console.log(x);
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
        console.log(res);
        if (res.length > 0) {
          var paxHotelArr = [];
          var crewHotelArr = [];
          res.forEach((val, index) => {
            val.PCH_DATE_CHECKIN = mConvert(val.PCH_DATE_CHECKIN, 'date');
            val.PCH_DATE_CHECKOUT = mConvert(val.PCH_DATE_CHECKOUT, 'date');
            if (val.PCH_TYPE == 'Pax') {
              paxHotelArr.push(val);
            } else {
              crewHotelArr.push(val);
            }
          });
          setpapaxHotel([...paxHotelArr]);
          setpacrewHotel([...crewHotelArr]);
        } else {
          // console.log(checkList[13], checkList[15]);
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
        console.log(res);
        if (res.length > 0) {
          var paxTransArr = [];
          var crewTransArr = [];
          res.forEach((val, index) => {
            // console.log(val.PCT_TYPE);
            if (val.PCT_TYPE == 'Pax') {

              paxTransArr.push(val);
            } else {
              crewTransArr.push(val);
            }
          });
          setpapaxTransport([...paxTransArr]);
          setpacrewTransport([...crewTransArr]);
        } else {
          // console.log(checkList[12], checkList[14]);
        }
      })
      .catch(error => {
        setcallLoad(false);
        console.log(error, 'Function error');
      });
  }, []);
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
      case 'papaxTransport':
        var tcheckList = [...papaxTransport];
        tcheckList[currentPicker.current[0]][
          currentPicker.current[2]
        ] = tConvert(
          new Date(date).toLocaleString('en-US', {
            hour12: false,
          }),
        );
        setpapaxTransport([...tcheckList]); break;
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
  const mConvert = (val, type) => {
    var datetime = new Date(val).toLocaleString('en-US', {
      hour12: false,
    });
    if (type == 'date') {
      return (
        datetime.split(',')[0]
      );
    }
    return (
      datetime
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
    // console.log(checkList[currentFeedback.current]);
  };
  const onSubmitFeedback = text => {
    var index = currentFeedback.current;
    // var tcheckList = [...checkList];
    // tcheckList[index].remarks = text;
    // setChecklist(tcheckList);
    // console.log(tcheckList);
    setpacheck({ ...pacheck, [index]: text })
    setvFeedback(false);
  };
  const removeFeedback = index => {
    setpacheck({ ...pacheck, [index]: '' })
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
            // console.log(tcheckList[index][pos].hotelMap.file);
            tcheckList[index][pos].hotelMap.file.push({
              name: res.name,
              base64: 'data:' + res.type + ';base64,' + encoded,
            });
          } else {
            // console.log('pos', pos);
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
    const email = auth().currentUser.email;
    setpapaxTransport([...papaxTransport,
    { "CREATED_BY": email, "CREATED_DATE": new Date().toDateString(), "FUID": FUID, "LAST_UPDATE": "", "PCT_ADDRESS": "", "PCT_DCN": "", "PCT_DN": "", "PCT_DOD_ADDRESS": "", "PCT_DOD_LOCATION": "", "PCT_DOD_NR": 0, "PCT_LEAD_NAME": "", "PCT_NR": 0, "PCT_PASSENGER_NO": 0, "PCT_PICKUP_LOCATION": "", "PCT_REM": "", "PCT_SPT": null, "PCT_STAT": "", "PCT_TYPE": "Pax", "PCT_VEHICLE_NO": "", "PCT_VEHICLE_TYPE": "", "STATUS": 0, "UID": uid, "UPDATE_BY": email }]);
    // var tcheckList = [...checkList];
    // tcheckList[12] = [
    //   ...checkList[12],
    //   {
    //     transportTime: null,
    //     name: null,
    //     number: null,
    //     remarks: null,
    //     type: 'Pax',
    //   },
    // ];
    // setChecklist(tcheckList);
  };
  const addTransportCrew = () => {
    const email = auth().currentUser.email;
    setpacrewTransport([...pacrewTransport,
    { "CREATED_BY": email, "CREATED_DATE": new Date().toDateString(), "FUID": FUID, "LAST_UPDATE": "", "PCT_ADDRESS": "", "PCT_DCN": "", "PCT_DN": "", "PCT_DOD_ADDRESS": "", "PCT_DOD_LOCATION": "", "PCT_DOD_NR": 0, "PCT_LEAD_NAME": "", "PCT_NR": 0, "PCT_PASSENGER_NO": 0, "PCT_PICKUP_LOCATION": "", "PCT_REM": "", "PCT_SPT": null, "PCT_STAT": "", "PCT_TYPE": "Crew", "PCT_VEHICLE_NO": "", "PCT_VEHICLE_TYPE": "", "STATUS": 0, "UID": uid, "UPDATE_BY": email }]);

    // var tcheckList = [...checkList];
    // tcheckList[14] = [
    //   ...checkList[14],
    //   {
    //     transportTime: null,
    //     name: null,
    //     number: null,
    //     remarks: null,
    //     type: 'Crew',
    //   },
    // ];
    // setChecklist(tcheckList);
  };

  //here
  const [addedimagepaxhotel, setaddedimagepaxhotel] = useState([]);

  const addHotel = () => {
    const email = auth().currentUser.email;
    setpapaxHotel([...papaxHotel,
    { "CREATED_BY": email, "CREATED_DATE": new Date().toDateString(), "FUID": FUID, "LAST_UPDATE": "", "PCH_CONTACT_NO": "", "PCH_DATE_CHECKIN": "", "PCH_DATE_CHECKOUT": "", "PCH_HL": "", "PCH_HN": "", "PCH_NR": 0, "PCH_REM": "", "PCH_TT": "", "PCH_TYPE": "Pax", "STATUS": 0, "UID": uid, "UPDATE_BY": email }]);

    // var tcheckList = [...checkList];
    // tcheckList[13] = [
    //   ...checkList[13],
    //   {
    //     name: null,
    //     location: null,
    //     hotelMap: { value: null, file: [] },
    //     time: null,
    //     remarks: null,
    //     type: 'Pax',
    //   },
    // ];
    // setChecklist(tcheckList);
  };
  const addHotelCrew = () => {
    const email = auth().currentUser.email;
    setpapaxHotel([...papaxHotel,
    { "CREATED_BY": email, "CREATED_DATE": new Date().toDateString(), "FUID": FUID, "LAST_UPDATE": "", "PCH_CONTACT_NO": "", "PCH_DATE_CHECKIN": "", "PCH_DATE_CHECKOUT": "", "PCH_HL": "", "PCH_HN": "", "PCH_NR": 0, "PCH_REM": "", "PCH_TT": "", "PCH_TYPE": "Crew", "STATUS": 0, "UID": uid, "UPDATE_BY": email }]);

    // var tcheckList = [...checkList];
    // tcheckList[15] = [
    //   ...checkList[15],
    //   {
    //     name: null,
    //     location: null,
    //     hotelMap: { value: null, file: [] },
    //     time: null,
    //     remarks: null,
    //     type: 'Crew',
    //   },
    // ];
    // setChecklist(tcheckList);
  };
  const onRemoveService = index => {
    var service = [...papaxTransport];
    service.splice(index, 1);
    setpapaxTransport(service);
  };
  const onRemoveServiceCrew = index => {
    var service = [...pacrewTransport];
    service.splice(index, 1);
    setpacrewTransport(service);
  };
  const onRemoveHotel = index => {
    var service = [...papaxHotel];
    service.splice(index, 1);
    setpapaxHotel(service);
  };
  const onRemoveHotelCrew = index => {
    var service = [...pacrewHotel];
    service.splice(index, 1);
    setpacrewHotel(service);
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
          // console.log(tcheckList[index][pos].hotelMap.file);
          tcheckList[index][pos].hotelMap.file.push({
            name: res.fileName.replace('rn_image_picker_lib_temp_', ''),
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
        } else {
          // console.log('pos', pos);
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
    // console.log('HERE', uploadSection);
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
      ...pacheck,
      FUID: FUID,
      UID: uid,
      UPDATE_BY: email,
      STATUS: '0',
    };

    console.log(payload);
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(payload)
    };
    fetch(
      'https://demo.vellas.net:94/arrowdemoapi/api/Values/PostPreArrivalChecklist',
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        Alert.alert('Success');
        setcallLoad(false);
        console.log(result);
      })
      .catch(error => {
        Alert.alert('Error in updation');
        setcallLoad(false);
        console.log(error, 'Function error');
      });


    papaxHotel.concat(pacrewHotel).map(val => {
      var requestOptions1 = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(val)
      };
      fetch(
        'https://demo.vellas.net:94/arrowdemoapi/api/Values/PostPreArrivalPaxCrewHotel',
        requestOptions1,
      )
        .then(response => response.text())
        .then(result => {
          Alert.alert('Success');
          setcallLoad(false);
          console.log(result);
        })
        .catch(error => {
          Alert.alert('Error in updation');
          setcallLoad(false);
          console.log(error, 'Function error');
        });
    });
    papaxTransport.concat(pacrewTransport).map(val => {
      var requestOptions1 = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(val)
      };
      fetch(
        'https://demo.vellas.net:94/arrowdemoapi/api/Values/PostPreArrivalPaxCrewTransport',
        requestOptions1,
      )
        .then(response => response.text())
        .then(result => {
          Alert.alert('Success');
          setcallLoad(false);
          console.log(result);
        })
        .catch(error => {
          Alert.alert('Error in updation');
          setcallLoad(false);
          console.log(error, 'Function error');
        });
    });

    // firebase
    //   .app()
    //   .functions('asia-southeast1')
    //   .httpsCallable('updateFlightModule?module=PostPreArrivalChecklist')(
    //     JSON.stringify(payload),
    //   )
    //   .then(response => {
    //     Alert.alert('Success');
    //     setcallLoad(false);
    //     console.log(response);
    //   })
    //   .catch(error => {
    //     Alert.alert('Error in updation');
    //     setcallLoad(false);
    //     console.log(error, 'Function error');
    //   });
    // console.log(papaxHotel);
    // console.log(papaxTransport);
    // console.log(pacrewHotel);
    // console.log(pacrewTransport);
    // papaxHotel.concat(pacrewHotel).map(val => {
    //   firebase
    //     .app()
    //     .functions('asia-southeast1')
    //     .httpsCallable('updateFlightModule?module=PostPreArrivalPaxCrewHotel')(
    //       JSON.stringify({
    //         ...val,
    //         UID: val.UID ? val.UID : '',
    //         STATUS: 0,
    //         FUID: FUID,
    //         UPDATE_BY: email,
    //       }),
    //     )
    //     .then(response => {
    //       // Alert.alert('Success');
    //       // setcallLoad(false);
    //       console.log(response);
    //     })
    //     .catch(error => {
    //       // Alert.alert('Error in updation');
    //       // setcallLoad(false);
    //       console.log(error, 'Function error');
    //     });
    // });



    // papaxTransport.concat(pacrewTransport).map(val => {
    //   firebase
    //     .app()
    //     .functions('asia-southeast1')
    //     .httpsCallable(
    //       'updateFlightModule?module=PostPreArrivalPaxCrewTransport',
    //     )(
    //       JSON.stringify({
    //         ...val,
    //         STATUS: 0,
    //         FUID: FUID,
    //         UPDATE_BY: email,
    //         UID: val.UID ? val.UID : '',
    //       }),
    //     )
    //     .then(response => {
    //       // Alert.alert('Success');
    //       // setcallLoad(false);
    //       console.log(response);
    //     })
    //     .catch(error => {
    //       // Alert.alert('Error in updation');
    //       // setcallLoad(false);
    //       console.log(error, 'Function error');
    //     });
    // });

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

        <View style={{ padding: 20, marginBottom: 100 }}>
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setpacheck({ ...pacheck, PAC_CER: pacheck.PAC_CER ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pacheck.PAC_CER ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pacheck.PAC_CER ? 'white' : 'black',
                  },
                ]}>
                Crew Entry Requirements
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PAC_CER_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pacheck.PAC_CER_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text>{pacheck.PAC_CER_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PAC_CER_REM')}>
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
              onPress={event => setpacheck({ ...pacheck, PAC_PER: pacheck.PAC_PER ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pacheck.PAC_PER ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pacheck.PAC_PER ? 'white' : 'black',
                  },
                ]}>
                Pax Entry Requirements
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PAC_PER_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pacheck.PAC_PER_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text>{pacheck.PAC_PER_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PAC_PER_REM')}>
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
              onPress={event => setpacheck({ ...pacheck, PAC_CTA: pacheck.PAC_CTA ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pacheck.PAC_CTA ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pacheck.PAC_CTA ? 'white' : 'black',
                  },
                ]}>
                Crew Transport Arranged
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PAC_CTA_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pacheck.PAC_CTA_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text>{pacheck.PAC_CTA_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PAC_CTA_REM')}>
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
              onPress={event => setpacheck({ ...pacheck, PAC_PTA: pacheck.PAC_PTA ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pacheck.PAC_PTA ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pacheck.PAC_PTA ? 'white' : 'black',
                  },
                ]}>
                Pax Transport Arranged
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PAC_PTA_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pacheck.PAC_PTA_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text>{pacheck.PAC_PTA_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PAC_PTA_REM')}>
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
              onPress={event => setpacheck({ ...pacheck, PAC_CHA: pacheck.PAC_CHA ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pacheck.PAC_CHA ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pacheck.PAC_CHA ? 'white' : 'black',
                  },
                ]}>
                Crew Hotel Arranged
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PAC_CHA_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pacheck.PAC_CHA_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text>{pacheck.PAC_CHA_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PAC_CHA_REM')}>
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
              onPress={event => setpacheck({ ...pacheck, PAC_PHA: pacheck.PAC_PHA ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pacheck.PAC_PHA ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pacheck.PAC_PHA ? 'white' : 'black',
                  },
                ]}>
                Pax Hotel Arranged
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PAC_PHA_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pacheck.PAC_PHA_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text>{pacheck.PAC_PHA_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PAC_PHA_REM')}>
                <Icons
                  style={{ marginLeft: 10 }}
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
              onPress={event => setpacheck({ ...pacheck, PAC_IRP: pacheck.PAC_IRP ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pacheck.PAC_IRP ? 'green' : 'white', //checkList[4].checked
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pacheck.PAC_IRP ? 'white' : 'black',
                  },
                ]}>
                Informed Recieving Party
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PAC_IRP_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pacheck.PAC_IRP_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text>{pacheck.PAC_IRP_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PAC_IRP_REM')}>
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
              onPress={event => setpacheck({ ...pacheck, PAC_IFBO: pacheck.PAC_IFBO ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pacheck.PAC_IFBO ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pacheck.PAC_IFBO ? 'white' : 'black',
                  },
                ]}>
                Informed FBO
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PAC_IFBO_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pacheck.PAC_IFBO_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text>{pacheck.PAC_IFBO_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PAC_IFBO_REM')}>
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
              onPress={event => setpacheck({ ...pacheck, PAC_IHA: pacheck.PAC_IHA ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pacheck.PAC_IHA ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pacheck.PAC_IHA ? 'white' : 'black',
                  },
                ]}>
                Informed Handling Agent
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PAC_IHA_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pacheck.PAC_IHA_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text>{pacheck.PAC_IHA_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PAC_IHA_REM')}>
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
              onPress={event => setpacheck({ ...pacheck, PAC_ICAI: pacheck.PAC_ICAI ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pacheck.PAC_ICAI ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pacheck.PAC_ICAI ? 'white' : 'black',
                  },
                ]}>
                Informed Customs & Immigration
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PAC_ICAI_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pacheck.PAC_ICAI_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text>{pacheck.PAC_ICAI_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PAC_ICAI_REM')}>
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
              onPress={event => setpacheck({ ...pacheck, PAC_IAS: pacheck.PAC_IAS ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pacheck.PAC_IAS ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pacheck.PAC_IAS ? 'white' : 'black',
                  },
                ]}>
                Informed Airport Security
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PAC_IAS_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pacheck.PAC_IAS_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text>{pacheck.PAC_IAS_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PAC_IAS_REM')}>
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
              onPress={event => setpacheck({ ...pacheck, PAC_ICC: pacheck.PAC_ICC ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pacheck.PAC_ICC ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pacheck.PAC_ICC ? 'white' : 'black',
                  },
                ]}>
                Informed Catering Company
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PAC_ICC_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pacheck.PAC_ICC_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text>{pacheck.PAC_ICC_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PAC_ICC_REM')}>
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
            }}>
            <View style={styleSheet.toggleContainer}>
              <TouchableOpacity
                onPress={event => setpacheck({ ...pacheck, PAC_PAGD: pacheck.PAC_PAGD ? 0 : 1 })}
                style={[
                  styleSheet.toggleButton,
                  {
                    backgroundColor: pacheck.PAC_PAGD ? 'green' : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styleSheet.label,
                    {
                      textAlign: 'center',
                      color: pacheck.PAC_PAGD ? 'white' : 'black',
                    },
                  ]}>
                  Prepared Arrival GenDec
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              // onPress={() => {
              //   setuploadSection(10);
              //   setuploadAddedSection(false);
              //   refRBSheet.current.open();
              // }}
              style={{
                marginLeft: 10,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 8,
              }}>
              <Text style={{ color: 'green' }}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PAC_PAGD_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pacheck.PAC_PAGD_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <View style={styleSheet.remarks}>
                <Text>{pacheck.PAC_PAGD_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PAC_PAGD_REM')}>
                <Icons
                  style={{ marginLeft: 10 }}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}
          {/* {checkList[10].file.length > 0 && (
            <View style={{ marginBottom: 20 }}>
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
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.8,
                          shadowRadius: 2,
                        },
                        android: {
                          elevation: 3,
                        },
                      }),
                    }}>
                    <Text style={{ color: 'black' }}>{value.name}</Text>
                    <TouchableOpacity onPress={() => removeFilePreA(10, index)}>
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
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setpacheck({ ...pacheck, PAC_PRA: pacheck.PAC_PRA ? 0 : 1 })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pacheck.PAC_PRA ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pacheck.PAC_PRA ? 'white' : 'black',
                  },
                ]}>
                In Position to Receive Aircraft
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback('PAC_PRA_REM')}>
              <Icons
                style={{ marginLeft: 10 }}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pacheck.PAC_PRA_REM && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={styleSheet.remarks}>
                <Text>{pacheck.PAC_PRA_REM}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback('PAC_PRA_REM')}>
                <Icons
                  style={{ marginLeft: 10 }}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}

          <Text style={[styleSheet.label, { marginTop: 20 }]}>
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
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={() => { setpacheck({ ...pacheck, PAC_PTNR: pacheck.PAC_PTNR ? 0 : 1 }), setpapaxTransport([]) }}
              >
                <Icons
                  name={
                    pacheck.PAC_PTNR
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={pacheck.PAC_PTNR ? 'green' : 'black'}
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
                onPress={addTransport}
                disabled={pacheck.PAC_PTNR ? true : false}
                style={[
                  styleSheet.button,
                  { backgroundColor: pacheck.PAC_PTNR ? '#80808080' : 'green' },
                ]}>
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  Add Transport
                </Text>
              </TouchableOpacity>
            </View>
            {papaxTransport.map((val, index) => {
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
                      onPress={() => onRemoveService(index)}>
                      <Icons name="minus-box-outline" color="red" size={30} />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Pick-up Details:
                  </Text>
                  <LabelledInput
                    label={'Pickup Location'} //mark
                    data={val.PCT_PICKUP_LOCATION}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxTransport];
                      markers[index] = { ...markers[index], PCT_PICKUP_LOCATION: text };
                      setpapaxTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    label={'Address'} //mark
                    data={val.PCT_ADDRESS}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxTransport];
                      markers[index] = { ...markers[index], PCT_ADDRESS: text };
                      setpapaxTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />



                  <DateTimeInput
                    label={'Scheduled Pick-up Time (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', index, 'papaxTransport', "PCT_SPT");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...papaxTransport];
                      tcheckList[index].PCT_SPT = x
                      setpapaxTransport([...tcheckList]);
                    }}
                    size={12}
                    type={'datetime'}
                    data={val.PCT_SPT}
                    index={12}
                  />
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Drop-off Details:
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        var tcheckList = [...papaxTransport];
                        tcheckList[index].PCT_DOD_NR = tcheckList[index].PCT_DOD_NR ? 0 : 1
                        setpapaxTransport([...tcheckList]);
                      }}
                    >
                      <Icons
                        name={
                          val.PCT_DOD_NR
                            ? 'checkbox-marked-outline'
                            : 'checkbox-blank-outline'
                        }
                        color={val.PCT_DOD_NR ? 'green' : 'black'}
                        size={40}
                      />
                    </TouchableOpacity>
                    <Text style={styleSheet.label}>Not Required</Text>
                  </View>
                  <LabelledInput
                    disabled={val.PCT_DOD_NR}
                    label={'Drop-off Location'} //mark
                    data={val.PCT_DOD_LOCATION}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxTransport];
                      markers[index] = { ...markers[index], PCT_DOD_LOCATION: text };
                      setpapaxTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    disabled={val.PCT_DOD_NR}
                    label={'Address'} //mark
                    data={val.PCT_DOD_ADDRESS}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxTransport];
                      markers[index] = { ...markers[index], PCT_DOD_ADDRESS: text };
                      setpapaxTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Driver Details:
                  </Text>
                  <LabelledInput

                    label={'Driver Name'} //mark
                    data={val.PCT_DN}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxTransport];
                      markers[index] = { ...markers[index], PCT_DN: text };
                      setpapaxTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'Driver Contact Number'} //mark
                    data={val.PCT_DCN}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxTransport];
                      markers[index] = { ...markers[index], PCT_DCN: text };
                      setpapaxTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'Vehicle Number'} //mark
                    data={val.PCT_VEHICLE_NO}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxTransport];
                      markers[index] = { ...markers[index], PCT_VEHICLE_NO: text };
                      setpapaxTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'Vehicle Type'} //mark
                    data={val.PCT_VEHICLE_TYPE}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxTransport];
                      markers[index] = { ...markers[index], PCT_VEHICLE_TYPE: text };
                      setpapaxTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Pax Details:
                  </Text>
                  <LabelledInput

                    label={'Lead Pax Name'} //mark
                    data={val.PCT_LEAD_NAME}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxTransport];
                      markers[index] = { ...markers[index], PCT_LEAD_NAME: text };
                      setpapaxTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'No. of Pax'} //mark
                    data={val.PCT_PASSENGER_NO}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxTransport];
                      markers[index] = { ...markers[index], PCT_PASSENGER_NO: text };
                      setpapaxTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'Remarks'} //mark
                    data={val.PCT_REM}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxTransport];
                      markers[index] = { ...markers[index], PCT_REM: text };
                      setpapaxTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                </View>
              );
            })}
          </View>
          <Text style={[styleSheet.label, { marginTop: 20 }]}>Pax Hotel:</Text>
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
                onPress={() => { setpapaxHotel([]); setpacheck({ ...pacheck, PAC_PHNR: pacheck.PAC_PHNR ? 0 : 1 }) }}
              >
                <Icons
                  name={
                    pacheck.PAC_PHNR
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={pacheck.PAC_PHNR ? 'green' : 'black'}
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
                disabled={pacheck.PAC_PHNR ? true : false}
                onPress={addHotel}
                style={[
                  styleSheet.button,
                  {
                    backgroundColor: pacheck.PAC_PHNR
                      ? '#80808080'
                      : 'green',
                  },
                ]}>
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  Add Hotel
                </Text>
              </TouchableOpacity>
            </View>
            {papaxHotel.map((val, index) => {
              // if (index > 0) {
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
                      onPress={() => onRemoveHotel(index)}>
                      <Icons name="minus-box-outline" color="red" size={30} />
                    </TouchableOpacity>
                  </View>

                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Hotel Details:
                  </Text>
                  <LabelledInput
                    label={'Hotel Name'} //mark
                    data={val.PCH_HN}
                    datatype={'text'}
                    index={13}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxHotel];
                      markers[index] = { ...markers[index], PCH_HN: text };
                      setpapaxHotel([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    label={'Hotel Location'} //mark
                    data={val.PCH_HL}
                    datatype={'text'}
                    index={13}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxHotel];
                      markers[index] = { ...markers[index], PCH_HL: text };
                      setpapaxHotel([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    label={'Hotel Contact No.'} //mark
                    data={val.PCH_CONTACT_NO}
                    datatype={'text'}
                    index={13}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxHotel];
                      markers[index] = { ...markers[index], PCH_CONTACT_NO: text };
                      setpapaxHotel([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />

                  {/* <TakeCamera
                    label={'Map of Route to Hotel'}
                    type={13}
                    uploadInitiator={() => {
                      setuploadAddedSection(true);
                      setuploadAddedSectionindex(index);
                      setuploadSection(13);
                      refRBSheet.current.open();
                    }}
                    removeFilePreA={(type, i) => {
                      var x = [...checkList];
                      if (x[13][index].hotelMap.file.length === 1) {
                        x[13][index].hotelMap.file = [];
                      } else {
                        x[13][index].hotelMap.file.splice(i, 1);
                      }
                    }}
                    attachments={checkList[13][index].hotelMap}
                    Icon={
                      <Icons
                        style={{ color: 'green', marginLeft: 10 }}
                        name="close"
                        size={30}
                      />
                    }
                  /> */}
                  <LabelledInput
                    label={'Travel Time (Approximate) Hrs'} //mark
                    data={val.PCH_TT}
                    datatype={'text'}
                    index={13}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewHotel];
                      markers[index] = { ...markers[index], PCH_TT: text };
                      setpapaxHotel([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />

                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Booking Details:
                  </Text>
                  <DateTimeInput
                    label={'Check-in Date'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('date', index, 'papaxHotel', "PCH_DATE_CHECKIN");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...papaxHotel];
                      tcheckList[index].PCH_DATE_CHECKIN = x
                      setpapaxHotel([...tcheckList]);
                    }}
                    size={12}
                    type={'date'}
                    data={val.PCH_DATE_CHECKIN}
                    index={12}
                  />
                  <DateTimeInput
                    label={'Check-out Date'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('date', index, 'papaxHotel', "PCH_DATE_CHECKOUT");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...papaxHotel];
                      tcheckList[index].PCH_DATE_CHECKOUT = x
                      setpapaxHotel([...tcheckList]);
                    }}
                    size={12}
                    type={'date'}
                    data={val.PCH_DATE_CHECKOUT}
                    index={12}
                  />
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Confirmation Details:
                  </Text>
                  <LabelledInput
                    label={'Guest Name'} //mark
                    data=''
                    datatype={'text'}
                    index={13}
                    setText={(i, text, type, section) => {
                      // let markers = [...papaxHotel];
                      // markers[index] = { ...markers[index], PCH_HL: text };
                      // setpapaxHotel([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    label={'Guest Name'} //mark
                    data=''
                    datatype={'text'}
                    index={13}
                    setText={(i, text, type, section) => {
                      // let markers = [...papaxHotel];
                      // markers[index] = { ...markers[index], PCH_HL: text };
                      // setpapaxHotel([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'Remarks'} //mark
                    data={val.PCH_REM}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxTransport];
                      markers[index] = { ...markers[index], PCH_REM: text };
                      setpapaxTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                </View>
              );
              // }
            })}
          </View>
          <Text style={[styleSheet.label, { marginTop: 20 }]}>
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={() => { setpacrewTransport([]); setpacheck({ ...pacheck, PAC_CTNR: pacheck.PAC_CTNR ? 0 : 1 }) }}
              >
                <Icons
                  name={
                    pacheck.PAC_CTNR
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={pacheck.PAC_CTNR ? 'green' : 'black'}
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
                onPress={addTransportCrew}
                disabled={pacheck.PAC_CTNR ? true : false}
                style={[
                  styleSheet.button,
                  { backgroundColor: pacheck.PAC_CTNR ? '#80808080' : 'green' },
                ]}>
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  Add Transport
                </Text>
              </TouchableOpacity>
            </View>
            {pacrewTransport.map((val, index) => {
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
                      onPress={() => onRemoveServiceCrew(index)}>
                      <Icons name="minus-box-outline" color="red" size={30} />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Pick-up Details:
                  </Text>
                  <LabelledInput
                    label={'Pickup Location'} //mark
                    data={val.PCT_PICKUP_LOCATION}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewTransport];
                      markers[index] = { ...markers[index], PCT_PICKUP_LOCATION: text };
                      setpacrewTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    label={'Address'} //mark
                    data={val.PCT_ADDRESS}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewTransport];
                      markers[index] = { ...markers[index], PCT_ADDRESS: text };
                      setpacrewTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />



                  <DateTimeInput
                    label={'Scheduled Pick-up Time (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', index, 'pacrewTransport', "PCT_SPT");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...pacrewTransport];
                      tcheckList[index].PCT_SPT = x
                      setpacrewTransport([...tcheckList]);
                    }}
                    size={12}
                    type={'datetime'}
                    data={val.PCT_SPT}
                    index={12}
                  />
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Drop-off Details:
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        var tcheckList = [...pacrewTransport];
                        tcheckList[index].PCT_DOD_NR = tcheckList[index].PCT_DOD_NR ? 0 : 1
                        setpacrewTransport([...tcheckList]);
                      }}
                    >
                      <Icons
                        name={
                          val.PCT_DOD_NR
                            ? 'checkbox-marked-outline'
                            : 'checkbox-blank-outline'
                        }
                        color={val.PCT_DOD_NR ? 'green' : 'black'}
                        size={40}
                      />
                    </TouchableOpacity>
                    <Text style={styleSheet.label}>Not Required</Text>
                  </View>
                  <LabelledInput
                    disabled={val.PCT_DOD_NR}
                    label={'Drop-off Location'} //mark
                    data={val.PCT_DOD_LOCATION}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewTransport];
                      markers[index] = { ...markers[index], PCT_DOD_LOCATION: text };
                      setpacrewTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    disabled={val.PCT_DOD_NR}
                    label={'Address'} //mark
                    data={val.PCT_DOD_ADDRESS}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewTransport];
                      markers[index] = { ...markers[index], PCT_DOD_ADDRESS: text };
                      setpacrewTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Driver Details:
                  </Text>
                  <LabelledInput

                    label={'Driver Name'} //mark
                    data={val.PCT_DN}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewTransport];
                      markers[index] = { ...markers[index], PCT_DN: text };
                      setpacrewTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'Driver Contact Number'} //mark
                    data={val.PCT_DCN}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewTransport];
                      markers[index] = { ...markers[index], PCT_DCN: text };
                      setpacrewTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'Vehicle Number'} //mark
                    data={val.PCT_VEHICLE_NO}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewTransport];
                      markers[index] = { ...markers[index], PCT_VEHICLE_NO: text };
                      setpacrewTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'Vehicle Type'} //mark
                    data={val.PCT_VEHICLE_TYPE}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewTransport];
                      markers[index] = { ...markers[index], PCT_VEHICLE_TYPE: text };
                      setpacrewTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Crew Details:
                  </Text>
                  <LabelledInput

                    label={'Lead Crew Name'} //mark
                    data={val.PCT_LEAD_NAME}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewTransport];
                      markers[index] = { ...markers[index], PCT_LEAD_NAME: text };
                      setpacrewTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'No. of Crew'} //mark
                    data={val.PCT_PASSENGER_NO}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewTransport];
                      markers[index] = { ...markers[index], PCT_PASSENGER_NO: text };
                      setpacrewTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'Remarks'} //mark
                    data={val.PCT_REM}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewTransport];
                      markers[index] = { ...markers[index], PCT_REM: text };
                      setpacrewTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                </View>
              );
            })}
          </View>
          <Text style={[styleSheet.label, { marginTop: 20 }]}>Crew Hotel:</Text>
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
                onPress={() => { setpacrewHotel([]); setpacheck({ ...pacheck, PAC_CHNR: pacheck.PAC_CHNR ? 0 : 1 }) }}
              >
                <Icons
                  name={
                    pacheck.PAC_CHNR
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={pacheck.PAC_CHNR ? 'green' : 'black'}
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
                disabled={pacheck.PAC_CHNR ? true : false}
                onPress={addHotelCrew}
                style={[
                  styleSheet.button,
                  {
                    backgroundColor: pacheck.PAC_CHNR
                      ? '#80808080'
                      : 'green',
                  },
                ]}>
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  Add Hotel
                </Text>
              </TouchableOpacity>
            </View>
            {pacrewHotel.map((val, index) => {
              // if (index > 0) {
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
                      onPress={() => onRemoveHotelCrew(index)}>
                      <Icons name="minus-box-outline" color="red" size={30} />
                    </TouchableOpacity>
                  </View>

                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Hotel Details:
                  </Text>
                  <LabelledInput
                    label={'Hotel Name'} //mark
                    data={val.PCH_HN}
                    datatype={'text'}
                    index={13}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewHotel];
                      markers[index] = { ...markers[index], PCH_HN: text };
                      setpacrewHotel([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    label={'Hotel Location'} //mark
                    data={val.PCH_HL}
                    datatype={'text'}
                    index={13}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewHotel];
                      markers[index] = { ...markers[index], PCH_HL: text };
                      setpacrewHotel([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    label={'Hotel Contact No.'} //mark
                    data={val.PCH_CONTACT_NO}
                    datatype={'text'}
                    index={13}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewHotel];
                      markers[index] = { ...markers[index], PCH_CONTACT_NO: text };
                      setpacrewHotel([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />

                  {/* <TakeCamera
                    label={'Map of Route to Hotel'}
                    type={13}
                    uploadInitiator={() => {
                      setuploadAddedSection(true);
                      setuploadAddedSectionindex(index);
                      setuploadSection(13);
                      refRBSheet.current.open();
                    }}
                    removeFilePreA={(type, i) => {
                      var x = [...checkList];
                      if (x[13][index].hotelMap.file.length === 1) {
                        x[13][index].hotelMap.file = [];
                      } else {
                        x[13][index].hotelMap.file.splice(i, 1);
                      }
                    }}
                    attachments={checkList[13][index].hotelMap}
                    Icon={
                      <Icons
                        style={{ color: 'green', marginLeft: 10 }}
                        name="close"
                        size={30}
                      />
                    }
                  /> */}
                  <LabelledInput
                    label={'Travel Time (Approximate) Hrs'} //mark
                    data={val.PCH_TT}
                    datatype={'text'}
                    index={13}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewHotel];
                      markers[index] = { ...markers[index], PCH_TT: text };
                      setpacrewHotel([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />

                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Booking Details:
                  </Text>
                  <DateTimeInput
                    label={'Check-in Date'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('date', index, 'pacrewHotel', "PCH_DATE_CHECKIN");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...pacrewHotel];
                      tcheckList[index].PCH_DATE_CHECKIN = x
                      setpacrewHotel([...tcheckList]);
                    }}
                    size={12}
                    type={'date'}
                    data={val.PCH_DATE_CHECKIN}
                    index={12}
                  />
                  <DateTimeInput
                    label={'Check-out Date'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('date', index, 'pacrewHotel', "PCH_DATE_CHECKOUT");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...pacrewHotel];
                      tcheckList[index].PCH_DATE_CHECKOUT = x
                      setpacrewHotel([...tcheckList]);
                    }}
                    size={12}
                    type={'date'}
                    data={val.PCH_DATE_CHECKOUT}
                    index={12}
                  />
                  <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                    Confirmation Details:
                  </Text>
                  <LabelledInput
                    label={'Guest Name'} //mark
                    data=''
                    datatype={'text'}
                    index={13}
                    setText={(i, text, type, section) => {
                      // let markers = [...papaxHotel];
                      // markers[index] = { ...markers[index], PCH_HL: text };
                      // setpapaxHotel([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput
                    label={'Guest Name'} //mark
                    data=''
                    datatype={'text'}
                    index={13}
                    setText={(i, text, type, section) => {
                      // let markers = [...papaxHotel];
                      // markers[index] = { ...markers[index], PCH_HL: text };
                      // setpapaxHotel([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                  <LabelledInput

                    label={'Remarks'} //mark
                    data={val.PCH_REM}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxTransport];
                      markers[index] = { ...markers[index], PCH_REM: text };
                      setpapaxTransport([...markers]);
                    }}
                    multiline={false}
                    numberOfLines={1}
                  />
                </View>
              );
              // }
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
