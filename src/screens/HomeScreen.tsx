import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyPrayerTimes, PrayerTime } from '../types';

const HomeScreen = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [location, setLocation] = useState<string>('Paris, France');
  const [refreshing, setRefreshing] = useState(false);
  const [nextPrayer, setNextPrayer] = useState<string>('');

  useEffect(() => {
    loadPrayerTimes();
    getLocation();
  }, []);

  // Update next prayer whenever prayerTimes changes or every minute
  useEffect(() => {
    if (prayerTimes.length > 0) {
      updateNextPrayer();
      const interval = setInterval(() => {
        updateNextPrayer();
      }, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [prayerTimes]);

  const loadPrayerTimes = async () => {
    try {
      // Try to load from storage first (from scanner)
      const storedTimes = await AsyncStorage.getItem('prayerTimes');
      if (storedTimes) {
        const times = JSON.parse(storedTimes);
        setPrayerTimes(times);
        // updateNextPrayer will be called automatically by useEffect when prayerTimes updates
      } else {
        // Default prayer times (example for Paris)
        setDefaultPrayerTimes();
      }
    } catch (error) {
      console.error('Error loading prayer times:', error);
      setDefaultPrayerTimes();
    }
  };

  const setDefaultPrayerTimes = () => {
    const defaultTimes: PrayerTime[] = [
      { name: 'Fajr', time: '05:30', arabicName: 'الفجر' },
      { name: 'Dhuhr', time: '13:45', arabicName: 'الظهر' },
      { name: 'Asr', time: '16:30', arabicName: 'العصر' },
      { name: 'Maghrib', time: '19:15', arabicName: 'المغرب' },
      { name: 'Isha', time: '21:00', arabicName: 'العشاء' },
    ];
    setPrayerTimes(defaultTimes);
    // updateNextPrayer will be called automatically by useEffect when prayerTimes updates
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (address[0]) {
        setLocation(`${address[0].city || ''}, ${address[0].country || ''}`);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const updateNextPrayer = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayerTimes) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;

      if (prayerTime > currentTime) {
        setNextPrayer(prayer.name);
        return;
      }
    }
    setNextPrayer('Fajr'); // Next day
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrayerTimes();
    await getLocation();
    setRefreshing(false);
  };

  const getCurrentPrayerIndex = (): number => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (let i = prayerTimes.length - 1; i >= 0; i--) {
      const [hours, minutes] = prayerTimes[i].time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;
      if (currentTime >= prayerTime) {
        return i;
      }
    }
    return -1;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Ionicons name="location" size={20} color="#fff" />
          <Text style={styles.locationText}>{location}</Text>
        </View>
        <Text style={styles.dateText}>
          {currentDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Next Prayer Card */}
      <View style={styles.nextPrayerCard}>
        <Text style={styles.nextPrayerLabel}>Prochaine prière</Text>
        <Text style={styles.nextPrayerName}>{nextPrayer}</Text>
        {prayerTimes.find((p) => p.name === nextPrayer) && (
          <Text style={styles.nextPrayerTime}>
            {prayerTimes.find((p) => p.name === nextPrayer)?.time}
          </Text>
        )}
      </View>

      {/* Prayer Times List */}
      <View style={styles.prayerTimesContainer}>
        <Text style={styles.sectionTitle}>Horaires du jour</Text>
        {prayerTimes.map((prayer, index) => (
          <View
            key={prayer.name}
            style={[
              styles.prayerTimeCard,
              prayer.name === nextPrayer && styles.nextPrayerHighlight,
            ]}
          >
            <View style={styles.prayerInfo}>
              <Text style={styles.prayerArabicName}>{prayer.arabicName}</Text>
              <Text style={styles.prayerName}>{prayer.name}</Text>
              {prayer.name === nextPrayer && (
                <View style={styles.nextBadge}>
                  <Text style={styles.nextBadgeText}>PROCHAIN</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.prayerTime,
                prayer.name === nextPrayer && styles.nextPrayerTimeText,
              ]}
            >
              {prayer.time}
            </Text>
          </View>
        ))}
      </View>

      {/* Info Card */}
      <TouchableOpacity
        style={styles.infoCard}
        onPress={() =>
          Alert.alert(
            'Scanner un calendrier',
            'Utilisez l\'onglet "Scanner" pour prendre une photo de votre calendrier de prières et extraire automatiquement les horaires.'
          )
        }
      >
        <Ionicons name="information-circle" size={24} color="#1a936f" />
        <Text style={styles.infoText}>
          Scannez votre calendrier de prières pour obtenir des horaires précis
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a936f',
    padding: 20,
    paddingTop: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  nextPrayerCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nextPrayerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  nextPrayerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a936f',
    marginBottom: 4,
  },
  nextPrayerTime: {
    fontSize: 24,
    color: '#333',
    fontWeight: '600',
  },
  prayerTimesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  prayerTimeCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nextPrayerHighlight: {
    backgroundColor: '#e8f5f1',
    borderWidth: 2,
    borderColor: '#1a936f',
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerArabicName: {
    fontSize: 18,
    color: '#1a936f',
    marginRight: 12,
    fontWeight: '600',
  },
  prayerName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  nextBadge: {
    backgroundColor: '#1a936f',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  nextBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  prayerTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nextPrayerTimeText: {
    color: '#1a936f',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    color: '#666',
    fontSize: 14,
  },
});

export default HomeScreen;
