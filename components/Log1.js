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
import {TabView, SceneMap} from 'react-native-tab-view';
// create a component

const FirstRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#ff4081'}]} />
);
const SecondRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#673ab7'}]} />
);

const Log1 = ({navigation}) => {
  const [legSelected, setSelecetd] = useState(true);
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
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
            Flight Log
          </Text>
        </View>
        <View
          style={{
            width: width - 60,
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
            Phongsubthavy Group Sole Co. Ltd
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
                17-Jan-2023
              </Text>
              <Text style={{color: 'black', fontSize: 20, flex: 1, padding: 5}}>
                Registration: T7-5678
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
                Trip#:
              </Text>
              <Text style={{color: 'black', fontSize: 20, flex: 1, padding: 5}}>
                A/C Type: H25B
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
                Log#:
              </Text>
            </View>
          </View>
        </View>
        <Collapse style={{marginTop: 10}}>
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                PIC: Gareth Joseph Griffiths
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
                Pilot: Martin Sauer
              </Text>
            </View>
          </CollapseBody>
        </Collapse>

        <View style={{flexDirection: 'row', marginTop: 10}}>
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
            <Text style={{color: 'white', fontSize: 24, padding: 10}}>
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
            <Text style={{color: 'white', fontSize: 24, padding: 10}}>
              Fuel Details
            </Text>
          </TouchableOpacity>
        </View>

        {legSelected ? (
          <>
            <View
              style={{
                width: width - 60,
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
                  <Text style={{color: 'black', fontSize: 20}}>
                    PIC Signature:
                  </Text>
                  <View style={{height: 100}}></View>
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
                  <Text style={{color: 'black', fontSize: 20}}>FLT:</Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    padding: 5,
                    borderRightWidth: 1,
                  }}>
                  <Text style={{color: 'black', fontSize: 20}}>BLK:</Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    padding: 5,
                    borderRightWidth: 1,
                  }}>
                  <Text style={{color: 'black', fontSize: 20}}>Cycles:</Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
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
                    Notes (Incidents & Observations):
                  </Text>
                  <View style={{height: 100}}></View>
                </View>
              </View>
            </View>
            <View
              style={{
                width: width - 60,
                borderWidth: 2,
                borderColor: 'black',
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderBottomWidth: 0,
                marginTop: 20,
                flexDirection: 'row',
              }}>
              <View style={{flex: 1}}>
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
                    <Text style={{color: 'black', fontSize: 20}}>From:</Text>
                    <TextInput
                      style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                    }}>
                    <Text style={{color: 'black', fontSize: 20}}>To:</Text>
                    <TextInput
                      style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
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
                    <Text style={{color: 'black', fontSize: 20}}>Out:</Text>
                    <TextInput
                      style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      borderRightWidth: 1,
                    }}>
                    <Text style={{color: 'black', fontSize: 20}}>Off:</Text>
                    <TextInput
                      style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                      borderRightWidth: 1,
                    }}>
                    <Text style={{color: 'black', fontSize: 20}}>On:</Text>
                    <TextInput
                      style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                    }}>
                    <Text style={{color: 'black', fontSize: 20}}>In:</Text>
                    <TextInput
                      style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
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
                    <Text style={{color: 'black', fontSize: 20}}>FLT:</Text>
                    <TextInput
                      style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                    }}>
                    <Text style={{color: 'black', fontSize: 20}}>BLK:</Text>
                    <TextInput
                      style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
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
                    <Text style={{color: 'black', fontSize: 20}}>Inst:</Text>
                    <TextInput
                      style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 5,
                    }}>
                    <Text style={{color: 'black', fontSize: 20}}>Nite:</Text>
                    <TextInput
                      style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
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
                    <Text style={{color: 'black', fontSize: 20}}>TYP:</Text>
                    <TextInput
                      style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
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
              width: width - 60,
              borderWidth: 2,
              borderColor: 'black',
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              borderBottomWidth: 0,
              marginTop: 20,
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}}>
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
                    style={{color: 'black', fontSize: 20, textAlign: 'center'}}>
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
                  <Text style={{color: 'black', fontSize: 20}}>Planned:</Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    padding: 5,
                    borderRightWidth: 1,
                  }}>
                  <Text style={{color: 'black', fontSize: 20}}>Actual:</Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    padding: 5,
                    borderRightWidth: 1,
                  }}>
                  <Text style={{color: 'black', fontSize: 20}}>
                    Actual(lbs.):
                  </Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
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
                  <Text style={{color: 'black', fontSize: 20}}>
                    Price/USG(USD):
                  </Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    padding: 5,
                  }}>
                  <Text style={{color: 'black', fontSize: 20}}>Receipt:</Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
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
                  <Text style={{color: 'black', fontSize: 20}}>
                    Departure Fuel (lbs):
                  </Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    padding: 5,
                    borderRightWidth: 1,
                  }}>
                  <Text style={{color: 'black', fontSize: 20}}>
                    Arrival Fuel (lbs):
                  </Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    padding: 5,
                  }}>
                  <Text style={{color: 'black', fontSize: 20}}>
                    Fuel Burn (lbs):
                  </Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
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
                  <Text style={{color: 'black', fontSize: 20}}>#1:</Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    padding: 5,
                    borderRightWidth: 1,
                  }}>
                  <Text style={{color: 'black', fontSize: 20}}>#2:</Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
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
                  <Text style={{color: 'black', fontSize: 20}}>Start:</Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    padding: 5,
                    borderRightWidth: 1,
                  }}>
                  <Text style={{color: 'black', fontSize: 20}}>Type:</Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    padding: 5,
                  }}>
                  <Text style={{color: 'black', fontSize: 20}}>Mixture:</Text>
                  <TextInput
                    style={{fontSize: 20, backgroundColor: 'rgba(0,0,0,0.1)'}}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
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
