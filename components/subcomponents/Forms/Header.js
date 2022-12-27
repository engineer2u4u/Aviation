import React from "react";
import {View,Text,TouchableOpacity,StyleSheet} from 'react-native'

export default function Header({headingSize,heading,Icon,sendForm}){
    return(
        <View style={styles.container}>
        <Text style={[{ fontSize: headingSize },styles.headingText]}> {heading} </Text>
        <TouchableOpacity onPress={sendForm} style={{marginRight: 20}}>
            {Icon}
        </TouchableOpacity>
      </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
      },
      headingText:{
        fontWeight: 'bold',
        color: 'black',
        paddingLeft:10
    }
})