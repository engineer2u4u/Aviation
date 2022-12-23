import React, { useEffect,useState } from "react";
import {View,Text,TextInput,TouchableOpacity} from 'react-native'
import s from '../FlightPreparation/form.styles'

const DateTimeInput=({label,showDatePickerPostDepart,ini,setNowPostDepart,size,data,index,type='time',sectionName='crew',added=false})=>{

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
        <Text style={s.label}>{label || 'Time Verified (Local Time)'} {JSON.stringify(data)}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={s.picker}
              onPress={() => showDatePickerPostDepart(type, index)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {date!=null ? date : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
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