import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CheckBox from '@react-native-community/checkbox';

const Home = props => {
  const data = props.route.params;
  const [flights, setFlights] = useState([]);
  const [airLines, setAirLines] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);

  const API_URL = 'https://api.npoint.io/4829d4ab0e96bfab50e7';

  const getAllAirlineNames = data => {
    const airlineNames = [];
    data.forEach(flight => {
      flight.displayData.airlines.forEach(airline => {
        if (!airlineNames.includes(airline.airlineName)) {
          airlineNames.push(airline.airlineName);
        }
      });
    });
    return airlineNames;
  };

  const filterByAirline = airlineNames => {
    const filteredResults = flights.filter(flight =>
      flight.displayData.airlines.some(airline =>
        airlineNames.includes(airline.airlineName),
      ),
    );

    setFilteredData(filteredResults);
  };

  const fetchFlights = () => {
    setFlights(data);
    setFilteredData(data);
    setAirLines(getAllAirlineNames(data));
  };

  useEffect(() => {
    fetchFlights();
  }, []);

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

  const [selectedAirlines, setSelectedAirlines] = useState([]);

  const handleCheckboxChange = name => {
    setSelectedAirlines(prevState => {
      return {
        ...prevState,
        [name]: !prevState[name],
      };
    });
  };

  const FilterModel = () => {
    const [selectedAirlinesModal, setSelectedAirlinesModal] = useState({});

    useEffect(() => {
      setSelectedAirlinesModal(selectedAirlines);
    }, [modalVisible]);

    const handleApplyFilter = () => {
      const selectedAirlinesList = Object.keys(selectedAirlinesModal).filter(
        name => selectedAirlinesModal[name],
      );

      setModalVisible(false);
      setSelectedAirlines(selectedAirlinesModal);
      filterByAirline(selectedAirlinesList);
    };

    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <View style={styles.centeredView}>
            <View
              style={{
                height: '94%',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <View style={{marginLeft: 20}}>
                <Text style={{fontSize: 16, color: '#000', fontWeight: '600'}}>
                  Select Airlines:
                </Text>

                {airLines.map(name => (
                  <View
                    key={name}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <CheckBox
                      value={selectedAirlinesModal[name]}
                      onValueChange={() =>
                        setSelectedAirlinesModal(prevState => ({
                          ...prevState,
                          [name]: !prevState[name],
                        }))
                      }
                    />
                    <Text style={{color: '#000'}}>{name}</Text>
                  </View>
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '95%',
                  justifyContent: 'space-between',
                  marginHorizontal: 10,
                }}>
                <TouchableOpacity
                  style={{
                    width: '45%',
                    backgroundColor: 'red',
                    paddingVertical: 10,
                    borderRadius: 4,
                  }}
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <Text style={{alignSelf: 'center', color: '#fff'}}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleApplyFilter}
                  style={{
                    width: '45%',
                    backgroundColor: 'blue',
                    paddingVertical: 10,
                    borderRadius: 4,
                  }}>
                  <Text style={{alignSelf: 'center', color: '#fff'}}>
                    Apply Filter
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const handleButtonPress = button => {
    if (selectedButton === button) {
      setSelectedButton(null);
    } else {
      setSelectedButton(button);
    }

    setSortModalVisible(false);
  };

  const SortModel = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={() => {
          setSortModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[
                styles.button,
                selectedButton === 'button1' && styles.selectedButton,
              ]}
              onPress={() => {
                handleButtonPress('button1');
                const sortedLowToHigh = [...filteredData].sort(
                  (a, b) => a.fare - b.fare,
                );
                setFilteredData(sortedLowToHigh);
              }}>
              <Text style={styles.buttonText}>Price-- Low to High</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                selectedButton === 'button2' && styles.selectedButton,
              ]}
              onPress={() => {
                handleButtonPress('button2');

                const sortedHighToLow = [...filteredData].sort(
                  (a, b) => b.fare - a.fare,
                );
                setFilteredData(sortedHighToLow);
              }}>
              <Text style={styles.buttonText}>Price-- High to Low</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setSortModalVisible(false);
            }}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.mainComponent}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          height: 40,
          backgroundColor: '#ccc',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Image
            style={styles.iconImage}
            source={require('../images/filter.png')}
          />
          <Text style={{color: '#000', marginLeft: 5}}>Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => {
            setSortModalVisible(true);
          }}>
          <Image
            style={styles.iconImage}
            source={require('../images/sort.png')}
          />
          <Text style={{color: '#000', marginLeft: 5}}>Sort by</Text>
        </TouchableOpacity>
        <FilterModel />
        <SortModel />
      </View>
      <View style={{width: '100%', marginBottom: '10%'}}>
        <FlatList
          data={filteredData}
          renderItem={renderFlightItem}
          keyExtractor={item => item.id}
          style={styles.flatList}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainComponent: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
  },
  iconImage: {
    height: 20,
    width: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'center',
  },
  flightItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    width: '100%',
  },
  flightInfo: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    height: '100%',
    width: '100%',
  },

  //
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  button: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedButton: {
    backgroundColor: 'lightblue',
  },
  buttonText: {
    textAlign: 'center',
    color: '#000',
  },
  closeButton: {
    backgroundColor: '#fff',
    padding: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'blue',
    fontSize: 16,
  },
});
