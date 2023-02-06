import PushNotification from "react-native-push-notification";
import getData from "./read";
import storeData from "./store";

class NotificationHandler {
  onNotification(notification) {
    console.log('NotificationHandler Recieved:', notification);
    if (notification.foreground) {
      console.log("foreground");
      PushNotification.localNotification(notification);
    } 
    if (typeof this._onNotification === 'function') {
      this._onNotification(notification);
    }
  }

  async onRegister(token) {
    var _token=token.token;
    getData('@token').then(data=>{
      console.log("RETURED",data);
      if(data===null){
        storeData('@token',{token:_token,login:false});
      }
    }).catch(e=>{
      console.log(e)
    })
      //storeData('@token',{token,login:false});
    //storeFCMDevice(token);
    if (typeof this._onRegister === 'function') {
      this._onRegister(token);
    }
  }

  onAction(notification) {
    if(notification.action === 'Yes') {
      PushNotification.invokeApp(notification);
    }
  }

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError(err) {
    console.log(err);
  }

  attachRegister(handler) {
    this._onRegister = handler;
  }

  attachNotification(handler) {
    this._onNotification = handler;
  }
  

  configureNow(){
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister:handler.onRegister.bind(handler),
    
      // (required) Called when a remote or local notification is opened or received
      onNotification: handler.onNotification.bind(handler),
      
      // (optional) Called when Action is pressed (Android)
      onAction: handler.onAction.bind(handler),
    
      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: handler.onRegistrationError.bind(handler),
      senderID:187606766416,
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
    
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
    
      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true,
    });
    
  }

}

// if(Platform.OS==='ios'){
//   messaging().hasPermission().catch(e=>{
//     console.log("Unable to get permissions")
//   }).then((enabled)=>{
//     if(enabled){
//       messaging().getToken().then(token=>{
//         console.log('IOS TOKEN',token)
//         storeFCMDevice({os:'ios',token})
//       }).catch(e=>{
//         console.log('NOT TOKEN')
//       })
//     }
//   })
  
// }


const handler = new NotificationHandler();
handler.configureNow()


export default handler;
