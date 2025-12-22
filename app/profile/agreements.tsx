import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, Plus, CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { getRoommateAgreements, addRoommateAgreement, updateRoommateAgreement, deleteRoommateAgreement } from '../../services/storage';
import { agreementTemplates } from '../../services/mockData';
import { RoommateAgreement } from '../../types';

export default function AgreementsScreen() {
  const router = useRouter();
  const [agreements, setAgreements] = useState<RoommateAgreement[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState<RoommateAgreement | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadAgreements();
  }, []);

  const loadAgreements = async () => {
    const storedAgreements = await getRoommateAgreements();
    const parsedAgreements = storedAgreements.map(a => ({
      ...a,
      createdAt: new Date(a.createdAt),
      updatedAt: new Date(a.updatedAt),
    }));
    setAgreements([...agreementTemplates, ...parsedAgreements.filter(a => !a.isTemplate)]);
  };

  const handleCreate = () => {
    setEditingAgreement(null);
    setTitle('');
    setContent('');
    setModalVisible(true);
  };

  const handleEdit = (agreement: RoommateAgreement) => {
    setEditingAgreement(agreement);
    setTitle(agreement.title);
    setContent(agreement.content);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert('Required', 'Please fill in all fields');
      return;
    }

    if (editingAgreement) {
      await updateRoommateAgreement(editingAgreement.id, { title, content });
    } else {
      const newAgreement: RoommateAgreement = {
        id: `agreement_${Date.now()}`,
        title,
        content,
        isTemplate: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await addRoommateAgreement(newAgreement);
    }

    setModalVisible(false);
    await loadAgreements();
  };

  const handleDelete = (agreement: RoommateAgreement) => {
    if (agreement.isTemplate) return;

    Alert.alert('Delete Agreement', 'Are you sure you want to delete this agreement?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteRoommateAgreement(agreement.id);
          await loadAgreements();
        },
      },
    ]);
  };

  const handleCopyTemplate = async (template: RoommateAgreement) => {
    const newAgreement: RoommateAgreement = {
      id: `agreement_${Date.now()}`,
      title: `${template.title} (Copy)`,
      content: template.content,
      isTemplate: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await addRoommateAgreement(newAgreement);
    await loadAgreements();
    Alert.alert('Success', 'Template copied to your agreements');
  };

  const renderAgreementCard = (agreement: RoommateAgreement) => (
    <View key={agreement.id} style={styles.agreementCard}>
      <View style={styles.agreementIcon}>
        <FileText size={24} color="#4F46E5" />
      </View>
      <View style={styles.agreementContent}>
        <Text style={styles.agreementTitle}>{agreement.title}</Text>
        {agreement.isTemplate && <View style={styles.templateBadge}>
          <Text style={styles.templateBadgeText}>Template</Text>
        </View>}
        {!agreement.isTemplate && (
          <Text style={styles.agreementDate}>
            Updated {agreement.updatedAt.toLocaleDateString()}
          </Text>
        )}
        <Text style={styles.agreementPreview} numberOfLines={2}>
          {agreement.content.substring(0, 100)}...
        </Text>
      </View>
      <View style={styles.agreementActions}>
        {agreement.isTemplate ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCopyTemplate(agreement)}
          >
            <Plus size={20} color="#4F46E5" />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEdit(agreement)}
            >
              <Edit size={20} color="#4F46E5" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDelete(agreement)}
            >
              <Trash2 size={20} color="#EF4444" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  const templates = agreements.filter(a => a.isTemplate);
  const userAgreements = agreements.filter(a => !a.isTemplate);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Roommate Agreements</Text>
          <TouchableOpacity onPress={handleCreate}>
            <Plus size={24} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>
          Create and manage roommate agreements to establish clear expectations and
          responsibilities.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Templates</Text>
          {templates.map(renderAgreementCard)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Agreements</Text>
          {userAgreements.length === 0 ? (
            <View style={styles.emptyState}>
              <FileText size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No agreements yet</Text>
              <Text style={styles.emptySubtitle}>
                Create your first roommate agreement or use a template to get started.
              </Text>
            </View>
          ) : (
            userAgreements.map(renderAgreementCard)
          )}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingAgreement ? 'Edit Agreement' : 'New Agreement'}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Agreement title"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Content</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Agreement content (you can use Markdown formatting)"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={20}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
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
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  agreementCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  agreementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  agreementContent: {
    flex: 1,
  },
  agreementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  templateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  templateBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  agreementDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  agreementPreview: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  agreementActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 300,
    textAlignVertical: 'top',
  },
});
