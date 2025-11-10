import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList } from '../types';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ScannerScreen from '../screens/ScannerScreen';
import QiblaScreen from '../screens/QiblaScreen';
import QuranScreen from '../screens/QuranScreen';
import HalalStoreScreen from '../screens/HalalStoreScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Scanner') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Qibla') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Quran') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'HalalStores') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1a936f',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#1a936f',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Horaires de Prière' }}
      />
      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{ title: 'Scanner' }}
      />
      <Tab.Screen
        name="Qibla"
        component={QiblaScreen}
        options={{ title: 'Qibla' }}
      />
      <Tab.Screen
        name="Quran"
        component={QuranScreen}
        options={{ title: 'Coran' }}
      />
      <Tab.Screen
        name="HalalStores"
        component={HalalStoreScreen}
        options={{ title: 'Magasins Halal' }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
