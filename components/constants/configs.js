import firebase from '@react-native-firebase/app';
import functions from '@react-native-firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyBWeXoZQJL4e2I9EK5IMu8hMw1S139RWaQ',
  authDomain: 'aviation-4f1a7.firebaseapp.com',
  databaseURL: 'https://aviation-4f1a7.firebaseio.com',
  projectId: 'aviation-4f1a7',
  storageBucket: 'aviation-4f1a7.appspot.com',
  messagingSenderId: '187606766416',
  appId: '1:187606766416:android:b7c5c9d1a97e8f05529255',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const fc = firebase.functions();




export { firebase, fc };