import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';

import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function InterimService({navigation}) {
  const [Iservices, setIservices] = useState([]);

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
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 20,
        }}>
      
        <Text style={{fontSize: 24, fontWeight: 'bold', color: 'black',paddingLeft:20}}>
          Interim Services
        </Text>
        <TouchableOpacity style={{marginRight: 20}}>
          <Icons name="content-save" color="green" size={30} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={{padding: 10}}>
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
