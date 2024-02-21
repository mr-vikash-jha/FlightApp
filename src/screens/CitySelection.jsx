import React, {useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const CitySelection = () => {
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [fromCities, setFromCities] = useState([]);
  const [toCities, setToCities] = useState([]);
  const [selectedFromCity, setSelectedFromCity] = useState('');
  const [selectedToCity, setSelectedToCity] = useState('');

  // Dummy list of cities for demonstration
  const allCities = ['New York', 'Los Angeles', 'London', 'Paris', 'Tokyo'];

  const searchFromCity = text => {
    setFromSearch(text);
    const filteredCities = allCities.filter(city =>
      city.toLowerCase().includes(text.toLowerCase()),
    );
    setFromCities(filteredCities);
  };

  const searchToCity = text => {
    setToSearch(text);
    const filteredCities = allCities.filter(city =>
      city.toLowerCase().includes(text.toLowerCase()),
    );
    setToCities(filteredCities);
  };

  const handleFromCitySelect = city => {
    setSelectedFromCity(city);
    setFromSearch(city);
    setFromCities([]);
  };

  const handleToCitySelect = city => {
    setSelectedToCity(city);
    setToSearch(city);
    setToCities([]);
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="From"
          value={fromSearch}
          onChangeText={searchFromCity}
        />
        <TextInput
          style={styles.input}
          placeholder="To"
          value={toSearch}
          onChangeText={searchToCity}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 50,
          width: '45%',
        }}>
        <FlatList
          data={fromCities}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleFromCitySelect(item)}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={{position: 'absolute', left: '50%', top: 50, width: '45%'}}>
        <FlatList
          data={toCities}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleToCitySelect(item)}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
});

export default CitySelection;
