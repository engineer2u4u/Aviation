import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import s from '../FlightPreparation/form.styles';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const DateTimeInput = ({
  label,
  showLabel = true,
  notrequiredSection = false,
  isnotrequired,
  setnotrequired,
  disabled,
  showDatePickerPostDepart,
  ini,
  setNowPostDepart,
  size,
  data,
  index,
  type = 'time',
  sectionName = 'crew',
  added = false,
  setflightdoc = null,
  showTimeNow = true,
  notrequiredtext = null
}) => {
  const [date, setdate] = useState(data);
  const [notreq, setnotreq] = useState(isnotrequired);
  const [color, setcolor] = useState('white');
  const [touchableactive, setdisabletouchable] = useState(true);

  const setTime = () => {
    if (type == 'date') {
      var x = new Date().toLocaleString('en-US', {
        hour12: false,
      });
      x = x.split(',')[0];
    }
    else if (type == 'time') {
      var x = new Date().toLocaleString('en-US', {
        hour12: false,
      });
      var time24 = x.split(', ')[1];
      var time = time24.split(':');
      x = time[0] + ':' + time[1];
    }
    else {
      var x = new Date().toLocaleString('en-US', {
        hour12: false,
      });
    }

    if (typeof setflightdoc === 'function') {
      console.log('setflight');
      setflightdoc(x);
    } else {
      // console.log('setnow', x);

      setNowPostDepart(index, x, 'time', sectionName);
    }

    setdate(x);
  };

  useEffect(() => {
    setdate(data);
  }, [data]);
  useEffect(() => {
    setnotreq(isnotrequired)
  }, [isnotrequired]);

  useEffect(() => {
    // if (notrequiredSection) {
    // if (disabled) {
    //   setnotreq(true)
    // }
    // else if(!disabled) {
    //   setnotreq(false)
    // }
    if (notreq || disabled) {
      setcolor('rgba(0,0,0,0.3)');
      setdisabletouchable(true);
      setdate(null);
    } else {
      setcolor('white');
      setdisabletouchable(false);
      setnotreq(false)
    }
    // } else {
    //   if (disabled) {
    //     setcolor('rgba(0,0,0,0.3)');
    //     setdisabletouchable(true);
    //     setdate(null);
    //   } else {
    //     setcolor('white');
    //     setdisabletouchable(false);
    //   }
    // }
  }, [disabled, notreq]);
  return (
    <>
      {showLabel && (
        <Text style={s.label}>{label || 'Time Verified (Local Time)'}</Text>
      )}
      {notrequiredSection && (
        <TouchableOpacity
          onPress={event => {
            // var x = paxhotelactivesections;
            // setpaxhotelactivesections(!x);
            // console.log(x);
            //setpaxboardedtimeactive

            setnotrequired(!notreq);
            setnotreq(!notreq);
            //come here
            //setpaxarrivaltimeaddedactive(x);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: 5,
            marginTop: 10,
          }}>
          <Icons
            name={
              // paxhotelactivesections
              notreq
                ? //val.arrivaActive

                'checkbox-marked-outline'
                : 'checkbox-blank-outline'
            }
            color={notreq ? 'green' : 'black'}
            size={35}
          />
          <Text style={[{ fontSize: 15, paddingLeft: 10, color: 'black' }]}>
            {notrequiredtext ? notrequiredtext : 'Not Required'}
          </Text>
        </TouchableOpacity>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          disabled={touchableactive}
          style={[s.picker, { backgroundColor: color }]}
          onPress={() => showDatePickerPostDepart(type, index)}>
          <Text style={{ fontSize: 20, color: 'black' }}>
            {date != null ? date : (type == 'date' ? 'dd/mm/yy' : type == 'time' ? '-- : --' : 'dd/mm/yy, -- : --')}
          </Text>
        </TouchableOpacity>
        {showTimeNow && <TouchableOpacity
          disabled={touchableactive}
          onPress={() => {
            setTime(); //  :  setNowPostDepart(index)
          }}
          style={{ padding: 10 }}>
          <Text
            style={{
              fontSize: size,
              color: 'green',
            }}>
            {type == 'date' ? 'Today' : 'Time Now'}
          </Text>
        </TouchableOpacity>}
      </View>
    </>
  );
};

export default DateTimeInput;
