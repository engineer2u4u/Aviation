import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Touchable
} from 'react-native';
import React, {useState,useRef} from 'react';
import Loader from '../Loader';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as ImagePicker from 'react-native-image-picker';

import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';

const {height} = Dimensions.get('window');

export default function FlightPreparation({navigation}) {
  const refRBSheet = useRef();
    //upload funcs
    const [uploadSection,setuploadSection]=useState(0);


  const [loading, setloading] = useState(false);
  const [fpreparation, setfpreparation] = useState([
    null,
    null,
    null,
    {value: null, file: []},
    {value: null, file: []},
    {value: null, file: []},
  ]);
  const onPressDocFPreparation = async index => {
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
          var tfpreparation = [...fpreparation];
          tfpreparation[index].file.push({
            name: res.name,
            base64: 'data:' + res.type + ';base64,' + encoded,
          });
          setfpreparation(tfpreparation);
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

  return (
    <ScrollView>
      <Loader visible={loading} />
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
            paddingLeft:20
          }}>
          Flight Preparation
        </Text>
        <TouchableOpacity style={{marginRight: 20}}>
          <Icons name="content-save" color="green" size={30} />
        </TouchableOpacity>
      </View>
      <View style={{padding: 20}}>
        <Text style={styleSheet.label}>Airport Information</Text>
        <TextInput
          style={styleSheet.input}
          multiline={true}
          numberOfLines={4}
          value={fpreparation[0]}
          onChangeText={text => {
            var tfpreparation = [...fpreparation];
            tfpreparation[0] = text;
            setfpreparation(tfpreparation);
          }}
        />
        <Text style={styleSheet.label}>NOTAMs</Text>
        <TextInput
          style={styleSheet.input}
          multiline={true}
          numberOfLines={4}
          value={fpreparation[1]}
          onChangeText={text => {
            var tfpreparation = [...fpreparation];
            tfpreparation[1] = text;
            setfpreparation(tfpreparation);
          }}
        />
        <Text style={styleSheet.label}>Special Procedures</Text>
        <TextInput
          style={styleSheet.input}
          multiline={true}
          numberOfLines={4}
          value={fpreparation[2]}
          onChangeText={text => {
            var tfpreparation = [...fpreparation];
            tfpreparation[2] = text;
            setfpreparation(tfpreparation);
          }}
        />
        <Text style={styleSheet.label}>Slots</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={styleSheet.input}
            multiline={true}
            numberOfLines={2}
            value={fpreparation[3].value}
            onChangeText={text => {
              var tfpreparation = [...fpreparation];
              tfpreparation[3].value = text;
              setfpreparation(tfpreparation);
            }}
          />
          <TouchableOpacity 
            //onPress={() => onPressDocFPreparation(3)}
            onPress={() => {
              setuploadSection(3);
              refRBSheet.current.open();
            }}
          >
            <Icons
              style={{color: 'green', marginLeft: 10}}
              name="upload"
              size={40}
            />
          </TouchableOpacity>
        </View>

        {fpreparation[3].file.length > 0 && (
          <View style={{marginBottom: 20}}>
            {fpreparation[3].file.map((value, index) => {
              return (
                <View
                  style={{
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
                  }}>
                  <Text style={{color: 'black'}}>{value.name}</Text>
                  <TouchableOpacity onPress={() => removeFileFP(3, index)}>
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

        <Text style={styleSheet.label}>Parking</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={styleSheet.input}
            multiline={true}
            numberOfLines={2}
            value={fpreparation[4].value}
            onChangeText={text => {
              var tfpreparation = [...fpreparation];
              tfpreparation[4].value = text;
              setfpreparation(tfpreparation);
            }}
          />
          <TouchableOpacity 
            //onPress={() => onPressDocFPreparation(4)}
            onPress={() => {
              setuploadSection(4);
              refRBSheet.current.open();
            }}
          >
            <Icons
              style={{color: 'green', marginLeft: 10}}
              name="upload"
              size={40}
            />
          </TouchableOpacity>
        </View>
        {fpreparation[4].file.length > 0 && (
          <View style={{marginBottom: 20}}>
            {fpreparation[4].file.map((value, index) => {
              return (
                <View
                  style={{
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
                  }}>
                  <Text style={{color: 'black'}}>{value.name}</Text>
                  <TouchableOpacity onPress={() => removeFileFP(4, index)}>
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
        <Text style={styleSheet.label}>Landing Permit</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={styleSheet.input}
            multiline={true}
            numberOfLines={2}
            value={fpreparation[5].value}
            onChangeText={text => {
              var tfpreparation = [...fpreparation];
              tfpreparation[5].value = text;
              setfpreparation(tfpreparation);
            }}
          />
          <TouchableOpacity 
            //onPress={() => onPressDocFPreparation(5)}
            onPress={() => {
              setuploadSection(5);
              refRBSheet.current.open();
            }}
          >
            <Icons
              style={{color: 'green', marginLeft: 10}}
              name="upload"
              size={40}
            />
          </TouchableOpacity>
        </View>
        {fpreparation[5].file.length > 0 && (
          <View style={{marginBottom: 20}}>
            {fpreparation[5].file.map((value, index) => {
              return (
                <View
                  style={{
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
                  }}>
                  <Text style={{color: 'black'}}>{value.name}</Text>
                  <TouchableOpacity onPress={() => removeFileFP(5, index)}>
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
        {/* <View style={{flexDirection: 'row', marginTop: 10}}>
          <TouchableOpacity style={[styleSheet.button, {marginRight: 10}]}>
            <Text style={{color: 'white', textAlign: 'center'}}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log(fpreparation)}
            style={[styleSheet.button, {marginLeft: 10}]}>
            <Text style={{color: 'white', textAlign: 'center'}}>Submit</Text>
          </TouchableOpacity>
        </View> */}
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
