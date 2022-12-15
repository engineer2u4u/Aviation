import React from "react";
import { ScrollView } from "react-native";
import FlightHeader from "../subcomponents/flightdetails/flightHeader";
import FlightMenu from "../subcomponents/flightdetails/flightmenuOptions";

export default function InitialScreen(props){
    return(
        <ScrollView>
            <FlightHeader flighName="N123AB" departure="20 Aug, 2022" crew={4} passengers={4} />
            <FlightMenu navigation={props.navigation} />
        </ScrollView>
    )
}