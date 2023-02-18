import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import functions from '@react-native-firebase/functions';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ActivityIndicator} from 'react-native';
import {firebase} from '@react-native-firebase/functions';
import auth from '@react-native-firebase/auth';

export default function InterimService(props) {
  const FUID = props.route.params.UID;
  const [uid, setuid] = useState(null);

  const [Iservices, setIservices] = useState([]);
  useEffect(() => {
    setcallLoad(true);
    firebase
      .app()
      .functions('asia-southeast1')
      .httpsCallable(
        'getFlightModule?fuid=' + FUID + '&module=GetInterimServices',
      )()
      .then(response => {
        setcallLoad(false);

        var packet = JSON.parse(response.data.body);
        var res = packet.Table;
        console.log(res);
        if (res.length > 0) {
          var y = [...Iservices];
          y = [];
          res.forEach((val, index) => {
            y.push({
              service: val.INS_SERVICE.trim().replace('""', ''),
              remarks: val.INS_REM.trim().replace('""', ''),
              UID: val.UID,
            });
          });
          setIservices([...y]);
        }
      })
      .catch(error => {
        setcallLoad(false);
        console.log(error, 'Function error');
      });
  }, []);

  const onAddServices = () => {
    setIservices([...Iservices, {service: null, remarks: null}]);
  };
  const onRemoveService = index => {
    var service = [...Iservices];
    service.splice(index, 1);
    setIservices(service);
  };

  const onChangeService = (text, index, type) => {
    var service = [...Iservices];
    service[index][type] = text;
    setIservices(service);
  };
  const [callLoad, setcallLoad] = useState(false);
  const sendForm = () => {
    const email = auth().currentUser.email;
    setcallLoad(true);
    Iservices.map(val => {
      firebase
        .app()
        .functions('asia-southeast1')
        .httpsCallable('updateFlightModule?module=PostInterimServices')(
          JSON.stringify({
            INS_SERVICE: val.service ? val.service : '""',
            INS_REM: val.remarks ? val.remarks : '""',
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
          Interim Services
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
        <View style={{padding: 10, paddingBottom: 100}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={onAddServices}
              style={[styleSheet.button, {marginHorizontal: 30}]}>
              <Text style={{color: 'white', textAlign: 'center'}}>
                Add Service
              </Text>
            </TouchableOpacity>
          </View>
          {Iservices.length > 0 && (
            <>
              <View
                style={{
                  borderColor: 'rgba(0,0,0,0.5)',
                  padding: 10,
                  borderRadius: 10,
                  marginVertical: 10,
                }}>
                {Iservices.map((val, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        borderBottomWidth: 1,
                        marginVertical: 10,
                        borderBottomColor: 'rgba(0,0,0,0.3)',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text style={styleSheet.label}>Services Provided</Text>
                        <TouchableOpacity
                          style={styleSheet.label}
                          onPress={() => onRemoveService(index)}>
                          <Icons
                            name="minus-box-outline"
                            color="red"
                            size={30}
                          />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TextInput
                          style={styleSheet.input}
                          value={Iservices[index].service}
                          onChangeText={text =>
                            onChangeService(text, index, 'service')
                          }
                        />
                      </View>
                      <Text style={styleSheet.label}>Additional Remarks</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 10,
                        }}>
                        <TextInput
                          style={styleSheet.input}
                          multiline={true}
                          numberOfLines={2}
                          value={Iservices[index].remarks}
                          onChangeText={text =>
                            onChangeService(text, index, 'remarks')
                          }
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  checkbox: {
    width: 40,
    height: 40,
    backgroundColor: 'red',
  },
  label: {
    fontSize: 15,
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
