import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card } from 'react-native-paper';

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};
const Urgent = { key: 'Urgent', color: 'red', selectedDotColor: 'red' };
const Cancelled = { key: 'Cancelled', color: 'purple', selectedDotColor: 'purple' };
const Hold = { key: 'Hold', color: 'yellow', selectedDotColor: 'yellow' };
const Arrived = { key: 'Arrived', color: 'green', selectedDotColor: 'green' };
const Departed = { key: 'Departed', color: 'orange', selectedDotColor: 'orange' };
const TBA = { key: 'To Be Action', color: 'blue', selectedDotColor: 'blue' };
const Calendar = () => {
  const [items, setItems] = React.useState({});

  const loadItems = (day) => {
    setTimeout(() => {
      // for (let i = 0; i < 25; i++) {
      //   const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      //   const strTime = timeToString(time);
      //   console.log(strTime);
      //   if (!items[strTime]) {
      //     items[strTime] = [];

      //     const numItems = Math.floor(Math.random() * 3 + 1);
      //     for (let j = 0; j < numItems; j++) {
      //       items[strTime].push({
      //         name: 'Item for ' + strTime + ' #' + j,
      //         height: Math.max(10, Math.floor(Math.random() * 150)),
      //         day: strTime,
      //       });
      //     }
      //   }
      // }
      // const newItems = {};
      // Object.keys(items).forEach((key) => {
      //   newItems[key] = items[key];
      // });
      setItems({
        '2022-09-16': [
          {
            name: 'GG:1980',

            day: '2022-09-16',
            startTime: '10 a.m',
            endTime: '12 p.m',
            meetingType: 'Cancelled',
          },
          {
            name: 'DG:1981',
            meetingType: 'TBA',
            day: '2022-09-16',
          },
        ],
        '2022-09-17': [
          {
            name: 'GA8293',

            day: '2022-09-17',
          },
        ],
      });
    }, 1000);
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        style={[
          styles.item,
          {
            backgroundColor:
              item.meetingType == 'TBA' ? 'blue' : 'purple',
          },
        ]}>
        <View>
          <Text
            style={{
              color: 'white',
              fontSize: Dimensions.get('window').width / 22,
            }}>
            {item.name}
          </Text>
          {item.startTime && (
            <Text
              style={{
                color: 'white',
                fontSize: Dimensions.get('window').width / 30,
              }}>
              {item.startTime + ' - ' + item.endTime}
            </Text>
          )}
          {item.meetingType && (
            <Text
              style={{
                color: 'white',
                fontSize: Dimensions.get('window').width / 30,
              }}>
              {item.meetingType}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={'2022-09-16'}
        markingType={'multi-dot'}
        markedDates={{
          '2022-09-16': {
            dots: [TBA, Cancelled],
            marked: true,
          },
          '2022-09-17': {
            dots: [Cancelled],
            marked: true,
          },
        }}
        refreshControl={null}
        showClosingKnob={true}
        refreshing={false}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
});

export default Calendar;
