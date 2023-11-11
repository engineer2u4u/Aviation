const ScreenMenues = [
  {
    type: 'ALL',
    id: 0,
    name: 'Flight Preparation',
    route: 'FlightPreparation',
    icon: 'airplane-check',
  },

  { type: 'ARRIVAL', id: 1, name: 'Pre Arrival', route: 'PreArrival', icon: 'airplane-landing' },
  {
    type: 'ARRIVAL',
    id: 2,
    name: 'Arrival Service',
    route: 'ArrivalService',
    icon: 'airplane-marker',
  },
  {
    type: 'ALL',
    id: 4,
    name: 'Interim Service',
    route: 'InterimService',
    icon: 'airplane-plus',
  },
  {
    type: 'DEPARTURE',
    id: 5,
    name: 'Pre-Departure Checklist',
    route: 'PreDepartureChecklist',
    icon: 'airplane-edit',
  },

  { type: 'DEPARTURE', id: 6, name: 'Departure', route: 'Departure', icon: 'airplane-takeoff' },
  {
    type: 'DEPARTURE',
    id: 7,
    name: 'Post Departure',
    route: 'PostDeparture',
    icon: 'airplane-clock',
  },
];

export default ScreenMenues;
