// FlightResultsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

export default function FlightResultsScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [sortOption, setSortOption] = useState('price');

  // Function to fetch flight data using Axios
  const fetchFlights = async () => {
    try {
      const response = await axios.get('https://api.npoint.io/4829d4ab0e96bfab50e7');
      const data = response.data.result;
      setFlights(data);
      setFilteredFlights(data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  // Function to handle search
  const handleSearch = text => {
    setSearch(text);
    const filteredData = flights.filter(flight =>
      flight.displayData.source.airport.cityName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFlights(filteredData);
  };

  // Function to handle sorting
  const handleSort = option => {
    setSortOption(option);
    const sortedData = [...filteredFlights].sort((a, b) => {
      if (option === 'price') {
        return a.fare - b.fare;
      } else {
        return new Date(a.displayData.source.depTime) - new Date(b.displayData.source.depTime);
      }
    });
    setFilteredFlights(sortedData);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
        placeholder="Search Flights"
        onChangeText={handleSearch}
        value={search}
      />
      <Picker
        selectedValue={sortOption}
        style={{ height: 50, width: '100%', marginBottom: 10 }}
        onValueChange={(itemValue) => handleSort(itemValue)}>
        <Picker.Item label="Sort by Price" value="price" />
        <Picker.Item label="Sort by Departure Time" value="time" />
      </Picker>
      <FlatList
        data={filteredFlights}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('FlightDetails', { flight: item })}>
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
              <Text>{item.displayData.source.airport.cityName} to {item.displayData.destination.airport.cityName}</Text>
              <Text>Fare: {item.fare}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}
