import React from "react";
import {View,Dimensions, Text,TouchableOpacity, ScrollView} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimeInput from "../subcomponents/Forms/universal/datetimeinput";
import LabelledInput from "../subcomponents/Forms/universal/labelledinput";


const EditFlight=()=>{
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
                label={'Reference No.'} //mark
                
                data={""}
                datatype={'text'}
                index={57}
                setText={(index,text,type,section)=>{
                
                }} 
                multiline={true}
                numberOfLines={1}
              />

            <LabelledInput
                label={'Registration'} //mark
                
                data={""}
                datatype={'text'}
                index={57}
                setText={(index,text,type,section)=>{
                
                }} 
                multiline={true}
                numberOfLines={1}
              />

                <DateTimeInput 
                      label={'Departure Date'}
                      showDatePickerPostDepart={()=>{}}
                      setNowPostDepart={()=>{}}
                      size={12}
                      added={true}
                      type={'time'}
                      data={null}
                    />


                <DateTimeInput 
                      label={'Arrival Date'}
                      showDatePickerPostDepart={()=>{}}
                      setNowPostDepart={()=>{}}
                      size={12}
                      added={true}
                      type={'time'}
                      data={null}
                    />


                    <DateTimeInput 
                      label={'Departure Time'}
                      showDatePickerPostDepart={()=>{}}
                      setNowPostDepart={()=>{}}
                      size={12}
                      added={true}
                      type={'time'}
                      data={null}
                    />

                    <DateTimeInput 
                      label={'Arrival Date'}
                      showDatePickerPostDepart={()=>{}}
                      setNowPostDepart={()=>{}}
                      size={12}
                      added={true}
                      type={'time'}
                      data={null}
                    />

            <LabelledInput
                label={'Crew (Departure)'} //mark
                
                data={""}
                datatype={'text'}
                index={57}
                setText={(index,text,type,section)=>{
                
                }} 
                multiline={true}
                numberOfLines={1}
              />

            <LabelledInput
                label={'Crew (Arrival)'} //mark
                
                data={""}
                datatype={'text'}
                index={57}
                setText={(index,text,type,section)=>{
                
                }} 
                multiline={true}
                numberOfLines={1}
              />

            <LabelledInput
                label={'Pax (Departure)'} //mark
                
                data={""}
                datatype={'text'}
                index={57}
                setText={(index,text,type,section)=>{
                
                }} 
                multiline={true}
                numberOfLines={1}
              />

            <LabelledInput
                label={'Pax (Arrival)'} //mark
                
                data={""}
                datatype={'text'}
                index={57}
                setText={(index,text,type,section)=>{
                
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