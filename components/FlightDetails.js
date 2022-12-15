import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  Switch,
  ScrollView,
} from 'react-native';
import React, {useRef, useState} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Loader from './Loader';
import Feedback from './Feedback';

export default function FlightDetails({navigation}) {
  const ListRef = useRef();
  const FormRef = useRef();
  const currentPicker = useRef(0);
  const currentDeparture = useRef(0);
  const currentDepart = useRef(0);
  const currentFeedback = useRef(0);
  const currentPostDepart = useRef(0);
  const [dataSourceCords, setDataSourceCords] = useState([]);
  const [loading, setloading] = useState(false);
  const [vFeedback, setvFeedback] = useState(false);
  const tabs = [
    {
      id: '1',
      name: 'Flight Preparation',
    },
    {
      id: '2',
      name: 'Pre-Arrival Checklist',
    },
    {
      id: '3',
      name: 'Arrival Services',
    },
    {
      id: '4',
      name: 'Interim Services',
    },
    {
      id: '5',
      name: 'Pre-Departure Checklist',
    },

    {
      id: '6',
      name: 'Departure',
    },
    {
      id: '7',
      name: 'Post-Departure',
    },
  ];

  const [current, setCurrent] = useState('1');
  const [mode, setMode] = useState('time');
  const [modeDeparture, setModeDeparture] = useState('time');
  const onSelectTab = (name, id) => {
    setCurrent(id);
    ListRef.current.scrollToIndex({index: id - 1});
    FormRef.current.scrollTo({
      x: 0,
      y: dataSourceCords[id],
      animated: true,
    });
  };

  // -------------Arrival functions start ------------

  // -------------Arrival functions End------------

  // -------------Pre-Departure functions start ------------

  // -------------Pre-Departure functions end ------------

  // -------------Departure functions start ------------

  // -------------Departure functions end ------------

  // -------------Post Departure functions start ------------

  // -------------Post Departure functions end ------------

  const onScrollList = event => {};
  const ItemRender = ({name, id}) => (
    <TouchableOpacity
      onPress={() => onSelectTab(name, id)}
      style={styleSheet.item}>
      <Text
        style={[
          styleSheet.itemText,
          {color: current == id ? 'green' : 'grey'},
        ]}>
        {name}
      </Text>
      <View
        style={{
          height: 4,
          borderRadius: 10,
          backgroundColor: current == id ? 'green' : 'grey',
          width: '100%',
          marginTop: 10,
        }}></View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styleSheet.MainContainer}>
      <Loader visible={loading} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styleSheet.titleText}>Edit details</Text>
        <TouchableOpacity
          style={{marginRight: 20}}
          onPress={() => navigation.openDrawer()}>
          <Icons name="content-save" color="green" size={30} />
        </TouchableOpacity>
      </View>
      <View style={{paddingHorizontal: 20}}>
        <FlatList
          ref={ListRef}
          data={tabs}
          renderItem={({item}) => <ItemRender name={item.name} id={item.id} />}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          paddingHorizontal: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginTop: 20,
        }}>
        <ScrollView ref={FormRef} onScroll={onScrollList}>
          {/* ---------------------------Arrival   -----------------------*/}

          {/* ----------------Interim Services ----------- */}

          {/* ----------------Pre-Departure Checklist ----------- */}

          {/* -------------------Departure Services----------------- */}

          {/* ----------------Post-Departure ----------- */}
        </ScrollView>

        {/*----------------Time picker for Arrival----------------*/}

        {/*----------------Date Time picker for pre-departure checklist----------------*/}

        {/*----------------Date Time picker for departure ----------------*/}

        {/*----------------Date Time picker for post-departure ----------------*/}
      </View>
    </SafeAreaView>
  );
}

const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  checkbox: {
    width: 40,
    height: 40,
    backgroundColor: 'red',
  },
  label: {
    fontSize: 15,
    color: 'black',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'green',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },

  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 12,
    marginVertical: 20,
    paddingHorizontal: 20,
    color: 'black',
  },

  item: {
    padding: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  itemText: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    textAlignVertical: 'top',
    color: 'black',
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginVertical: 10,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  remarks: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    flex: 1,
    color: 'black',
  },
});
