//import liraries
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
  Alert
} from 'react-native';
import { SERVER_URL, getDomain } from './constants/env';
const { width, height } = Dimensions.get('window');
import Header from './subcomponents/Forms/Header';
import auth from '@react-native-firebase/auth';

import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from 'accordion-collapse-react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';

// create a component
const Risk = (props) => {
  const [regList, setregList] = useState([]);
  const [registrationModel, setregistrationModel] = useState(false);
  const [OriginModalList, setOriginModalList] = useState(false);
  const originType = useRef(null);
  const [OriginList, setOriginList] = useState([]);

  const [score, setScore] = useState(0);
  const [status, setStatus] = useState(null);
  const [FR_DATA, setFR_DATA] = useState(props.route.params.FR_DATA);
  const [callLoad, setcallLoad] = useState(false);
  const [RiskHeader, setRiskHeader] = useState(null);
  const [RiskDetail, setRiskDetail] = useState(null);
  const [formReady, setformReady] = useState(true);

  const getTitleHeader = (data) => {
    var structuredData = [];
    var totalCount = 0;
    data.Title.map(val => {
      var oData = val;
      // var cData = structuredData.filter(value => value == val.UID);
      // if (cData.length === 0) {

      //   oData.DESC = [];
      //   structuredData.push(oData);
      // }
      var count = 0;
      var aDesc = data.Detail.filter(value => {
        if (value.TUID == val.UID) {
          if (value.APPLIES === 1) {
            count += value.SCORE;
          }

          return true;
        }

        return false
      });

      // console.log(val.FRA_DESCRIPTION, aDesc)
      oData.DESC = [...aDesc];
      oData.SCORE = count;
      totalCount += oData.SCORE;
      structuredData.push(oData);
      setRiskDetail([...structuredData]);

    });
    if (totalCount > 35) {
      setStatus({ title: 'NO-GO', color: 'red' });
    } else if (totalCount >= 21) {
      setStatus({ title: 'Approval Required', color: 'orange' });
    } else if (totalCount >= 11) {
      setStatus({ title: 'Good to go with mitigation', color: 'black' });
    } else if (totalCount >= 0) {
      setStatus({ title: 'Good to go', color: 'green' });
    }
    setScore(totalCount)
    console.log('structuredData', JSON.stringify(structuredData))

  }
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setOriginModalList(false);
        if (originType.current === 0) {
          setFR_DATA({ ...FR_DATA, FROM_ICAO: item.ICAO_IATA })
        }
        else {
          setFR_DATA({ ...FR_DATA, TO_ICAO: item.ICAO_IATA })
        }

      }}
      style={{
        backgroundColor: 'white',
        width: width * 0.7,
        padding: 10,
        borderBottomWidth: 2,
      }}>
      <Text style={{ color: 'black', fontSize: width / 40 }}>
        {item.ICAO_IATA}
      </Text>
    </TouchableOpacity>
  );
  useEffect(() => {
    setcallLoad(true);
    var domain = getDomain();
    const originURL =
      `${domain}/GetAddressList?_token=CE367E60-22DD-4420-9BA1-79D872CD16C9`;
    fetch(originURL, { method: 'GET' })
      .then(data => {
        return data.json();
      })
      .then(data => {
        var res = data;
        // console.log(res);
        res = res.filter(val => val.STATUS !== 5)
        if (res && res.length) {
          setOriginList(res);
        }
        setcallLoad(false);
      })
      .catch(e => {
        setcallLoad(false);
        console.log(e);
      });
    const url =
      `${domain}/getAIRCRAFT?_token=CB9A5812-B894-469A-8CA4-15055DA6D7D6&_opco=&_an=`;
    fetch(url, { method: 'GET' })
      .then(data => {
        return data.json();
      })
      .then(data => {
        var res = data;
        // console.log(res);
        res = res.filter(val => val.STATUS !== 5)
        setregList(res);
        // setcallLoad(false);
      })
      .catch(e => {
        // setcallLoad(false);
        console.log(e);
      });
    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };
    if (FR_DATA && FR_DATA.UID) {

      // console.log(`${domain}/GetRiskManagementTitleAndHeader?_token=1458C635-6FB6-41BA-9C1C-C336150A79C1&huid=${FRAID}`)
      fetch(
        `${domain}/GetRiskManagementTitleAndHeader?_token=1458C635-6FB6-41BA-9C1C-C336150A79C1&huid=${FR_DATA.UID}`,
        requestOptions,
      )
        .then(response => response.text())
        .then(result => {
          setcallLoad(false);
          console.log('Title', result)
          try {
            var packet = JSON.parse(result);
            // console.log(packet);
            if (packet) {
              getTitleHeader(packet)
            }
            else {
              // props.navigation.pop();
            }

          }
          catch (e) {
            setcallLoad(false);
            // alert(e);
          }
        })
        .catch(error => {
          setcallLoad(false);
          alert(error);
        });
    }
    else {
      setcallLoad(false);
      fetch(
        `${domain}/GetRiskManagementTitleAndHeader?_token=1458C635-6FB6-41BA-9C1C-C336150A79C1&huid=${FR_DATA.UID}`,
        requestOptions,
      )
        .then(response => response.text())
        .then(result => {
          setcallLoad(false);
          console.log('Title', result)
          try {
            var packet = JSON.parse(result);
            // console.log(packet);
            if (packet) {
              getTitleHeader(packet)
            }
            else {
              // props.navigation.pop();
            }

          }
          catch (e) {
            setcallLoad(false);
            // alert(e);
          }
        })
        .catch(error => {
          setcallLoad(false);
          alert(error);
        });
    }
  }, []);


  const selectRisk = (TUID, UID) => {
    var temp = RiskDetail;
    var count = 0;
    // var selectedT = temp.filter(val => val.UID === TUID);
    // var selectedD = temp.filter(val => val.UID === TUID);
    temp.map(val => {
      if (val.UID === TUID) {
        val.DESC.map(value => {
          if (value.UID === UID) {
            if (value.APPLIES) {
              val.SCORE -= value.SCORE;
              value.APPLIES = 0
            }
            else {
              val.SCORE += value.SCORE;
              value.APPLIES = 1
            }

          }
        })
      }
      count += val.SCORE;
    })
    setRiskDetail([...temp])
    // var selected = temp[item.SN - 1].body[index].APPLIES;
    // var count = score;
    // if (selected) {
    //   temp[item.SN - 1].count =
    //     temp[item.SN - 1].count - temp[item.SN - 1].body[index].SCORE;
    //   count = count - temp[item.SN - 1].body[index].SCORE;
    // } else {
    //   temp[item.SN - 1].count =
    //     temp[item.SN - 1].count + temp[item.SN - 1].body[index].SCORE;
    //   count = count + temp[item.SN - 1].body[index].SCORE;
    // }

    // temp[item.SN - 1].body[index].APPLIES = selected === 1 ? 0 : 1;
    // setRiskDetail([...temp]);

    if (count > 35) {
      setStatus({ title: 'NO-GO', color: 'red' });
    } else if (count >= 21) {
      setStatus({ title: 'Approval Required', color: 'orange' });
    } else if (count >= 11) {
      setStatus({ title: 'Good to go with mitigation', color: 'black' });
    } else if (count >= 0) {
      setStatus({ title: 'Good to go', color: 'green' });
    }
    setScore(count);
  };

  const sendForm = () => {
    console.log(JSON.stringify({ 'Detail': RiskDetail, 'header': FR_DATA }));
    var domain = getDomain();
    setcallLoad(true);
    const email = auth().currentUser.email;
    var payload = {
      riskHeader: { ...FR_DATA, UPDATE_BY: email },
      riskTitle: {},
      riskDetails: [...RiskDetail]
    };
    console.log(payload);

    var myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(payload)
    };
    fetch(
      `${domain}/PostFligRiskAssessmentHeaderNo`,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        setcallLoad(false);
        if (FR_DATA.UID) {
          Alert.alert('Success', 'Record updated', [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]);
        }
        else {
          Alert.alert('Success', 'Record successfully created', [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]);
        }
        console.log(result);
      })
      .catch(error => {
        setcallLoad(false);
        Alert.alert('Error in updating');
        console.log(error, 'Function error');
      });
  }


  const _head = item => {
    return (
      <View
        style={{
          backgroundColor: '#3b7dfc',
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomWidth: 2
        }}>
        <Text style={{ fontSize: 24, color: 'white', padding: 5 }}>
          {item.FRA_DESCRIPTION}
        </Text>
        <Text style={{ fontSize: 24, color: 'white', padding: 5 }}>
          {item.SCORE}
        </Text>
      </View>
    );
  };

  const _body = item => {
    return item.DESC.map((val, index) => {
      return (
        <TouchableOpacity
          onPress={() => selectRisk(val.TUID, val.UID)}
          key={index}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 5,
            paddingVertical: 15,
            borderBottomWidth: 2,
            backgroundColor: val.APPLIES == 1 ? '#b43b3b' : '#fff',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: val.APPLIES == 1 ? 'white' : 'black',
              marginRight: 10,
              flex: 1
            }}>
            {val.FRS_DESCRIPTION}
          </Text>
          {val.APPLIES == 1 && (
            <Text
              style={{
                fontSize: 20,
                color: val.APPLIES == 1 ? 'white' : 'black',
                marginRight: 10,

              }}>
              {val.SCORE}
            </Text>
          )}
        </TouchableOpacity>
      );
    });
  };
  return (
    <ScrollView>
      <View style={{ backgroundColor: 'white' }}>
        <Header
          headingSize={width / 25}
          heading={'Risk Assessment'}
          sendForm={sendForm}
          nav={"RiskList"}
          navigation={props.navigation}
          Icon={
            callLoad ? (
              <ActivityIndicator size={'small'} color="green" />
            ) : (
              <Icons
                name="content-save"
                color={formReady ? 'green' : '#aeaeae'}
                size={30}
              />
            )
          }
        />
      </View>
      {FR_DATA && <View style={styles.container}>
        <View
          style={{
            // width: width - 60,
            borderWidth: 2,
            borderColor: status ? status.color : 'black',
            borderRadius: 8,
            padding: 10,
            flexDirection: 'row'
          }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Aircraft Registration</Text>
            <View>
              <TouchableOpacity
                style={styles.input}
                onPress={() => {
                  setregistrationModel(true);
                }}>
                <Text style={{ fontSize: 20, color: 'black' }}>{FR_DATA.AIRCRAFT_REGISTRATION}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Aircraft Type</Text>
            <Text style={{ color: 'black', fontSize: 20 }}>{FR_DATA.AIRCRAFT_TYPE}</Text>
            <Text style={{ color: 'black', fontSize: 20 }}>{FR_DATA.FRA_DATE && new Date(FR_DATA.FRA_DATE).toLocaleDateString()}</Text>
            {status && (
              <View style={{ flexDirection: 'row', flexWrap: "wrap" }}>
                <Text style={{ color: 'black', fontSize: 24, fontWeight: 'bold' }}>
                  Status:{' '}
                </Text>
                <Text style={{ color: status.color, fontSize: 24, flexWrap: "wrap" }}>
                  {status.title}: [{score}]
                </Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>From:</Text>
            <View>
              <TouchableOpacity
                style={styles.input}
                onPress={() => {
                  originType.current = 0;
                  setOriginModalList(true);
                }}>
                <Text style={{ fontSize: 20, color: 'black' }}>{FR_DATA.FROM_ICAO}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>To:</Text>
            <View>
              <TouchableOpacity
                style={styles.input}
                onPress={() => {
                  originType.current = 1;

                  setOriginModalList(true);
                }}>
                <Text style={{ fontSize: 20, color: 'black' }}>{FR_DATA.TO_ICAO}</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: 'black', fontSize: 20 }}>Ref#: {FR_DATA.FRA_REF_NO}</Text>
          </View>
        </View>

        {RiskDetail && <AccordionList
          style={{ marginTop: 10 }}
          list={RiskDetail}
          header={_head}
          body={_body}
          keyExtractor={item => `${item.UID}`}
        // expandedIndex={0}
        />}
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
          <View style={{ flex: 1 }}>
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
                <Text style={{ color: 'black', fontSize: 20 }}>
                  Signature (PIC):
                </Text>
                <View style={{ height: 100 }}></View>
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
                <Text style={{ color: 'black', fontSize: 20 }}>Name :</Text>
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
                <Text style={{ color: 'black', fontSize: 20 }}>
                  {`Approval Signature \n (Required for assessment Scores > 31 ) :`}
                </Text>
                <View style={{ height: 100 }}></View>
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
                <Text style={{ color: 'black', fontSize: 20 }}>Name :</Text>
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
      </View>}
      <Modal animationType="fade" transparent={false} visible={registrationModel}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.8)',
        }}>
          <TouchableOpacity
            style={{
              zIndex: 99,
              padding: 10,
              backgroundColor: 'white',
            }}
            onPress={() => setregistrationModel(false)}>
            <Text style={{ color: 'black', fontSize: 20 }}>Close</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.8)',
            paddingTop: 10,
          }}>
          <ScrollView >
            {regList.map((val, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setregistrationModel(false);
                    setFR_DATA({ ...FR_DATA, AIRCRAFT_REGISTRATION: val.AIRCRAFT_REGISTRATION, AIRCRAFT_TYPE: val.AIRCRAFT_TYPE })
                  }}
                  style={{
                    backgroundColor: 'white',
                    width: width * 0.7,
                    padding: 10,
                    borderBottomWidth: 2,
                  }}>
                  <Text style={{ color: 'black', fontSize: width / 40 }}>
                    {val.AIRCRAFT_REGISTRATION}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={OriginModalList}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.8)',
        }}>
          <TouchableOpacity
            style={{
              zIndex: 99,
              padding: 10,
              backgroundColor: 'white',
            }}
            onPress={() => setOriginModalList(false)}>
            <Text style={{ color: 'black', fontSize: 20 }}>Close</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.8)',
            paddingTop: 10,
          }}>
          <FlatList
            data={OriginList}
            renderItem={renderItem}
            keyExtractor={(item) => item.ICAO_IATA}
          />
        </View>
      </Modal>
    </ScrollView >
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#FFF',
    padding: 30,
    paddingTop: 0
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    textAlignVertical: 'top',
    color: 'black',
    backgroundColor: 'white',
    marginBottom: 10,
    marginRight: 10,
    fontSize: 20,
    padding: 5,
  },
  label: {
    // fontSize: Dimensions.get('window').width / 25,
    color: 'black',
  },
  rowFront: {
    backgroundColor: '#3b7dfc',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    height: 100,
    borderColor: '#000',
    borderRadius: 8,
    flexDirection: 'row',
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
    elevation: 10,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 20,
  },
});

//make this component available to the app
export default Risk;
