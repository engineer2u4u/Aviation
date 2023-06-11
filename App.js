import React, { useContext, useEffect, useState } from 'react';
import Home from './components/Home';
import LogDetails from './components/LogDetails';
import Risk from './components/Risk';
import Log2 from './components/Log2';
import Rectification from './components/Rectification';
import Log1 from './components/Log1';
import GroundHandling from './components/GroundHandling';
import AircraftDetails from './components/AircraftDetails';
import Scanner from './components/Scanner';
import FlightDetailsRoute from './components/FlightDetailsRoute';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import auth from '@react-native-firebase/auth';

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { UserContext } from './components/context/userContext';
import { UserDetails } from './components/context/userDetailsContext';
import SplashScreen from 'react-native-splash-screen';
import EditFlight from './components/FlightDetails/EditFlight';

const Stack = createNativeStackNavigator();

//import functions from '@react-native-firebase/functions';

// functions()
//       .httpsCallable('listProducts')()
//       .then(response => {
//         return response.json();
//       }).then(data=>{
//         console.log(data);
//       }).catch(e=>{
//         console.log(e);
//       });

const authenticator = async (email, pass, call) => {
  var res = {};
  try {
    var req = await auth().createUserWithEmailAndPassword(email, pass);
    res.account_created = true;
    res.err = false;
  } catch (error) {
    console.log('HH', error);
    res.err = true;
    res.code = error;
  }
  console.log(res);
  return res;
  // auth()
  // .createUserWithEmailAndPassword(email, pass)
  // .then(() => {
  //   var res={

  //   }
  //   console.log('User account created & signed in!');
  // })
  // .catch(error => {
  //   if (error.code === 'auth/email-already-in-use') {
  //     console.log('That email address is already in use!');
  //   }

  //   if (error.code === 'auth/invalid-email') {
  //     console.log('That email address is invalid!');
  //   }

  //   console.error(error);
  // });
};

