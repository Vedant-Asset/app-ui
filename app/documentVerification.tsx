import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { STORAGE_KEYS, saveData, getData } from '../utils/storage';

export default function DocumentVerification() {
  const router = useRouter();
  const [panImage, setPanImage] = useState<string | null>(null);
  const [uidFrontImage, setUidFrontImage] = useState<string | null>(null);
  const [uidBackImage, setUidBackImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved images on component mount
  useEffect(() => {
    loadSavedImages();
  }, []);

  const loadSavedImages = async () => {
    try {
      const savedPan = await getData(STORAGE_KEYS.PAN_IMAGE);
      const savedUidFront = await getData(STORAGE_KEYS.UID_FRONT_IMAGE);
      const savedUidBack = await getData(STORAGE_KEYS.UID_BACK_IMAGE);

      if (savedPan) setPanImage(savedPan);
      if (savedUidFront) setUidFrontImage(savedUidFront);
      if (savedUidBack) setUidBackImage(savedUidBack);
    } catch (error) {
      console.error('Error loading saved images:', error);
    }
  };

  const pickImage = async (type: 'pan' | 'uidFront' | 'uidBack') => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        
        try {
          switch (type) {
            case 'pan':
              setPanImage(imageUri);
              await saveData(STORAGE_KEYS.PAN_IMAGE, imageUri);
              break;
            case 'uidFront':
              setUidFrontImage(imageUri);
              await saveData(STORAGE_KEYS.UID_FRONT_IMAGE, imageUri);
              break;
            case 'uidBack':
              setUidBackImage(imageUri);
              await saveData(STORAGE_KEYS.UID_BACK_IMAGE, imageUri);
              break;
          }
        } catch (error) {
          console.error('Error saving image:', error);
          Alert.alert('Error', 'Failed to save image. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!panImage || !uidFrontImage || !uidBackImage) {
      Alert.alert('Error', 'Please upload all required documents');
      return;
    }

    try {
      setIsLoading(true);
      
      // Save verification status
      await saveData(STORAGE_KEYS.DOCUMENTS_VERIFIED, {
        verifiedAt: new Date().toISOString(),
        status: 'completed'
      });

      // Navigate to next screen
      router.push('/additionalDetails');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to proceed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderImageBox = (type: 'pan' | 'uidFront' | 'uidBack', title: string, image: string | null) => (
    <View style={styles.imageBox}>
      <Text style={styles.imageTitle}>{title}</Text>
      <TouchableOpacity 
        style={styles.imageButton}
        onPress={() => pickImage(type)}
        disabled={isLoading}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Tap to capture</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Document Verification</Text>
        
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        <View style={styles.content}>
          {renderImageBox('pan', 'PAN Card', panImage)}
          {renderImageBox('uidFront', 'Aadhaar Front', uidFrontImage)}
          {renderImageBox('uidBack', 'Aadhaar Back', uidBackImage)}

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!panImage || !uidFrontImage || !uidBackImage) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!panImage || !uidFrontImage || !uidBackImage || isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Processing...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    gap: 20,
  },
  imageBox: {
    marginBottom: 20,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  imageButton: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
