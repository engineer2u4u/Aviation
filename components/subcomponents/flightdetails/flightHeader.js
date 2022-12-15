import React from "react";
import {View,Text } from 'react-native'
import Icons from 'react-native-vector-icons/MaterialIcons';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'


const FlightHeader=({flighName,departure,crew,passengers})=>{
    return(
        <View style={{flex:1,marginTop:20,paddingLeft:10,flexDirection:'row'}}>
          <View>
            <Text style={{fontSize: 30,fontWeight:'400', color: 'black'}}> {flighName}</Text>
            <View style={{flexDirection:'row',marginRight:20,marginLeft:5,marginTop:10}}>
              <CommunityIcon name="airplane-takeoff" size={20} color={"black"}/> 
              <Text style={{fontSize: 18,fontWeight:'400', color: 'black'}}>
                {departure}
              </Text>
            </View>
          </View>
          <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end',marginRight:30}}>
            <View style={{flexDirection:'row'}}>
              <View style={{flexDirection:'row',marginRight:10}}>
                <Icons name="person" size={25} color={"black"}/> 
                <Text style={{fontSize: 22,fontWeight:'400', color: 'black'}}>
                  {crew}
                </Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Icons name="people-alt" size={25} color={"black"}/> 
                <Text  style={{fontSize: 22,fontWeight:'400', color: 'black'}}>
                  {passengers}
                </Text>
              </View>
            </View>
          </View>
        </View>
    )
}
export default FlightHeader;