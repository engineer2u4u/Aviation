import React, { useEffect, useState } from "react";
import {View,Dimensions, Text,TouchableOpacity, ScrollView} from 'react-native';
import { useSafeAreaFrame } from "react-native-safe-area-context";
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimeInput from "../subcomponents/Forms/universal/datetimeinput";
import LabelledInput from "../subcomponents/Forms/universal/labelledinput";
import functions from '@react-native-firebase/functions';
if(true) functions().useEmulator('192.168.29.75',5001)

const EditFlight=(props)=>{
  const UID=props.route.params.UID;
  const [refno,setrefno]=useState(null);
  const [reg,setreg]=useState(null);
  const [depdate,setdepdate]=useState(null);
  const [arrdate,setarrdate]=useState(null);
  const [deptime,setdeptime]=useState(null);
  const [arrtime,setarrtime]=useState(null);
  const [crewdep,setcrewdep]=useState(0);
  const [crewarr,setcrewArr]=useState(0);
  const [paxdep,setpaxdep]=useState(null);
  const [paxarr,setpaxarr]=useState(null);

  useEffect(()=>{
    const sayHello = functions().httpsCallable('getEditPage');
    sayHello({UID}).then((data)=>{
      var res=JSON.parse(data.data.body).Table;
      console.log(res[0].FLIGHT_CREW_DEPARTURE);
      setrefno(res[0].REF_NO);
      setreg(res[0].FLIGHT_REGISTRATION);
      setdepdate(res[0].FLIGHT_DEPARTURE_DATE);
      setarrdate(res[0].FLIGHT_ARRIVAL_DATE);
      setdeptime(res[0].FLIGHT_DEPARTURE_TIME)
      setarrtime(res[0].FLIGHT_ARRIVAL_TIME);
      setcrewdep(res[0].FLIGHT_CREW_DEPARTURE);
      setcrewArr(res[0].FLIGHT_CREW_ARRIVAL);
      setpaxarr(res[0].FLIGHT_PAX_ARRIVAL);
      setpaxdep(res[0].FLIGHT_PAX_DEPARTURE);
      console.log(crewdep,crewarr,paxarr,paxdep)
    }).catch(e=>{
      console.log(e);
      setcallLoad(false);
    });
  },[])

    return(
        <View>
            <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 20,
        }}>
       
        <Text
          style={{
            fontSize: Dimensions.get('window').width / 15,
            fontWeight: 'bold',
            color: 'black',
            paddingLeft:20
          }}>
          Edit Flight
        </Text>
        <TouchableOpacity  style={{marginRight: 20}}>
          <Icons name="content-save" color="green" size={30} />
        </TouchableOpacity>
      </View>
      <ScrollView>
      <View style={{
        paddingHorizontal:20,
        paddingBottom:100
      }}>
                <LabelledInput
                key={refno+'ekjnfk'}
                label={'Reference No.'} //mark
                datatype={'text'}
                data={refno}
                disabled={false}
                index={57}
                setText={(index,text,type,section)=>{
                  setrefno(text);
                }} 
                multiline={true}
                numberOfLines={1}
              />

            <LabelledInput
                key={reg+'rfnr'}
                label={'Registration'} //mark
                data={reg}
                datatype={'text'}
                index={57}
                setText={(index,text,type,section)=>{
                  setreg(text)
                }} 
                multiline={true}
                numberOfLines={1}
              />

                <DateTimeInput 
                key={depdate+'cc'}
                      label={'Departure Date'}
                      showDatePickerPostDepart={(data)=>{
                        console.log(data);
                      }}
                      setNowPostDepart={(data)=>{
                        console.log(data);
                      }}
                      setflightdoc={(data)=>{
                        setdepdate(data);
                      }}
                      
                      size={12}
                      added={true}
                      type={'time'}
                      data={depdate}
                    />


                <DateTimeInput 
                key={arrdate}
                      label={'Arrival Date'}
                      showDatePickerPostDepart={()=>{}}
                      setNowPostDepart={()=>{}}
                      
                      setflightdoc={setarrdate}
                      size={12}
                      added={true}
                      type={'time'}
                      data={arrdate}
                    />


                    <DateTimeInput 
                    key={deptime+'deptime'}
                      label={'Departure Time'}
                      showDatePickerPostDepart={()=>{}}
                      setNowPostDepart={()=>{}}
                      setflightdoc={setdeptime}
                      size={12}
                      added={true}
                      type={'time'}
                      data={deptime}
                    />

                    <DateTimeInput 
                    key={arrtime+'arrtime'}
                      label={'Arrival Date'}
                      showDatePickerPostDepart={()=>{}}
                      setNowPostDepart={()=>{}}
                      setflightdoc={setarrtime}
                      size={12}
                      added={true}
                      type={'time'}
                      data={arrtime}
                    />

            <LabelledInput
            key={crewdep+'dkjfn'}
                label={'Crew (Departure)'} //mark
                datatype={'text'}
                data={crewdep}
                disabled={false}
                index={57}
                setText={(index,text,type,section)=>{
                  setcrewdep(text)
                }} 
                multiline={true}
                numberOfLines={1}
              />

            <LabelledInput
                key={crewarr+'kjsdnfskf'}
                label={'Crew (Arrival)'} //mark
                
                data={crewarr}
                datatype={'text'}
                index={57}
                setText={(index,text,type,section)=>{
                  setcrewArr(text)
                }} 
                multiline={true}
                numberOfLines={1}
              />

            <LabelledInput
                key={paxdep+'jenfkn'}
                label={'Pax (Departure)'} //mark
                
                data={paxdep}
                datatype={'text'}
                index={57}
                setText={(index,text,type,section)=>{
                  setpaxdep(text);
                }} 
                multiline={true}
                numberOfLines={1}
              />

            <LabelledInput
                key={paxarr+'sjen'}
                label={'Pax (Arrival)'} //mark
                
                data={paxarr}
                datatype={'text'}
                index={57}
                setText={(index,text,type,section)=>{
                  setpaxarr(text);
                }} 
                multiline={true}
                numberOfLines={1}
              />

            <LabelledInput
                label={'Type'} //mark
                data={"Ground Handling"}
                datatype={'text'}
                index={57}
                setText={(index,text,type,section)=>{
                
                }} 
                multiline={true}
                numberOfLines={1}
              />
      </View>
      </ScrollView>
        </View>
    )
}

export default EditFlight;