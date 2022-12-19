import React from "react";
import {View,Text,TouchableOpacity,Platform, StyleSheet} from 'react-native'

const FileAttachMents=({removeFile,index,type,filename,Icon})=>{

    const removeFileBind=()=>removeFile(type,index);
    return(
      <View
      key={index}
      style={styles.constainer}>
      <Text style={{color: 'black'}}>{filename}</Text>
      <TouchableOpacity onPress={() => removeFileBind(type, index)}>
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