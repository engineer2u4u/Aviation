//import liraries
import React, { Component, useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { setDomain, setUser } from './constants/env';
import getData from './methods/read';
import storeData from './methods/store';
import functions from '@react-native-firebase/functions';
import { UserContext } from './context/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// create a component
const UserLogin = ({ navigation }) => {
  const [loading, setloading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const domain = useRef(null);
  const { loggedIn, setloggedIn } = useContext(UserContext);
  const [email, setemail] = useState('');
  const [pword, setpword] = useState('');
  const [emailinvalid, setemailinvalid] = useState(false);

  const [err, seterr] = useState(false);
  const [errmsg, seterrmsg] = useState(
    'Password and Confirm Password do not match',
  );


  useEffect(() => {
    setloading(true);
    const user = auth().currentUser;
    if (user.uid) {
      // console.log(user.uid);
      firestore().collection('users_access').doc(user.uid).get().then(document => {
        console.log(document.data().url);
        setloading(false);

        setDomain(document.data().url);
        domain.current = document.data().url;
        checkLogin();
      }).catch();

    }
    else {
      setloading(false);
      auth().signOut();

    }
  }, [])
  const logOut = async () => {

    return auth()
      .signOut()
      .then(() => {
        setloggedIn(false);
      });
  };

  const loginStart = () => {
    // setloading(true);
    // const url = `${domain.current}/GetUserLogin?username=${encodeURIComponent(email)}&pw=${encodeURIComponent(pword)}&_token=b95909e1-d33f-469f-90c6-5a2fb1e5627c&_opco=`;
    // console.log(url);
    // fetch(url)
    //   .then(res => res.json())
    //   .then(data => {
    //     if (data.length > 0 && data[0].ACCESS_RIGHT !== null && data[0].CID !== null) {
    //       setloading(false);
    AsyncStorage.setItem('username', email);
    AsyncStorage.setItem('password', pword);
    navigation.navigate('Home')
    //   }
    //   else {
    //     Alert.alert('Wrong credentials!')
    //     setloading(false);
    //   }
    // })
    // .catch(e => {
    //   console.log('error:', e)
    //   Alert.alert('Access Denied!');
    //   // navigation.navigate('Home');
    //   setloading(false);
    // })
  }
  const checkLogin = async () => {
    var username = await AsyncStorage.getItem('username');
    var password = await AsyncStorage.getItem('password');
    console.log(username + password);
    if (username && password) {
      // setloading(true);
      // const url = `${domain.current}/GetUserLogin?username=${encodeURIComponent(username)}&pw=${encodeURIComponent(password)}&_token=b95909e1-d33f-469f-90c6-5a2fb1e5627c&_opco=`;
      // console.log(url);
      // fetch(url)
      //   .then(res => res.json())
      //   .then(data => {
      //     console.log(data);
      //     if (data.length > 0 && data[0].ACCESS_RIGHT !== null && data[0].CID !== null) {
      //       setloading(false);

      AsyncStorage.setItem('username', username);
      AsyncStorage.setItem('password', password);
      // setUser(data[0]);
      navigation.replace('Home');
      //   }
      //   else {

      //     AsyncStorage.removeItem('username');
      //     AsyncStorage.removeItem('password');
      //   }
      // })
      // .catch(e => {
      //   console.log(e, 'Function error');
      //   setloading(false);
      //   AsyncStorage.removeItem('username');
      //   AsyncStorage.removeItem('password');
      // })
    }
    else {

    }
  };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingTop: 30,
        paddingHorizontal: 20,
      }}>
      <Text
        style={{
          color: '#000',
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 32,
        }}>
        User Log In
      </Text>
      <View style={{ flex: 5, marginTop: 20 }}>
        {err && (
          <View
            style={{
              width: '100%',
              height: 50,
              paddingHorizontal: 10,
              justifyContent: 'center',
              backgroundColor: '#d3d3d360',
            }}>
            <Text style={{ color: 'red', fontSize: 14 }}>&bull; {errmsg}</Text>
          </View>
        )}
        <View style={{ flex: 1, marginTop: 20 }}>
          <Text style={{ color: '#000', fontSize: 18 }}>Email Address</Text>
          {emailinvalid && (
            <Text style={{ color: 'red', fontSize: 12, marginTop: 10 }}>
              {email.length === 0
                ? 'Email Required'
                : 'Invalid Email Address'}
            </Text>
          )}
          <TextInput
            placeholder="username"
            placeholderTextColor="#808080"
            onChangeText={text => setemail(text)}
            onFocus={() => {
              setemailinvalid(false);
            }}
            onBlur={() => {
              if (email.length === 0) setemailinvalid(true);

            }}
            style={{
              width: '100%',
              height: 50,
              paddingLeft: 10,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#d3d3d3',
              marginTop: 10,
              color: '#000',
            }}
          />

          <Text style={{ color: '#000', fontSize: 18, marginTop: 20 }}>
            Password
          </Text>
          <TextInput
            textContentType="password"
            secureTextEntry={true}
            onFocus={() => seterr(false)}
            onChangeText={text => setpword(text)}
            style={{
              width: '100%',
              height: 50,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#d3d3d3',
              marginTop: 10,
              color: '#000',
            }}
          />

          {loading ? (
            <TouchableOpacity
              style={{
                width: '100%',
                height: 50,
                marginTop: 80,
                backgroundColor: 'green',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator />
            </TouchableOpacity>
          ) : (
            <><TouchableOpacity
              onPress={loginStart}
              style={{
                width: '100%',
                height: 50,
                marginTop: 80,
                backgroundColor: 'green',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 22, color: 'white' }}>Login</Text>
            </TouchableOpacity>
              <TouchableOpacity
                onPress={logOut}
                style={{
                  marginTop: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 18, color: 'black', textDecorationLine: "underline" }}>Log Out</Text>
              </TouchableOpacity></>
          )}
        </View>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default UserLogin;
