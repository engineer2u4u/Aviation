import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Dimensions,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimeInput from './subcomponents/Forms/universal/datetimeinput';
import LabelledInput from './subcomponents/Forms/universal/labelledinput';
import { firebase } from '@react-native-firebase/functions';
import Header from './subcomponents/Forms/Header';
import auth from '@react-native-firebase/auth';
const { width, height } = Dimensions.get('window');
import { SERVER_URL, getDomain } from './constants/env';

const HeadingTextSize = width / 15;
const labelTextSize = width / 25;
const AircraftDetails = props => {
    const UID = props.route.params ? props.route.params.UID : null;
    console.log(UID);
    const [mode, setMode] = useState('time');

    const [hasUnsavedChanges, sethasUnsavedChanges] = useState(false);
    const [callLoad, setcallLoad] = useState(false);
    const [aircraftData, setaircraftData] = useState({ "AIRCRAFT_ENGINES": null, "AIRCRAFT_ENGINE_MODELS": "", "AIRCRAFT_FUSELAGE_LENGTH": null, "AIRCRAFT_HOMEBASE": "", "AIRCRAFT_ICAO": "", "AIRCRAFT_MAX_CONFIGURATION": null, "AIRCRAFT_MAX_OPERATION_MACHNO": null, "AIRCRAFT_MAX_RANGE": null, "AIRCRAFT_MAX_TAKE_OFF_WEIGHT": null, "AIRCRAFT_MODEL": "", "AIRCRAFT_OPERATOR_ADDRESS": "", "AIRCRAFT_OWNER": "", "AIRCRAFT_PHONE": "", "AIRCRAFT_REGISTRATION": "", "AIRCRAFT_SEAT": null, "AIRCRAFT_TAIL_HEIGHT": null, "AIRCRAFT_TYPE": "", "AIRCRAFT_TYPICAL_CONFIGURATION": null, "AIRCRAFT_WINGSPAN": null, "CREATED_BY": "", "STATUS": 1, "UPDATED_BY": "" });

    useEffect(
        () =>
            props.navigation.addListener('beforeRemove', e => {
                if (!hasUnsavedChanges) {
                    // If we don't have unsaved changes, then we don't need to do anything
                    return;
                }

                // Prevent default behavior of leaving the screen
                e.preventDefault();

                // Prompt the user before leaving the screen
                Alert.alert(
                    'Discard changes?',
                    'You have unsaved changes. Are you sure to discard them and leave the screen?',
                    [
                        { text: "Don't leave", style: 'cancel', onPress: () => { } },
                        {
                            text: 'Discard',
                            style: 'destructive',
                            // If the user confirmed, then we dispatch the action we blocked earlier
                            // This will continue the action that had triggered the removal of the screen
                            onPress: () => props.navigation.dispatch(e.data.action),
                        },
                    ],
                );
            }),
        [props.navigation, hasUnsavedChanges],
    );

    useEffect(() => {
        var domain = getDomain();
        if (UID) {
            console.log(UID, "found");

            setcallLoad(true);
            var myHeaders = new Headers();
            myHeaders.append('Accept', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
            };

            fetch(
                `${domain}/GetAviationAirCraftById?_token=A3EF9E63-4962-43A6-9FD3-E99625C2747B&_opco=&_uid=${UID}` +
                UID,
                requestOptions,
            )
                .then(response => response.text())
                .then(result => {
                    console.log(result, 'aircraft');
                    setaircraftData(JSON.parse(result)[0]);
                    setcallLoad(false);

                })
                .catch(error => { setcallLoad(false); console.log('error', error) });
        } else {
            //   setcallLoad(true);
            console.log(UID, "sdfd");
        }
    }, []);
    const sendForm = () => {
        setcallLoad(true);
        var domain = getDomain();
        const email = auth().currentUser.email;
        var send = aircraftData;
        send.UPDATED_BY = email;
        console.log(send);
        if (UID) {
            var myHeaders = new Headers();
            myHeaders.append('Accept', 'application/json');
            myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(send)
            };
            fetch(
                `${domain}/UpdateAviationAirCraft`,
                requestOptions,
            )
                .then(response => response.text())
                .then(result => {
                    setcallLoad(false);
                    Alert.alert('Success', 'Record updated');
                    sethasUnsavedChanges(false);
                    console.log(result);
                    // props.navigation.navigate("Home");
                })
                .catch(error => {
                    setcallLoad(false);
                    Alert.alert('Error in updating');
                    console.log(error, 'Function error');
                });
        }
        else {
            var myHeaders = new Headers();
            myHeaders.append('Accept', 'application/json');
            myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(send)
            };
            fetch(
                `${domain}/PostAviationAirCraft`,
                requestOptions,
            )
                .then(response => response.text())
                .then(result => {
                    setcallLoad(false);
                    Alert.alert('Success', 'Aircraft created');
                    sethasUnsavedChanges(false);
                    // props.navigation.navigate("Home");
                    console.log(result);
                })
                .catch(error => {
                    setcallLoad(false);
                    Alert.alert('Error in updating');
                    console.log(error, 'Function error');
                });
        }

    };

    return (
        <View>
            <Header
                headingSize={HeadingTextSize}
                heading={UID ? 'Edit Aircraft' : 'Create Aircraft'}
                sendForm={sendForm}
                nav={'Aircrafts'}
                navigation={props.navigation}
                Icon={
                    callLoad ? (
                        <ActivityIndicator size={'small'} color="green" />
                    ) : (
                        <Icons name="content-save" color={'green'} size={30} />
                    )
                }
            />

            <ScrollView>
                {aircraftData && <View
                    style={{
                        paddingHorizontal: 20,
                        paddingBottom: 100,
                    }}>
                    <LabelledInput
                        label={'Registration'} //mark
                        datatype={'text'}
                        data={aircraftData.AIRCRAFT_REGISTRATION}
                        disabled={false}
                        setText={(index, text, type, section) => {
                            sethasUnsavedChanges(true);
                            setaircraftData({ ...aircraftData, AIRCRAFT_REGISTRATION: text });
                        }}
                        multiline={false}
                        numberOfLines={1}
                    />
                    <LabelledInput
                        label={'Type'} //mark
                        datatype={'text'}
                        data={aircraftData.AIRCRAFT_TYPE}
                        disabled={false}
                        setText={(index, text, type, section) => {
                            sethasUnsavedChanges(true);
                            setaircraftData({ ...aircraftData, AIRCRAFT_TYPE: text });
                        }}
                        multiline={false}
                        numberOfLines={1}
                    />
                    <LabelledInput
                        label={'Home Base'} //mark
                        datatype={'text'}
                        data={aircraftData.AIRCRAFT_HOMEBASE}
                        disabled={false}
                        setText={(index, text, type, section) => {
                            sethasUnsavedChanges(true);
                            setaircraftData({ ...aircraftData, AIRCRAFT_HOMEBASE: text });
                        }}
                        multiline={false}
                        numberOfLines={1}
                    />
                    <LabelledInput
                        label={'ICAO CODE'} //mark
                        datatype={'text'}
                        data={aircraftData.AIRCRAFT_ICAO}
                        disabled={false}
                        setText={(index, text, type, section) => {
                            sethasUnsavedChanges(true);
                            setaircraftData({ ...aircraftData, AIRCRAFT_ICAO: text });
                        }}
                        multiline={false}
                        numberOfLines={1}
                    />
                    <LabelledInput
                        label={'Operator'} //mark
                        datatype={'text'}
                        data={aircraftData.AIRCRAFT_OWNER}
                        disabled={false}
                        setText={(index, text, type, section) => {
                            sethasUnsavedChanges(true);
                            setaircraftData({ ...aircraftData, AIRCRAFT_OWNER: text });
                        }}
                        multiline={false}
                        numberOfLines={1}
                    />
                    <LabelledInput
                        label={'Phone / Fax No.'} //mark
                        datatype={'text'}
                        data={aircraftData.AIRCRAFT_PHONE}
                        disabled={false}
                        setText={(index, text, type, section) => {
                            sethasUnsavedChanges(true);
                            setaircraftData({ ...aircraftData, AIRCRAFT_PHONE: text });
                        }}
                        multiline={false}
                        numberOfLines={1}
                    />
                    <LabelledInput
                        label={'Operator Address'} //mark
                        datatype={'text'}
                        data={aircraftData.AIRCRAFT_OPERATOR_ADDRESS}
                        disabled={false}
                        setText={(index, text, type, section) => {
                            sethasUnsavedChanges(true);
                            setaircraftData({ ...aircraftData, AIRCRAFT_OPERATOR_ADDRESS: text });
                        }}
                        multiline={true}
                        numberOfLines={3}
                    />
                    <LabelledInput
                        label={'Seat Pax'} //mark
                        datatype={'text'}
                        data={aircraftData.AIRCRAFT_SEAT}
                        disabled={false}
                        setText={(index, text, type, section) => {
                            sethasUnsavedChanges(true);
                            setaircraftData({ ...aircraftData, AIRCRAFT_SEAT: text });
                        }}
                        multiline={false}
                        numberOfLines={1}
                    /><LabelledInput
                        label={'MTOW'} //mark
                        datatype={'text'}
                        data={aircraftData.AIRCRAFT_MAX_TAKE_OFF_WEIGHT}
                        disabled={false}
                        setText={(index, text, type, section) => {
                            sethasUnsavedChanges(true);
                            setaircraftData({ ...aircraftData, AIRCRAFT_MAX_TAKE_OFF_WEIGHT: text });
                        }}
                        multiline={false}
                        numberOfLines={1}
                    />
                </View>}
            </ScrollView>
        </View>
    );
};
const styleSheet = StyleSheet.create({
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 10,
        textAlignVertical: 'top',
        color: 'black',
        backgroundColor: 'white',
        marginBottom: 20,
        fontSize: 20,
        padding: 10,
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
export default AircraftDetails;
