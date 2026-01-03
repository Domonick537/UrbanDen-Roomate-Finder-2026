import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  getChecklistWithItems,
  updateChecklistProgress,
  ChecklistTemplateWithItems,
} from '../../services/checklist';
import { getCurrentUserId } from '../../services/storage';
import ChecklistItemComponent from '../../components/ChecklistItemComponent';
import { useToast } from '../../hooks/useToast';

export default function ChecklistDetailScreen() {
  const router = useRouter();
  const { id, matchId } = useLocalSearchParams();
  const { showToast } = useToast();
  const [checklist, setChecklist] = useState<ChecklistTemplateWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadChecklist();
  }, [id, matchId]);

  const loadChecklist = async () => {
    try {
      const currentUserId = await getCurrentUserId();
      setUserId(currentUserId);

      if (currentUserId && id) {
        const data = await getChecklistWithItems(
          id as string,
          currentUserId,
          matchId as string | undefined
        );
        setChecklist(data);
      }
    } catch (error) {
      console.error('Error loading checklist:', error);
      showToast('Failed to load checklist', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleItemUpdate = async (
    itemId: string,
    isCompleted: boolean,
    selectedValue?: string,
    notes?: string
  ) => {
    if (!userId) return;

    try {
      await updateChecklistProgress(
        userId,
        itemId,
        isCompleted,
        selectedValue,
        notes,
        matchId as string | undefined
      );
      await loadChecklist();
    } catch (error) {
      console.error('Error updating progress:', error);
      showToast('Failed to update progress', 'error');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  if (!checklist) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Checklist not found</Text>
        <TouchableOpacity
          style={styles.backToListButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backToListButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progressPercentage =
    checklist.totalCount > 0
      ? Math.round((checklist.completedCount / checklist.totalCount) * 100)
      : 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#059669', '#10B981']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{checklist.title}</Text>
        <Text style={styles.headerSubtitle}>{checklist.description}</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              {checklist.completedCount} of {checklist.totalCount} completed
            </Text>
            <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercentage}%` },
              ]}
            />
          </View>
        </View>

        {progressPercentage === 100 && (
          <View style={styles.completedBanner}>
            <CheckCircle2 size={20} color="#FFFFFF" />
            <Text style={styles.completedBannerText}>
              Checklist completed!
            </Text>
          </View>
        )}
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {checklist.items.map((item) => (
          <ChecklistItemComponent
            key={item.id}
            item={item}
            onUpdate={(isCompleted, selectedValue, notes) =>
              handleItemUpdate(item.id, isCompleted, selectedValue, notes)
            }
          />
        ))}

        {progressPercentage === 100 && (
          <View style={styles.congratsCard}>
            <Text style={styles.congratsTitle}>Excellent work!</Text>
            <Text style={styles.congratsText}>
              You've completed this checklist. Keep up the great work on your
              roommate search journey!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 20,
  },
  backToListButton: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backToListButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.95,
    lineHeight: 22,
  },
  progressContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  completedBannerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  congratsCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  congratsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 8,
  },
  congratsText: {
    fontSize: 15,
    color: '#047857',
    lineHeight: 22,
  },
});
