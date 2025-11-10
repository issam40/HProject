import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Surah {
  number: number;
  name: string;
  arabicName: string;
  englishName: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
}

const SURAHS: Surah[] = [
  {
    number: 1,
    name: 'Al-Fatihah',
    arabicName: 'الفاتحة',
    englishName: 'The Opening',
    revelationType: 'Meccan',
    numberOfAyahs: 7,
  },
  {
    number: 2,
    name: 'Al-Baqarah',
    arabicName: 'البقرة',
    englishName: 'The Cow',
    revelationType: 'Medinan',
    numberOfAyahs: 286,
  },
  {
    number: 36,
    name: 'Ya-Sin',
    arabicName: 'يس',
    englishName: 'Ya-Sin',
    revelationType: 'Meccan',
    numberOfAyahs: 83,
  },
  {
    number: 55,
    name: 'Ar-Rahman',
    arabicName: 'الرحمن',
    englishName: 'The Most Merciful',
    revelationType: 'Medinan',
    numberOfAyahs: 78,
  },
  {
    number: 67,
    name: 'Al-Mulk',
    arabicName: 'الملك',
    englishName: 'The Sovereignty',
    revelationType: 'Meccan',
    numberOfAyahs: 30,
  },
  {
    number: 112,
    name: 'Al-Ikhlas',
    arabicName: 'الإخلاص',
    englishName: 'The Sincerity',
    revelationType: 'Meccan',
    numberOfAyahs: 4,
  },
  {
    number: 113,
    name: 'Al-Falaq',
    arabicName: 'الفلق',
    englishName: 'The Daybreak',
    revelationType: 'Meccan',
    numberOfAyahs: 5,
  },
  {
    number: 114,
    name: 'An-Nas',
    arabicName: 'الناس',
    englishName: 'Mankind',
    revelationType: 'Meccan',
    numberOfAyahs: 6,
  },
];

const SAMPLE_AYAHS: { [key: number]: string[] } = {
  1: [
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    'الرَّحْمَٰنِ الرَّحِيمِ',
    'مَالِكِ يَوْمِ الدِّينِ',
    'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
  ],
  112: [
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'قُلْ هُوَ اللَّهُ أَحَدٌ',
    'اللَّهُ الصَّمَدُ',
    'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
  ],
  113: [
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
    'مِن شَرِّ مَا خَلَقَ',
    'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
    'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
    'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
  ],
  114: [
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    'مَلِكِ النَّاسِ',
    'إِلَٰهِ النَّاسِ',
    'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
    'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
    'مِنَ الْجِنَّةِ وَالنَّاسِ',
  ],
};

const QuranScreen = () => {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openSurah = (surah: Surah) => {
    setSelectedSurah(surah);
    setModalVisible(true);
  };

  const closeSurah = () => {
    setModalVisible(false);
    setSelectedSurah(null);
  };

  const renderSurah = ({ item }: { item: Surah }) => (
    <TouchableOpacity style={styles.surahCard} onPress={() => openSurah(item)}>
      <View style={styles.surahNumber}>
        <Text style={styles.surahNumberText}>{item.number}</Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={styles.surahName}>{item.name}</Text>
        <Text style={styles.surahDetails}>
          {item.revelationType} • {item.numberOfAyahs} versets
        </Text>
      </View>
      <Text style={styles.surahArabicName}>{item.arabicName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>القرآن الكريم</Text>
        <Text style={styles.headerSubtitle}>Le Saint Coran</Text>
      </View>

      <FlatList
        data={SURAHS}
        renderItem={renderSurah}
        keyExtractor={(item) => item.number.toString()}
        contentContainerStyle={styles.listContainer}
      />

      {/* Surah Reader Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeSurah}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeSurah} style={styles.closeButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalTitle}>{selectedSurah?.arabicName}</Text>
              <Text style={styles.modalSubtitle}>{selectedSurah?.name}</Text>
            </View>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedSurah && SAMPLE_AYAHS[selectedSurah.number] ? (
              <>
                {SAMPLE_AYAHS[selectedSurah.number].map((ayah: string, index: number) => (
                  <View key={index} style={styles.ayahContainer}>
                    <Text style={styles.ayahNumber}>{index + 1}</Text>
                    <Text style={styles.ayahText}>{ayah}</Text>
                  </View>
                ))}
              </>
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name="book-outline" size={64} color="#ccc" />
                <Text style={styles.placeholderText}>
                  Contenu complet disponible prochainement
                </Text>
                <Text style={styles.placeholderSubtext}>
                  Cette sourate contient {selectedSurah?.numberOfAyahs} versets
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a936f',
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  listContainer: {
    padding: 16,
  },
  surahCard: {
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
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a936f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  surahNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  surahDetails: {
    fontSize: 12,
    color: '#666',
  },
  surahArabicName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a936f',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  modalHeader: {
    backgroundColor: '#1a936f',
    padding: 16,
    paddingTop: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
    marginRight: 12,
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  ayahContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ayahNumber: {
    fontSize: 14,
    color: '#1a936f',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ayahText: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: 'right',
    color: '#333',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default QuranScreen;
