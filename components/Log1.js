//import liraries
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from 'accordion-collapse-react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import { SERVER_URL, getDomain } from './constants/env';

// create a component
const Log1 = (props) => {
  const [legSelected, setSelecetd] = useState(true);
  const [LogHeader, setLogHeader] = useState(null);
  const [LogDetail, setLogDetail] = useState([1]);
  const [callLoad, setcallLoad] = useState(false);
  const UID = props.route.params.UID;
  useEffect(() => {
    setcallLoad(true);
    var domain = getDomain();
    if (UID) {
      var myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'GET',
        headers: myHeaders
      };
      fetch(
        `${domain}/GetFlightLog?_token=F4CD8DF6-9D96-40EF-A9D0-1EBFA93D92B2&_uid=${UID}`,
        requestOptions,
      )
        .then(response => response.text())
        .then(result => {
          setcallLoad(false);
          try {
            var packet = JSON.parse(result);
            console.log(packet);
            if (packet && packet.length > 0) {
              setLogHeader(packet[0]);
            }
            else {
              props.navigation.pop();
            }

          }
          catch (e) {
            setcallLoad(false);
            alert(e);
          }
        })
        .catch(error => {
          setcallLoad(false);
          alert(error);
        });
    }
    else {
      setcallLoad(false);
      setLogHeader({ "AC_TYPE": "", "AIRCRAFT_NAME": "", "AIRCRAFT_UID": "", "CABIN_ATTENDANT": "", "CABIN_OFF": "", "CABIN_ON": "", "CREATED_BY": "", "CREATED_DATE": "", "ENG_NAME": "", "ENG_OFF": "", "ENG_ON": "", "ENG_UID": "", "FLIGHT_NO": null, "LAST_UPDATE": "", "LEG_UID": "", "LOG_NO": 11, "OWNER": "ow", "PIC_NAME": "", "PIC_OFF": "", "PIC_ON": "", "PIC_UID": "", "PILOT2_NAME": "", "PILOT2_OFF": "", "PILOT2_ON": "", "PILOT2_UID": "", "PILOT_NAME": "", "PILOT_OFF": "", "PILOT_ON": "", "PILOT_UID": "", "REG_NO": "", "START_DATE": "", "STATUS": 0, "STATUS_LH": null, "TRIP_NO": "", "TRIP_NO_LH": null, "TRIP_UID": "", "UID": "", "UPDATE_BY": "" });
    }
  }, []);
  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <TouchableOpacity
            style={{ paddingRight: 10 }}
            onPress={() => props.navigation.navigate('LogDetails')}>
            <FontAwesome5Icons name="caret-left" color={'black'} size={40} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Flight Log
          </Text>
        </View>
        {LogHeader && <>
          <View
            style={{
              // width: width - 60,
              borderWidth: 2,
              borderColor: 'black',
              borderRadius: 8,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 24,
                fontWeight: 'bold',
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}>
              {LogHeader.AIRCRAFT_NAME}
            </Text>
            <View style={{}}>
              <View
                style={{
                  borderBottomWidth: 2,
                  borderTopWidth: 2,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    flex: 1,
                    borderRightWidth: 2,
                    padding: 5,
                  }}>
                  {LogHeader.START_DATE && new Date(LogHeader.START_DATE).toLocaleDateString()}
                </Text>
                <Text style={{ color: 'black', fontSize: 20, flex: 1, padding: 5 }}>
                  Registration: {LogHeader.REG_NO}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 2,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    flex: 1,
                    borderRightWidth: 2,
                    padding: 5,
                  }}>
                  Trip#: {LogHeader.TRIP_NO}
                </Text>
                <Text style={{ color: 'black', fontSize: 20, flex: 1, padding: 5 }}>
                  A/C Type:  {LogHeader.AC_TYPE}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    flex: 1,
                    padding: 5,
                  }}>
                  Log#: {LogHeader.LOG_NO}
                </Text>
              </View>
            </View>
          </View>
          <Collapse style={{ marginTop: 10 }}>
            <CollapseHeader>
              <View
                style={{
                  backgroundColor: '#3b7dfc',
                  flexDirection: 'row',
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  justifyContent: 'space-between',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FontAwesome5Icons name="user-tie" color={'white'} size={25} />
                  <Text
                    style={{
                      fontSize: 24,
                      color: 'white',
                      padding: 5,
                      paddingLeft: 10,
                    }}>
                    Crew Details
                  </Text>
                </View>
                <FontAwesome5Icons name="caret-down" color={'white'} size={25} />
              </View>
            </CollapseHeader>
            <CollapseBody>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 5,
                  paddingVertical: 15,
                  borderBottomWidth: 2,
                  borderLeftWidth: 2,
                  borderRightWidth: 2,
                  borderColor: '#3b7dfc',
                  backgroundColor: '#fff',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'black',
                  }}>
                  PIC: {LogHeader.PIC_NAME}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 5,
                  paddingVertical: 15,
                  borderBottomWidth: 2,
                  borderLeftWidth: 2,
                  borderRightWidth: 2,
                  borderColor: '#3b7dfc',
                  backgroundColor: '#fff',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'black',
                  }}>
                  Pilot 1:  {LogHeader.PILOT_NAME}
                </Text>
              </View>
              {LogHeader.PILOT2_NAME && <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 5,
                  paddingVertical: 15,
                  borderBottomWidth: 2,
                  borderLeftWidth: 2,
                  borderRightWidth: 2,
                  borderColor: '#3b7dfc',
                  backgroundColor: '#fff',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'black',
                  }}>
                  Pilot 2:  {LogHeader.PILOT2_NAME}
                </Text>
              </View>}
              {LogHeader.ENG_NAME && <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 5,
                  paddingVertical: 15,
                  borderBottomWidth: 2,
                  borderLeftWidth: 2,
                  borderRightWidth: 2,
                  borderColor: '#3b7dfc',
                  backgroundColor: '#fff',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'black',
                  }}>
                  Engineer:  {LogHeader.ENG_NAME}
                </Text>
              </View>}
              {LogHeader.CABIN_ATTENDANT && <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 5,
                  paddingVertical: 15,
                  borderBottomWidth: 2,
                  borderLeftWidth: 2,
                  borderRightWidth: 2,
                  borderColor: '#3b7dfc',
                  backgroundColor: '#fff',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'black',
                  }}>
                  Cabin Attendant:  {LogHeader.CABIN_ATTENDANT}
                </Text>
              </View>}

            </CollapseBody>
          </Collapse>

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => {
                setSelecetd(true);
              }}
              style={{
                flex: 1,
                backgroundColor: '#3b7dfc',
                borderBottomColor: 'black',
                borderBottomWidth: legSelected ? 5 : 0,
              }}>
              <Text style={{ color: 'white', fontSize: 24, padding: 10 }}>
                Leg Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelecetd(false);
              }}
              style={{
                flex: 1,
                backgroundColor: '#3b7dfc',
                borderBottomColor: 'black',
                borderBottomWidth: legSelected ? 0 : 5,
              }}>
              <Text style={{ color: 'white', fontSize: 24, padding: 10 }}>
                Fuel Details
              </Text>
            </TouchableOpacity>
          </View>

          {legSelected ? (
            <>
              <View
                style={{
                  // width: width - 60,
                  borderWidth: 2,
                  borderColor: 'black',
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  borderBottomWidth: 0,
                  marginTop: 10,
                }}>
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
                      PIC Signature:
                    </Text>
                    <View style={{ height: 100 }}></View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 2,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 24,
                      color: 'black',
                      textAlign: 'center',
                    }}>
                    Total times/Cycles
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 2,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      borderRightWidth: 1,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>FLT:</Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      borderRightWidth: 1,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>BLK:</Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      borderRightWidth: 1,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>Cycles:</Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
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
                      Notes (Incidents & Observations):
                    </Text>
                    <View style={{ height: 100 }}></View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  // width: width - 60,
                  borderWidth: 2,
                  borderColor: 'black',
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  borderBottomWidth: 0,
                  marginTop: 20,
                  flexDirection: 'row',
                }}>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 24,
                        color: 'black',
                        padding: 5,
                      }}>
                      Leg #:1
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 24,
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      Station
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                        borderRightWidth: 1,
                      }}>
                      <Text style={{ color: 'black', fontSize: 20 }}>From:</Text>
                      <TextInput
                        style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                      }}>
                      <Text style={{ color: 'black', fontSize: 20 }}>To:</Text>
                      <TextInput
                        style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 24,
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      Leg Times - GMT
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                        borderRightWidth: 1,
                      }}>
                      <Text style={{ color: 'black', fontSize: 20 }}>Out:</Text>
                      <TextInput
                        style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                        borderRightWidth: 1,
                      }}>
                      <Text style={{ color: 'black', fontSize: 20 }}>Off:</Text>
                      <TextInput
                        style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                        borderRightWidth: 1,
                      }}>
                      <Text style={{ color: 'black', fontSize: 20 }}>On:</Text>
                      <TextInput
                        style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                      }}>
                      <Text style={{ color: 'black', fontSize: 20 }}>In:</Text>
                      <TextInput
                        style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                        borderRightWidth: 1,
                      }}>
                      <Text style={{ color: 'black', fontSize: 20 }}>FLT:</Text>
                      <TextInput
                        style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                      }}>
                      <Text style={{ color: 'black', fontSize: 20 }}>BLK:</Text>
                      <TextInput
                        style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <Text
                      style={{
                        fontSize: 24,
                        color: 'black',
                        marginRight: 10,
                        marginLeft: 10,
                      }}>
                      Cycles:
                    </Text>
                    <TextInput
                      style={{
                        fontSize: 20,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        flex: 1,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 24,
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      Flight Type Time
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                        borderRightWidth: 1,
                      }}>
                      <Text style={{ color: 'black', fontSize: 20 }}>Inst:</Text>
                      <TextInput
                        style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                      }}>
                      <Text style={{ color: 'black', fontSize: 20 }}>Nite:</Text>
                      <TextInput
                        style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 24,
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      APP
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                        borderRightWidth: 1,
                      }}>
                      <Text style={{ color: 'black', fontSize: 20 }}>TYP:</Text>
                      <TextInput
                        style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 20,
                          textAlign: 'center',
                        }}>
                        EVS
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 24,
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      T/O
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                        borderRightWidth: 1,
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 20,
                          textAlign: 'center',
                        }}>
                        D
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 20,
                          textAlign: 'center',
                        }}>
                        N
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 24,
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      LND
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                        borderRightWidth: 1,
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 20,
                          textAlign: 'center',
                        }}>
                        D
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 20,
                          textAlign: 'center',
                        }}>
                        N
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <Text
                      style={{
                        fontSize: 24,
                        color: 'black',
                        marginRight: 10,
                        marginLeft: 10,
                        textAlign: 'center',
                      }}>
                      Hldg
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <Text
                      style={{
                        fontSize: 24,
                        color: 'black',
                        marginRight: 10,
                        marginLeft: 10,
                      }}>
                      {`Operations\nClassification:`}
                    </Text>
                    <TextInput
                      style={{
                        fontSize: 20,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        flex: 1,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                    }}>
                    <Text
                      style={{
                        fontSize: 24,
                        color: 'black',
                        marginRight: 10,
                        marginLeft: 10,
                      }}>
                      Pilot Flying:
                    </Text>
                    <TextInput
                      style={{
                        fontSize: 20,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        flex: 1,
                      }}
                    />
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View
              style={{
                // width: width - 60,
                borderWidth: 2,
                borderColor: 'black',
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderBottomWidth: 0,
                marginTop: 20,
                flexDirection: 'row',
              }}>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 2,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 24,
                      color: 'black',
                      padding: 5,
                    }}>
                    Leg #:1
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 2,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 24,
                      color: 'black',
                      textAlign: 'left',
                    }}>
                    Station: VXVT
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 2,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 24,
                      color: 'black',
                      textAlign: 'center',
                    }}>
                    Uplift
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 2,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                    }}>
                    <Text
                      style={{ color: 'black', fontSize: 20, textAlign: 'center' }}>
                      Ltrs/USG
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      borderRightWidth: 1,
                      borderLeftWidth: 1,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>Planned:</Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      borderRightWidth: 1,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>Actual:</Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      borderRightWidth: 1,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>
                      Actual(lbs.):
                    </Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 2,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      borderRightWidth: 1,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>
                      Price/USG(USD):
                    </Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>Receipt:</Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 2,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 24,
                      color: 'black',
                      textAlign: 'center',
                    }}>
                    Attch.
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 2,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      borderRightWidth: 1,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>
                      Departure Fuel (lbs):
                    </Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      borderRightWidth: 1,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>
                      Arrival Fuel (lbs):
                    </Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>
                      Fuel Burn (lbs):
                    </Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 2,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 24,
                      color: 'black',
                      textAlign: 'center',
                    }}>
                    Engine Oil (Quarts)
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 2,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      borderRightWidth: 1,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>#1:</Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      borderRightWidth: 1,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>#2:</Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 2,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 24,
                      color: 'black',
                      textAlign: 'center',
                    }}>
                    De-Ice
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 2,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      borderRightWidth: 1,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>Start:</Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      borderRightWidth: 1,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>Type:</Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                    }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>Mixture:</Text>
                    <TextInput
                      style={{ fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </>}

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
export default Log1;
