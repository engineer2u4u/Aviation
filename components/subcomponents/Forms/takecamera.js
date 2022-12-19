import React from "react";
import {View,Text,TouchableOpacity} from 'react-native'
import s from './FlightPreparation/form.styles';
import FileAttachMents from "./fileAttachments";

const TakeCamera=({label,type,uploadInitiator,attachments,removeFilePreA,Icon})=>{
    const uploadInitiatorbind=()=>uploadInitiator(type);
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
            onPress={uploadInitiatorbind}
            style={s.takecamerabtn}>
            <Text style={{color: 'green'}}>Take Camera</Text>
          </TouchableOpacity>
        </View>
        {attachments.file.length > 0 && (
          <View style={{marginBottom: 20}}>
            {attachments.file.map((value, index) => {
              return (
                <FileAttachMents 
                key={index}
                removeFile={removeFilePreA}
                type={0}
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