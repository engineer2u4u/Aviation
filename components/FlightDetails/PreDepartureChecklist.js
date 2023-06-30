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

const { width, height } = Dimensions.get('window');
const HeadingTextSize = width / 15;

export default function PreDepartureChecklist(props) {
  const FUID = props.route.params.UID;
  const refRBSheet = useRef();
  const [uid, setuid] = useState(null);
  const currentPicker = useRef(0);
  const [uploadSection, setuploadSection] = useState(0);
  const [uploadaddedSection, setuploadAddedSection] = useState(false);
  const [uploadaddedSectionindex, setuploadAddedSectionindex] = useState(false);

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

  const [paxhotelactivesections, setpaxhotelactivesections] = useState(false);
  const [crewactivesections, setcrewactivesections] = useState(false);
  const [pdchecklist, setpdchecklist] = useState({ "CREATED_BY": "", "CREATED_DATE": "", "FUID": "", "LAST_UPDATE": "", "PDC_AFR": 0, "PDC_AFR_REM": "", "PDC_ASR": 0, "PDC_ASR_REM": "", "PDC_CAR": 0, "PDC_CAR_REM": "", "PDC_CCDD": null, "PDC_CCDT": "", "PDC_CIQ": 0, "PDC_CIQ_REM": "", "PDC_CML": "", "PDC_CML_PHOTO": "", "PDC_CNML": 0, "PDC_CNML_REM": "", "PDC_CTA": 0, "PDC_CTA_REM": "", "PDC_CTNR": 0, "PDC_CTPD": "", "PDC_CTPT": "", "PDC_FBO": 0, "PDC_FBO_REM": "", "PDC_FD": null, "PDC_FD_ATC": "", "PDC_FD_FDP": "", "PDC_FD_FDR": "", "PDC_FD_NOTAMS": "", "PDC_FD_SLOTS": "", "PDC_FD_WIU": "", "PDC_FT": "", "PDC_HAR": 0, "PDC_HAR_REM": "", "PDC_PAGD": 0, "PDC_PAGD_REM": "", "PDC_PNML": 0, "PDC_PNML_REM": "", "PDC_PTA": 0, "PDC_PTA_REM": "", "PDC_PTNR": 0, "PDC_REM": "", "PDC_TOR_CONTACT": "", "PDC_TOR_DRIVER": "", "PDC_TOR_REM": "", "PDC_TOR_TIME": "", "PDC_UDGD": "", "STATUS": 0, "UID": "", "UPDATE_BY": "" })
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
    setcallLoad(true);
    firebase
      .app()
      .functions('asia-southeast1')
      .httpsCallable(
        'getFlightModule?fuid=' + FUID + '&module=GetPreDepartureChecklist',
      )()
      .then(response => {

        var packet = JSON.parse(response.data.body);
        var res = [...packet.Table];
        if (res && res.length > 0) {
          console.log(res[0]);
          setpdchecklist(res[0])
          setuid(res[0].UID);
          setcallLoad(false);

        } else {
          setcallLoad(false);
          setuid('');
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
        'getFlightModule?fuid=' + FUID + '&module=GetPreDepartureTransport',
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
            if (val.PDCT_TYPE.trim() == 'Pax') {
              apaxTransport.push(val);
            } else {
              acrewTransport.push(val);
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
  }, []);

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
          var tpdeparturecheck = [...pdeparturecheck];
          tpdeparturecheck[index].file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setpdeparturecheck(tpdeparturecheck);
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
  const [isDatePickerVisibleDeparture, setDatePickerVisibilityDeparture] =
    useState(false);
  const showDatePicker = (type, index, arr, pos) => {
    currentPicker.current = [index, arr, pos];
    setMode(type);
    setDatePickerVisibilityDeparture(true);
  };
  const showDatePickerDeparture = (type, index) => {
    currentDeparture.current = index;
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
  const removeFilePreA = (arrayIndex, index, added = false) => {
    console.log('REMOVER', added, arrayIndex, index);
    if (added) {
      var tpdeparturecheck = addedcrewSectionval;
      tpdeparturecheck[arrayIndex].hotelMap.file.splice(index, 1);
      setaddedcrewSectionval(tpdeparturecheck);
      return;
    }
    var tpdeparturecheck = [...pdeparturecheck];
    console.log(tpdeparturecheck[arrayIndex].hotelMap.file.length);
    if (tpdeparturecheck[arrayIndex].hotelMap.file.length === 1)
      tpdeparturecheck[arrayIndex].hotelMap.file = [];
    else tpdeparturecheck[arrayIndex].hotelMap.file.splice(index, 1);
    console.log(tpdeparturecheck[arrayIndex].hotelMap.file.length);
    //console.log(tpdeparturecheck[arrayIndex].hotelMap.file)
    setpdeparturecheck(tpdeparturecheck);
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

        if (uploadaddedSection) {
          var tpdeparturecheck =
            activeSection === 'crew'
              ? [...addedcrewSectionval]
              : [...addedpaxSectionval];
          tpdeparturecheck[index].hotelMap.file.push({
            name: res.fileName.replace('rn_image_picker_lib_temp_', ''),
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setaddedcrewSectionval(tpdeparturecheck);
        } else {
          console.log('HERE WE GO');

          var tpdeparturecheck = [...pdeparturecheck]; //<- this line works

          tpdeparturecheck[index].hotelMap.file.push({
            name: res.fileName.replace('rn_image_picker_lib_temp_', ''),
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setpdeparturecheck(tpdeparturecheck);
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
    setpaxtransport([...paxtransport, { "CREATED_BY": email, "CREATED_DATE": new Date(), "FUID": FUID, "LAST_UPDATE": "", "PDCT_ADDRESS": "", "PDCT_DCN": "", "PDCT_DD_NR": 0, "PDCT_DN": "", "PDCT_DOD_ADDRESS": "", "PDCT_DOD_LOCATION": "", "PDCT_DOD_TIME": "", "PDCT_LEAD_NAME": "", "PDCT_PASSENGER_NO": 0, "PDCT_PD_NR": 0, "PDCT_PL": "", "PDCT_REMARK": "", "PDCT_SPT": "", "PDCT_TYPE": "Pax", "PDCT_VEHICLE_NO": "", "PDCT_VEHICLE_TYPE": "", "STATUS": 1, "UID": uid, "UPDATE_BY": email }])

  };

  const addnewcrewSection = () => {
    const email = auth().currentUser.email;
    setcrewtransport([...crewtransport, { "CREATED_BY": email, "CREATED_DATE": new Date(), "FUID": FUID, "LAST_UPDATE": "", "PDCT_ADDRESS": "", "PDCT_DCN": "", "PDCT_DD_NR": 0, "PDCT_DN": "", "PDCT_DOD_ADDRESS": "", "PDCT_DOD_LOCATION": "", "PDCT_DOD_TIME": "", "PDCT_LEAD_NAME": "", "PDCT_PASSENGER_NO": 0, "PDCT_PD_NR": 0, "PDCT_PL": "", "PDCT_REMARK": "", "PDCT_SPT": "", "PDCT_TYPE": "Crew", "PDCT_VEHICLE_NO": "", "PDCT_VEHICLE_TYPE": "", "STATUS": 1, "UID": uid, "UPDATE_BY": email }])
  };
  const [ini, setini] = useState(false);

  const removepaxSection = index => {
    //remove val
    var val = [...addedpaxSectionval];
    val.splice(index, 1);
    if (val.length === 0) val = [];
    console.log(val);
    setaddedpaxSectionval(val);
  };

  const removecrewSection = index => {
    var service = [...crewtransport];
    service.splice(index, 1);
    setcrewtransport(service);
  };

  const setAddedcrewData = (index, data, type, section = 'crew') => {
    console.log(section, index);
    var x;
    if (section === 'crew') x = addedcrewSectionval;
    else if (section === 'pax') x = addedpaxSectionval;
    else if (section === 'departure') x = pdeparturecheck;

    if (section === 'crew' || section === 'pax') {
      if (type === 'time') x[index].time = data;
      if (type === 'location') {
        x[index].location = data;
      }
      if (type === 'contact') {
        x[index].contact = data;
      }
      if (type === 'remarks') {
        x[index].remarks = data;
      } else if (type === 'text') x[index].name = data;
    } else if (section === 'departure') {
      if (type === 'recieved') {
        x[index].recieved = data;
      }
      if (type === 'printed') x[index].printed = data;
      if (type === 'notams') x[index].notams = data;
      if (type === 'weather') x[index].weather_info_updated = data;
      if (type === 'atc') x[index].atc_flight_plan = data;
      if (type === 'slot') x[index].slot_confirmed = data;
      if (type === 'catering') x[index].catering.delivery = data;
      if (type === 'fueling_time') x[index].fueling_time = data;
    }
    console.log(x);
    if (section === 'crew') setaddedcrewSectionval(x);
    else if (section === 'departure') setpdeparturecheck(x);
    else setaddedpaxSectionval(x);
    //console.log(x);
    //setaddedtestSectionval(x);
    // currentDeparture.current = index;
    // setMode(type);
    // setDatePickerVisibilityDeparture(true);
  };

  const addnewtestSection = () => {
    //add menu section
    var section = [...addedtestSection];
    var menu = { name: 'Added Test Section Field' };
    section.push(menu);
    setaddedtestsection(section);
    //add menu value collection
    var val = [...addedtestSectionval];
    var data = {
      name: null,
      location: null,
      hotelMap: { value: null, file: [] },
      time: null,
      remarks: null,
    };
    val.push(data);
    setaddedtestSectionval(val);
    settestmovement(true);
    // var x = [...addedtestSection];
    // var y= [...addedtestSectionval];
    // console.log(x);
    // var options={
    // values:{  name: null,
    //   location: null,
    //   hotelMap: {value: null, file: []},
    //   time: null,
    //   remarks: null,}
    // }
    // var menu={
    //   name:"Added Pickup Location"
    // }
    // x.push(menu);
    // y.push(options);
    // setaddedtestSectionval(x);
    // setaddedtestsection(y);
    // settestmovement(true);
  };
  const removetestSection = index => {
    console.log(index);
    //remove section
    var s = [...addedtestSection];
    s.splice(index, 1);
    if (s.length === 0) s = [];
    setaddedtestsection(s);
    //remove val
    var val = [...addedtestSectionval];
    val.splice(index, 1);
    if (val.length === 0) val = [];
    setaddedtestSectionval(val);
    console.log(addedtestSectionval);
  };

  const setAddedData = (index, data, type) => {
    var x = addedtestSectionval;
    x[index].location = data;
    console.log(x);
    setaddedtestSectionval(x);
    //console.log(x);
    //setaddedtestSectionval(x);
    // currentDeparture.current = index;
    // setMode(type);
    // setDatePickerVisibilityDeparture(true);
  };

  const addMovement = (type, index) => {
    // setpdeparturecheck(x);
    switch (type) {
      case true:
        setpdaddmovement(true);
        setpdaddmovementnum(pdaddmovementnum + 1);
        break;
      case false:
        setpaxpdaddmovement(true);
        setpaxpdaddmovementnum(paxpdaddmovementnum + 1);
        break;
    }

    //console.log(index);
    pdeparturecheck[index].push({
      name: null,
      location: null,
      hotelMap: { value: null, file: [] },
      time: null,
      remarks: null,
    });
    setpdeparturecheck(pdeparturecheck);
  };

  const onRemoveMovement = type => {
    switch (type) {
      case true:
        var x = pdaddmovementnum;
        x = x - 1;
        if (x == 0) {
          setpdaddmovement(false);
          setpdaddmovementnum(0);
        } else {
          setpdaddmovementnum(x);
        }
        break;
      case false:
        var x = paxpdaddmovementnum;
        x = x - 1;
        if (x == 0) {
          setpaxpdaddmovement(false);
          setpaxpdaddmovementnum(0);
        } else {
          setpaxpdaddmovementnum(x);
        }
        break;
    }
  };

  const [formReady, setformReady] = useState(true);
  const [flightdocrecieved, setflightdoc] = useState(null);
  const [printed, setprinted] = useState(null);
  const [notams_updated, setnotams_updated] = useState(null);
  const [weather_information, setweather_information] = useState(null);
  const [atc_flight, setatc_flight] = useState(null);
  const [slots_confirmed, setslots_confirmed] = useState(null);
  const [callLoad, setcallLoad] = useState(false);
  const sendForm = data => {
    setcallLoad(true);
    let x = [...pdeparturecheck];
    const email = auth().currentUser.email;

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
      'https://demo.vellas.net:94/arrowdemoapi/api/Values/PostPreDepartureChecklist',
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        Alert.alert('Success', 'Record updated', [

          { text: 'OK', onPress: () => props.navigation.pop() },
        ]);
        setcallLoad(false);
        console.log(result);
      })
      .catch(error => {
        Alert.alert('Error in updation');
        setcallLoad(false);
        console.log(error, 'Function error');
      });

    // console.log('addedcrewSectionval', addedcrewSectionval);
    console.log(crewtransport.concat(paxtransport));

    if (crewtransport.concat(paxtransport).length > 0) {
      crewtransport.concat(paxtransport).map(val => {
        var requestOptions1 = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(val)
        };
        fetch(
          'https://demo.vellas.net:94/arrowdemoapi/api/Values/PostPreDepartureChecklistTransport',
          requestOptions1,
        )
          .then(response => response.text())
          .then(result => {
            Alert.alert('Success', 'Record updated', [

              { text: 'OK', onPress: () => props.navigation.pop() },
            ]);
            setcallLoad(false);
            console.log(result);
          })
          .catch(error => {
            Alert.alert('Error in updation');
            setcallLoad(false);
            console.log(error, 'Function error');
          });

      });
    }
    // addedcrewSectionval.map(val => {
    //   firebase
    //     .app()
    //     .functions('asia-southeast1')
    //     .httpsCallable(
    //       'updateFlightModule?module=PostPreDepartureChecklistTransport',
    //     )(
    //       JSON.stringify({
    //         PDCT_SPT: val.time ? val.time : '""',
    //         PDCT_PL: val.location ? val.location : '""',
    //         PDCT_DN: val.name ? val.name : '""',
    //         PDCT_DCN: val.contact ? val.contact : '""',
    //         PDCT_REMARK: val.remarks ? val.remarks : '""',
    //         PDCT_TYPE: val.type ? val.type : '""',
    //         UID: val.UID ? val.UID : '',
    //         STATUS: 0,
    //         FUID: FUID,
    //         UPDATE_BY: email,
    //       }),
    //     )
    //     .then(response => {
    //       Alert.alert('Success');
    //       setcallLoad(false);
    //       console.log(response);
    //     })
    //     .catch(error => {
    //       Alert.alert('Error in updation');
    //       setcallLoad(false);
    //       console.log(error, 'Function error');
    //     });
    // });

    // addedpaxSectionval.map(val => {
    //   firebase
    //     .app()
    //     .functions('asia-southeast1')
    //     .httpsCallable(
    //       'updateFlightModule?module=PostPreDepartureChecklistTransport',
    //     )(
    //       JSON.stringify({
    //         PDCT_SPT: val.time ? val.time : '""',
    //         PDCT_PL: val.location ? val.location : '""',
    //         PDCT_DN: val.name ? val.name : '""',
    //         PDCT_DCN: val.contact ? val.contact : '""',
    //         PDCT_REMARK: val.remarks ? val.remarks : '""',
    //         PDCT_TYPE: val.type ? val.type : '""',
    //         UID: val.UID ? val.UID : '',
    //         STATUS: 0,
    //         FUID: FUID,
    //         UPDATE_BY: email,
    //       }),
    //     )
    //     .then(response => {
    //       Alert.alert('Success');
    //       setcallLoad(false);
    //       console.log(response);
    //     })
    //     .catch(error => {
    //       Alert.alert('Error in updation');
    //       setcallLoad(false);
    //       console.log(error, 'Function error');
    //     });
    // });
  };

  const uploadInitiator = (type, addedsection, section = 'crew') => {
    setactiveSection(section);
    setuploadAddedSection(addedsection);
    setuploadSection(type);
    refRBSheet.current.open();
  };

  const setText = (index, text, type, section = 'crew') => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index] = text;
    setpdeparturecheck(tpdeparturecheck);
  };

  return (
    <View>
      <Header
        headingSize={HeadingTextSize}
        heading={'Pre-Departure Checklist'}
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
                  { setpdchecklist({ ...pdchecklist, PDC_CTNR: pdchecklist.PDC_CTNR ? 0 : 1 }), setcrewtransport([]) }
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
                        tcheckList[index].PDCT_PD_NR = tcheckList[index].PDCT_PD_NR ? 0 : 1
                        setcrewtransport([...tcheckList]);
                      }}
                    >
                      <Icons
                        name={
                          val.PDCT_PD_NR
                            ? 'checkbox-marked-outline'
                            : 'checkbox-blank-outline'
                        }
                        color={val.PDCT_PD_NR ? 'green' : 'black'}
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

                  <TakeCamera
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
                  />

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
                    type={'datetime'}
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
                    type={'datetime'}
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
                        tcheckList[index].PDCT_DD_NR = tcheckList[index].PDCT_DD_NR ? 0 : 1
                        setcrewtransport([...tcheckList]);
                      }}
                    >
                      <Icons
                        name={
                          val.PDCT_DD_NR
                            ? 'checkbox-marked-outline'
                            : 'checkbox-blank-outline'
                        }
                        color={val.PDCT_DD_NR ? 'green' : 'black'}
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
                <Text>{pdchecklist.PDC_PTA_REM}</Text>
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
                <Text>{pdchecklist.PDC_PNML_REM}</Text>
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
                  { setpdchecklist({ ...pdchecklist, PDC_PTNR: pdchecklist.PDC_PTNR ? 0 : 1 }), setcrewtransport([]) }
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
                        var tcheckList = [...paxtransport];
                        tcheckList[index].PDCT_PD_NR = tcheckList[index].PDCT_PD_NR ? 0 : 1
                        setpaxtransport([...tcheckList]);
                      }}
                    >
                      <Icons
                        name={
                          val.PDCT_PD_NR
                            ? 'checkbox-marked-outline'
                            : 'checkbox-blank-outline'
                        }
                        color={val.PDCT_PD_NR ? 'green' : 'black'}
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

                  <TakeCamera
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
                  />

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
                    type={'datetime'}
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
                    type={'datetime'}
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
                        tcheckList[index].PDCT_DD_NR = tcheckList[index].PDCT_DD_NR ? 0 : 1
                        setpaxtransport([...tcheckList]);
                      }}
                    >
                      <Icons
                        name={
                          val.PDCT_DD_NR
                            ? 'checkbox-marked-outline'
                            : 'checkbox-blank-outline'
                        }
                        color={val.PDCT_DD_NR ? 'green' : 'black'}
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
                <Text>{pdchecklist.PDC_PAGD_REM}</Text>
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

          <TakeCamera
            disabled={true}
            label={'Upload Departure GenDec'}
            type={4}
            addedsection={false}
            init={ini}
            sectionName={'departure'}
            uploadInitiator={uploadInitiator}
            removeFilePreA={(a, b, c) => {
              // console.log(a, b, c);
              // var x = [...pdeparturecheck];
              // if (x[4].hotelMap.file.length === 1) x[4].hotelMap.file = [];
              // else x[4].hotelMap.file.splice(b, 1);

            }}
            attachments={pdeparturecheck[4].hotelMap}
            Icon={
              <Icons
                style={{ color: 'green', marginLeft: 10 }}
                name="close"
                size={30}
              />
            }
          />


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
                <Text>{pdchecklist.PDC_FBO_REM}</Text>
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
                <Text>{pdchecklist.PDC_HAR_REM}</Text>
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
                <Text>{pdchecklist.PDC_CIQ_REM}</Text>
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
                <Text>{pdchecklist.PDC_ASR_REM}</Text>
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
                <Text>{pdchecklist.PDC_CAR_REM}</Text>
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
                <Text>{pdchecklist.PDC_AFR_REM}</Text>
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
        />
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
