import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const firebaseConfig = {
	apiKey: "AIzaSyBf_LZnVXKel6tQlaBtiT_05a10R0Whwko",
	authDomain: "aviation-4f1a7.appspot.com",
	projectId: "aviation-4f1a7",
	storageBucket: "aviation-4f1a7.appspot.com",
	messagingSenderId: "1087314122312",
	appId: "1:187606766416:android:b7c5c9d1a97e8f05529255",
	measurementId: "G-QHQ4PL8NV0"
  };

firebase.initializeApp(firebaseConfig);

firebase.firestore();

export default firebase;
