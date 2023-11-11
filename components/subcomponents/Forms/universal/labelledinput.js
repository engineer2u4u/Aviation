import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import s from '../FlightPreparation/form.styles';

const LabelledInput = ({
  label,
  disabled = false,
  multiline,
  numberOfLines,
  data,
  ini,
  index,
  setText,
  sectionName = 'crew',
  added = false,
  datatype = 'text',
}) => {
  const [val, setval] = useState('');

  const sendText = () => {
    if (added) setText(index, val, datatype, sectionName);
  };

  const setTextbind = event => {
    if (added) {
      setval(event);
    } else setText(index, event, datatype, sectionName);
  };

  useEffect(() => {
    // console.log("HEELLLO",data)
    setval(data ? data.toString() : '');
  }, [data]);

  return (
    <>
      <Text style={s.label}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={[
            s.input,
            { backgroundColor: disabled ? 'rgba(0,0,0,0.1)' : 'white' },
          ]}
          editable={!disabled}
          value={disabled ? '' : val}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onChangeText={(text) => { setText(null, text, null, null), setval(text) }}
        // onBlur={sendText}
        // var tpostdeparture = [...postdeparture];
        // tpostdeparture[2] = text;
        // setpostdeparture(tpostdeparture);
        //}}
        />
      </View>
    </>
  );
};

export default LabelledInput;
