import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, Clock, XCircle, Upload, Camera, Lock, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { getCurrentUser, getVerificationDocuments, uploadVerificationDocument, addVerificationDocument } from '../../services/storage';
import { VerificationDocument } from '../../types';

export default function VerificationScreen() {
  const router = useRouter();
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    const user = await getCurrentUser();
    if (user) {
      setIsVerified(user.isVerified);
    }

    const docs = await getVerificationDocuments();
    setDocuments(docs);
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera access is needed to take a photo of your ID.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadDocument(result.assets[0].uri, 'photo.jpg');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Photo library access is needed to select an ID photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadDocument(result.assets[0].uri, 'document.jpg');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const uploadDocument = async (uri: string, fileName: string) => {
    try {
      setUploading(true);
      const user = await getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'User not found');
        return;
      }

      const filePath = await uploadVerificationDocument(user.id, uri, fileName);
      if (!filePath) {
        Alert.alert('Error', 'Failed to upload document. Please try again.');
        return;
      }

      await addVerificationDocument(user.id, filePath, 'government-id');

      await loadVerificationStatus();

      Alert.alert(
        'Success!',
        'Your ID has been submitted for verification. Our team will review it within 24-48 hours.'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const showUploadOptions = () => {
    if (Platform.OS === 'web') {
      handlePickImage();
    } else {
      Alert.alert(
        'Upload ID Photo',
        'Choose how you want to submit your government ID',
        [
          {
            text: 'Take Photo',
            onPress: handleTakePhoto,
          },
          {
            text: 'Choose from Library',
            onPress: handlePickImage,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={32} color="#10B981" />;
      case 'rejected':
        return <XCircle size={32} color="#EF4444" />;
      case 'pending':
        return <Clock size={32} color="#F59E0B" />;
      default:
        return <XCircle size={32} color="#9CA3AF" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Verified';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Under Review';
      default:
        return 'Not Verified';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#10B981';
      case 'rejected':
        return '#EF4444';
      case 'pending':
        return '#F59E0B';
      default:
        return '#9CA3AF';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.statusCard}>
        {getStatusIcon(isVerified ? 'approved' : 'default')}
        <Text style={styles.statusTitle}>
          {isVerified ? 'Identity Verified' : 'Identity Not Verified'}
        </Text>
        <Text style={styles.statusSubtitle}>
          {isVerified
            ? 'Your identity has been successfully verified'
            : 'Verify your identity to build trust'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why verify your identity?</Text>
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.benefitText}>Build trust with potential roommates</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.benefitText}>Get priority in search results</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.benefitText}>Access to verified-only features</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.benefitText}>Safer roommate matching experience</Text>
          </View>
        </View>
      </View>

      {!isVerified && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Government ID</Text>
          <Text style={styles.sectionSubtitle}>
            We accept driver's licenses, passports, and state-issued ID cards. Your information is
            kept secure and private.
          </Text>

          <View style={styles.uploadOptions}>
            <TouchableOpacity
              style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
              onPress={showUploadOptions}
              disabled={uploading}
            >
              <Camera size={24} color="#4F46E5" />
              <Text style={styles.uploadButtonText}>
                {uploading ? 'Uploading...' : 'Take Photo or Upload'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {documents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification History</Text>
          {documents.map(doc => (
            <View key={doc.id} style={styles.documentCard}>
              <View style={styles.documentIcon}>
                <ImageIcon size={24} color="#6B7280" />
              </View>
              <View style={styles.documentContent}>
                <Text style={styles.documentTitle}>Government ID</Text>
                <Text style={styles.documentDate}>
                  Submitted {doc.submittedAt.toLocaleDateString()}
                </Text>
                {doc.status === 'rejected' && doc.rejectionReason && (
                  <Text style={styles.rejectionReason}>
                    Reason: {doc.rejectionReason}
                  </Text>
                )}
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(doc.status)}20` }]}>
                <Text style={[styles.statusBadgeText, { color: getStatusColor(doc.status) }]}>
                  {getStatusText(doc.status)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.securityNote}>
        <Lock size={20} color="#10B981" />
        <View style={{ flex: 1 }}>
          <Text style={styles.securityTitle}>🔒 Your Privacy is Protected</Text>
          <Text style={styles.securityText}>
            Your documents are encrypted with bank-level security and never shared with other users.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  uploadOptions: {
    gap: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#4F46E5',
    padding: 20,
    borderRadius: 12,
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  documentContent: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  rejectionReason: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 4,
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#D1FAE5',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 4,
  },
  securityText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 21,
  },
});
