import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';

export default function Header({ headingSize, heading, Icon, sendForm, navigation, nav }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{ marginLeft: 20 }}
                onPress={() => navigation.navigate(nav)}
            >
                <FontAwesome5Icons name="caret-left" color={'black'} size={40} />
            </TouchableOpacity>

            <Text style={[{ fontSize: headingSize }, styles.headingText]}> {heading} </Text>
            <TouchableOpacity onPress={sendForm} style={{ marginRight: 20 }}>
                {Icon}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    headingText: {
        fontWeight: 'bold',
        color: 'black',
        paddingLeft: 10
    }
})