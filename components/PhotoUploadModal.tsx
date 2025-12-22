import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { X, Camera, ImageIcon, Trash2 } from 'lucide-react-native';
import { pickImage, takePhoto, uploadPhoto, deletePhoto, updateProfilePhotos } from '../services/photos';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';

interface PhotoUploadModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  currentPhotos: string[];
  onPhotosUpdated: (photos: string[]) => void;
}

export default function PhotoUploadModal({
  visible,
  onClose,
  userId,
  currentPhotos,
  onPhotosUpdated,
}: PhotoUploadModalProps) {
  const { toast, showToast, hideToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<string[]>(currentPhotos);

  const handlePickImage = async () => {
    if (photos.length >= 6) {
      showToast('Maximum 6 photos allowed', 'error');
      return;
    }

    const uri = await pickImage();
    if (uri) {
      setUploading(true);
      const photoUrl = await uploadPhoto(userId, uri);
      if (photoUrl) {
        const updatedPhotos = [...photos, photoUrl];
        setPhotos(updatedPhotos);
        await updateProfilePhotos(userId, updatedPhotos);
        onPhotosUpdated(updatedPhotos);
        showToast('Photo uploaded successfully', 'success');
      } else {
        showToast('Failed to upload photo', 'error');
      }
      setUploading(false);
    }
  };

  const handleTakePhoto = async () => {
    if (photos.length >= 6) {
      showToast('Maximum 6 photos allowed', 'error');
      return;
    }

    const uri = await takePhoto();
    if (uri) {
      setUploading(true);
      const photoUrl = await uploadPhoto(userId, uri);
      if (photoUrl) {
        const updatedPhotos = [...photos, photoUrl];
        setPhotos(updatedPhotos);
        await updateProfilePhotos(userId, updatedPhotos);
        onPhotosUpdated(updatedPhotos);
        showToast('Photo uploaded successfully', 'success');
      } else {
        showToast('Failed to upload photo', 'error');
      }
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoUrl: string) => {
    setUploading(true);
    const success = await deletePhoto(photoUrl);
    if (success) {
      const updatedPhotos = photos.filter(p => p !== photoUrl);
      setPhotos(updatedPhotos);
      await updateProfilePhotos(userId, updatedPhotos);
      onPhotosUpdated(updatedPhotos);
      showToast('Photo deleted successfully', 'success');
    } else {
      showToast('Failed to delete photo', 'error');
    }
    setUploading(false);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Photos</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.subtitle}>
            Add up to 6 photos to your profile
          </Text>

          <View style={styles.photosGrid}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePhoto(photo)}
                  disabled={uploading}
                >
                  <Trash2 size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {uploading && (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator size="large" color="#059669" />
              <Text style={styles.uploadingText}>Processing...</Text>
            </View>
          )}

          {!uploading && photos.length < 6 && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleTakePhoto}
              >
                <Camera size={24} color="#059669" />
                <Text style={styles.actionText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handlePickImage}
              >
                <ImageIcon size={24} color="#059669" />
                <Text style={styles.actionText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type}
            visible={toast.visible}
            onHide={hideToast}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  photoContainer: {
    width: '31%',
    aspectRatio: 0.8,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    borderRadius: 20,
    padding: 6,
  },
  uploadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  uploadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  actions: {
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
});
