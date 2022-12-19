import React from "react";
import {View,Text} from 'react-native'
import s from '../FlightPreparation/form.styles'

const ServiceVerifiedSection = ({showDatePickerPostDepart,setNowPostDepart,timeTextSize,data}) => {
    return(
        <>
        <Text style={[s.label, {marginTop: 10}]}>
          Services Verified:
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Text style={s.label}>Time Verified (Local Time)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={s.picker}
              onPress={() => showDatePickerPostDepart('time', 1)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {data ? data : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNowPostDepart(1)}
              style={{padding: 10}}>
              <Text
                style={{
                  fontSize: timeTextSize,
                  color: 'green',
                }}>
                Time Now
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styleSheet.label}>Name of Verifier</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={styleSheet.input}
              value={postdeparture[2]}
              onChangeText={text => {
                // var tpostdeparture = [...postdeparture];
                // tpostdeparture[2] = text;
                // setpostdeparture(tpostdeparture);
              }}
            />
          </View>
        </View>
        </>
    )
}

export default ServiceVerifiedSection;