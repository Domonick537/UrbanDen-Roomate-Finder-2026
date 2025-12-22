import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, Clock, XCircle, Upload, Camera, Lock } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { getCurrentUser, getVerificationDocuments, addVerificationDocument } from '../../services/storage';
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

  const handleUpload = async () => {
    try {
      setUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const user = await getCurrentUser();
        if (!user) return;

        const newDoc: VerificationDocument = {
          id: `doc_${Date.now()}`,
          userId: user.id,
          type: 'government-id',
          imageUrl: result.assets[0].uri,
          status: 'pending',
          submittedAt: new Date(),
        };

        await addVerificationDocument(newDoc);
        setDocuments([...documents, newDoc]);

        Alert.alert('Success', 'Document submitted successfully! Our team will review it shortly.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document');
    } finally {
      setUploading(false);
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

          <TouchableOpacity
            style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
            onPress={handleUpload}
            disabled={uploading}
          >
            <Upload size={24} color="#4F46E5" />
            <Text style={styles.uploadButtonText}>
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {documents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification History</Text>
          {documents.map(doc => (
            <View key={doc.id} style={styles.documentCard}>
              <View style={styles.documentIcon}>
                <Camera size={24} color="#6B7280" />
              </View>
              <View style={styles.documentContent}>
                <Text style={styles.documentTitle}>Government ID</Text>
                <Text style={styles.documentDate}>
                  Submitted {doc.submittedAt.toLocaleDateString()}
                </Text>
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4F46E5',
    borderStyle: 'dashed',
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
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
