import React, { useEffect,useState } from "react";
import {View,Text,TextInput,TouchableOpacity} from 'react-native'
import s from '../FlightPreparation/form.styles'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const DateTimeInput=({label,showLabel=true,notrequiredSection=false,disabled,showDatePickerPostDepart,ini,setNowPostDepart,size,data,index,type='time',sectionName='crew',added=false})=>{

    const [date,setdate]=useState(data);
    const [notreq,setnotreq]=useState(disabled);
    const [color,setcolor]=useState('white')
    const [touchableactive,setdisabletouchable]=useState(true);

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

    useEffect(()=>{
      if(notrequiredSection){
        if(notreq){
           setcolor('rgba(0,0,0,0.3)')
           setdisabletouchable(true);
           setdate(null)
        }
        else{
           setcolor('white');
           setdisabletouchable(false);
          }
      }else{
        if(disabled){
           setcolor('rgba(0,0,0,0.3)')
           setdisabletouchable(true);
           setdate(null)
        }
        else{
           setcolor('white');
           setdisabletouchable(false);
        }
      }
    },[disabled,notreq])
    return(
        <>
      
        {showLabel && <Text style={s.label}>{label || 'Time Verified (Local Time)'}</Text>}
        {
          notrequiredSection && 

          <TouchableOpacity onPress={event =>{
            // var x = paxhotelactivesections;
            // setpaxhotelactivesections(!x);
            // console.log(x);
            //setpaxboardedtimeactive
            setnotreq(!notreq)
            //come here
            //setpaxarrivaltimeaddedactive(x);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent:'flex-start',
              marginBottom: 5,
              marginTop:10
            }} >
              
            <Icons
              name={
               // paxhotelactivesections
              notreq
               //val.arrivaActive
                
                  ? 'checkbox-marked-outline'
                  : 'checkbox-blank-outline'
              }
              color={notreq ? 'green' : 'black'}
              size={35}
            />
            <Text style={[{fontSize:15,paddingLeft:10,color:"black"}]}>Not Required</Text>
          </TouchableOpacity>
        }

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              disabled={touchableactive}
              style={[s.picker,{backgroundColor:color}]}
              onPress={() => showDatePickerPostDepart(type, index)}>
              <Text style={{fontSize: 20, color: 'black'}}>
                {date!=null ? date : 'dd/mm/yy, -- : --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={touchableactive}
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