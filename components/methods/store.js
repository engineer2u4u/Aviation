import AsyncStorage from '@react-native-async-storage/async-storage';
const storeData = async (key,value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue) //'@storage_Key'
      return true;
    } catch (e) {
      // saving error
      console.log(e);
      return false;
    }
  }
export default storeData;