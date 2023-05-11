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
const Rectification = ({navigation}) => {
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
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
            Rectification Actions
          </Text>
        </View>

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
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
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
                Check if Maintenance Entry
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 2,
              }}>
              <View
                style={{
                  flex: 1,
                  padding: 10,
                  borderRightWidth: 1,
                }}>
                <Text style={{color: 'black', fontSize: 20}}>MEL Ref :</Text>
                <TextInput
                  style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                />
              </View>
              <View style={{flex: 1, padding: 10}}>
                <Text style={{color: 'black', fontSize: 20}}>MEL Cat. :</Text>
                <TextInput
                  style={{
                    fontSize: 20,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    color: 'black',
                  }}
                />
              </View>
            </View>
            <TextInput
              placeholder="Specify your action performed"
              placeholderTextColor={'gray'}
              multiline
              numberOfLines={5}
              style={{
                textAlignVertical: 'top',
                fontSize: 24,
                padding: 5,
                borderBottomWidth: 2,
                color: 'black',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 2,
                borderBottomWidth: 2,
              }}>
              <View
                style={{
                  flex: 1,
                  padding: 10,
                  borderRightWidth: 1,
                }}>
                <Text style={{color: 'black', fontSize: 20}}>Licencse# :</Text>
                <TextInput
                  style={{
                    fontSize: 20,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    color: 'black',
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 2,
              }}>
              <View
                style={{
                  flex: 1,
                  padding: 10,
                  borderRightWidth: 1,
                }}>
                <Text style={{color: 'black', fontSize: 20}}>Name :</Text>
                <TextInput
                  style={{
                    fontSize: 20,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    color: 'black',
                  }}
                />
              </View>
              <View style={{flex: 1, padding: 10}}>
                <Text style={{color: 'black', fontSize: 20}}>Date :</Text>
                <TextInput
                  style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  padding: 10,
                  borderRightWidth: 1,
                }}>
                <Text style={{color: 'black', fontSize: 20}}>Signature :</Text>
                <View style={{height: 100}}></View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderTopWidth: 2,
                borderBottomWidth: 2,
              }}>
              <Text
                style={{
                  borderRightWidth: 2,
                  flex: 1,
                  fontSize: 24,
                  color: 'black',
                  padding: 5,
                }}>
                P/N On
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: 24,
                  color: 'black',
                  padding: 5,
                  paddingLeft: 10,
                }}>
                S/N On
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-start',
    backgroundColor: '#FFF',
    padding: 30,
  },
});

//make this component available to the app
export default Rectification;
