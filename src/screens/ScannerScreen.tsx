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
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrayerTime } from '../types';

const ScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedTimes, setExtractedTimes] = useState<PrayerTime[]>([]);
  const cameraRef = useRef<any>(null);

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

      Alert.alert(
        'Scan réussi!',
        'Les horaires de prière ont été extraits. Voulez-vous les enregistrer?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Enregistrer',
            onPress: () => savePrayerTimes(mockTimes),
          },
        ]
      );
    }, 2000);
  };

  const savePrayerTimes = async (times: PrayerTime[]) => {
    try {
      await AsyncStorage.setItem('prayerTimes', JSON.stringify(times));
      Alert.alert(
        'Succès',
        'Les horaires de prière ont été enregistrés. Consultez l\'onglet Accueil pour les voir.'
      );
      resetScanner();
    } catch (error) {
      console.error('Error saving prayer times:', error);
      Alert.alert('Erreur', 'Impossible d\'enregistrer les horaires');
    }
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
      </View>

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
              onPress={() => savePrayerTimes(extractedTimes)}
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
      </View>
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
