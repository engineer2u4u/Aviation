import React, { useEffect, useState } from "react";
import {View,Text,TextInput,TouchableOpacity} from 'react-native'
import s from '../FlightPreparation/form.styles'

const LabelledInput=({label,disabled=false,multiline,numberOfLines,data,ini,index,setText,sectionName='crew',added=false,datatype='text'})=>{
    const [val,setval]=useState('');

    const sendText=()=>{
      if(added) setText(index,val,datatype,sectionName)
    }

    const setTextbind=(event)=>{
      if(added){
        setval(event);
      }else setText(index,event)
    }

    useEffect(()=>{
      setval(data);
    },[ini])

    return(
        <>
        <Text style={s.label}>{label}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={[s.input,{backgroundColor: disabled ? 'rgba(0,0,0,0.1)' : 'white'}]}
              editable={!disabled}
              value={disabled? '' : val}
              multiline={multiline}
              numberOfLines={numberOfLines}
              onChangeText={setTextbind}
              onBlur={sendText}
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