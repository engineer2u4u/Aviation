import React from "react";
import {View,Text,TouchableOpacity,StyleSheet} from 'react-native'

export default function Header({headingSize,heading}){
    return(
        <View style={styles.container}>
        <Text style={[{ fontSize: headingSize },styles.headingText]}> {heading} </Text>
        <TouchableOpacity style={{marginRight: 20}}>
            <Icons name="content-save" color="green" size={30} />
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
        paddingLeft:20
    }
})