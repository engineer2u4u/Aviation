//import liraries
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from 'accordion-collapse-react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';

// create a component
const Log2 = ({navigation}) => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <TouchableOpacity
            style={{paddingRight: 10}}
            onPress={() => navigation.navigate('LogDetails')}>
            <FontAwesome5Icons name="caret-left" color={'black'} size={40} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Log Report
          </Text>
        </View>
        <View
          style={{
            width: width - 60,
            borderWidth: 2,
            borderColor: 'black',
            borderRadius: 8,
            padding: 10,
          }}>
          <Text style={{color: 'black', fontSize: 24, fontWeight: 'bold'}}>
            Phongsubthavy Group Sole Co. Ltd
          </Text>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 1}}>
              <Text style={{color: 'black', fontSize: 20}}>17-Jan-2023</Text>
              <Text style={{color: 'black', fontSize: 20}}>H25B</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{color: 'black', fontSize: 20}}>
                Registration: T7-5678
              </Text>
              <Text style={{color: 'black', fontSize: 20}}>Log#: 3</Text>
            </View>
          </View>
        </View>
        <Collapse style={{marginTop: 10}}>
          <CollapseHeader>
            <View
              style={{
                backgroundColor: '#3b7dfc',
                flexDirection: 'row',
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 5,
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome5Icons name="user-tie" color={'white'} size={25} />
                <Text
                  style={{
                    fontSize: 24,
                    color: 'white',
                    padding: 5,
                    paddingLeft: 10,
                  }}>
                  Crew Details
                </Text>
              </View>
              <FontAwesome5Icons name="caret-down" color={'white'} size={25} />
            </View>
          </CollapseHeader>
          <CollapseBody>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 5,
                paddingVertical: 15,
                borderBottomWidth: 2,
                borderLeftWidth: 2,
                borderRightWidth: 2,
                borderColor: '#3b7dfc',
                backgroundColor: '#fff',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: 'black',
                }}>
                PIC: Gareth Joseph Griffiths
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 5,
                paddingVertical: 15,
                borderBottomWidth: 2,
                borderLeftWidth: 2,
                borderRightWidth: 2,
                borderColor: '#3b7dfc',
                backgroundColor: '#fff',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: 'black',
                }}>
                Pilot: Martin Sauer
              </Text>
            </View>
          </CollapseBody>
        </Collapse>
        <Text
          style={{
            marginTop: 20,
            fontSize: 24,
            fontWeight: 'bold',
            color: 'black',
          }}>
          Pilot Reports
        </Text>
        <View
          style={{
            width: width - 60,
            borderWidth: 2,
            borderColor: 'black',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomWidth: 0,
            marginTop: 10,
            flexDirection: 'row',
          }}>
          <View style={{borderRightWidth: 3, padding: 10}}>
            <Text
              style={{
                fontSize: 24,
                color: 'black',
              }}>
              1
            </Text>
          </View>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
                borderBottomWidth: 2,
                padding: 10,
              }}>
              <TouchableOpacity>
                <Icons name="checkbox-marked-outline" color="green" size={40} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  color: 'black',
                }}>
                Check if Null
              </Text>
            </View>
            <TextInput
              placeholder="Specify your report"
              placeholderTextColor={'gray'}
              multiline
              numberOfLines={5}
              style={{
                textAlignVertical: 'top',
                fontSize: 24,
                padding: 5,
                color: 'black',
              }}
              value="This is a sample report"
              editable={false}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderTopWidth: 2,
              }}>
              <Text
                style={{
                  borderRightWidth: 2,
                  flex: 1,
                  fontSize: 24,
                  color: 'black',
                  padding: 5,
                }}>
                P/N Off
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: 24,
                  color: 'black',
                  padding: 5,
                  paddingLeft: 10,
                }}>
                S/N Off
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Rectification')}
          style={{
            backgroundColor: '#3b7dfc',
            padding: 5,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            borderWidth: 2,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
            }}>
            Rectification Actions
          </Text>
          <Icons name="chevron-right" color={'white'} size={30} />
        </TouchableOpacity>

        <View
          style={{
            width: width - 60,
            borderWidth: 2,
            borderColor: 'black',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomWidth: 0,
            marginTop: 20,
            flexDirection: 'row',
          }}>
          <View style={{borderRightWidth: 3, padding: 10}}>
            <Text
              style={{
                fontSize: 24,
                color: 'black',
              }}>
              2
            </Text>
          </View>
          <View style={{flex: 1}}>
            <TextInput
              placeholder="Specify your report"
              placeholderTextColor={'gray'}
              multiline
              numberOfLines={5}
              style={{
                textAlignVertical: 'top',
                fontSize: 24,
                padding: 5,
                color: 'black',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderTopWidth: 2,
              }}>
              <Text
                style={{
                  borderRightWidth: 2,
                  flex: 1,
                  fontSize: 24,
                  color: 'black',
                  padding: 5,
                }}>
                P/N Off
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: 24,
                  color: 'black',
                  padding: 5,
                  paddingLeft: 10,
                }}>
                S/N Off
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Rectification')}
          style={{
            backgroundColor: '#3b7dfc',
            padding: 5,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            borderWidth: 2,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
            }}>
            Rectification Actions
          </Text>
          <Icons name="chevron-right" color={'white'} size={30} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#FFF',
    padding: 30,
  },
});

//make this component available to the app
export default Log2;