const Login = props => {
  // Set an initializing state whilst Firebase connects
  const [loading, setloading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const [email, setemail] = useState('');
  const [pword, setpword] = useState('');
  const [emailinvalid, setemailinvalid] = useState(false);

  const [err, seterr] = useState(false);
  const [errmsg, seterrmsg] = useState(
    'Password and Confirm Password do not match',
  );

  const validateEmail = () => {
    //return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const inValidator = (err, msg) => {
    seterr(true), seterrmsg(msg);
  };

  const loginStart = () => {
    if (emailinvalid) return console.log('NO VALID');
    else if (email.length === 0) return inValidator(true, 'Email required');
    else if (pword.length === 0)
      return inValidator(true, 'Password Field Cannot be left Empty');
    else if (pword.length < 6)
      return inValidator(true, 'Password Should at least be 6 characters');
    else {
      setloading(true);
      auth()
        .signInWithEmailAndPassword(email, pword)
        .then(() => {
          console.log('User account created & signed in!');
          setloading(false);
        })
        .catch(error => {
          if (error.code === 'auth/user-not-found')
            inValidator(true, 'Incorrect Credentials');
          setloading(false);
        });
    }
  };

  const logOut = () => {
    return auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const createNewAccount = () => {
    props.navigation.navigate('SignUp');
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
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
          Sign In
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
              placeholder="example@example.com"
              placeholderTextColor="#808080"
              onChangeText={text => setemail(text)}
              onFocus={() => {
                setemailinvalid(false);
              }}
              onBlur={() => {
                if (email.length === 0) setemailinvalid(true);
                else if (!validateEmail()) {
                  console.log('EMAIL INVALID');
                  setemailinvalid(true);
                } else {
                  //setemailinvalid(false);
                }
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
              <TouchableOpacity
                onPress={loginStart}
                style={{
                  width: '100%',
                  height: 50,
                  marginTop: 80,
                  backgroundColor: 'green',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 22 }}>Login</Text>
              </TouchableOpacity>
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignContent: 'center',
                marginTop: 40,
              }}>
              <Text style={{ color: 'black', fontSize: 18, paddingTop: 10 }}>
                Im a new user,{' '}
              </Text>
              <TouchableOpacity
                onPress={createNewAccount}
                style={{
                  marginTop: 5,
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 18, paddingTop: 5, color: 'navy' }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* <TouchableOpacity onPress={loginStart} style={{
      width:'50%',
      height:50,
      backgroundColor:"green",
      justifyContent:'center',
      alignContent:'center'
     }}>
      <Text>Login</Text>
     </TouchableOpacity> */}
        {/* <Text style={{color:"black"}}>Login</Text> */}
      </View>
    );
  }

  return (
    <View>
      <Text style={{ color: 'black' }}>Welcome {user.email}</Text>
      <TouchableOpacity
        onPress={logOut}
        style={{
          width: '50%',
          height: 50,
          backgroundColor: 'green',
          justifyContent: 'center',
          alignContent: 'center',
          marginTop: 30,
        }}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const SignUp = props => {
  const { user, setUser } = useContext(UserDetails);
  const { loggedIn, setloggedIn } = useContext(UserContext);

  const [loading, setloading] = useState(false);
  const [email, setemail] = useState('');
  const [pword, setpword] = useState('');
  const [cpword, setcpword] = useState('');

  const [emailinvalid, setemailinvalid] = useState(false);

  const [err, seterr] = useState(false);
  const [errmsg, seterrmsg] = useState(
    'Password and Confirm Password do not match',
  );

  const validateEmail = () => {
    //return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const inValidator = (err, msg) => {
    seterr(true), seterrmsg(msg);
  };

  const createacc = () => {
    if (email.length === 0) return inValidator(true, 'Email Field required.');
    else if (pword !== cpword)
      return inValidator(true, 'Password and Confirm Password do not match');
    else if (emailinvalid) return console.log('NO VALID');
    else if (pword.length === 0)
      return inValidator(true, 'Password Field Cannot be left Empty');
    else if (pword.length < 6)
      return inValidator(true, 'Password Should at least be 6 characters');
    else {
      setloading(true);
      seterr(false);
      authenticator(email, pword)
        .then(data => {
          setloading(false);
          if (data.account_created) {
            console.log('Gk');
            setUser(email);
            setloggedIn(true);
          } else if (data.err) {
            //if(data.code.code) inValidator(true,'Password Should be atleast 6 character');
            if (data.code.code === 'auth/email-already-in-use')
              inValidator(true, 'Email already in use, try another.');
          }
        })
        .catch(e => {
          setloading(false);
          if (e.code === 'auth/weak-password')
            inValidator(true, 'Password Should be atleast 6 character');
        });
    }

    //console.log(email,pword,cpword)
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
        Create Account
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
          <Text style={{ color: '#000', fontSize: 18 }}>Email</Text>
          {emailinvalid && (
            <Text style={{ color: 'red', fontSize: 12, marginTop: 10 }}>
              {email.length === 0 ? 'Email Required' : 'Invalid Email Address'}
            </Text>
          )}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#808080"
            onChangeText={text => setemail(text)}
            onFocus={() => {
              setemailinvalid(false);
            }}
            onBlur={() => {
              if (email.length === 0) setemailinvalid(true);
              else if (!validateEmail()) {
                console.log('EMAIL INVALID');
                setemailinvalid(true);
              } else {
                //setemailinvalid(false);
              }
            }}
            style={{
              width: '100%',
              height: 50,
              backgroundColor: '#fff',
              paddingLeft: 10,
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

          <Text style={{ color: '#000', fontSize: 18, marginTop: 20 }}>
            Confirm Password
          </Text>
          <TextInput
            textContentType="password"
            secureTextEntry={true}
            onFocus={() => seterr(false)}
            onChangeText={text => setcpword(text)}
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
            <TouchableOpacity
              onPress={createacc}
              style={{
                width: '100%',
                height: 50,
                marginTop: 80,
                backgroundColor: 'green',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 22 }}>Create Account</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const App = () => {
  const [loggedIn, setloggedIn] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (user) setloggedIn(true);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    SplashScreen.hide();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <UserContext.Provider value={{ loggedIn, setloggedIn }}>
      <UserDetails.Provider value={{ user, setUser }}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={loggedIn ? 'Home' : 'Login'}
            screenOptions={{ headerShown: false }}>
            {loggedIn ? (
              <Stack.Screen name="Home" component={Home} />
            ) : (
              <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="SignUp">
                  {props => <SignUp {...props} setloggedIn={setloggedIn} />}
                </Stack.Screen>
              </>
            )}

            {/* <Stack.Screen name="FlightDetails" component={FlightDetails} /> */}
            <Stack.Screen name="GroundHandling" component={GroundHandling} />
            <Stack.Screen name="LogDetails" component={LogDetails} />
            <Stack.Screen name="Risk" component={Risk} />
            <Stack.Screen name="Log2" component={Log2} />
            <Stack.Screen name="Log1" component={Log1} />
            <Stack.Screen name="Rectification" component={Rectification} />
            <Stack.Screen
              name="FlightDetailsRoute"
              component={FlightDetailsRoute}
            />
            <Stack.Screen name="Scanner" component={Scanner} />
            <Stack.Screen name="EditPageFlight" component={EditFlight} />
            <Stack.Screen name="AircraftDetails" component={AircraftDetails} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserDetails.Provider>
    </UserContext.Provider>
  );
};

export default App;
