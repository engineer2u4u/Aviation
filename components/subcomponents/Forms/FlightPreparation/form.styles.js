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
    imgName: {color: 'black', fontSize: 12, fontWeight: '600'},
    takecamerabtn:{
      marginLeft: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderRadius: 8,
    },
    picker: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 8,
      marginVertical: 10,
      padding: 10,
      backgroundColor: 'white',
      marginBottom: 20,
    },
})