//import liraries
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from 'accordion-collapse-react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';

// create a component
const Risk = ({navigation}) => {
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState(null);

  const [list, setlist] = useState([
    {
      id: 0,
      title: 'Pre-Trip Planning',
      count: 0,
      body: [
        {title: 'Pop up trip < 12 hrs notice', applied: false, score: 5},
        {title: 'Quick Turn', applied: false, score: 5},
        {title: 'Non-standard Crew', applied: false, score: 10},
        {title: 'Positioning flight no passengers', applied: false, score: 5},
        {title: 'Reserves / Fuel at destination', applied: false, score: 5},
      ],
    },
    {
      id: 1,
      title: 'Components',
      count: 0,
      body: [
        {title: 'Pop up trip < 12 hrs notice', applied: false, score: 5},
        {title: 'Quick Turn', applied: false, score: 5},
        {title: 'Non-standard Crew', applied: false, score: 5},
        {title: 'Positioning flight no passengers', applied: false, score: 5},
        {title: 'Reserves / Fuel at destination', applied: false, score: 5},
      ],
    },
  ]);
  const selectRisk = (item, index) => {
    var temp = list;
    var selected = temp[item.id].body[index].applied;
    var count = score;
    if (selected) {
      temp[item.id].count =
        temp[item.id].count - temp[item.id].body[index].score;
      count = count - temp[item.id].body[index].score;
    } else {
      temp[item.id].count =
        temp[item.id].count + temp[item.id].body[index].score;
      count = count + temp[item.id].body[index].score;
    }

    temp[item.id].body[index].applied = !selected;
    setlist([...temp]);

    if (count > 35) {
      setStatus({title: 'NO_GO', color: 'red'});
    } else if (count >= 21) {
      setStatus({title: 'Approval Required', color: 'orange'});
    } else if (count >= 11) {
      setStatus({title: 'Something', color: 'green'});
    } else if (count >= 0) {
      setStatus({title: 'Good to go', color: 'green'});
    }
    setScore(count);
  };

  const _head = item => {
    return (
      <View
        style={{
          backgroundColor: '#3b7dfc',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={{fontSize: 24, color: 'white', padding: 5}}>
          {item.title}
        </Text>
        <Text style={{fontSize: 24, color: 'white', padding: 5}}>
          {item.count}
        </Text>
      </View>
    );
  };

  const _body = item => {
    return item.body.map((val, index) => {
      return (
        <TouchableOpacity
          onPress={() => selectRisk(item, index)}
          key={index}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 5,
            paddingVertical: 15,
            borderBottomWidth: 2,
            backgroundColor: val.applied ? '#b43b3b' : '#fff',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: val.applied ? 'white' : 'black',
            }}>
            {val.title}
          </Text>
          {val.applied && (
            <Text
              style={{
                fontSize: 20,
                color: val.applied ? 'white' : 'black',
                paddingRight: 10,
              }}>
              {val.score}
            </Text>
          )}
        </TouchableOpacity>
      );
    });
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <TouchableOpacity
            style={{paddingRight: 10}}
            onPress={() => navigation.navigate('LogDetails')}>
            <FontAwesome5Icons name="caret-left" color={'black'} size={40} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Risk Assessment
          </Text>
        </View>
        <View
          style={{
            width: width - 60,
            borderWidth: 2,
            borderColor: status ? status.color : 'black',
            borderRadius: 8,
            padding: 10,
          }}>
          <Text style={{color: 'black', fontSize: 24, fontWeight: 'bold'}}>
            Phongsubthavy Group Sole Co. Ltd
          </Text>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 1}}>
              <Text style={{color: 'black', fontSize: 20}}>17-Jan-2023</Text>
              <Text style={{color: 'black', fontSize: 20}}>H25B</Text>
              <Text style={{color: 'black', fontSize: 20}}>From: WSSL</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{color: 'black', fontSize: 20}}>
                Registration: T7-5678
              </Text>
              <Text style={{color: 'black', fontSize: 20}}>Ref#: 3</Text>
              <Text style={{color: 'black', fontSize: 20}}>To: VTBT</Text>
            </View>
          </View>
          {status && (
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: 'black', fontSize: 24, fontWeight: 'bold'}}>
                Status:{' '}
              </Text>
              <Text style={{color: status.color, fontSize: 24}}>
                {status.title}: [{score}]
              </Text>
            </View>
          )}
        </View>

        <AccordionList
          style={{marginTop: 10}}
          list={list}
          header={_head}
          body={_body}
          keyExtractor={item => `${item.id}`}
          expandedIndex={0}
        />
        <View
          style={{
            width: width - 60,
            borderWidth: 2,
            borderColor: 'black',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomWidth: 0,
            marginTop: 10,
            flexDirection: 'row',
          }}>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  padding: 10,
                  borderBottomWidth: 2,
                }}>
                <Text style={{color: 'black', fontSize: 20}}>
                  Signature (PIC):
                </Text>
                <View style={{height: 100}}></View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 2,
                borderBottomWidth: 2,
              }}>
              <View
                style={{
                  flex: 1,
                  padding: 10,
                  borderRightWidth: 1,
                }}>
                <Text style={{color: 'black', fontSize: 20}}>Name :</Text>
                <TextInput
                  style={{
                    fontSize: 20,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    color: 'black',
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  padding: 10,
                  borderBottomWidth: 2,
                }}>
                <Text style={{color: 'black', fontSize: 20}}>
                  {`Approval Signature \n (Required for assessment Scores > 31 ) :`}
                </Text>
                <View style={{height: 100}}></View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 2,
                borderBottomWidth: 2,
              }}>
              <View
                style={{
                  flex: 1,
                  padding: 10,
                  borderRightWidth: 1,
                }}>
                <Text style={{color: 'black', fontSize: 20}}>Name :</Text>
                <TextInput
                  style={{
                    fontSize: 20,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    color: 'black',
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#FFF',
    padding: 30,
  },
});

//make this component available to the app
export default Risk;
