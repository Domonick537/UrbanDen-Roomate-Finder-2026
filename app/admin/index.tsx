import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Users,
  AlertTriangle,
  MessageSquare,
  Bug,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react-native';
import { adminService, AdminStats } from '@/services/admin';
import { useTheme } from '@/contexts/ThemeContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { theme } = useTheme();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const isAdmin = await adminService.isAdmin();
    if (!isAdmin) {
      router.back();
      return;
    }
    loadStats();
  };

  const loadStats = async () => {
    const data = await adminService.getAdminStats();
    setStats(data);
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadStats();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <LinearGradient
        colors={theme.colors.gradient}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Monitor and manage UrbanDen</Text>
      </LinearGradient>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.statIcon, { backgroundColor: '#EBF5FF' }]}>
            <Users size={24} color="#3B82F6" />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats?.totalUsers || 0}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Total Users</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
            <AlertTriangle size={24} color="#F59E0B" />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats?.pendingReports || 0}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Pending Reports</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.statIcon, { backgroundColor: '#DBEAFE' }]}>
            <MessageSquare size={24} color="#3B82F6" />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats?.newFeedback || 0}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>New Feedback</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.statIcon, { backgroundColor: '#FEE2E2' }]}>
            <Bug size={24} color="#EF4444" />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats?.recentErrors || 0}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Errors (24h)</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.statIcon, { backgroundColor: '#D1FAE5' }]}>
            <ShieldCheck size={24} color="#10B981" />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats?.verificationRequests || 0}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Verifications</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.statIcon, { backgroundColor: '#FEE2E2' }]}>
            <AlertTriangle size={24} color="#EF4444" />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats?.totalReports || 0}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Total Reports</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textTertiary }]}>QUICK ACTIONS</Text>

        <TouchableOpacity
          style={[styles.actionItem, { backgroundColor: theme.colors.card }]}
          onPress={() => router.push('/admin/reports')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
            <AlertTriangle size={20} color="#F59E0B" />
          </View>
          <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, { color: theme.colors.text }]}>Review Reports</Text>
            <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
              {stats?.pendingReports || 0} pending
            </Text>
          </View>
          <ChevronRight size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionItem, { backgroundColor: theme.colors.card }]}
          onPress={() => router.push('/admin/feedback')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#DBEAFE' }]}>
            <MessageSquare size={20} color="#3B82F6" />
          </View>
          <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, { color: theme.colors.text }]}>Review Feedback</Text>
            <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
              {stats?.newFeedback || 0} new
            </Text>
          </View>
          <ChevronRight size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionItem, { backgroundColor: theme.colors.card }]}
          onPress={() => router.push('/admin/verifications')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#D1FAE5' }]}>
            <ShieldCheck size={20} color="#10B981" />
          </View>
          <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, { color: theme.colors.text }]}>Verify Identities</Text>
            <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
              {stats?.verificationRequests || 0} pending
            </Text>
          </View>
          <ChevronRight size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionItem, { backgroundColor: theme.colors.card }]}
          onPress={() => router.push('/admin/errors')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#FEE2E2' }]}>
            <Bug size={20} color="#EF4444" />
          </View>
          <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, { color: theme.colors.text }]}>Error Logs</Text>
            <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
              {stats?.recentErrors || 0} in last 24h
            </Text>
          </View>
          <ChevronRight size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginTop: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 24,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 24,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
  },
});
