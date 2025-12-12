export interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
}

export interface DailyPrayerTimes {
  date: string; // Format: YYYY-MM-DD
  prayers: PrayerTime[];
}

export interface PrayerTimesDatabase {
  [dateKey: string]: PrayerTime[]; // Key: YYYY-MM-DD, Value: array of prayer times
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface HalalStore {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'restaurant' | 'grocery' | 'butcher' | 'bakery';
  rating?: number;
}

export type RootTabParamList = {
  Home: undefined;
  Scanner: undefined;
  Qibla: undefined;
  Quran: undefined;
  HalalStores: undefined;
};
