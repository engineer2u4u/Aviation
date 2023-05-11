import React from 'react';
import {ScrollView} from 'react-native';
import FlightHeader from '../subcomponents/flightdetails/flightHeader';
import FlightMenu from '../subcomponents/flightdetails/flightmenuOptions';

export default function InitialScreen(props) {
  console.log(props);
  return (
    <ScrollView>
      <FlightHeader
        flighName={props.params.flightName || 'N123AB'}
        departure={new Date(
          props.params.flights.FLIGHT_DEPARTURE_DATE,
        ).toDateString()}
        crew={props.params.flights.FLIGHT_CREW_DEPARTURE}
        passengers={props.params.flights.FLIGHT_PAX_DEPARTURE}
        item={props.params.flights}
      />
      <FlightMenu navigation={props.navigation} uid={props.params.uid} />
    </ScrollView>
  );
}
