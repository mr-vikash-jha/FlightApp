import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native';

const API_URL = 'https://api.npoint.io/4829d4ab0e96bfab50e7';

export default function App() {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [airlineFilter, setAirlineFilter] = useState('');
  const [sortBy, setSortBy] = useState('price');

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      setFlights(json.data.result);
      setFilteredFlights(json.data.result);
    } catch (error) {
      console.error('Error fetching flights: ', error);
    }
  };
  const applyFiltersAndSort = () => {
    let filtered = flights;

    // Filter by departure and arrival destinations
    if (departure.trim() && arrival.trim()) {
      filtered = filtered.filter(
        flight =>
          flight.displayData.source.airport.cityName
            .toLowerCase()
            .includes(departure.trim().toLowerCase()) &&
          flight.displayData.destination.airport.cityName
            .toLowerCase()
            .includes(arrival.trim().toLowerCase()),
      );
    }

    // Apply airline filter if it's set
    if (airlineFilter.trim()) {
      filtered = filtered.filter(flight => {
        const airlines = flight.displayData.airlines.map(
          airline => airline.airlineName,
        );
        return airlines.some(airline =>
          airline.toLowerCase().includes(airlineFilter.trim().toLowerCase()),
        );
      });
    }

    // Sort the filtered flights
    filtered.sort((a, b) => {
      if (sortBy === 'price') {
        return a.fare - b.fare;
      } else {
        // Add more sorting options if needed
        return 0;
      }
    });

    setFilteredFlights([...filtered]);
  };

  const renderFlightItem = ({item}) => (
    <TouchableOpacity style={styles.flightItem}>
      <Text style={styles.flightInfo}>
        Departure: {item.displayData.source.airport.cityName}
      </Text>
      <Text style={styles.flightInfo}>
        Destination: {item.displayData.destination.airport.cityName}
      </Text>
      <Text style={styles.flightInfo}>
        Airline: {item.displayData.airlines[0].airlineName}
      </Text>
      <Text style={styles.flightInfo}>Price: {item.fare}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>JetSetGo - Flight Search</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Departure"
          value={departure}
          onChangeText={text => setDeparture(text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Arrival"
          value={arrival}
          onChangeText={text => setArrival(text)}
        />
        <Button title="Search" onPress={applyFiltersAndSort} />
      </View>

      <View style={styles.filterContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Filter by Airline"
          value={airlineFilter}
          onChangeText={text => setAirlineFilter(text)}
        />
        <Button title="Apply Filters" onPress={applyFiltersAndSort} />
      </View>

      <View style={styles.sortByContainer}>
        <Text>Sort By: </Text>
        <Button title="Price" onPress={() => setSortBy('price')} />
      </View>

      <FlatList
        data={filteredFlights}
        renderItem={renderFlightItem}
        keyExtractor={item => item.id}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sortByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  flatList: {
    width: '100%',
  },
  flightItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: '100%',
  },
  flightInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
});
