import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';

const { width } = Dimensions.get('window');
const MECCA_LATITUDE = 21.4225;
const MECCA_LONGITUDE = 39.8262;

const QiblaScreen = () => {
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [magnetometerHeading, setMagnetometerHeading] = useState<number>(0);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    getLocationAndCalculateQibla();
    subscribeMagnetometer();

    return () => {
      Magnetometer.removeAllListeners();
    };
  }, []);

  const getLocationAndCalculateQibla = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission de localisation refusée');
        setIsLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const userLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(userLocation);

      // Calculate Qibla direction
      const direction = calculateQiblaDirection(
        userLocation.latitude,
        userLocation.longitude
      );
      setQiblaDirection(direction);
      setIsLoading(false);
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Impossible d\'obtenir votre position');
      setIsLoading(false);
    }
  };

  const subscribeMagnetometer = () => {
    Magnetometer.setUpdateInterval(100);

    Magnetometer.addListener((data) => {
      let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      angle = angle >= 0 ? angle : 360 + angle;
      setMagnetometerHeading(angle);
    });
  };

  const calculateQiblaDirection = (
    latitude: number,
    longitude: number
  ): number => {
    // Convert to radians
    const lat1 = (latitude * Math.PI) / 180;
    const lon1 = (longitude * Math.PI) / 180;
    const lat2 = (MECCA_LATITUDE * Math.PI) / 180;
    const lon2 = (MECCA_LONGITUDE * Math.PI) / 180;

    // Calculate Qibla direction
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    bearing = (bearing + 360) % 360;

    return bearing;
  };

  const getDistance = (): string => {
    if (!location) return '0 km';

    const R = 6371; // Earth's radius in km
    const lat1 = (location.latitude * Math.PI) / 180;
    const lat2 = (MECCA_LATITUDE * Math.PI) / 180;
    const dLat = ((MECCA_LATITUDE - location.latitude) * Math.PI) / 180;
    const dLon = ((MECCA_LONGITUDE - location.longitude) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return `${Math.round(distance).toLocaleString()} km`;
  };

  // Calculate rotation for the compass needle
  const compassRotation = (qiblaDirection - magnetometerHeading + 360) % 360;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1a936f" />
        <Text style={styles.loadingText}>Calcul de la direction de la Qibla...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>
          Veuillez activer la localisation et réessayer
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.infoCard}>
          <Ionicons name="navigate" size={24} color="#1a936f" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Direction</Text>
            <Text style={styles.infoValue}>{Math.round(qiblaDirection)}°</Text>
          </View>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="location" size={24} color="#1a936f" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Distance de la Mecque</Text>
            <Text style={styles.infoValue}>{getDistance()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.compassContainer}>
        <View style={styles.compass}>
          {/* Compass background */}
          <View style={styles.compassCircle}>
            <Text style={[styles.compassMark, styles.northMark]}>N</Text>
            <Text style={[styles.compassMark, styles.eastMark]}>E</Text>
            <Text style={[styles.compassMark, styles.southMark]}>S</Text>
            <Text style={[styles.compassMark, styles.westMark]}>O</Text>

            {/* Qibla needle */}
            <View
              style={[
                styles.needle,
                {
                  transform: [{ rotate: `${compassRotation}deg` }],
                },
              ]}
            >
              <View style={styles.needleTop} />
              <View style={styles.needleBottom} />
            </View>

            {/* Center dot */}
            <View style={styles.centerDot} />
          </View>

          {/* Kaaba icon */}
          <View
            style={[
              styles.kaabaIcon,
              {
                transform: [{ rotate: `${compassRotation}deg` }],
              },
            ]}
          >
            <View style={styles.kaaba}>
              <View style={styles.kaabaTop} />
              <View style={styles.kaabaBody} />
            </View>
          </View>
        </View>

        <Text style={styles.instruction}>
          Alignez la flèche verte avec le nord pour trouver la direction de la Qibla
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusIndicator}>
          <View
            style={[
              styles.statusDot,
              Math.abs(compassRotation) < 10 && styles.statusDotActive,
            ]}
          />
          <Text style={styles.statusText}>
            {Math.abs(compassRotation) < 10
              ? 'Direction correcte!'
              : 'Tournez votre appareil'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  errorSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    padding: 16,
    gap: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  compassContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  compass: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  compassCircle: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#1a936f',
  },
  compassMark: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  northMark: {
    top: 20,
  },
  eastMark: {
    right: 20,
  },
  southMark: {
    bottom: 20,
  },
  westMark: {
    left: 20,
  },
  needle: {
    position: 'absolute',
    width: 8,
    height: width * 0.6,
    alignItems: 'center',
  },
  needleTop: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#1a936f',
  },
  needleBottom: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#e74c3c',
  },
  centerDot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#333',
    zIndex: 10,
  },
  kaabaIcon: {
    position: 'absolute',
  },
  kaaba: {
    alignItems: 'center',
  },
  kaabaTop: {
    width: 30,
    height: 20,
    backgroundColor: '#8B4513',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  kaabaBody: {
    width: 40,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  instruction: {
    marginTop: 24,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statusContainer: {
    padding: 20,
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  statusDotActive: {
    backgroundColor: '#1a936f',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default QiblaScreen;
