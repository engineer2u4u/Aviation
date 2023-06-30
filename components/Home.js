/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component, useState, useEffect, useContext, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  PermissionsAndroid,
  StatusBar,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {UserContext} from './context/userContext';
import {UserDetails} from './context/userDetailsContext';
const {width, height} = Dimensions.get('window');
import NotifService from '../components/methods/notifService';
import getData from './methods/read';
import storeData from './methods/store';
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
// const MrzScanner = NativeModules.RNMrzscannerlib;
// // import MrzScanner from 'react-native-mrzscannerlib';
// MrzScanner.registerWithLicenseKey(
//   '43DC619CB9444C24D6BEDA0C0F9DF5E5932D7421B0244D435A14D76F41461655C2ACC8134E3D1A8DFE6EA62107A31AA9',
// );
// const EventEmitter = new NativeEventEmitter(MrzScanner);

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const DEV = true;

export default function Home({navigation}) {
  const nf = useRef(null);

  const [prompt, setprompt] = useState(false);
  const [details, setdetails] = useState(null);
  const {loggedIn, setloggedIn} = useContext(UserContext);
  const {user, setUser} = useContext(UserDetails);

  const onRegister = token => {
    console.log('OKOK');
    console.log('tok', token);
    //setonReg({registerToken: token.token, fcmRegistered: true});
  };

  const onNotif = notif => {
    console.log('RECIEVED NOTI', notif);
    return notif;
  };

  const logOut = async () => {
    try {
      var data = await getData('@token');
      if (data.login === false) {
        data.login = false;
        storeData('@token', data);
      }
      console.log(data);

      const sayHello = functions().httpsCallable('addUserToken');
      sayHello({deviceRegisteration: data, user: uid})
        .then(data => {
          console.log(data.data);
        })
        .catch(e => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }

    return auth()
      .signOut()
      .then(() => {
        setloggedIn(false);
      });
  };

  const requestNotificationAndFunctions = async uid => {
    try {
      var data = await getData('@token');
      if (data.login === false) {
        data.login = true;
        storeData('@token', data);
      }
      console.log(data);

      const sayHello = functions().httpsCallable('addUserToken');
      sayHello({deviceRegisteration: data, user: uid})
        .then(data => {
          console.log(data.data);
        })
        .catch(e => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const uid = auth().currentUser.uid;
    nf.current = new NotifService(onRegister, onNotif);
    console.log(nf.current);
    //console.log('asdsd',nf.current);
    requestNotificationAndFunctions(uid);
    requestCameraPermission();
    // var subscription;
    // subscription = EventEmitter.addListener(
    //   'successfulScanEmittedEvent',
    //   (body) => {
    //     setdetails({
    //       surname: body.surname,
    //       'given name': body.given_names_readable,
    //       'document number': body.document_number,
    //       'issuing country': body.issuing_country,
    //       nationality: body.nationality,
    //       'date of birth': body.dob_readable,
    //       sex: body.sex,
    //       'estimated issuing date': body.est_issuing_date_readable,
    //       'expiration date': body.expiration_date_readable,
    //       'passport image': body.passportImage,
    //       'passport sign': body.signature,
    //       'passport portrait': body.portrait,
    //     });
    //     console.log('Results', body);
    //   },
    // );
    // subscription = EventEmitter.addListener(
    //   'successfulDocumentScanEmittedEvent',
    //   (body) => {
    //     console.log('doc success');
    //   },
    // );
    // subscription = EventEmitter.addListener(
    //   'scannerWasDismissedEmittedEvent',
    //   (body) => {
    //     console.log('onBackPressed' + body + 'back pressed');
    //   },
    // );
    // return () => subscription.remove();
  }, []);

  const onChange = (key, value) => {
    var detailsData = {...details};
    console.log(detailsData);

    detailsData[key] = value;
    console.log(detailsData);
    setdetails({...detailsData});
  };
  return (
    <ScrollView
      contentContainerStyle={{minHeight: Dimensions.get('window').height}}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text
              style={{
                textAlign: 'left',
                fontSize: width / 15,
                fontWeight: 'bold',
                color: 'black',
              }}>
              Aviation
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignContent: 'flex-end',
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() => setprompt(true)}
              style={{
                width: 55,
                height: 55,
                borderRadius: parseInt(55 / 2),
                backgroundColor: '#d3d3d3',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'black', fontSize: 28}}>
                {typeof user === 'object' &&
                  user.email != undefined &&
                  user.email.charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{backgroundColor: 'black', height: 5, flex: 1}}></View>
          <Image
            source={require('../assets/airplane.png')}
            style={{height: 40, width: 40}}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginTop: 20,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Scanner')}
            style={[styles.card, {marginRight: 10}]}>
            <Icons color="white" name="qr-code-scanner" size={50} />
            <Text style={{color: 'white'}}>Scan passport</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('GroundHandling')}
            style={styles.card}>
            <Icons color="white" name="flight-land" size={50} />
            <Text style={{color: 'white'}}>Ground Handling</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginTop: 20,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('LogDetails')}
            style={[styles.card, {marginRight: 10}]}>
            <Icons color="white" name="sticky-note-2" size={50} />
            <Text style={{color: 'white'}}>Flight Log</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('LogDetails')}
            style={[styles.card]}>
            <Icons color="white" name="date-range" size={50} />
            <Text style={{color: 'white'}}>Calender</Text>
          </TouchableOpacity>
          
        </View>
      </View>

      {prompt && (
        <View
          style={{
            position: 'absolute',
            width: width,
            height: height + 100,
            backgroundColor: '#40404034',
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              width: width - 40,
              height: 200,
              backgroundColor: '#FFF',
              padding: 10,
            }}>
            <Text style={{color: '#000', fontSize: 25, fontWeight: '600'}}>
              Logout
            </Text>
            <Text
              style={{
                color: '#808080',
                fontSize: 16,
                fontWeight: '500',
                marginTop: 20,
              }}>
              Are you sure you want to logout ?
            </Text>
            <View
              style={{
                marginTop: 'auto',
                marginBottom: 10,
                marginRight: 20,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => {
                  logOut();
                  setprompt(false);
                }}
                style={{marginRight: 60}}>
                <Text
                  style={{
                    color: 'cornflowerblue',
                    fontSize: 20,
                    fontWeight: '600',
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setprompt(false);
                }}
                style={{}}>
                <Text
                  style={{
                    color: 'cornflowerblue',
                    fontSize: 20,
                    fontWeight: '600',
                  }}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: '#FFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  card: {
    backgroundColor: '#3b7dfc',
    borderRadius: 10,
    flex: 1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
    elevation: 10,
    shadowOffset: {width: 0, height: 3},
  },
});
