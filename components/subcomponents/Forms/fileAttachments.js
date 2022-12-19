import React from "react";
import {View,Text,TouchableOpacity,Platform, StyleSheet} from 'react-native'

const FileAttachMents=(removeFile,index,type,filename,Icon)=>{
    const removeFileBind=()=>removeFile(type,index);
    return(
        <View
                  style={styles.constainer}>
                  <Text style={styles.label}>{JSON.stringify(filename)} {index}asd</Text>
                  <TouchableOpacity //onPress={() => removeFileFP(0, index)}
                  onPress={removeFileBind}
                  >
                    {Icon}
                  </TouchableOpacity>
                </View>
    )
}

export default FileAttachMents;

const styles=StyleSheet.create({
    constainer:{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 5,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.8,
            shadowRadius: 2,
          },
          android: {
            elevation: 3,
          },
        }),
      },
      label:{color: 'black'}
})