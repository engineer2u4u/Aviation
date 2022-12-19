import React from "react";
import {View,Text,StyleSheet,TextInput} from 'react-native'

const BroadTextInput=({type,label,labelSize,text,textSeeker})=>{
    return(
        <View>
            <Text style={[styles.label,{fontSize:labelSize}]}>{label}</Text>
            <TextInput
            style={styles.input}
            multiline={true}
            numberOfLines={4}
            value={text}
            onChangeText={text => {
                textSeeker(type,text)
            }}
            />
        </View>
    )
}

export default BroadTextInput;

const styles=StyleSheet.create({
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