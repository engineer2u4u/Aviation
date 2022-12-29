import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useState, useRef} from 'react';
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

const {width,height} = Dimensions.get('window');
const HeadingTextSize=width / 15;

export default function PreDepartureChecklist({navigation}) {
  const refRBSheet = useRef();

  const [uploadSection, setuploadSection] = useState(0);
  const [uploadaddedSection, setuploadAddedSection] = useState(false);
  const [uploadaddedSectionindex, setuploadAddedSectionindex] = useState(false);

  const [pdaddmovement, setpdaddmovement] = useState(false);
  const [pdaddmovementnum, setpdaddmovementnum] = useState(0);
  const [paxpdaddmovement, setpaxpdaddmovement] = useState(false);
  const [paxpdaddmovementnum, setpaxpdaddmovementnum] = useState(0);
  const [activeSection,setactiveSection]=useState('crew')
  
  const [vFeedback, setvFeedback] = useState(false);
  const currentFeedback = useRef(0);
  const [loading, setloading] = useState(false);

  const [mode, setMode] = useState('time');
  const currentDeparture = useRef(0);

  const [paxhotelactivesections,setpaxhotelactivesections]=useState(false)
  const [crewactivesections,setcrewactivesections]=useState(false)

  const [pdeparturecheck, setpdeparturecheck] = useState([
    //null,
    //null,
    //{value: null, file: []},
    //null,
    //null,
    //null,
    //null,
    //{checked: false, remarks: null},
    //{value: null, file: []},
    //null,
    //null,
    //null,
    //null,
    //null,
    //null,
    //{checked: false, remarks: null},
    //{checked: false, remarks: null},
    //{checked: false, remarks: null},
    //{checked: false, remarks: null},
    //{checked: false, remarks: null},
    //{checked: false, remarks: null},
    //null,
    //null,
    //null,
    //null,
    //{value: null, file: []},
    //{value: null, file: []},
    //[
    //  {
    //    name: null,
    //    location: null,
    //    hotelMap: {value: null, file: []},
    //    time: null,
    //    remarks: null,
    //  },
    //], //27
    //null,
    //[
    //  {
    //    name: null,
    //    location: null,
    //    hotelMap: {value: null, file: []},
    //    time: null,
    //    remarks: null,
    //  },
    //],//29
    //null,//30
    //null,
    {name: null, location: null,hotelMap: {value: null, file: []},time: null,contact:null,remarks: null}, //32 -> 0 for crew
    {name: null, location: null,hotelMap: {value: null, file: []},time: null,contact:null,remarks: null}, //1 -> 1 for pax
    {
      flight_and_admin_documents:{
        recieved:null,
        printed:null,
        notams:null,
        weather_info_updated:null,
        atc_flight_plan:null,
        slot_confirmed:null
      },
      catering:{
        delivery:null
      },
      fueling_time:null,
    },//2 -> 2 for flight and admin documentation time - Local
    {checked: false, remarks: null}, //3 -> 3 gendec
    {hotelMap:{value: null, file: []}}, //4 -> 4 gendec upload <- 1 issue noted
    {checked: false, remarks: null}, //5 FBO -> 5
    {checked: false, remarks: null}, //6 -> 6 Handling Agent
    {checked: false, remarks: null}, //7 -> 7 CIQ
    {checked: false, remarks: null}, //8 -> 8 Airport sec
    {checked: false, remarks: null}, //9 -> 9 Catering agent
    {checked: false, remarks: null}, //10 -> 10 Aircraft Fueller
    {checked: false, remarks: null},//11
    {checked: false, remarks: null},//12
    {checked:false,remarks:null},
    {checked:false,remarks:null}
  ]);
  const getFeedback = index => {
    setvFeedback(true);
    currentFeedback.current = index;
  };
  const onSubmitFeedback = text => {
    var index = currentFeedback.current;
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index].remarks = text;
    setpdeparturecheck(tpdeparturecheck);
    console.log(tpdeparturecheck);
    setvFeedback(false);
  };
  const removeFeedback = index => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index].remarks = null;
    setpdeparturecheck(tpdeparturecheck);
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
    return (
      date[1] + '/' + date[0] + '/' + date[2] + ', ' + time[0] + ':' + time[1]
    );
  };

  const handleConfirmDeparture = date => {
    // console.log("A date has been picked: ",date);
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[currentDeparture.current] = tConvert(
      new Date(date).toLocaleString('en-US', {
        hour12: false,
      }),
    );
    setpdeparturecheck(tpdeparturecheck);
    hideDatePickerDeparture();
  };
  const setNowDeparture = (index,time,type,section='crew') => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index].time = time;
    // tConvert(
    //   new Date().toLocaleString('en-US', {
    //     hour12: false,
    //   }),
    // );
    setpdeparturecheck(tpdeparturecheck);
  };
  const setCheckedDeparture = index => {
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index].checked = !tpdeparturecheck[index].checked;
    setpdeparturecheck(tpdeparturecheck);
    // console.log('triggered', tcheckList);
  };
  const removeFilePreA = (arrayIndex, index, added=false) => {
    console.log('REMOVER',added, arrayIndex, index);
    if(added){
      var tpdeparturecheck = addedcrewSectionval;
      tpdeparturecheck[arrayIndex].hotelMap.file.splice(index, 1);
      setaddedcrewSectionval(tpdeparturecheck);
      return;
    }
    var tpdeparturecheck = [...pdeparturecheck];
    console.log(tpdeparturecheck[arrayIndex].hotelMap.file.length)
    if(tpdeparturecheck[arrayIndex].hotelMap.file.length===1) tpdeparturecheck[arrayIndex].hotelMap.file=[]
    else tpdeparturecheck[arrayIndex].hotelMap.file.splice(index, 1);
    console.log(tpdeparturecheck[arrayIndex].hotelMap.file.length)
    //console.log(tpdeparturecheck[arrayIndex].hotelMap.file)
    setpdeparturecheck(tpdeparturecheck);
  };

 

 
  const [addedtestSection,setaddedtestsection]=useState([]);
  const [addedtestSectionval,setaddedtestSectionval]=useState([])
  const [testmovement,settestmovement] = useState(false);


  //CREW SECTION
  const [addedcrewSection,setaddedcrewSection]=useState([]);
  const [addedcrewSectionval,setaddedcrewSectionval]=useState([])
  const [crewmovement,setcrewmovement] = useState(false);

  //PAX SECTION
  const [addedpaxSection,setaddedpaxSection]=useState([]);
  const [addedpaxSectionval,setaddedpaxSectionval]=useState([])
  const [paxmovement,setpaxmovement] = useState(false);

  const onPressDocPreA_New = async (index, res) => {
    console.log("HEREEE",index,uploadaddedSection);
    setloading(false);
    RNFetchBlob.fs
      .readFile(res.uri, 'base64')
      .then(encoded => {
        // console.log(encoded, 'reports.base64');
        setloading(false);

        if (uploadaddedSection) {
          var tpdeparturecheck = (activeSection==='crew')? [...addedcrewSectionval] : [...addedpaxSectionval];
          //console.log(tpdeparturecheck);
          tpdeparturecheck[index].hotelMap.file.push({
            name: res.fileName.replace('rn_image_picker_lib_temp_', ''),
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          //console.log(tpdeparturecheck[index].hotelMap);
          setaddedcrewSectionval(tpdeparturecheck);
          // var tpdeparturecheck = [...pdeparturecheck];
          // tpdeparturecheck[index][uploadaddedSectionindex].hotelMap.file.push({
          //   name: res.fileName.replace('rn_image_picker_lib_temp_', ''),
          //   base64: 'data:' + res.type + ';base64,' + encoded,
          // });
          // console.log(tpdeparturecheck[index][uploadaddedSectionindex]);
          // setpdeparturecheck(tpdeparturecheck);
        } else {
          console.log("HERE WE GO")

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

  const addnewpaxSection=()=>{
    //add menu section
      var section=[...addedpaxSection];
      var menu={name:"Added Test Section Field"};
      section.push(menu);
    setaddedpaxSection(section);
    //add menu value collection
      var val = [...addedpaxSectionval];
      var data= {name: null, location: null,hotelMap: {value: null, file: []},time: null,contact:null,remarks: null}
      val.push(data);
      console.log(val);
    setaddedpaxSectionval(val);
    setpaxmovement(true);
  }

  const addnewcrewSection=()=>{
    //add menu section
      var section=[...addedcrewSection];
      var menu={name:"Added Test Section Field"};
      section.push(menu);
    setaddedcrewSection(section);
    //add menu value collection
      var val = [...addedcrewSectionval];
      var data= {name: null, location: null,hotelMap: {value: null, file: []},time: null,contact:null,remarks: null}
      val.push(data);
    setaddedcrewSectionval(val);
    setcrewmovement(true);
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
  }
  const [ini,setini]=useState(false);


  const removepaxSection=(index)=>{
    console.log(index);
    //remove section
      var s=[...addedpaxSection];
      s.splice(index,1);
      if(s.length===0) s=[]
    setaddedpaxSection(s);
    //remove val
      var val=[...addedpaxSectionval];
      val.splice(index,1);
      if(val.length===0) val=[];
      console.log(val);
    setaddedpaxSectionval(val)
    setini(!ini)
  }


  const removecrewSection=(index)=>{
    console.log(index);
    //remove section
      var s=[...addedcrewSection];
      s.splice(index,1);
      if(s.length===0) s=[]
    setaddedcrewSection(s);
    //remove val
      var val=[...addedcrewSectionval];
      val.splice(index,1);
      if(val.length===0) val=[];
      console.log(val);
    setaddedcrewSectionval(val)
    setini(!ini)
  }

  const setAddedcrewData = (index,data,type,section='crew') => {
    var x;
    if(section==='crew')  x=addedcrewSectionval;
    else if(section==='pax') x=addedpaxSectionval;
    else if(section==='departure')  x=pdeparturecheck;

    if(section==='crew' || section==='pax'){
      if(type==='time') x[index].time=data
      if(type==='location') { x[index].location=data}
      if(type==='contact') { x[index].contact=data}
      if(type==='remarks') { x[index].remarks=data}
      else if(type==='text') x[index].name=data
    }else if(section==='departure'){
      if(type==='recieved')  x[index].recieved=data;
      if(type==='printed')  x[index].printed=data;
      if(type==='notams')  x[index].notams=data;
      if(type==='weather')  x[index].weather_info_updated=data;
      if(type==='atc')  x[index].atc_flight_plan=data;
      if(type==='slot')  x[index].slot_confirmed=data;
      if(type==='catering') x[index].catering.delivery=data;
      if(type==='fueling_time') x[index].fueling_time=data;
    }
    console.log(x);
    if(section==='crew') setaddedcrewSectionval(x);
    else if(section==='departure') setpdeparturecheck(x);
    else setaddedpaxSectionval(x);
    //console.log(x);
    //setaddedtestSectionval(x);
    // currentDeparture.current = index;
    // setMode(type);
    // setDatePickerVisibilityDeparture(true);
  };
  


  const addnewtestSection=()=>{
    //add menu section
      var section=[...addedtestSection];
      var menu={name:"Added Test Section Field"};
      section.push(menu);
    setaddedtestsection(section);
    //add menu value collection
      var val = [...addedtestSectionval];
      var data= {name: null, location: null,hotelMap: {value: null, file: []},time: null,remarks: null}
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
  }
  const removetestSection=(index)=>{
    console.log(index);
    //remove section
      var s=[...addedtestSection];
      s.splice(index,1);
      if(s.length===0) s=[]
    setaddedtestsection(s);
    //remove val
      var val=[...addedtestSectionval];
      val.splice(index,1);
      if(val.length===0) val=[];
    setaddedtestSectionval(val)
    console.log(addedtestSectionval);
  }

  const setAddedData = (index,data,type) => {
    var x=addedtestSectionval;
    x[index].location=data;
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
      hotelMap: {value: null, file: []},
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

  const [formReady,setformReady]=useState(true);
  const sendForm=()=>{
    var formFields={
      crewtransport:{
        scheduled_pickup_time:'',
        pickup_location:'',
        photo_pickup_location:'',
        driver_name:'',
        driver_contact_num:'',
        remarks:'',
        additional_remarks:'',
        add_transport:[]
      }
    }
  }

  const uploadInitiator=(type,addedsection,section='crew')=>{
    setactiveSection(section);
    setuploadAddedSection(addedsection);
    setuploadSection(type);
    refRBSheet.current.open();
  }

  const setText=(index,text,type,section='crew')=>{
    var tpdeparturecheck = [...pdeparturecheck];
    tpdeparturecheck[index] = text;
    setpdeparturecheck(tpdeparturecheck);
  }

  return (
    <View>
      <Header 
        headingSize={HeadingTextSize} 
        heading={"Pre-Departure Checklist"} 
        sendForm={sendForm} 
        Icon={<Icons name="content-save" color={formReady ? "green" : "#aeaeae"} size={30} />} 
      />
      <ScrollView>
        <Feedback visible={vFeedback} onCloseFeedback={() => setvFeedback(false)} onSubmitFeedback={onSubmitFeedback} />
        <Loader visible={loading} />

        {/* <View style={{padding: 20, marginBottom: 80}}> */
          /** CREW TRANSPPORT */
          
          /* <Text style={styleSheet.label}>Test Section :</Text>  

          <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',marginTop:20
              }}>
              <TouchableOpacity
                onPress={addnewtestSection}
                style={[styleSheet.button]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Transport 
                </Text>
              </TouchableOpacity>
            </View>
            {
              testmovement &&
                addedtestSection.length > 0 &&
                addedtestSection.map((data,index)=>{
                  console.log('VAL',data);
                  return (
                    <View
                        key={index}>
                      <LabelledInput
                        label={'Added Pickup Location'}
                        data={addedtestSectionval[index].location}
                        index={index}
                        added={true}
                        setText={setAddedData} 
                        multiline={false}
                        numberOfLines={1}
                      />
                      <TouchableOpacity onPress={()=>{
                        removetestSection(index)
                      }}>
                        <Text style={{color:"#000"}}>Remove {JSON.stringify(addedtestSectionval[index].location)}</Text>
                      </TouchableOpacity>
                      
                    </View>
                  )
                })
            }

<TouchableOpacity onPress={()=>{
  console.log(addedtestSectionval);
}}>
<Text style={{color:"#000"}}>"ACASDads"</Text>
</TouchableOpacity>
        </View> */
}

        {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => addnewcrewSection()}
                style={[styleSheet.button]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Transport
                </Text>
              </TouchableOpacity>
            </View>

            {
              crewmovement &&
                addedcrewSection.map((data,i)=>{
                  return(
                    <View key={i}>
                      <Text style={{color:"black"}}>Hello {JSON.stringify(addedcrewSectionval[i].time)}</Text>
                      <View style={{alignItems: 'flex-end'}}>
                      <TouchableOpacity
                        style={styleSheet.label}
                        onPress={() => {
                          removecrewSection(i);
                        }}>
                        <Icons name="minus-box-outline" color="red" size={30} />
                      </TouchableOpacity>
                    </View>
                    <DateTimeInput 
                label={'Scheduled Pickup Time (Local Time)'}
                showDatePickerPostDepart={showDatePickerDeparture}
                setNowPostDepart={setAddedcrewData}
                size={12}
                sectionName={'pax'}
                added={true}
                type={'datetime'}
                data={addedcrewSectionval[i].time}
                index={i}
              />

            <TakeCamera 
               label={"Photo of Pickup Location"} 
               type={i} 
               addedsection={true}
               uploadInitiator={uploadInitiator} 
               removeFilePreA={removeFilePreA} 
               attachments={addedcrewSectionval[i].hotelMap} 
            Icon={
              <Icons
                style={{color: 'green', marginLeft: 10}}
                name="close"
                size={30}
              /> 
            } />
                    </View>
                  )
                })
            }
             */}

<View style={[styleSheet.toggleContainer,{paddingHorizontal:20}]}>
            <TouchableOpacity
              onPress={event => setCheckedDeparture(11)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor:pdeparturecheck[11].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[11].checked ? 'white' : 'black',
                  },
                ]}>
                Crew Transport Arranged
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(11)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color={"green"}
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdeparturecheck[11].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[11].remarks}</Text>
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

<View style={[styleSheet.toggleContainer,{paddingHorizontal:20}]}>
            <TouchableOpacity
              onPress={event => setCheckedDeparture(12)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[12].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[12].checked ? 'white' : 'black',
                  },
                ]}>
                Crew Notified on Meeting
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(12)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color={"green"}
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdeparturecheck[12].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[12].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(12)}>
                <Icons
                  style={{marginLeft: 10}}
                  name="delete-circle-outline"
                  color="red"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}


        <View style={{padding: 20, marginBottom: 80}}>
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
<View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={event =>{
                var x = crewactivesections;
                setcrewactivesections(!x);
      
                setcrewmovement(false);
                setaddedcrewSection([]);
                
                var x=[...pdeparturecheck];
                x[0].hotelMap={value: null, file: []};
                setpdeparturecheck(x);
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
                label={'Scheduled Pickup Time (Local Time)'}
                disabled={crewactivesections}
                showDatePickerPostDepart={showDatePickerDeparture}
                setNowPostDepart={setNowDeparture}
                size={12}
                type={'datetime'}
                data={pdeparturecheck[0].time}
                index={0}
              />
              <LabelledInput
                label={'Pickup Location'} //mark
                disabled={crewactivesections}
                data={pdeparturecheck[0].location}
                datatype={'location'}
                index={0}
                setText={setAddedcrewData} 
                multiline={false}
                numberOfLines={1}
              />
              <TakeCamera 
               label={"Photo of Pickup Location s"} 
               disabled={crewactivesections}
               type={0} 
                
               uploadInitiator={uploadInitiator} 
               removeFilePreA={(arrayIndex, index)=>{
                //removeFilePreA(arrayIndex, index, added)
                var x=[...pdeparturecheck]
                if(x[0].hotelMap.file.length===1) x[0].hotelMap.file=[]
                else x[0].hotelMap.file.splice(index,1);

                //setpdeparturecheck(x);
                //console.log(arrayIndex,index)
              }} 
               attachments={pdeparturecheck[0].hotelMap} 
            Icon={
              <Icons
                style={{color: 'green', marginLeft: 10}}
                name="close"
                size={30}
              /> 
            } 
        /> 
            {/*   ------------------------------Transport Operator Reminder	 ----------- */}

            <LabelledInput
                label={'Driver Name'}
                disabled={crewactivesections}
                data={pdeparturecheck[0].name}
                datatype={'text'}
                index={0}
                setText={setAddedcrewData} 
                multiline={false}
                numberOfLines={1}
              />

              <LabelledInput
                label={'Driver Contact Number'}
                disabled={crewactivesections}
                data={pdeparturecheck[0].contact}
                datatype={'contact'}
                index={0}
                setText={setAddedcrewData} 
                multiline={false}
                numberOfLines={1}
              />
              <LabelledInput
                label={'Remarks'}
                disabled={crewactivesections}
                data={pdeparturecheck[0].remarks}
                datatype={'remarks'}
                index={0}
                setText={setAddedcrewData} 
                multiline={false}
                numberOfLines={1}
              />

              {/* <LabelledInput
                label={'Additional Remarks'}
                data={pdeparturecheck[24]}
                index={24}
                setText={setText} 
                multiline={true}
                numberOfLines={2}
              /> */}

            {/*   ------------------------------Transport Operator Reminder	 End ----------- */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                //onPress={() => addMovement(true, 27)}
                disabled={crewactivesections}
                onPress={addnewcrewSection}
                style={[styleSheet.button,{backgroundColor: crewactivesections? '#80808080':'green'}]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Transport
                </Text>
              </TouchableOpacity>
            </View>
{
   
    crewmovement &&
      addedcrewSectionval.map((data,i)=>{
        return(
          <View key={i}>
          <View style={{alignItems: 'flex-end'}}>
          <TouchableOpacity
            style={styleSheet.label}
            onPress={() => {
              removecrewSection(i);
            }}>
            <Icons name="minus-box-outline" color="red" size={30} /> 
            
          </TouchableOpacity>
        </View>
        <View>
        </View>
        
        <DateTimeInput 
    label={'Scheduled Pickup Time (Local Time)'}
    //crewmark
    showDatePickerPostDepart={showDatePickerDeparture}
    setNowPostDepart={setAddedcrewData}
    size={12}
    ini={ini}
    added={true}
    type={'datetime'}
    data={addedcrewSectionval[i].time}
    index={i}
  />

                      <LabelledInput
                        label={'Pickup Location'}
                        data={addedcrewSectionval[i].location}
                        index={i}
                        ini={ini}
                        added={true}
                        datatype={'location'}
                        setText={setAddedcrewData} 
                        multiline={false}
                        numberOfLines={1}
                      />


                      

            <TakeCamera 
               label={"Photo of Pickup Location"} 
               type={i} 
               addedsection={true}
               init={ini}
               
               uploadInitiator={uploadInitiator} 
               removeFilePreA={(a,b,c)=>{
                if(addedcrewSectionval[i].hotelMap.file.length===1) addedcrewSectionval[i].hotelMap.file=[]
                else addedcrewSectionval[i].hotelMap.file.splice(b,1);
               }} 
               attachments={addedcrewSectionval[i].hotelMap} 
            Icon={
              <Icons
                style={{color: 'green', marginLeft: 10}}
                name="close"
                size={30}
              /> 
            } />

                      <LabelledInput
                        label={'Driver Name'}
                        data={addedcrewSectionval[i].name}
                        index={i}
                        ini={ini}
                        added={true}
                        datatype={'text'}
                        setText={setAddedcrewData} 
                        multiline={false}
                        numberOfLines={1}
                      />

<LabelledInput
                        label={'Driver Contact Number'}
                        data={addedcrewSectionval[i].contact}
                        index={i}
                        ini={ini}
                        added={true}
                        datatype={'contact'}
                        setText={setAddedcrewData} 
                        multiline={false}
                        numberOfLines={1}
                      />

<LabelledInput
                        label={'Remarks'}
                        data={addedcrewSectionval[i].remarks}
                        index={i}
                        ini={ini}
                        added={true}
                        datatype={'remarks'}
                        setText={setAddedcrewData} 
                        multiline={false}
                        numberOfLines={1}
                      />

  </View>
        )
          })
        
}

            {/* {pdaddmovement &&
              [...Array(pdaddmovementnum)].map((data, index) => {
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
                        onPress={() => {
                          onRemoveMovement(true);
                        }}>
                        <Icons name="minus-box-outline" color="red" size={30} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styleSheet.label}>
                      Scheduled Transport Pickup Time (Local Time)
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        style={styleSheet.picker}
                        onPress={() =>
                          showDatePicker('time', 60, index, 'arrival')
                        }>
                        <Text style={{fontSize: 20, color: 'black'}}>
                          {pdeparturecheck[parseInt(14 + index)]
                            ? typeof pdeparturecheck[parseInt(14 + index)] ==
                              'object'
                              ? 'dd/mm/yy, -- : --'
                              : pdeparturecheck[parseInt(14 + index)]
                            : 'dd/mm/yy, -- : --'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setNowDeparture(parseInt(14 + index))}
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
                        label={'Pickup Location'}
                        data={pdeparturecheck[0]}
                        index={index}
                        added={true}
                        setText={setText} 
                        multiline={false}
                        numberOfLines={1}
                      />

                    <Text style={styleSheet.label}>Pickup Location</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TextInput
                        style={styleSheet.input}
                        value={pdeparturecheck[0]}
                        onChangeText={text => {
                          var tpdeparturecheck = [...pdeparturecheck];
                          tpdeparturecheck[0] = text;
                          setpdeparturecheck(tpdeparturecheck);
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
                        Photo of Pickup Location
                      </Text>
                      <TouchableOpacity
                        //onPress={event => onPressDocPreA(2)}
                        onPress={async () => {
                          //added section
                          //mark
                          setuploadAddedSection(true);
                          setuploadAddedSectionindex(index);
                          setuploadSection(27);
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
                    {pdeparturecheck[27][index].hotelMap.file.length > 0 && (
                      <View style={{marginBottom: 20}}>
                        {pdeparturecheck[27][index].hotelMap.file.map(
                          (value, index) => {
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
                                <Text style={styleSheet.imgName}>
                                  {value.name}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => removeFilePreA(2, index)}>
                                  <Icons
                                    style={{color: 'green', marginLeft: 10}}
                                    name="close"
                                    size={30}
                                  />
                                </TouchableOpacity>
                              </View>
                            );
                          },
                        )}
                      </View>
                    )}

                    <Text style={styleSheet.label}>Driver Name</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TextInput
                        style={styleSheet.input}
                        value={pdeparturecheck[0]}
                        onChangeText={text => {
                          var tpdeparturecheck = [...pdeparturecheck];
                          tpdeparturecheck[0] = text;
                          setpdeparturecheck(tpdeparturecheck);
                        }}
                      />
                    </View>

                    <Text style={styleSheet.label}>Driver Contact Number</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TextInput
                        style={styleSheet.input}
                        value={pdeparturecheck[0]}
                        onChangeText={text => {
                          var tpdeparturecheck = [...pdeparturecheck];
                          tpdeparturecheck[0] = text;
                          setpdeparturecheck(tpdeparturecheck);
                        }}
                      />
                    </View>

                    <Text style={styleSheet.label}>Remarks</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TextInput
                        style={styleSheet.input}
                        multiline={true}
                        placeholder="Pax Name"
                        numberOfLines={2}
                        //value={remarks}
                        onChangeText={text => {
                          var tarrival = [...arrival];
                          tarrival[60][index].remarks = text;
                          setArrival(tarrival);
                        }}
                      />
                    </View>
                  </View>
                );
              })} */}
          </View>
          {/**CREW END */}
          {/** PAX TRANSPort //mark */}



          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setCheckedDeparture(13)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[13].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[13].checked ? 'white' : 'black',
                  },
                ]}>
                Pax Transport Arranged
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(13)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdeparturecheck[13].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[13].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(13)}>
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
              onPress={event => setCheckedDeparture(14)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[14].checked ? 'green' : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[14].checked ? 'white' : 'black',
                  },
                ]}>
                Pax Transport Arranged
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => getFeedback(14)}>
              <Icons
                style={{marginLeft: 10}}
                name="comment-processing-outline"
                color="green"
                size={30}
              />
            </TouchableOpacity>
          </View>
          {pdeparturecheck[14].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[11].remarks}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFeedback(14)}>
                <Icons
                  style={{marginLeft: 10}}
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
              <TouchableOpacity onPress={event =>{
                var x = paxhotelactivesections;
                setpaxhotelactivesections(!x);
                console.log(x);

                setpaxmovement(false);
                setaddedpaxSection([]);
                
                var x=[...pdeparturecheck];
                x[1].hotelMap={value: null, file: []};
                setpdeparturecheck(x);


                }}>
                <Icons
                  name={
                    paxhotelactivesections
                    
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  color={paxhotelactivesections ? 'green' : 'black'}
                  size={40}
                />
              </TouchableOpacity>
              <Text style={styleSheet.label}>Not Required</Text>
            </View>

             <DateTimeInput 
                label={'Scheduled Pickup Time (Local Time)'}
                disabled={paxhotelactivesections}
                showDatePickerPostDepart={showDatePickerDeparture}
                setNowPostDepart={setNowDeparture}
                size={12}
                type={'datetime'}
                data={pdeparturecheck[1].time}
                index={1}
              />

              <LabelledInput
                label={'Pickup Location'} //mark
                disabled={paxhotelactivesections}
                data={pdeparturecheck[1].location}
                datatype={'location'}
                index={1}
                setText={setAddedcrewData} 
                multiline={false}
                numberOfLines={1}
              />

            <TakeCamera 
               label={"Photo of Pickup Location"} 
               disabled={paxhotelactivesections}
               type={1} 
                
               uploadInitiator={uploadInitiator} 
               removeFilePreA={(arrayIndex, index)=>{
                //removeFilePreA(arrayIndex, index, added)
                var x=[...pdeparturecheck]
                if(x[1].hotelMap.file.length===1) x[1].hotelMap.file=[]
                else x[1].hotelMap.file.splice(index,1);

                //setpdeparturecheck(x);
                //console.log(arrayIndex,index)
              }} 
               attachments={pdeparturecheck[1].hotelMap} 
            Icon={
              <Icons
                style={{color: 'green', marginLeft: 10}}
                name="close"
                size={30}
              /> 
            } 
        /> 

{/* <TakeCamera 
               label={"Upload Departure Gendec"} 
               type={4} 
               addedsection={false}
               init={ini}
               sectionName={'crew'}
               uploadInitiator={uploadInitiator} 
               removeFilePreA={removeFilePreA} 
               attachments={pdeparturecheck[1].hotelMap} 
            Icon={
              <Icons
                style={{color: 'green', marginLeft: 10}}
                name="close"
                size={30}
              /> 
            } /> */}

            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text style={styleSheet.label}>Photo of Pickup Location</Text>
              <TouchableOpacity
                //onPress={event => onPressDocPreA(2)}
                onPress={() => {
                  setuploadAddedSection(false);
                  setuploadSection(26);
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
            {pdeparturecheck[26].file.length > 0 && (
              <View style={{marginBottom: 20}}>
                {pdeparturecheck[26].file.map((value, index) => {
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
                        onPress={() => removeFilePreA(2, index)}>
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
            )} */}

              <LabelledInput
                label={'Driver Name'} //mark
                disabled={paxhotelactivesections}
                data={pdeparturecheck[1].name}
                datatype={'text'}
                index={1}
                setText={setAddedcrewData} 
                multiline={false}
                numberOfLines={1}
              />


<LabelledInput
                label={'Driver Contact Number'} //mark
                disabled={paxhotelactivesections}
                data={pdeparturecheck[1].contact}
                datatype={'contact'}
                index={1}
                setText={setAddedcrewData} 
                multiline={false}
                numberOfLines={1}
              />


<LabelledInput
                label={'Remarks'} //mark
                disabled={paxhotelactivesections}
                data={pdeparturecheck[1].remarks}
                datatype={'remarks'}
                index={1}
                setText={setAddedcrewData} 
                multiline={false}
                numberOfLines={1}
              />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                //onPress={() => addMovement(false, 29)}
                //mark
                disabled={paxhotelactivesections}
                onPress={addnewpaxSection}
                style={[styleSheet.button,{backgroundColor: paxhotelactivesections? '#80808080':'green'}]}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  Add Transport
                </Text>
              </TouchableOpacity>
            </View>

            {
              paxmovement &&
                addedpaxSection.map((data,i)=>{
                  return(
                    <View key={i}>
                      <View style={{alignItems: 'flex-end'}}>
                      <TouchableOpacity
                        style={styleSheet.label}
                        onPress={() => {
                          removepaxSection(i);
                        }}>
                        <Icons name="minus-box-outline" color="red" size={30} />
                      </TouchableOpacity>
                    </View>
                    <DateTimeInput 
                      label={'Scheduled Pickup Time (Local Time)'}
                      showDatePickerPostDepart={showDatePickerDeparture}
                      setNowPostDepart={setAddedcrewData}
                      size={12}
                      ini={ini}
                      added={true}
                      type={'datetime'}
                      sectionName={'pax'}
                      data={addedpaxSectionval[i].time}
                      index={i}
                    />





                      <LabelledInput
                        label={'Pickup Location'}
                        data={addedpaxSectionval[i].location}
                        index={i}
                        ini={ini}
                        added={true}
                        sectionName={'pax'}
                        datatype={'location'}
                        setText={setAddedcrewData} 
                        multiline={false}
                        numberOfLines={1}
                      />

<TakeCamera 
               label={"Photo of Pickup Location"} 
               type={i} 
               addedsection={true}
               init={ini}
               sectionName={'pax'}
               uploadInitiator={uploadInitiator} 
               removeFilePreA={(a,b,c)=>{
                //removeFilePreA

                  //removeFilePreA(arrayIndex, index, added)
                  if(addedpaxSectionval[i].hotelMap.file.length===1) addedpaxSectionval[i].hotelMap.file=[]
                  else addedpaxSectionval[i].hotelMap.file.splice(b,1);
                 
                 
  
                  //setpdeparturecheck(x);
                  //console.log(arrayIndex,index)


              }} 
               attachments={addedpaxSectionval[i].hotelMap} 
            Icon={
              <Icons
                style={{color: 'green', marginLeft: 10}}
                name="close"
                size={30}
              /> 
            } />

<LabelledInput
                        label={'Driver Name'}
                        data={addedpaxSectionval[i].name}
                        index={i}
                        ini={ini}
                        added={true}
                        sectionName={'pax'}
                        datatype={'text'}
                        setText={setAddedcrewData} 
                        multiline={false}
                        numberOfLines={1}
                      />

<LabelledInput
                        label={'Driver Contact Number'}
                        data={addedpaxSectionval[i].contact}
                        index={i}
                        ini={ini}
                        added={true}
                        sectionName={'pax'}
                        datatype={'contact'}
                        setText={setAddedcrewData} 
                        multiline={false}
                        numberOfLines={1}
                      />

<LabelledInput
                        label={'Remarks'}
                        data={addedpaxSectionval[i].remarks}
                        index={i}
                        ini={ini}
                        added={true}
                        sectionName={'pax'}
                        datatype={'remarks'}
                        setText={setAddedcrewData} 
                        multiline={false}
                        numberOfLines={1}
                      />


                    </View>
                  )
                })
            }

            {/* {paxpdaddmovement &&
              [...Array(paxpdaddmovementnum)].map((data, index) => {
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
                        onPress={() => {
                          onRemoveMovement(false);
                        }}>
                        <Icons name="minus-box-outline" color="red" size={30} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styleSheet.label}>
                      Scheduled Transport Pickup Time (Local Time)
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        style={styleSheet.picker}
                        onPress={() =>
                          showDatePicker('time', 60, index, 'arrival')
                        }>
                        <Text style={{fontSize: 20, color: 'black'}}>
                          {pdeparturecheck[parseInt(14 + index)]
                            ? typeof pdeparturecheck[parseInt(14 + index)] ==
                              'object'
                              ? 'dd/mm/yy, -- : --'
                              : pdeparturecheck[parseInt(14 + index)]
                            : 'dd/mm/yy, -- : --'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setNowDeparture(parseInt(14 + index))}
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

                    <Text style={styleSheet.label}>Pickup Location</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TextInput
                        style={styleSheet.input}
                        value={pdeparturecheck[0]}
                        onChangeText={text => {
                          var tpdeparturecheck = [...pdeparturecheck];
                          tpdeparturecheck[0] = text;
                          setpaxpdeparturecheck(tpaxpdeparturecheck);
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
                        Photo of Pickup Location
                      </Text>
                      <TouchableOpacity
                        //onPress={event => onPressDocPreA(2)}
                        onPress={() => {
                          setuploadAddedSection(true);
                          setuploadAddedSectionindex(index);
                          setuploadSection(29);
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
                    {pdeparturecheck[29][index].hotelMap.file.length > 0 && (
                      <View style={{marginBottom: 20}}>
                        {pdeparturecheck[29][index].hotelMap.file.map(
                          (value, index) => {
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
                                <Text style={styleSheet.imgName}>
                                  {value.name}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => removeFilePreA(2, index)}>
                                  <Icons
                                    style={{color: 'green', marginLeft: 10}}
                                    name="close"
                                    size={30}
                                  />
                                </TouchableOpacity>
                              </View>
                            );
                          },
                        )}
                      </View>
                    )}

                    <Text style={styleSheet.label}>Driver Name</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TextInput
                        style={styleSheet.input}
                        value={pdeparturecheck[0]}
                        onChangeText={text => {
                          var tpdeparturecheck = [...pdeparturecheck];
                          tpdeparturecheck[0] = text;
                          setpdeparturecheck(tpdeparturecheck);
                        }}
                      />
                    </View>

                    <Text style={styleSheet.label}>Driver Contact Number</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TextInput
                        style={styleSheet.input}
                        value={pdeparturecheck[0]}
                        onChangeText={text => {
                          var tpdeparturecheck = [...pdeparturecheck];
                          tpdeparturecheck[0] = text;
                          setpdeparturecheck(tpdeparturecheck);
                        }}
                      />
                    </View>

                    <Text style={styleSheet.label}>Remarks</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TextInput
                        style={styleSheet.input}
                        multiline={true}
                        placeholder="Pax Name"
                        numberOfLines={2}
                        //value={remarks}
                        onChangeText={text => {
                          var tarrival = [...arrival];
                          tarrival[60][index].remarks = text;
                          setArrival(tarrival);
                        }}
                      />
                    </View>
                  </View>
                );
              })} */}
          </View>
          {/**PAX TRANS END //catering.delivery=data */}


          <DateTimeInput 
                      label={'Confirm Catering Delivery Time (Local Time)'}
                      showDatePickerPostDepart={showDatePickerDeparture}
                      setNowPostDepart={setAddedcrewData}
                      size={12}
                      ini={ini}
                      added={true}
                      type={'catering'}
                      sectionName={'departure'}
                      data={pdeparturecheck[2].catering.delivery}
                      index={2}
                    />


<DateTimeInput 
                      label={'Fueling Time (Local Time)'}
                      showDatePickerPostDepart={showDatePickerDeparture}
                      setNowPostDepart={setAddedcrewData}
                      size={12}
                      ini={ini}
                      added={true}
                      type={'fueling_time'}
                      sectionName={'departure'}
                      data={pdeparturecheck[2].fueling_time}
                      index={2}
                    />

          {/* <Text style={styleSheet.label}>
            Confirm Catering Delivery Time (Local Time)
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDeparture('datetime', 5)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {pdeparturecheck[5] ? pdeparturecheck[5] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDeparture(5)}
              style={{padding: 10}}>
              <Text
                style={{
                  fontSize: Dimensions.get('window').width / 25,
                  color: 'green',
                }}>
                Time Now
              </Text>
            </TouchableOpacity>
          </View> */}
          {/* <Text style={styleSheet.label}>Fuelling Time (Local Time)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={styleSheet.picker}
              onPress={() => showDatePickerDeparture('datetime', 6)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {pdeparturecheck[6] ? pdeparturecheck[6] : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowDeparture(6)}
              style={{padding: 10}}>
              <Text
                style={{
                  fontSize: Dimensions.get('window').width / 25,
                  color: 'green',
                }}>
                Time Now
              </Text>
            </TouchableOpacity>
          </View> */}
          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setCheckedDeparture(3)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[3].checked
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[3].checked ? 'white' : 'black',
                  },
                ]}>
                Prepared Departure GenDec
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
          {pdeparturecheck[3].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[3].remarks}</Text>
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

<TakeCamera 
               label={"Upload Departure Gendec"} 
               type={4} 
               addedsection={false}
               init={ini}
               sectionName={'departure'}
               uploadInitiator={uploadInitiator} 
               removeFilePreA={(a,b,c)=>{
                console.log(a,b,c);
                var x=[...pdeparturecheck];
                if(x[4].hotelMap.file.length===1) x[4].hotelMap.file=[];
                else  x[4].hotelMap.file.splice(b,1);
//come here
                //removeFilePreA()
              }} 
               attachments={pdeparturecheck[4].hotelMap} 
            Icon={
              <Icons
                style={{color: 'green', marginLeft: 10}}
                name="close"
                size={30}
              /> 
            } />

          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 20,
            }}>
            <Text style={styleSheet.label}>Upload Departure GenDec</Text>
            <TouchableOpacity
              //onPress={event => onPressDocPreA(8)}
              onPress={event => {
                setuploadSection(8);
                refRBSheet.current.open();
              }}
              style={{
                marginLeft: 10,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 8,
              }}>
              <Text style={{color: 'green'}}>Add Files</Text>
            </TouchableOpacity>
          </View>
          {pdeparturecheck[8].file.length > 0 && (
            <View style={{marginBottom: 20}}>
              {pdeparturecheck[8].file.map((value, index) => {
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
                    <TouchableOpacity onPress={() => removeFilePreA(8, index)}>
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
          )} */}
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
                      showDatePickerPostDepart={showDatePickerDeparture}
                      setNowPostDepart={setAddedcrewData}
                      size={12}
                      ini={ini}
                      added={true}
                      type={'recieved'}
                      sectionName={'departure'}
                      data={pdeparturecheck[2].flight_and_admin_documents.recieved}
                      index={2}
                    />

<DateTimeInput 
                      label={'Flight Documents Printed (Local Time)'}
                      showDatePickerPostDepart={showDatePickerDeparture}
                      setNowPostDepart={setAddedcrewData}
                      size={12}
                      ini={ini}
                      added={true}
                      type={'printed'}
                      sectionName={'departure'}
                      data={pdeparturecheck[2].flight_and_admin_documents.printed}
                      index={2}
                    />

<DateTimeInput 
                      label={'Notams Updated (Local Time)'}
                      showDatePickerPostDepart={showDatePickerDeparture}
                      setNowPostDepart={setAddedcrewData}
                      size={12}
                      ini={ini}
                      added={true}
                      type={'notams'}
                      sectionName={'departure'}
                      data={pdeparturecheck[2].flight_and_admin_documents.notams}
                      index={2}
                    />

<DateTimeInput 
                      label={'Weather Information (Local Time)'}
                      showDatePickerPostDepart={showDatePickerDeparture}
                      setNowPostDepart={setAddedcrewData}
                      size={12}
                      ini={ini}
                      added={true}
                      type={'weather'}
                      sectionName={'departure'}
                      data={pdeparturecheck[2].flight_and_admin_documents.weather_info_updated}
                      index={2}
                    />

<DateTimeInput 
                      label={'ATC Flight Plan Filed (Local Time)'}
                      showDatePickerPostDepart={showDatePickerDeparture}
                      setNowPostDepart={setAddedcrewData}
                      size={12}
                      ini={ini}
                      added={true}
                      type={'atc'}
                      sectionName={'departure'}
                      data={pdeparturecheck[2].flight_and_admin_documents.atc_flight_plan}
                      index={2}
                    />

<DateTimeInput 
                      label={'Slots Confirmed (Local Time)'}
                      showDatePickerPostDepart={showDatePickerDeparture}
                      setNowPostDepart={setAddedcrewData}
                      size={12}
                      ini={ini}
                      added={true}
                      type={'slot'}
                      sectionName={'departure'}
                      data={pdeparturecheck[2].flight_and_admin_documents.slot_confirmed}
                      index={2}
                    />
            {/* 
            recieved
printed
notams
weather
atc
slot
            
            <Text style={styleSheet.label}>
              Flight Documents Received (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDeparture('time', 9)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {pdeparturecheck[9] ? pdeparturecheck[9] : 'dd/mm/yy,--:--'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDeparture(9)}
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
              Flight Documents Printed (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDeparture('time', 10)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {pdeparturecheck[10] ? pdeparturecheck[10] : 'dd/mm/yy,--:--'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDeparture(10)}
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
            <Text style={styleSheet.label}>Notams Updated (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDeparture('time', 11)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {pdeparturecheck[11] ? pdeparturecheck[11] : 'dd/mm/yy,--:--'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDeparture(11)}
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
              Weather Information Updated (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDeparture('time', 12)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {pdeparturecheck[12] ? pdeparturecheck[12] : 'dd/mm/yy,--:--'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDeparture(12)}
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
              ATC Flight Plan Filed (Local Time)
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDeparture('time', 13)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {pdeparturecheck[13] ? pdeparturecheck[13] : 'dd/mm/yy,--:--'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDeparture(13)}
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
            <Text style={styleSheet.label}>Slots Confirmed (Local Time)</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={styleSheet.picker}
                onPress={() => showDatePickerDeparture('time', 14)}>
                <Text style={{fontSize: 20, color: 'black'}}>
                  {pdeparturecheck[14] ? pdeparturecheck[14] : 'dd/mm/yy,--:--'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNowDeparture(14)}
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
            */}
          </View>
          {/*   ------------------------------Flight Documents/Admin End ----------- */}

          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setCheckedDeparture(5)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[5].checked
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[5].checked ? 'white' : 'black',
                  },
                ]}>
                FBO Reminder
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
          {pdeparturecheck[5].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[5].remarks}</Text>
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
              onPress={event => setCheckedDeparture(6)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[6].checked
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[6].checked ? 'white' : 'black',
                  },
                ]}>
                Handling Agent Reminder
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
          {pdeparturecheck[6].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[6].remarks}</Text>
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
              onPress={event => setCheckedDeparture(7)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[7].checked
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[7].checked ? 'white' : 'black',
                  },
                ]}>
                CIQ Reminder
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
          {pdeparturecheck[7].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[7].remarks}</Text>
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
              onPress={event => setCheckedDeparture(8)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[8].checked
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[8].checked ? 'white' : 'black',
                  },
                ]}>
                Airport Security Reminder
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
          {pdeparturecheck[8].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[8].remarks}</Text>
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
              onPress={event => setCheckedDeparture(9)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[9].checked
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[9].checked ? 'white' : 'black',
                  },
                ]}>
                Catering Agent Reminder
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
          {pdeparturecheck[9].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[9].remarks}</Text>
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

          <View style={styleSheet.toggleContainer}>
            <TouchableOpacity
              onPress={event => setCheckedDeparture(10)}
              style={[
                styleSheet.toggleButton,
                {
                  backgroundColor: pdeparturecheck[10].checked
                    ? 'green'
                    : 'white',
                },
              ]}>
              <Text
                style={[
                  styleSheet.label,
                  {
                    textAlign: 'center',
                    color: pdeparturecheck[10].checked ? 'white' : 'black',
                  },
                ]}>
                Aircraft Fueller Reminder
              </Text>
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
          {pdeparturecheck[10].remarks && (
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <View style={styleSheet.remarks}>
                <Text>{pdeparturecheck[10].remarks}</Text>
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
                <Text style={{color: 'black', fontSize: 22}}>Upload</Text>
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
  imgName: {color: 'black', fontSize: 12, fontWeight: '600'},
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
