import React, { useState, useEffect } from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    ActivityIndicator,
    View,
    Dimensions
} from 'react-native';

import { SwipeListView } from 'react-native-swipe-list-view';
// import { SERVER_URL } from 'react-native-dotenv';
import Icons from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/functions';
import { SERVER_URL, getDomain } from '../constants/env';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
const { width, height } = Dimensions.get('window');

const HeadingTextSize = width / 15;
const labelTextSize = width / 25;
export default function RiskList({ navigation }) {
    const [callLoad, setcallLoad] = useState(false);
    const [listData, setListData] = useState([]);
    const [RiskList, setRiskList] = useState([]);
    useEffect(() => {
        setcallLoad(true);
        var domain = getDomain();
        var myHeaders = new Headers();
        myHeaders.append('Accept', 'application/json');
        myHeaders.append("Content-Type", "application/json");
        console.log(`${domain}/GetRiskManagement?_token=F156B542-0C91-437C-AD89-822B9F35E8F8`)
        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
        fetch(
            `${domain}/GetRiskManagement?_token=F156B542-0C91-437C-AD89-822B9F35E8F8`,
            requestOptions,
        )
            .then(response => response.text())
            .then(result => {
                setcallLoad(false);
                try {
                    var packet = JSON.parse(result);
                    console.log(result);
                    if (packet) {
                        setRiskList(packet);
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
    }, []);


    const addRisk = () => {
        navigation.navigate('Risk', { FR_DATA: {} });
    };

    const getColor = val => {
        // return '#000';
        switch (val) {
            case 'Departure':
                return 'green';
            case 'Arrival':
                return 'orange';
            case 'Full Ground Handling':
                return '#000';
        }
    };
    const getScoreStatus = (score) => {
        if (score > 35) {
            return ({ title: 'NO-GO', color: 'red' });
        } else if (score >= 21) {
            return ({ title: 'Approval Required', color: 'orange' });
        } else if (score >= 11) {
            return ({ title: 'Good to go with mitigation', color: 'black' });
        } else if (score >= 0) {
            return ({ title: 'Good to go', color: 'green' });
        }
    }
    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    const renderItem = data => (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate('Risk', {
                    FR_DATA: data.item
                })
            }
            style={[styles.rowFront]}
            underlayColor={'#AAA'}
            activeOpacity={2}>
            <View style={{ flexDirection: 'row' }}>

                <View>
                    <Text style={{ color: 'white', fontSize: 25, marginBottom: 5 }}>
                        {data.item.AIRCRAFT_REGISTRATION}
                    </Text>
                    <Text style={{ fontSize: 15, color: 'white', marginBottom: 5 }}>
                        {data.item.AIRCRAFT_TYPE}
                    </Text>
                    <Text style={{ fontSize: 15, color: 'white', marginBottom: 5 }}>
                        {data.item.FROM_ICAO}{' TO '}
                        {data.item.TO_ICAO}
                    </Text>
                    <Text style={{ fontSize: 20, color: getScoreStatus(data.item.TOTAL_SCORE).color }}>
                        {getScoreStatus(data.item.TOTAL_SCORE).title + '(' + data.item.TOTAL_SCORE + ')'}
                    </Text>
                    <Text style={{ fontSize: 15, color: 'white' }}>
                        {data.item.REC_DATE &&
                            new Date(data.item.REC_DATE).toDateString()}
                    </Text>

                </View>
            </View>
            <Icons color="white" name="chevron-right" size={20} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <TouchableOpacity
                    style={{ marginLeft: 20 }}
                    onPress={() => { navigation.navigate("LogDetails") }}
                >
                    <FontAwesome5Icons name="caret-left" color={'black'} size={40} />
                </TouchableOpacity>

                <Text style={{
                    fontSize: width / 25, fontWeight: 'bold',
                    color: 'black',
                    paddingLeft: 10
                }}> Flight Risk Assessment </Text>
                {callLoad ? (
                    <View style={{ paddingRight: 20 }}>
                        <ActivityIndicator color="green" size={'small'} />
                    </View>
                ) : (
                    <TouchableOpacity onPress={addRisk} style={{ marginRight: 20 }}>
                        <Icons name="plus" color="#6750A4" size={30} />
                    </TouchableOpacity>
                )}
            </View>
            <SwipeListView
                data={RiskList}
                renderItem={renderItem}
                // renderHiddenItem={renderHiddenItem}
                // leftOpenValue={75}
                // rightOpenValue={-75}
                // previewRowKey={'0'}
                // previewOpenValue={-40}
                // previewOpenDelay={2000}
                onRowDidOpen={onRowDidOpen}
                disableLeftSwipe={false}
                disableRightSwipe={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingTop: 20,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        backgroundColor: '#3b7dfc',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        minHeight: 100,
        borderColor: '#000',
        borderRadius: 8,
        margin: 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        shadowColor: '#ccc',
        shadowOpacity: 0.5,
        elevation: 10,
        shadowOffset: { width: 0, height: 3 },
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        margin: 10,
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 8,
    },
    backRightBtn: {
        alignItems: 'flex-end',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 80,
        paddingRight: 17,
    },
    backLeftBtn: {
        alignItems: 'flex-start',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 80,
        paddingLeft: 17,
    },
    backRightBtnLeft: {
        backgroundColor: 'red',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: '#105cd7',
        right: 0,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    backLeftBtnRight: {
        backgroundColor: 'red',
        left: 0,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
});
