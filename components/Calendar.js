import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {Card} from 'react-native-paper';

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};
const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
const massage = {key: 'massage', color: 'orange', selectedDotColor: 'blue'};
const workout = {key: 'workout', color: 'green'};
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
            meetingType: 'Meeting',
          },
          {
            name: 'DG:1981',

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
              item.meetingType == 'Meeting' ? '#ffa500' : '#71d8c7',
          },
        ]}>
        {/* <Card>
          <Card.Content> */}
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
        {/* </Card.Content>
        </Card> */}
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
            dots: [massage, workout],
            marked: true,
          },
          '2022-09-17': {
            dots: [workout],
            marked: true,
          },
        }}
        refreshControl={null}
        showClosingKnob={true}
        refreshing={false}
        renderItem={renderItem}
      />
      {/* <StatusBar /> */}
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
