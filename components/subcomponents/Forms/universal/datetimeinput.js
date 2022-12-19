import React from "react";
import {View,Text,TextInput,TouchableOpacity} from 'react-native'
import s from '../FlightPreparation/form.styles'

const DateTimeInput=({showDatePickerPostDepart,setNowPostDepart,size,data,index})=>{
    return(
        <>
        <Text style={s.label}>Time Verified (Local Time)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={s.picker}
              onPress={() => showDatePickerPostDepart('time', index)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {data ? data : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowPostDepart(index)}
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