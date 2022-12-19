import React from "react";
import {View,Text,TextInput,TouchableOpacity} from 'react-native'
import s from '../FlightPreparation/form.styles'

const LabelledInput=({label,multiline,numberOfLines,data,index,setText})=>{
    const setTextbind=(event)=>setText(index,event)
    return(
        <>
        <Text style={s.label}>{label}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={s.input}
              value={data}
              multiline={multiline}
              numberOfLines={numberOfLines}
              onChangeText={setTextbind}
                // var tpostdeparture = [...postdeparture];
                // tpostdeparture[2] = text;
                // setpostdeparture(tpostdeparture);
              //}}
            />
          </View>
        </>
    )
}

export default LabelledInput