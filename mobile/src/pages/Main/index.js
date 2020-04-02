import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { 
  View, 
  Text, 
  Image, 
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import MapView, { Marker, Callout } from "react-native-maps";
import { 
  requestPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";

import styles from "./styles";

import api from "../../services/api";
import { connect, disconnect, subscribeToNewDevs } from "../../services/socket";

export default function Main() {
  const [techs, setTechs] = useState('');
  const [devs, setDevs] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      }
    }
    loadInitialPosition();
  }, []);

  useEffect(() => {
    subscribeToNewDevs(dev => setDevs([...devs, dev]));
  }, [devs]);

  function setupWebsocket() {
    disconnect();

    const { latitude, longitude } = currentRegion;

    connect(
      latitude,
      longitude,
      techs,
    );
  };

  async function loadDevs() {
    const { latitude, longitude } = currentRegion;

    const response = await api.get('search', {
      params: {
        latitude,
        longitude,
        techs,
      }
    });

    setDevs(response.data);
    setupWebsocket();
  };

  function handleRegionChange(region) {
    setCurrentRegion(region);
  };

  if (!currentRegion) {
    return null;
  }

  return (
    <>
      <MapView 
        onRegionChangeComplete={handleRegionChange}
        initialRegion={currentRegion} 
        style={styles.map}
      >
        {devs.map(dev => (
        <Marker 
          key={dev._id} 
          coordinate={{
            latitude: dev.location.coordinates[1],
            longitude: dev.location.coordinates[0],
          }}
        >
          <Image 
            style={styles.avatar} 
            source={{ uri: dev.avatar_url }} 
            alt={dev.name}
          />

          <Callout onPress={() => {
            navigation.navigate('Profile', { github_username: dev.github_username });
          }}>
            <View style={styles.callout}>
              <Text styles={styles.devName}>{dev.name}</Text>
              <Text styles={styles.devBio}>{dev.bio}</Text>
              <Text styles={styles.devTechs}>{dev.techs.join(', ')}</Text>
            </View>
          </Callout>
        </Marker>
        ))}
      </MapView>

      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Devs por techs..."
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />

        <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
          <MaterialIcons name="my-location" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
};