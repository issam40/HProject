import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { HalalStore } from '../types';

// Sample halal stores data
const SAMPLE_STORES: HalalStore[] = [
  {
    id: '1',
    name: 'Boucherie Halal Al-Baraka',
    address: '123 Rue de la Paix, Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    type: 'butcher',
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Restaurant Le Cedre',
    address: '45 Avenue des Champs, Paris',
    latitude: 48.8584,
    longitude: 2.2945,
    type: 'restaurant',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Supermarché Al-Nour',
    address: '78 Boulevard Victor Hugo, Paris',
    latitude: 48.8534,
    longitude: 2.3488,
    type: 'grocery',
    rating: 4.2,
  },
  {
    id: '4',
    name: 'Pâtisserie Oriental Délices',
    address: '12 Rue Saint-Denis, Paris',
    latitude: 48.8629,
    longitude: 2.3510,
    type: 'bakery',
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Épicerie Halal Al-Mouna',
    address: '56 Rue de Belleville, Paris',
    latitude: 48.8720,
    longitude: 2.3883,
    type: 'grocery',
    rating: 4.3,
  },
];

const HalalStoreScreen = () => {
  const [stores, setStores] = useState<HalalStore[]>(SAMPLE_STORES);
  const [filteredStores, setFilteredStores] = useState<HalalStore[]>(SAMPLE_STORES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    filterStores();
  }, [searchQuery, selectedType]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const filterStores = () => {
    let filtered = stores;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((store) => store.type === selectedType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (store) =>
          store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStores(filtered);
  };

  const calculateDistance = (store: HalalStore): string => {
    if (!userLocation) return 'N/A';

    const R = 6371; // Earth's radius in km
    const dLat = ((store.latitude - userLocation.latitude) * Math.PI) / 180;
    const dLon = ((store.longitude - userLocation.longitude) * Math.PI) / 180;
    const lat1 = (userLocation.latitude * Math.PI) / 180;
    const lat2 = (store.latitude * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance < 1
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)}km`;
  };

  const getStoreIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'restaurant';
      case 'grocery':
        return 'cart';
      case 'butcher':
        return 'nutrition';
      case 'bakery':
        return 'cafe';
      default:
        return 'storefront';
    }
  };

  const getStoreTypeLabel = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'Restaurant';
      case 'grocery':
        return 'Épicerie';
      case 'butcher':
        return 'Boucherie';
      case 'bakery':
        return 'Pâtisserie';
      default:
        return 'Magasin';
    }
  };

  const openInMaps = (store: HalalStore) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application de cartes')
    );
  };

  const renderStore = ({ item }: { item: HalalStore }) => (
    <TouchableOpacity
      style={styles.storeCard}
      onPress={() => openInMaps(item)}
    >
      <View style={styles.storeIconContainer}>
        <Ionicons
          name={getStoreIcon(item.type) as any}
          size={28}
          color="#1a936f"
        />
      </View>
      <View style={styles.storeInfo}>
        <Text style={styles.storeName}>{item.name}</Text>
        <Text style={styles.storeType}>{getStoreTypeLabel(item.type)}</Text>
        <Text style={styles.storeAddress}>{item.address}</Text>
        <View style={styles.storeFooter}>
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#f39c12" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}
          <Text style={styles.distanceText}>{calculateDistance(item)}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  const typeFilters = [
    { key: 'all', label: 'Tous', icon: 'apps' },
    { key: 'restaurant', label: 'Restaurants', icon: 'restaurant' },
    { key: 'grocery', label: 'Épiceries', icon: 'cart' },
    { key: 'butcher', label: 'Boucheries', icon: 'nutrition' },
    { key: 'bakery', label: 'Pâtisseries', icon: 'cafe' },
  ];

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un magasin..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Type Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={typeFilters}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedType === item.key && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedType(item.key)}
            >
              <Ionicons
                name={item.icon as any}
                size={18}
                color={selectedType === item.key ? '#fff' : '#1a936f'}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  selectedType === item.key && styles.filterButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredStores.length} magasin{filteredStores.length > 1 ? 's' : ''}{' '}
          trouvé{filteredStores.length > 1 ? 's' : ''}
        </Text>
      </View>

      {/* Store List */}
      <FlatList
        data={filteredStores}
        renderItem={renderStore}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Aucun magasin trouvé</Text>
            <Text style={styles.emptySubtext}>
              Essayez de modifier vos critères de recherche
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1a936f',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#1a936f',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#1a936f',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  storeCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  storeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e8f5f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  storeType: {
    fontSize: 12,
    color: '#1a936f',
    fontWeight: '600',
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  storeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HalalStoreScreen;
