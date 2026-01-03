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
import {
  ArrowLeft,
  Shield,
  Users,
  Heart,
  Home,
  CheckCircle2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getChecklistTemplates, getUserChecklistStats, getMatchChecklists, getMatchChecklistStats } from '../../services/checklist';
import type { ChecklistTemplate } from '../../services/checklist';
import { getCurrentUserId } from '../../services/storage';
import { supabase } from '../../services/supabase';

const iconMap = {
  shield: Shield,
  users: Users,
  heart: Heart,
  home: Home,
};

const categoryColors = {
  safety: '#DC2626',
  'pre-meeting': '#3B82F6',
  compatibility: '#8B5CF6',
  'move-in': '#059669',
};

export default function ChecklistsScreen() {
  const router = useRouter();
  const { matchId } = useLocalSearchParams();
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [matchUserName, setMatchUserName] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [matchId]);

  const loadData = async () => {
    try {
      const currentUserId = await getCurrentUserId();
      setUserId(currentUserId);

      if (currentUserId) {
        if (matchId) {
          const { data: match } = await supabase
            .from('matches')
            .select('user_id_1, user_id_2')
            .eq('id', matchId as string)
            .maybeSingle();

          if (match) {
            const otherUserId = match.user_id_1 === currentUserId ? match.user_id_2 : match.user_id_1;
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name')
              .eq('id', otherUserId)
              .maybeSingle();

            if (profile) {
              setMatchUserName(profile.first_name);
            }
          }

          const [templatesData, statsData] = await Promise.all([
            getMatchChecklists(currentUserId, matchId as string),
            getMatchChecklistStats(currentUserId, matchId as string),
          ]);
          setTemplates(templatesData);
          setStats(statsData);
        } else {
          const [templatesData, statsData] = await Promise.all([
            getChecklistTemplates(),
            getUserChecklistStats(currentUserId),
          ]);
          setTemplates(templatesData);
          setStats(statsData);
        }
      }
    } catch (error) {
      console.error('Error loading checklists:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || Shield;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>
          {matchId && matchUserName ? `Checklists for ${matchUserName}` : 'Checklists'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {matchId
            ? 'Complete these checklists for this potential roommate'
            : 'Stay organized and safe throughout your roommate search'}
        </Text>

        {stats && (
          <View style={styles.statsContainer}>
            {!matchId ? (
              <>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>
                    {stats.completedChecklists}/{stats.totalChecklists}
                  </Text>
                  <Text style={styles.statLabel}>Checklists</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>
                    {stats.completedItems}/{stats.totalItems}
                  </Text>
                  <Text style={styles.statLabel}>Items</Text>
                </View>
              </>
            ) : (
              <View style={[styles.statBox, { flex: 1 }]}>
                <Text style={styles.statNumber}>
                  {stats.completedItems}/{stats.totalItems}
                </Text>
                <Text style={styles.statLabel}>
                  {stats.progressPercentage}% Complete
                </Text>
              </View>
            )}
          </View>
        )}
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Complete these checklists to ensure a safe and successful roommate search.
            Track your progress and never miss important steps!
          </Text>
        </View>

        {templates.map((template) => {
          const IconComponent = getIconComponent(template.icon);
          const color = categoryColors[template.category];

          return (
            <TouchableOpacity
              key={template.id}
              style={styles.checklistCard}
              onPress={() => {
                if (matchId) {
                  router.push({
                    pathname: `/checklists/[id]`,
                    params: { id: template.id, matchId: matchId as string },
                  });
                } else {
                  router.push(`/checklists/${template.id}`);
                }
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                <IconComponent size={28} color={color} />
              </View>
              <View style={styles.checklistContent}>
                <Text style={styles.checklistTitle}>{template.title}</Text>
                <Text style={styles.checklistDescription}>{template.description}</Text>
              </View>
              <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>›</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Why use checklists?</Text>
          <View style={styles.tipItem}>
            <CheckCircle2 size={20} color="#059669" />
            <Text style={styles.tipText}>Stay organized throughout the process</Text>
          </View>
          <View style={styles.tipItem}>
            <CheckCircle2 size={20} color="#059669" />
            <Text style={styles.tipText}>
              Ensure you don't miss important safety steps
            </Text>
          </View>
          <View style={styles.tipItem}>
            <CheckCircle2 size={20} color="#059669" />
            <Text style={styles.tipText}>
              Track compatibility factors with potential roommates
            </Text>
          </View>
          <View style={styles.tipItem}>
            <CheckCircle2 size={20} color="#059669" />
            <Text style={styles.tipText}>Prepare properly for move-in day</Text>
          </View>
        </View>
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.95,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    marginTop: 20,
    overflow: 'hidden',
  },
  statBox: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 21,
  },
  checklistCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  checklistContent: {
    flex: 1,
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  checklistDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  arrowContainer: {
    marginLeft: 8,
  },
  arrow: {
    fontSize: 32,
    color: '#D1D5DB',
    fontWeight: '300',
  },
  tipsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
