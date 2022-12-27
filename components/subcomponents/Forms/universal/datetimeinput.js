import React, { useEffect,useState } from "react";
import {View,Text,TextInput,TouchableOpacity} from 'react-native'
import s from '../FlightPreparation/form.styles'

const DateTimeInput=({label,disabled,showDatePickerPostDepart,ini,setNowPostDepart,size,data,index,type='time',sectionName='crew',added=false})=>{

    const [date,setdate]=useState(data);

    const setTime=()=>{
      var x=new Date().toLocaleString('en-US', {
        hour12: false,
      });
      console.log("JOLLYYYY")
      setdate(x)
      setNowPostDepart(index,x,'time',sectionName);
    }

    useEffect(()=>{
      setdate(data);
    },[ini])

    return(
        <>
        <Text style={s.label}>{label || 'Time Verified (Local Time)'}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              disabled={disabled}
              style={[s.picker,{backgroundColor: disabled ? 'rgba(0,0,0,0.1)' : 'white'}]}
              onPress={() => showDatePickerPostDepart(type, index)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {date!=null ? date : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={disabled}
              onPress={() => {
              setTime()//  :  setNowPostDepart(index)
              }}
              style={{padding: 10}}>
              <Text
                style={{
                  fontSize: size,
                  color: 'green',
                }}>
                Time Now
              </Text>
            </TouchableOpacity>
          </View>
          </>
    )
}

export default DateTimeInput;