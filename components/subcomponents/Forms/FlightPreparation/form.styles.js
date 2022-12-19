import { StyleSheet,Dimensions } from 'react-native';
const {width,height}=Dimensions.get('window');

export default StyleSheet.create({
    label:{ color: 'black' },
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
})