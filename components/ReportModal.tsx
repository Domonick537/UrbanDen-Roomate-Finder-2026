import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X } from 'lucide-react-native';
import { reportUser, blockUser } from '../services/safety';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  reporterId: string;
  reportedId: string;
  reportedName: string;
  onReported?: () => void;
}

const REPORT_REASONS = [
  'Inappropriate behavior',
  'Fake profile',
  'Harassment',
  'Spam',
  'Safety concern',
  'Other',
];

export default function ReportModal({
  visible,
  onClose,
  reporterId,
  reportedId,
  reportedName,
  onReported,
}: ReportModalProps) {
  const { toast, showToast, hideToast } = useToast();
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [blockToo, setBlockToo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      showToast('Please select a reason', 'error');
      return;
    }

    setLoading(true);

    const success = await reportUser(reporterId, reportedId, selectedReason, description);

    if (success) {
      if (blockToo) {
        await blockUser(reporterId, reportedId);
      }
      showToast('Report submitted successfully', 'success');
      setTimeout(() => {
        onReported?.();
        onClose();
      }, 1500);
    } else {
      showToast('Failed to submit report', 'error');
    }

    setLoading(false);
  };

  const handleClose = () => {
    setSelectedReason('');
    setDescription('');
    setBlockToo(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Report {reportedName}</Text>
          <TouchableOpacity onPress={handleClose} disabled={loading}>
            <X size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.subtitle}>Why are you reporting this user?</Text>

          <View style={styles.reasonsContainer}>
            {REPORT_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[
                  styles.reasonButton,
                  selectedReason === reason && styles.reasonButtonSelected,
                ]}
                onPress={() => setSelectedReason(reason)}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.reasonText,
                    selectedReason === reason && styles.reasonTextSelected,
                  ]}
                >
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Additional Details (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Provide more context about your report..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
          />

          <TouchableOpacity
            style={styles.blockOption}
            onPress={() => setBlockToo(!blockToo)}
            disabled={loading}
          >
            <View style={styles.checkbox}>
              {blockToo && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.blockText}>
              Also block this user from contacting me
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Report</Text>
            )}
          </TouchableOpacity>
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
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  reasonsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  reasonButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  reasonButtonSelected: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  reasonText: {
    fontSize: 16,
    color: '#374151',
  },
  reasonTextSelected: {
    color: '#059669',
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    minHeight: 100,
    marginBottom: 24,
  },
  blockOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  blockText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
