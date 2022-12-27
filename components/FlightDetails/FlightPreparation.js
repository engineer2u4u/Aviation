import { View,StyleSheet,Text,TouchableOpacity,ScrollView,Dimensions } from 'react-native';
import React, {useState,useRef} from 'react';
import Loader from '../Loader';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as ImagePicker from 'react-native-image-picker';

import RNFetchBlob from 'rn-fetch-blob';
import Header from '../subcomponents/Forms/Header';
import BroadTextInput from '../subcomponents/Forms/FlightPreparation/broadTextInput';
import BroadImageUpload from '../subcomponents/Forms/FlightPreparation/broadImageUpload';

const {width,height} = Dimensions.get('window');

const HeadingTextSize=width / 15;
const labelTextSize=width / 25;
const uploadMenu=[
  {id:0,name:"Slots",textId:3},
  {id:1,name:"Parking",textId:4},
  {id:2,name:"Landing Permit",textId:5}
]
        
export default function FlightPreparation({navigation}) {
  const refRBSheet = useRef();
  const [uploadSection,setuploadSection]=useState(0);
  const [loading, setloading] = useState(false);
  const [fpreparation, setfpreparation] = useState([
    {value: null, file: []},
    {value: null, file: []},
    {value: null, file: []}
  ]);

  const removeFileFP = (arrayIndex, index) => {
    var tfpreparation = [...fpreparation];
    tfpreparation[arrayIndex].file.splice(index, 1);
    setfpreparation(tfpreparation);
  };

  const onPressDocPreA_New = async (index,res) => {

    setloading(false);
    RNFetchBlob.fs
  .readFile(res.uri, 'base64')
  .then(encoded => {
    // console.log(encoded, 'reports.base64');
    setloading(false);
    var tfpreparation = [...fpreparation];
    tfpreparation[index].file.push({
      name: res.fileName.replace('rn_image_picker_lib_temp_',''),
      base64: 'data:' + res.type + ';base64,' + encoded,
    });
    setfpreparation(tfpreparation);
})
  .catch(error => {
    setloading(false);
    console.log(error);
  });

  refRBSheet.current.close();

}

const getImage=async (type)=>{
console.log("HERE",uploadSection)
var options={mediaType:'image',includeBase64: false,maxHeight: 800,maxWidth: 800};
console.log(options);
switch(type){
case true:
  try {
    options.mediaType='photo';
    const result = await ImagePicker.launchImageLibrary(options);  
    const file=result.assets[0];
    
    onPressDocPreA_New(uploadSection,file)

  } catch (error) {
    console.log(error);
  }
  break;
  case false:
    try {
      const result = await ImagePicker.launchCamera(options);  
      const file=result.assets[0];
      onPressDocPreA_New(uploadSection,file)
    } catch (error) {
      console.log(error);
    }
    break;
    default:
      break;
}

}


//NEW STRUCTURE

const [airinfo,setAirInfo]=useState('');
const [notams,setnotams]=useState('');
const [specialproc,setspecialproc]=useState('');

const [slot,setSlot]=useState('');
const [parking,setParking]=useState('');
const [landingperm,setlandingperm]=useState('');

const [formReady,setformReady]=useState(true);

const validate=()=>{
  //console.log('called');
  //lay validation rules
  //setformReady(true)
  //asd
  //test
}

const textSeeker=(type,event)=>{
  validate();
  switch(type){
    case 0:
      setAirInfo(event);
      break;
    case 1:
      setnotams(event);
      break;
    case 2:
      setspecialproc(event);
      break;
    case 3:
      setSlot(event)
      break;
    case 4:
      setParking(event)
      break;
    case 5:
      setlandingperm(event);
      break;
    default:
      return false;
      break;
  }
};

const uploadInitiator=(type)=>{
  setuploadSection(type);
  refRBSheet.current.open();
}

const sendForm=()=>{
  //fields
  var formFields={
    textFields:{
      Airport_Information:airinfo,
      Notams:notams,
      Special_Procedures:specialproc
    },
    uploadFields:{
      Slots:{
        text:slot,
        files:fpreparation[0]
      },
      Parking:{
        text:parking,
        files:fpreparation[1]
      },
      LandingPermit:{
        text:landingperm,
        files:fpreparation[2]
      }
    }
  }

  console.log("READY TO BE SENT",formFields);
}

//NEW STRUCtURE ENDS


  return (
    <ScrollView>
      <Loader visible={loading} />
      <Header headingSize={HeadingTextSize} heading={"Flight Preparation"} sendForm={sendForm} Icon={<Icons name="content-save" color={formReady ? "green" : "#aeaeae"} size={30} />} />
      <View style={{padding: 20}}>
        
        <BroadTextInput type={0} label={"Airport Information"} labelSize={labelTextSize} text={airinfo} textSeeker={textSeeker}/>
        <BroadTextInput type={1} label={"NOTAMs"} labelSize={labelTextSize} text={notams} textSeeker={textSeeker}/>
        <BroadTextInput type={2} label={"Special Procedures"} labelSize={labelTextSize} text={specialproc} textSeeker={textSeeker}/>
       {
        uploadMenu.map((data,index)=>{
          return(
            <BroadImageUpload 
          key={index}
          type={index}
          textId={data.textId}
          label={data.name}
          text={(index===0)? slot : (index===1) ? parking : landingperm }
          textSeeker={textSeeker}
          uploadType={index}
          uploadInitiator={uploadInitiator}
          icon={ <Icons style={{marginLeft: 10}} color={"green"} name="upload" size={40} /> }

          attachMents={
            <>
             {fpreparation[data.id].file.length > 0 && (
          <View style={{marginBottom: 20}}>
            {fpreparation[data.id].file.map((value, index) => {
              return (
                <View
                  key={index}
                  style={styleSheet.attachment}>
                  <Text style={{color: 'black'}}>{value.name}</Text>
                  <TouchableOpacity onPress={() => removeFileFP(data.id, index)}>
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
            </>
          }
        />
          )
        })
       } 
        
        
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
                onPress={()=>getImage(false)} 
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
                  onPress={()=>getImage(true)} 
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
    </ScrollView>
  );
}

const styleSheet = StyleSheet.create({
  attachment:{
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
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
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
  },
});