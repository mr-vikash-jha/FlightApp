import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import {City} from 'country-state-city';

const API_URL = 'https://api.npoint.io/4829d4ab0e96bfab50e7';

const Search = ({navigation}) => {
  const [flights, setFlights] = useState([]);
  const city = City.getCitiesOfCountry('IN');
  const [arrival, setArrival] = useState('');
  const [departure, setDeparture] = useState('');
  const [clickedArrival, setClickedArrival] = useState(false);
  const [clickedDeparture, setClickedDeparture] = useState(false);
  const [data, setData] = useState(city);
  const [selectedArrival, setSelectedArrival] = useState('');
  const [selectedDeparture, setSelectedDeparture] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const searchRef = useRef();
  const onSearch = search => {
    if (search !== '') {
      let tempData = data.filter(item => {
        return item.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
      });
      setData(tempData);
    } else {
      setData(city);
    }
  };

  const fetchFlights = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      console.log(json);
      setFlights(json.data.result);
    } catch (error) {
      console.error('Error fetching flights: ', error);
    }
  };

  const searchFlight = async () => {
    console.log('Arrival', selectedArrival);
    console.log('Departure', selectedDeparture);

    const filteredFlights = flights.filter(
      item =>
        item.displayData.destination.airport.cityName === selectedArrival &&
        item.displayData.source.airport.cityName === selectedDeparture,
    );

    console.log('Result ', await filteredFlights);
    if (filteredFlights.length !== 0) {
      await setSearchResult(filteredFlights);
      navigation.navigate('HomeScreen', filteredFlights);
    } else {
      Alert.alert('No flight Found');
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          marginLeft: '5%',
          marginTop: 25,
          paddingBottom: 10,
          fontSize: 20,
          fontWeight: 600,
          color: 'black',
        }}>
        Departure
      </Text>
      <TouchableOpacity
        style={{
          width: '90%',
          height: 50,
          borderRadius: 10,
          borderWidth: 0.5,
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 15,
          paddingRight: 15,
        }}
        onPress={() => {
          setClickedDeparture(!clickedDeparture);
        }}>
        <Text style={{fontWeight: '600'}}>
          {selectedDeparture == '' ? 'Select Departure' : selectedDeparture}
        </Text>
        {clickedDeparture ? (
          <Image
            source={require('../../upload.png')}
            style={{width: 20, height: 20}}
          />
        ) : (
          <Image
            source={require('../../dropdown.png')}
            style={{width: 20, height: 20}}
          />
        )}
      </TouchableOpacity>
      {clickedDeparture ? (
        <View
          style={{
            elevation: 5,
            marginTop: 20,
            height: 300,
            alignSelf: 'center',
            width: '90%',
            backgroundColor: '#fff',
            borderRadius: 10,
          }}>
          <TextInput
            placeholder="Search city.."
            value={departure}
            ref={searchRef}
            onChangeText={txt => {
              onSearch(txt);
              setDeparture(txt);
            }}
            style={{
              width: '90%',
              height: 50,
              alignSelf: 'center',
              borderWidth: 0.2,
              borderColor: '#8e8e8e',
              borderRadius: 7,
              marginTop: 20,
              paddingLeft: 20,
            }}
          />

          <FlatList
            data={data}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={{
                    width: '85%',
                    alignSelf: 'center',
                    height: 50,
                    justifyContent: 'center',
                    borderBottomWidth: 0.5,
                    borderColor: '#8e8e8e',
                  }}
                  onPress={() => {
                    setSelectedDeparture(item.name);
                    setClickedDeparture(!clickedDeparture);
                    onSearch('');
                    setDeparture('');
                  }}>
                  <Text style={{fontWeight: '600'}}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : null}

      <Text
        style={{
          marginLeft: '5%',
          marginTop: 25,
          paddingBottom: 10,
          fontSize: 20,
          fontWeight: 600,
          color: 'black',
        }}>
        Arrival
      </Text>
      <TouchableOpacity
        style={{
          width: '90%',
          height: 50,
          borderRadius: 10,
          borderWidth: 0.5,
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 15,
          paddingRight: 15,
        }}
        onPress={() => {
          setClickedArrival(!clickedArrival);
        }}>
        <Text style={{fontWeight: '600'}}>
          {selectedArrival == '' ? 'Select Arrival' : selectedArrival}
        </Text>
        {clickedArrival ? (
          <Image
            source={require('../../upload.png')}
            style={{width: 20, height: 20}}
          />
        ) : (
          <Image
            source={require('../../dropdown.png')}
            style={{width: 20, height: 20}}
          />
        )}
      </TouchableOpacity>
      {clickedArrival ? (
        <View
          style={{
            elevation: 5,
            marginTop: 20,
            height: 300,
            alignSelf: 'center',
            width: '90%',
            backgroundColor: '#fff',
            borderRadius: 10,
          }}>
          <TextInput
            placeholder="Search city.."
            value={arrival}
            ref={searchRef}
            onChangeText={txt => {
              onSearch(txt);
              setArrival(txt);
            }}
            style={{
              width: '90%',
              height: 50,
              alignSelf: 'center',
              borderWidth: 0.2,
              borderColor: '#8e8e8e',
              borderRadius: 7,
              marginTop: 20,
              paddingLeft: 20,
            }}
          />

          <FlatList
            data={data}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={{
                    width: '85%',
                    alignSelf: 'center',
                    height: 50,
                    justifyContent: 'center',
                    borderBottomWidth: 0.5,
                    borderColor: '#8e8e8e',
                  }}
                  onPress={() => {
                    setSelectedArrival(item.name);
                    setClickedArrival(!clickedArrival);
                    onSearch('');
                    setArrival('');
                  }}>
                  <Text style={{fontWeight: '600'}}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : null}
      <View
        style={{
          display: 'flex',
          width: '90%',
          margin: '5%',
        }}>
        <Button title="Search" onPress={searchFlight} />
      </View>
    </View>
  );
};

export default Search;
