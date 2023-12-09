import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Image
} from 'react-native';
import { SERVER_URL, getDomain } from '../constants/env';
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
import Header from '../subcomponents/Forms/Header';


export default function PreArrival(props) {

  const FUID = props.route.params.UID;
  const [uid, setuid] = useState(null);
  const [pacheck, setpacheck] = useState({
    "CREATED_BY": "", "CREATED_DATE": "", "FUID": "", "LAST_UPDATE": "", "PAC_CER": 0, "PAC_CER_REM": "",
    "PAC_CHA": 0, "PAC_CHA_REM": "", "PAC_CHNR": null, "PAC_CTA": 0, "PAC_CTA_REM": "", "PAC_CTNR": null, "PAC_IAS": 0, "PAC_IAS_REM": "",
    "PAC_ICAI": 0, "PAC_ICAI_REM": "", "PAC_ICC": 0, "PAC_ICC_REM": "", "PAC_IFBO": 0, "PAC_IFBO_REM": "", "PAC_IHA": 0, "PAC_IHA_REM": "",
    "PAC_IRP": 0, "PAC_IRP_REM": "", "PAC_PAGD": 0, "PAC_PAGD_REM": "", "PAC_PAGD_String": [], "PAC_PER": 0, "PAC_PER_REM": "", "PAC_PHA": 0, "PAC_PHA_REM": "",
    "PAC_PHNR": 0, "PAC_PRA": 0, "PAC_PRA_REM": "", "PAC_PTA": 0, "PAC_PTA_REM": "", "PAC_PTNR": 0, "PAC_UAGD": 0, "STATUS": 0, "UID": "", "UPDATE_BY": ""
  })

  const [papaxHotel, setpapaxHotel] = useState([]);
  const [pacrewHotel, setpacrewHotel] = useState([]);
  const [papaxTransport, setpapaxTransport] = useState([]);
  const [pacrewTransport, setpacrewTransport] = useState([]);
  const [imageVisible, setimageVisible] = useState(false);
  const [showImage, setshowImage] = useState(null);
  // const [checkList, setChecklist] = useState();
  const refRBSheet = useRef();
  //upload funcs
  const [uploadSection, setuploadSection] = useState(null);

  const [vFeedback, setvFeedback] = useState(false);
  const [loading, setloading] = useState(false);
  const timerDate = useRef(new Date());
  const currentFeedback = useRef(0);
  const currentPicker = useRef(0);
  const [mode, setMode] = useState('time');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  useEffect(() => {
    readData();
  }, []);
  const readData = () => {
    setcallLoad(true);
    // pax crew hotel
    var domain = getDomain();
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };
    fetch(
      `${domain}/GetPreArrivalChecklist?_token=CA5A7BA6-9E7F-4222-A6AB-CB7A51E7C2BF&_opco=&_fuid=${FUID}&_uid=`,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        // setcallLoad(false);
        try {
          var packet = JSON.parse(result);

          var res = packet.Table[0];
          // console.log('arrivalPre', res);
          if (res) {
            setpacheck(res)
            setuid(res.UID);
            fetch(
              `${domain}/GetArrivalChecklistFiles?_token=CDAC498B-116F-4346-AD72-C3F65A902FFD&_opco=&_fuid=${FUID}&_uid=${res.UID}`,
              requestOptions,
            )
              .then(response => response.text())
              .then(result => {
                setcallLoad(false);
                try {
                  var packet = JSON.parse(result);
                  // console.log('Files', packet);
                  var temp = { ...res };
                  temp.PAC_PAGD_String = packet.PAC_PAGD_String;
                  setpacheck({ ...temp })
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
        }
        catch (e) {
          setcallLoad(false);
          console.log(es, 'Function error');
        }
      })
      .catch(error => {
        setcallLoad(false);
        console.log(error, 'Function error');
      });

    fetch(
      `${domain}/GetPreArrivalHotel?_token=CA5A7BA6-9E7F-4222-A6AB-CB7A51E7C2BF&_opco=&_fuid=${FUID}&_uid=`,
      requestOptions,
    )
      .then(response => response.text())
      .then(response => {
        var packet = JSON.parse(response);
        // console.log('Hotel', response);
        if (packet && packet.ds.Table) {
          var res = packet.ds.Table;
          var resFile = packet.PCH_MRH_Files;
          if (res.length > 0) {
            var paxHotelArr = [];
            var crewHotelArr = [];
            res.forEach((val, index) => {
              val.PCH_DATE_CHECKIN = mConvert(val.PCH_DATE_CHECKIN, 'date');
              val.PCH_DATE_CHECKOUT = mConvert(val.PCH_DATE_CHECKOUT, 'date');
              console.log('Hotel', JSON.stringify(packet.Table1));
              if (packet.PCH_MRH_Files.length > 0) {

              }
              if (packet.ds.Table1 && packet.ds.Table1.length > 0) {

                val.GuestUser = packet.ds.Table1.filter(value => value.HID == val.UID)
              }
              else {
                val.GuestUser = []
              }
              if (val.STATUS != 5) {
                val.PDCT_PL_String = [];
                resFile.map(file => {
                  if (file.uid == val.UID) {
                    val.PCH_MRH_String = [...file.PCH_MRH_String];
                  }
                })
                if (val.PCH_TYPE == 'Pax') {
                  paxHotelArr.push(val);
                } else {
                  crewHotelArr.push(val);
                }
              }
            });
            // console.log('Hotel', paxHotelArr.concat(crewHotelArr));

            setpapaxHotel([...paxHotelArr]);
            setpacrewHotel([...crewHotelArr]);
          } else {
          }
        }
      })
      .catch(error => {
        setcallLoad(false);
        console.log(error, 'Function error');
      });

    fetch(
      `${domain}/GetPreArrivalTransport?_token=CA5A7BA6-9E7F-4222-A6AB-CB7A51E7C2BF&_opco=&_fuid=${FUID}&_uid=`,
      requestOptions,
    )
      .then(response => response.text())
      .then(response => {
        //get pax & crew transport
        var packet = JSON.parse(response);
        var res = packet.Table;
        // console.log(res, 'Transport');
        if (res.length > 0) {
          var paxTransArr = [];
          var crewTransArr = [];
          res.forEach((val, index) => {
            // console.log(val.PCT_TYPE);
            if (val.STATUS != 5) {
              if (val.PCT_TYPE == 'Pax') {

                paxTransArr.push(val);
              } else {
                crewTransArr.push(val);
              }
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
  }
  const showDatePicker = (type, index, arr, pos) => {
    currentPicker.current = [index, arr, pos];
    setMode(type);
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = date => {
    setDatePickerVisibility(false);
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
    // hideDatePicker();
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

  const changeFormat = (val) => {
    console.log(val)
    var dateSplit = val.split("/");
    console.log(dateSplit[1] + "/" + dateSplit[0] + "/" + dateSplit[2])
    return (
      dateSplit[1] + "/" + dateSplit[0] + "/" + dateSplit[2]
    );
  }

  const mConvert = (val, type) => {
    var datetime = new Date(val).toLocaleString('en-US', {
      hour12: false,
    });

    if (type == 'date') {
      var datee = datetime.split(',')[0];
      var dateSplit = datee.split("/");
      return (
        dateSplit[1] + "/" + dateSplit[0] + "/" + dateSplit[2]
      );
    }
    return (
      datetime
    );
  };
  const { width, height } = Dimensions.get('window');
  const HeadingTextSize = width / 15;
  const getFeedback = index => {
    setvFeedback(true);
    currentFeedback.current = index;
    console.log(pacheck[currentFeedback.current]);
  };
  const onSubmitFeedback = text => {
    var index = currentFeedback.current;
    setpacheck({ ...pacheck, [index]: text })
    setvFeedback(false);
  };
  const removeFeedback = index => {
    setpacheck({ ...pacheck, [index]: '' })
  };
  const addTransport = () => {
    const email = auth().currentUser.email;
    setpapaxTransport([...papaxTransport,
    { "CREATED_BY": email, "CREATED_DATE": new Date().toLocaleDateString(), "FUID": FUID, "LAST_UPDATE": "", "PCT_ADDRESS": "", "PCT_DCN": "", "PCT_DN": "", "PCT_DOD_ADDRESS": "", "PCT_DOD_LOCATION": "", "PCT_DOD_NR": 0, "PCT_LEAD_NAME": "", "PCT_NR": 0, "PCT_PASSENGER_NO": 0, "PCT_PICKUP_LOCATION": "", "PCT_REM": "", "PCT_SPT": null, "PCT_STAT": null, "PCT_TYPE": "Pax", "PCT_VEHICLE_NO": "", "PCT_VEHICLE_TYPE": "", "STATUS": 0, "UID": '', "UPDATE_BY": email }]);
  };
  const addTransportCrew = () => {
    const email = auth().currentUser.email;
    setpacrewTransport([...pacrewTransport,
    { "CREATED_BY": email, "CREATED_DATE": new Date().toLocaleDateString(), "FUID": FUID, "LAST_UPDATE": "", "PCT_ADDRESS": "", "PCT_DCN": "", "PCT_DN": "", "PCT_DOD_ADDRESS": "", "PCT_DOD_LOCATION": "", "PCT_DOD_NR": 0, "PCT_LEAD_NAME": "", "PCT_NR": 0, "PCT_PASSENGER_NO": 0, "PCT_PICKUP_LOCATION": "", "PCT_REM": "", "PCT_SPT": null, "PCT_STAT": null, "PCT_TYPE": "Crew", "PCT_VEHICLE_NO": "", "PCT_VEHICLE_TYPE": "", "STATUS": 0, "UID": '', "UPDATE_BY": email }]);
    // setChecklist(tcheckList);
  };

  const addHotel = () => {
    const email = auth().currentUser.email;
    setpapaxHotel([...papaxHotel,
    {
      "CREATED_BY": email, "CREATED_DATE": new Date().toLocaleDateString(), "FUID": FUID, "LAST_UPDATE": "",
      "PCH_CONTACT_NO": "", "PCH_DATE_CHECKIN": "", "PCH_DATE_CHECKOUT": "", "PCH_HL": "", "PCH_HN": "",
      "PCH_NR": 0, "PCH_REM": "", "PCH_TT": "", "PCH_TYPE": "Pax", "STATUS": 0, "UID": '', "UPDATE_BY": email,
      'GuestUser': [], PCH_MRH_String: []
    }]);
    console.log({
      "CREATED_BY": email, "CREATED_DATE": new Date().toLocaleDateString(), "FUID": FUID, "LAST_UPDATE": "",
      "PCH_CONTACT_NO": "", "PCH_DATE_CHECKIN": "", "PCH_DATE_CHECKOUT": "", "PCH_HL": "", "PCH_HN": "",
      "PCH_NR": 0, "PCH_REM": "", "PCH_TT": "", "PCH_TYPE": "Pax", "STATUS": 0, "UID": '', "UPDATE_BY": email,
      'GuestUser': []
    });

  };
  const addHotelCrew = () => {
    const email = auth().currentUser.email;
    setpacrewHotel([...pacrewHotel,
    {
      "CREATED_BY": email, "CREATED_DATE": new Date().toLocaleDateString(), "FUID": FUID, "LAST_UPDATE": "", "PCH_CONTACT_NO": "", "PCH_DATE_CHECKIN": "",
      "PCH_DATE_CHECKOUT": "", "PCH_HL": "", "PCH_HN": "", "PCH_NR": 0, "PCH_REM": "", "PCH_TT": "", "PCH_TYPE": "Crew", "STATUS": 0,
      "UID": '', "UPDATE_BY": email,
      'GuestUser': [], PCH_MRH_String: []
    }]);

  };


  const [deleteService, setdeleteService] = useState([]);

  const onRemoveService = index => {
    var service = [...papaxTransport];
    var delService = service.splice(index, 1);
    setpapaxTransport(service);
    if (delService[0].UID) {
      setdeleteService([...deleteService, { UID: delService[0].UID, TableName: 'PREARRIVALTRANSPORT' }]);
    }
  };
  const onRemoveServiceCrew = index => {
    var service = [...pacrewTransport];
    var delService = service.splice(index, 1);
    setpacrewTransport(service);
    if (delService[0].UID) {
      setdeleteService([...deleteService, { UID: delService[0].UID, TableName: 'PREARRIVALTRANSPORT' }]);
    }
  };
  const onRemoveHotel = index => {
    var service = [...papaxHotel];
    var delService = service.splice(index, 1);
    setpapaxHotel(service);
    if (delService[0].UID) {
      setdeleteService([...deleteService, { UID: delService[0].UID, TableName: 'PREARRIVALHOTEL' }]);
    }
  };
  const onRemoveHotelCrew = index => {
    var service = [...pacrewHotel];
    var delService = service.splice(index, 1);
    setpacrewHotel(service);
    if (delService[0].UID) {
      setdeleteService([...deleteService, { UID: delService[0].UID, TableName: 'PREARRIVALHOTEL' }]);
    }
  };
  const removeFilePreA = (field, type, index, aindex) => {
    if (type == "Crew") {
      var temp = [...pacrewHotel];

      temp[index].PCH_MRH_String.splice(aindex, 1);
      setpacrewHotel([...temp])
    }
    else if (type == "Pax") {
      var temp = [...papaxHotel];
      temp[index].PCH_MRH_String.splice(aindex, 1);
      setpapaxHotel([...temp])
    }
    else {
      var temp = { ...pacheck };
      temp[field].splice(index, 1);
      setpacheck({ ...temp });
      console.log(temp);
    }

  };

  const onPressDocPreA_New = async (index, res) => {
    setloading(false);
    console.log(uploadSection, "upload")
    RNFetchBlob.fs
      .readFile(res.uri, 'base64')
      .then(encoded => {
        setloading(false);

        if (uploadSection.type == "Crew") {
          var temp = [...pacrewHotel];
          temp[uploadSection.index].PCH_MRH_String ? temp[uploadSection.index].PCH_MRH_String.push('data:' + res.type + ';base64,' + encoded) : temp[uploadSection.index].PCH_MRH_String = ['data:' + res.type + ';base64,' + encoded];
          console.log("Crew hotel", temp)
          setpacrewHotel([...temp])
        }
        else if (uploadSection.type == "Pax") {
          var temp = [...papaxHotel];
          temp[uploadSection.index].PCH_MRH_String ? temp[uploadSection.index].PCH_MRH_String.push('data:' + res.type + ';base64,' + encoded) : temp[uploadSection.index].PCH_MRH_String = ['data:' + res.type + ';base64,' + encoded];
          setpapaxHotel([...temp])
        }
        else {
          var temp = { ...pacheck };
          temp.PAC_PAGD_String ? temp.PAC_PAGD_String.push('data:' + res.type + ';base64,' + encoded) : temp.PAC_PAGD_String = ['data:' + res.type + ';base64,' + encoded];
          setpacheck({ ...temp })
        }








        refRBSheet.current.close();
      })
      .catch(error => {
        setloading(false);
        console.log(error);
      });
  };


  const disableTransportService = (type) => {
    if (type == 'Pax') {
      var delService = [...papaxTransport];
      var filteredDelService = [];
      delService.map(val => {
        filteredDelService.push({ UID: val.UID, TableName: 'PREARRIVALTRANSPORT' })
      })
      setpapaxTransport([]);
      setdeleteService([...deleteService, ...filteredDelService]);
    }
    else {
      var delService = [...pacrewTransport];
      var filteredDelService = [];
      delService.map(val => {
        filteredDelService.push({ UID: val.UID, TableName: 'PREARRIVALTRANSPORT' })
      })
      setpacrewTransport([]);
      setdeleteService([...deleteService, ...filteredDelService]);

    }
  }

  const disableHotelService = (type) => {
    if (type == 'Pax') {
      var delService = [...papaxHotel];
      var filteredDelService = [];
      delService.map(val => {
        filteredDelService.push({ UID: val.UID, TableName: 'PREARRIVALHOTEL' })
      })
      setpapaxHotel([]);
      setdeleteService([...deleteService, ...filteredDelService]);

    }
    else {
      var delService = [...pacrewHotel];
      var filteredDelService = [];
      delService.map(val => {
        filteredDelService.push({ UID: val.UID, TableName: 'PREARRIVALHOTEL' })
      })
      setpacrewHotel([]);
      setdeleteService([...deleteService, ...filteredDelService]);

    }
  }

  const getImage = async type => {
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
          console.log(file);
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

  const [callLoad, setcallLoad] = useState(false);
  const sendForm = () => {
    setcallLoad(true);
    var domain = getDomain();
    const email = auth().currentUser.email;
    var payload = {
      ...pacheck,
      FUID: FUID,
      UID: uid,
      UPDATE_BY: email,
      STATUS: '0',
    };

    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(payload)
    };
    fetch(
      `${domain}/PostPreArrivalChecklist`,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        Alert.alert('Success');
        setcallLoad(false);
        console.log(result);
        console.log('Hotel Data', papaxHotel.concat(pacrewHotel));
        console.log('Transport Data', papaxTransport.concat(pacrewTransport));
        console.log('deleteService', deleteService);
        if (papaxHotel.concat(pacrewHotel).length > 0) {
          var requestOptions1 = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(papaxHotel.concat(pacrewHotel))
          };
          fetch(
            `${domain}/PostPreArrivalPaxCrewHotel`,
            requestOptions1,
          )
            .then(response => response.text())
            .then(result => {
              // Alert.alert('Success');
              setcallLoad(false);
              console.log('Hotel success', result);
            })
            .catch(error => {
              Alert.alert('Error in updation');
              setcallLoad(false);
              console.log(error, 'Function error');
            });
        }


        if (papaxTransport.concat(pacrewTransport).length > 0) {
          var requestOptions1 = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(papaxTransport.concat(pacrewTransport))
          };
          fetch(
            `${domain}/PostPreArrivalPaxCrewTransport`,
            requestOptions1,
          )
            .then(response => response.text())
            .then(result => {
              // Alert.alert('Success');
              setcallLoad(false);
              readData();
              console.log(result);
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
        headingSize={HeadingTextSize}
        heading={'Pre-Arrival'}
        nav={"IntialScreenView"}
        navigation={props.navigation}
        sendForm={() => sendForm()}
        Icon={
          callLoad ? (
            <ActivityIndicator color="green" size="small" />
          ) : (
            <Icons
              name="content-save"
              color={'green'}
              size={30}
            />
          )
        }
      />
      <ScrollView>
        <Loader visible={loading} />
        <Feedback
          visible={vFeedback}
          onCloseFeedback={() => setvFeedback(false)}
          onSubmitFeedback={onSubmitFeedback}
          value={
            pacheck[currentFeedback.current]
              ? pacheck[currentFeedback.current]
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
                <Text style={{ color: 'black' }}>{pacheck.PAC_CER_REM}</Text>
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
                <Text style={{ color: 'black' }}>{pacheck.PAC_PER_REM}</Text>
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
                <Text style={{ color: 'black' }}>{pacheck.PAC_CTA_REM}</Text>
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
              onPress={event => setpacheck({ ...pacheck, PAC_PTA: pacheck.PAC_PTA == "0" ? "1" : "0" })}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pacheck.PAC_PTA == "1" ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pacheck.PAC_PTA == "1" ? 'white' : 'black',
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
                <Text style={{ color: 'black' }}>{pacheck.PAC_PTA_REM}</Text>
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
                <Text style={{ color: 'black' }}>{pacheck.PAC_CHA_REM}</Text>
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
                <Text style={{ color: 'black' }}>{pacheck.PAC_PHA_REM}</Text>
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
                <Text style={{ color: 'black' }}>{pacheck.PAC_IRP_REM}</Text>
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
                <Text style={{ color: 'black' }}>{pacheck.PAC_IFBO_REM}</Text>
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
                <Text style={{ color: 'black' }}>{pacheck.PAC_IHA_REM}</Text>
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
                <Text style={{ color: 'black' }}>{pacheck.PAC_ICAI_REM}</Text>
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
                <Text style={{ color: 'black' }}>{pacheck.PAC_IAS_REM}</Text>
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
                <Text style={{ color: 'black' }}>{pacheck.PAC_ICC_REM}</Text>
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
              onPress={() => {
                setuploadSection({ field: 'PAC_PAGD_String', type: "", index: 0 });
                // setuploadAddedSection(false);
                refRBSheet.current.open();
              }}
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
                <Text style={{ color: 'black' }}>{pacheck.PAC_PAGD_REM}</Text>
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
          {pacheck.PAC_PAGD_String && pacheck.PAC_PAGD_String.map((val, indexxx) => {
            return (<TouchableOpacity
              onPress={() => {
                if (val.split(",")[0].startsWith('data:image')) {
                  setimageVisible(true);
                  setshowImage(val);
                }
                else {
                  saveFile(val, 'PAC_PAGD_DOCUMENT' + (indexxx + 1))

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
              <Text style={{ color: 'black' }}>{`PAC_PAGD_DOCUMENT` + (indexxx + 1)}</Text>
              <TouchableOpacity onPress={() => removeFilePreA('PAC_PAGD_String', "", 0, indexxx)}>
                <Icons
                  style={{ color: 'green', marginLeft: 10 }}
                  name="close"
                  size={30}
                />
              </TouchableOpacity>
            </TouchableOpacity>)
          })}
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
                <Text style={{ color: 'black' }}>{pacheck.PAC_PRA_REM}</Text>
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
                onPress={() => { setpacheck({ ...pacheck, PAC_PTNR: pacheck.PAC_PTNR ? 0 : 1 }); disableTransportService('Pax') }}
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
                    Pick Up Details:
                  </Text>
                  <LabelledInput
                    label={'Pick Up Location'} //mark
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
                    label={'Scheduled Transport Pick Up Time (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', index, 'papaxTransport', "PCT_STAT");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...papaxTransport];
                      tcheckList[index].PCT_STAT = x
                      setpapaxTransport([...tcheckList]);
                    }}
                    size={12}
                    type={'time'}
                    data={val.PCT_STAT}
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

                    label={'Contact No'} //mark
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
                onPress={() => { disableHotelService('Pax'); setpacheck({ ...pacheck, PAC_PHNR: pacheck.PAC_PHNR ? 0 : 1 }) }}
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
                    index={90}
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
                    index={91}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxHotel];
                      markers[index] = { ...markers[index], PCH_CONTACT_NO: text };
                      setpapaxHotel([...markers]);
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
                      Map of Route to Hotel
                    </Text>
                    <TouchableOpacity
                      //onPress={event => onPressDocPreA(16)}
                      onPress={() => {
                        setuploadSection({ field: 'PCH_MRH_String', type: "Pax", index: index });
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
                  {val.PCH_MRH_String && val.PCH_MRH_String.map((val, indexxx) => {
                    return (<TouchableOpacity
                      onPress={() => {
                        if (val.split(",")[0].startsWith('data:image')) {
                          setimageVisible(true);
                          setshowImage(val);
                        }
                        else {
                          saveFile(val, 'PCH_MRH_DOCUMENT' + (indexxx + 1))
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
                      <Text style={{ color: 'black' }}>{`PCH_MRH_DOCUMENT` + (indexxx + 1)}</Text>
                      <TouchableOpacity onPress={() => removeFilePreA('PCH_MRH_String', "Pax", index, indexxx)}>
                        <Icons
                          style={{ color: 'green', marginLeft: 10 }}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>)
                  })}
                  <LabelledInput
                    label={'Travel Time (Approximate) '} //mark
                    data={val.PCH_TT}
                    datatype={'text'}
                    index={92}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxHotel];
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
                      console.log(x);
                      tcheckList[index] = { ...tcheckList[index], PCH_DATE_CHECKIN: x };
                      // tcheckList[index].PCH_DATE_CHECKIN = x
                      setpapaxHotel([...tcheckList]);
                    }}
                    size={12}
                    type={'date'}
                    data={val.PCH_DATE_CHECKIN}
                    index={93}
                  />
                  <DateTimeInput
                    label={'Check-out Date'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('date', index, 'papaxHotel', "PCH_DATE_CHECKOUT");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...papaxHotel];
                      tcheckList[index] = { ...tcheckList[index], PCH_DATE_CHECKOUT: x };
                      setpapaxHotel([...tcheckList]);
                    }}
                    size={12}
                    type={'date'}
                    data={val.PCH_DATE_CHECKOUT}
                    index={94}
                  />

                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                    <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                      Confirmation Details:
                    </Text>
                    <TouchableOpacity onPress={() => {
                      const email = auth().currentUser.email;
                      console.log(papaxHotel)
                      let markers = [...papaxHotel];
                      let guestMap = markers[index].GuestUser;
                      guestMap.push({ "UID": "", GUEST_NAME: '', CONFIRMATION_NO: '', STATUS: 0, CREATED_BY: email, UPDATE_BY: email });
                      markers[index].GuestUser = guestMap;
                      console.log(markers)
                      setpapaxHotel([...markers]);
                    }} style={{ backgroundColor: "green", padding: 5, borderRadius: 5 }}>
                      <Text style={{ color: "white" }}>Add Guests</Text>
                    </TouchableOpacity>
                  </View>

                  {val.GuestUser && val.GuestUser.map((gval, gindex) => {

                    return <View key={gindex}>
                      <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity
                          style={styleSheet.label}
                          onPress={() => {
                            let markers = [...papaxHotel];
                            let guestMap = markers[index].GuestUser;
                            var delService = guestMap.splice(gindex, 1);
                            if (delService[0].UID) {
                              setdeleteService([...deleteService, { UID: delService[0].UID, TableName: 'HOTELGUESTUSER' }]);
                            }

                            markers[index].GuestUser = guestMap;
                            setpapaxHotel([...markers]);
                          }}>
                          <Icons name="minus-box-outline" color="red" size={30} />
                        </TouchableOpacity>
                      </View>
                      <LabelledInput
                        label={'Guest Name'} //mark
                        data={gval.GUEST_NAME}
                        datatype={'text'}
                        index={13}
                        setText={(i, text, type, section) => {
                          let markers = [...papaxHotel];
                          let guestMap = markers[index].GuestUser[gindex];
                          guestMap = { ...guestMap, GUEST_NAME: text };
                          markers[index].GuestUser[gindex] = guestMap;
                          setpapaxHotel([...markers]);
                        }}
                        multiline={false}
                        numberOfLines={1}
                      />
                      <LabelledInput
                        label={'Confirmation No.'} //mark
                        data={gval.CONFIRMATION_NO}
                        datatype={'text'}
                        index={13}
                        setText={(i, text, type, section) => {
                          let markers = [...papaxHotel];
                          let guestMap = markers[index].GuestUser[gindex];
                          guestMap = { ...guestMap, CONFIRMATION_NO: text };
                          markers[index].GuestUser[gindex] = guestMap;
                          setpapaxHotel([...markers]);
                        }}
                        multiline={false}
                        numberOfLines={1}
                      />
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: 'rgba(0,0,0,0.4)',
                          marginBottom: 20,
                        }}></View>

                    </View>

                  })}
                  <LabelledInput

                    label={'Remarks'} //mark
                    data={val.PCH_REM}
                    datatype={'text'}
                    index={95}
                    setText={(i, text, type, section) => {
                      let markers = [...papaxHotel];
                      markers[index] = { ...markers[index], PCH_REM: text };
                      setpapaxHotel([...markers]);
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
                onPress={() => { disableTransportService('Crew'); setpacheck({ ...pacheck, PAC_CTNR: pacheck.PAC_CTNR ? 0 : 1 }) }}
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
                    Pick Up Details:
                  </Text>
                  <LabelledInput
                    label={'Pick Up Location'} //mark
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
                    label={'Scheduled Transport Pick Up Time (Local Time)'}
                    showDatePickerPostDepart={() => {
                      showDatePicker('time', index, 'pacrewTransport', "PCT_STAT");
                    }}
                    setNowPostDepart={(indexx, x) => {
                      var tcheckList = [...pacrewTransport];
                      tcheckList[index].PCT_STAT = x
                      setpacrewTransport([...tcheckList]);
                    }}
                    size={12}
                    type={'time'}
                    data={val.PCT_STAT}
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

                    label={'Contact No'} //mark
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
                onPress={() => { disableHotelService('Crew'); setpacheck({ ...pacheck, PAC_CHNR: pacheck.PAC_CHNR ? 0 : 1 }) }}
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

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 10,
                      marginBottom: 10,
                    }}>
                    <Text style={styleSheet.label}>
                      Map of Route to Hotel
                    </Text>
                    <TouchableOpacity
                      //onPress={event => onPressDocPreA(16)}
                      onPress={() => {
                        setuploadSection({ field: 'PCH_MRH_String', type: "Crew", index: index });
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
                  {val.PCH_MRH_String && val.PCH_MRH_String.map((val, indexxx) => {
                    return (<TouchableOpacity
                      onPress={() => {
                        if (val.split(",")[0].startsWith('data:image')) {
                          setimageVisible(true);
                          setshowImage(val);
                        }
                        else {
                          saveFile(val, 'PCH_MRH_DOCUMENT' + (indexxx + 1))

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
                      <Text style={{ color: 'black' }}>{`PCH_MRH_DOCUMENT` + (indexxx + 1)}</Text>
                      <TouchableOpacity onPress={() => removeFilePreA('PCH_MRH_String', "Crew", index, indexxx)}>
                        <Icons
                          style={{ color: 'green', marginLeft: 10 }}
                          name="close"
                          size={30}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>)
                  })}
                  <LabelledInput
                    label={'Travel Time (Approximate) '} //mark
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
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                    <Text style={[styleSheet.label, { fontWeight: "bold", marginBottom: 10 }]}>
                      Confirmation Details:
                    </Text>
                    <TouchableOpacity onPress={() => {
                      const email = auth().currentUser.email;
                      let markers = [...pacrewHotel];
                      let guestMap = markers[index].GuestUser;
                      guestMap.push({ "UID": "", GUEST_NAME: '', CONFIRMATION_NO: '', STATUS: 0, CREATED_BY: email, UPDATE_BY: email });
                      markers[index].GuestUser = guestMap;
                      setpacrewHotel([...markers]);
                    }} style={{ backgroundColor: "green", padding: 5, borderRadius: 5 }}>
                      <Text style={{ color: "white" }}>Add Guests</Text>
                    </TouchableOpacity>
                  </View>
                  {val.GuestUser && val.GuestUser.map((gval, gindex) => {

                    return <View key={gindex}>
                      <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity
                          style={styleSheet.label}
                          onPress={() => {
                            let markers = [...pacrewHotel];
                            let guestMap = markers[index].GuestUser;
                            var delService = guestMap.splice(gindex, 1);
                            if (delService[0].UID) {
                              setdeleteService([...deleteService, { UID: delService[0].UID, TableName: 'HOTELGUESTUSER' }]);
                            }
                            markers[index].GuestUser = guestMap;
                            setpacrewHotel([...markers]);
                          }}>
                          <Icons name="minus-box-outline" color="red" size={30} />
                        </TouchableOpacity>
                      </View>
                      <LabelledInput
                        label={'Guest Name'} //mark
                        data={gval.GUEST_NAME}
                        datatype={'text'}
                        index={13}
                        setText={(i, text, type, section) => {
                          let markers = [...pacrewHotel];
                          let guestMap = markers[index].GuestUser[gindex];
                          guestMap = { ...guestMap, GUEST_NAME: text };
                          markers[index].GuestUser[gindex] = guestMap;
                          setpacrewHotel([...markers]);
                        }}
                        multiline={false}
                        numberOfLines={1}
                      />
                      <LabelledInput
                        label={'Confirmation No.'} //mark
                        data={gval.CONFIRMATION_NO}
                        datatype={'text'}
                        index={13}
                        setText={(i, text, type, section) => {
                          let markers = [...pacrewHotel];
                          let guestMap = markers[index].GuestUser[gindex];
                          guestMap = { ...guestMap, CONFIRMATION_NO: text };
                          markers[index].GuestUser[gindex] = guestMap;
                          setpacrewHotel([...markers]);
                        }}
                        multiline={false}
                        numberOfLines={1}
                      />
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: 'rgba(0,0,0,0.4)',
                          marginBottom: 20,
                        }}></View>

                    </View>

                  })}
                  <LabelledInput

                    label={'Remarks'} //mark
                    data={val.PCH_REM}
                    datatype={'text'}
                    index={12}
                    setText={(i, text, type, section) => {
                      let markers = [...pacrewHotel];
                      markers[index] = { ...markers[index], PCH_REM: text };
                      setpacrewHotel([...markers]);
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
