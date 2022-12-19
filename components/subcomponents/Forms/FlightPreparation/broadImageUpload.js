import React from "react";
import {View,Text,TextInput,TouchableOpacity} from 'react-native';
import s from './form.styles';
import m from '../../../styles/layouts/main.style';

const BroadImageUpload=({icon,type,
label,
text,
textSeeker,
uploadType,
uploadInitiator,textId,attachMents})=>{

    const uploadInitiatorbind=()=>uploadInitiator(uploadType);
    const textSeekerbind=(text)=>textSeeker(textId,text);

    return(
        <View>
            <Text style={s.label}>{label}</Text>
            <View style={[m.row,m.alighItemCenter]}>
                <TextInput
                    style={s.input}
                    multiline={true}
                    numberOfLines={2}
                    value={text}
                    onChangeText={textSeekerbind}
                />
                <TouchableOpacity 
                    //onPress={() => onPressDocFPreparation(3)}
                    onPress={uploadInitiatorbind}
                    style={{justifyContent:'flex-end',alignSelf:'flex-end',marginBottom:20}}
                >
                 {icon}   
                </TouchableOpacity>
            </View>
            {attachMents}
        </View>
    )
}

export default BroadImageUpload;