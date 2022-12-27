import React,{useState} from "react";
import {View,Text,TouchableOpacity} from 'react-native'
import s from './FlightPreparation/form.styles';
import FileAttachMents from "./fileAttachments";

const TakeCamera=({label,disabled=false,type,uploadInitiator,init,attachments,removeFilePreA,Icon,sectionName='crew',addedsection=false})=>{
    const [ini,setini]=useState(init);
    const uploadInitiatorbind=()=>{
      uploadInitiator(type,addedsection,sectionName);
      setini(!ini)
    };
    return(
        <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 20,
          }}>
          <Text style={s.label}>{label}</Text>
          <TouchableOpacity
            //onPress={event => onPressDocPreA(0)}
            disabled={disabled}
            onPress={uploadInitiatorbind}
            style={s.takecamerabtn}>
            <Text style={{color:disabled? '#000' : 'green'}}>Take Camera</Text>
          </TouchableOpacity>

        </View>
        {

          attachments.file.length > 0 && (
          <View style={{marginBottom: 20}}>
            {attachments.file.map((value, index) => {
              return (
              <FileAttachMents 
                key={index}
                ini={ini}
                addedsection={addedsection}
                removeFile={removeFilePreA}
                type={type}
                index={index}
                filename={value.name}
                Icon={Icon}
                />
              );
            })}
          </View>
        )}
        </>
    )
}

export default TakeCamera;