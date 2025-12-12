import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrayerTime, PrayerTimesDatabase } from '../types';

const ScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedTimes, setExtractedTimes] = useState<PrayerTime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showDateModal, setShowDateModal] = useState(false);
  const cameraRef = useRef<any>(null);

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get today's date by default
  const getTodayDate = (): string => {
    return formatDate(new Date());
  };

  const requestCameraPermission = async () => {
    const { status } = await requestPermission();
    if (status === 'granted') {
      setShowCamera(true);
    } else {
      Alert.alert(
        'Permission refusée',
        'Veuillez autoriser l\'accès à la caméra pour scanner le calendrier.'
      );
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
        setShowCamera(false);
        processImage(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Erreur', 'Impossible de prendre la photo');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        // For PDF, we don't show preview but go straight to processing
        processPDF(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking PDF:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner le PDF');
    }
  };

  const processPDF = async (pdfUri: string) => {
    setIsProcessing(true);
    setCapturedImage(null); // No image preview for PDF

    // Simulate OCR processing for PDF
    // In a real app, you would use PDF.js + OCR or a PDF OCR service
    setTimeout(() => {
      // Mock extracted prayer times for whole month
      const mockTimes: PrayerTime[] = [
        { name: 'Fajr', time: '05:30', arabicName: 'الفجر' },
        { name: 'Dhuhr', time: '13:45', arabicName: 'الظهر' },
        { name: 'Asr', time: '16:30', arabicName: 'العصر' },
        { name: 'Maghrib', time: '19:15', arabicName: 'المغرب' },
        { name: 'Isha', time: '21:00', arabicName: 'العشاء' },
      ];

      setExtractedTimes(mockTimes);
      setIsProcessing(false);

      // Show date selection modal
      setSelectedDate(getTodayDate());
      setShowDateModal(true);
    }, 2000);
  };

  const processImage = async (imageUri: string) => {
    setIsProcessing(true);

    // Simulate OCR processing
    // In a real app, you would use Google Cloud Vision API, Tesseract, or similar
    setTimeout(() => {
      // Mock extracted prayer times
      const mockTimes: PrayerTime[] = [
        { name: 'Fajr', time: '05:30', arabicName: 'الفجر' },
        { name: 'Dhuhr', time: '13:45', arabicName: 'الظهر' },
        { name: 'Asr', time: '16:30', arabicName: 'العصر' },
        { name: 'Maghrib', time: '19:15', arabicName: 'المغرب' },
        { name: 'Isha', time: '21:00', arabicName: 'العشاء' },
      ];

      setExtractedTimes(mockTimes);
      setIsProcessing(false);

      // Show date selection modal
      setSelectedDate(getTodayDate());
      setShowDateModal(true);
    }, 2000);
  };

  const savePrayerTimes = async (times: PrayerTime[], date: string) => {
    try {
      // Load existing database
      const existingData = await AsyncStorage.getItem('prayerTimesDatabase');
      let database: PrayerTimesDatabase = existingData
        ? JSON.parse(existingData)
        : {};

      // Add or update prayer times for the specified date
      database[date] = times;

      // Save back to storage
      await AsyncStorage.setItem('prayerTimesDatabase', JSON.stringify(database));

      Alert.alert(
        'Succès',
        `Les horaires de prière du ${formatDateDisplay(date)} ont été enregistrés. Consultez l'onglet Accueil pour les voir.`
      );
      setShowDateModal(false);
      resetScanner();
    } catch (error) {
      console.error('Error saving prayer times:', error);
      Alert.alert('Erreur', 'Impossible d\'enregistrer les horaires');
    }
  };

  const formatDateDisplay = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setExtractedTimes([]);
    setIsProcessing(false);
  };

  if (showCamera) {
    return (
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.scanFrame} />
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCamera(false)}
              >
                <Ionicons name="close" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              <View style={styles.placeholder} />
            </View>
          </View>
        </CameraView>
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Positionnez le calendrier dans le cadre
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="scan" size={64} color="#1a936f" />
        <Text style={styles.title}>Scanner le Calendrier</Text>
        <Text style={styles.subtitle}>
          Prenez une photo de votre calendrier de prières pour extraire automatiquement
          les horaires
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={requestCameraPermission}
        >
          <Ionicons name="camera" size={32} color="#fff" />
          <Text style={styles.actionButtonText}>Prendre une photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
          <Ionicons name="images" size={32} color="#fff" />
          <Text style={styles.actionButtonText}>Choisir une image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButtonAlt} onPress={pickPDF}>
          <Ionicons name="document-text" size={32} color="#1a936f" />
          <Text style={styles.actionButtonTextAlt}>Choisir un PDF</Text>
        </TouchableOpacity>
      </View>

      {isProcessing && !capturedImage && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#1a936f" />
          <Text style={styles.processingText}>
            Extraction des horaires du PDF en cours...
          </Text>
        </View>
      )}

      {capturedImage && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Image capturée</Text>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color="#1a936f" />
              <Text style={styles.processingText}>
                Extraction des horaires en cours...
              </Text>
            </View>
          )}
        </View>
      )}

      {extractedTimes.length > 0 && !isProcessing && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Horaires extraits</Text>
          {extractedTimes.map((prayer) => (
            <View key={prayer.name} style={styles.resultRow}>
              <Text style={styles.resultArabic}>{prayer.arabicName}</Text>
              <Text style={styles.resultName}>{prayer.name}</Text>
              <Text style={styles.resultTime}>{prayer.time}</Text>
            </View>
          ))}
          <View style={styles.resultActions}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setSelectedDate(getTodayDate());
                setShowDateModal(true);
              }}
            >
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.retryButton} onPress={resetScanner}>
              <Ionicons name="refresh" size={24} color="#1a936f" />
              <Text style={styles.retryButtonText}>Recommencer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Conseils pour un meilleur scan</Text>
        <View style={styles.tip}>
          <Ionicons name="sunny" size={20} color="#1a936f" />
          <Text style={styles.tipText}>Assurez un bon éclairage</Text>
        </View>
        <View style={styles.tip}>
          <Ionicons name="expand" size={20} color="#1a936f" />
          <Text style={styles.tipText}>Cadrez tout le calendrier</Text>
        </View>
        <View style={styles.tip}>
          <Ionicons name="hand-left" size={20} color="#1a936f" />
          <Text style={styles.tipText}>Maintenez l'appareil stable</Text>
        </View>
        <View style={styles.tip}>
          <Ionicons name="document-text" size={20} color="#1a936f" />
          <Text style={styles.tipText}>Vous pouvez aussi scanner un PDF de calendrier</Text>
        </View>
      </View>

      {/* Date Selection Modal */}
      <Modal
        visible={showDateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionnez la date</Text>
            <Text style={styles.modalSubtitle}>
              Pour quelle date sont ces horaires de prière ?
            </Text>

            <View style={styles.dateInputContainer}>
              <Ionicons name="calendar" size={24} color="#1a936f" />
              <TextInput
                style={styles.dateInput}
                value={selectedDate}
                onChangeText={setSelectedDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.quickDateButtons}>
              <TouchableOpacity
                style={styles.quickDateButton}
                onPress={() => setSelectedDate(getTodayDate())}
              >
                <Text style={styles.quickDateButtonText}>Aujourd'hui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickDateButton}
                onPress={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setSelectedDate(formatDate(tomorrow));
                }}
              >
                <Text style={styles.quickDateButtonText}>Demain</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowDateModal(false)}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={() => savePrayerTimes(extractedTimes, selectedDate)}
              >
                <Text style={styles.modalSaveText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#1a936f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  actionButtonAlt: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: '#1a936f',
  },
  actionButtonTextAlt: {
    color: '#1a936f',
    fontSize: 18,
    fontWeight: '600',
  },
  processingContainer: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  quickDateButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickDateButton: {
    flex: 1,
    backgroundColor: '#e8f5f1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickDateButtonText: {
    color: '#1a936f',
    fontSize: 14,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#1a936f',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  scanFrame: {
    flex: 1,
    margin: 40,
    marginTop: 100,
    marginBottom: 200,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
  },
  cancelButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1a936f',
  },
  placeholder: {
    width: 60,
  },
  instructionContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  previewContainer: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  processingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
  resultsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultArabic: {
    fontSize: 16,
    color: '#1a936f',
    fontWeight: '600',
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  resultTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#1a936f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#1a936f',
  },
  retryButtonText: {
    color: '#1a936f',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
  },
});

export default ScannerScreen;
