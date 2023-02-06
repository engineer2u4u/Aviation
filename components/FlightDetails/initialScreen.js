import React from "react";
import { ScrollView } from "react-native";
import FlightHeader from "../subcomponents/flightdetails/flightHeader";
import FlightMenu from "../subcomponents/flightdetails/flightmenuOptions";

export default function InitialScreen(props){
    console.log("ASD",props.params.flightName);
    return(
        <ScrollView>
            <FlightHeader flighName={props.params.flightName ||"N123AB"} departure="20 Aug, 2022" crew={4} passengers={4} />
            <FlightMenu navigation={props.navigation} uid={props.params.uid} />
        </ScrollView>
    )
}