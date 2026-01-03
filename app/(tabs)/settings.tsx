import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  User as UserIcon,
  Shield,
  FileText,
  Bell,
  HelpCircle,
  LogOut,
  Trash2,
  Download,
  Eye,
  Moon,
  Sun,
  Monitor,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react-native';
import { clearAllData, setCurrentUser, getCurrentUser, updateUser } from '../../services/storage';
import { exportUserData, deleteUserAccount } from '../../services/dataExport';
import { supabase } from '../../services/supabase';
import { User } from '../../types';
import { useTheme, ThemeMode } from '../../contexts/ThemeContext';
import { FeedbackModal } from '../../components/FeedbackModal';
import { adminService } from '../../services/admin';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, themeMode, setThemeMode } = useTheme();
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadUserSettings();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const adminStatus = await adminService.isAdmin();
    setIsAdmin(adminStatus);
  };

  const loadUserSettings = async () => {
    const user = await getCurrentUser();
    if (user) {
      setCurrentUserData(user);
      setReadReceipts(user.showReadReceipts);
    }
  };

  const handleToggleReadReceipts = async (value: boolean) => {
    setReadReceipts(value);
    if (currentUserData) {
      const updatedUser = { ...currentUserData, showReadReceipts: value };
      await updateUser(updatedUser);
      setCurrentUserData(updatedUser);
    }
  };

  const handleExportData = async () => {
    const exportedData = await exportUserData();
    if (exportedData) {
      try {
        await Share.share({
          message: exportedData,
          title: 'UrbanDen Data Export',
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to export data');
      }
    } else {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          await setCurrentUser(null);
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteUserAccount();
            if (success) {
              await clearAllData();
              router.replace('/(auth)/welcome');
            } else {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <Sun size={20} color={theme.colors.primary} />;
      case 'dark':
        return <Moon size={20} color={theme.colors.primary} />;
      case 'auto':
        return <Monitor size={20} color={theme.colors.primary} />;
    }
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'auto':
        return 'Auto';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={theme.colors.gradient}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your preferences</Text>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textTertiary }]}>APPEARANCE</Text>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.colors.card }]} onPress={() => setShowThemeModal(true)}>
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.primaryLight }]}>
            {getThemeIcon()}
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Theme</Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
              {getThemeLabel()} mode
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textTertiary }]}>ACCOUNT</Text>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <UserIcon size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Edit Profile</Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>Update your personal information</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.colors.card }]}
          onPress={() => router.push('/profile/verification')}
        >
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <Shield size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Identity Verification</Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>Verify your identity for safety</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.colors.card }]}
          onPress={() => router.push('/profile/agreements')}
        >
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <FileText size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Roommate Agreements</Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>View and manage agreement templates</Text>
          </View>
        </TouchableOpacity>
      </View>

      {isAdmin && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textTertiary }]}>ADMIN</Text>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: theme.colors.card }]}
            onPress={() => router.push('/admin')}
          >
            <View style={[styles.settingIcon, { backgroundColor: '#FEE2E2' }]}>
              <ShieldAlert size={20} color="#EF4444" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Admin Dashboard</Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>Manage users, reports, and content</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textTertiary }]}>PRIVACY & SECURITY</Text>

        <View style={[styles.settingItem, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <Bell size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Push Notifications</Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
              Receive notifications about matches and messages
            </Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
            thumbColor={pushNotifications ? theme.colors.primary : theme.colors.textTertiary}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <Eye size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Read Receipts</Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>Let others know when you've read their messages</Text>
          </View>
          <Switch
            value={readReceipts}
            onValueChange={handleToggleReadReceipts}
            trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
            thumbColor={readReceipts ? theme.colors.primary : theme.colors.textTertiary}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <Shield size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Location Services</Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>Allow location access for better matches</Text>
          </View>
          <Switch
            value={locationServices}
            onValueChange={setLocationServices}
            trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
            thumbColor={locationServices ? theme.colors.primary : theme.colors.textTertiary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textTertiary }]}>DATA & PRIVACY</Text>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.colors.card }]} onPress={handleExportData}>
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <Download size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Export Data</Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>Download your personal data</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.colors.card }]}
          onPress={() => router.push('/(auth)/terms')}
        >
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <FileText size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Terms of Service</Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>Review our terms of service</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.colors.card }]}
          onPress={() => router.push('/(auth)/privacy')}
        >
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <Shield size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Privacy Policy</Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>Review our privacy policy</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textTertiary }]}>SUPPORT</Text>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.colors.card }]}
          onPress={() => setShowFeedbackModal(true)}
        >
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <MessageSquare size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Send Feedback</Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>Report bugs or suggest features</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.colors.card }]}
          onPress={() =>
            Alert.alert('Help & Support', 'Contact support at help@urbanden.com')
          }
        >
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <HelpCircle size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Help & Support</Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>Get help with using UrbanDen</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textTertiary }]}>ACCOUNT ACTIONS</Text>

        <TouchableOpacity style={[styles.dangerItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.errorLight }]} onPress={handleSignOut}>
          <View style={[styles.dangerIcon, { backgroundColor: theme.colors.errorLight }]}>
            <LogOut size={20} color={theme.colors.error} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.dangerTitle, { color: theme.colors.error }]}>Sign Out</Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>Sign out of your account</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.dangerItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.errorLight }]} onPress={handleDeleteAccount}>
          <View style={[styles.dangerIcon, { backgroundColor: theme.colors.errorLight }]}>
            <Trash2 size={20} color={theme.colors.error} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.dangerTitle, { color: theme.colors.error }]}>Delete Account</Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
              Permanently delete your account and data
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showThemeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowThemeModal(false)}
        >
          <View style={[styles.themeModal, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.themeModalTitle, { color: theme.colors.text }]}>Choose Theme</Text>

            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'light' && { backgroundColor: theme.colors.primaryLight },
              ]}
              onPress={() => {
                setThemeMode('light');
                setShowThemeModal(false);
              }}
            >
              <Sun size={24} color={themeMode === 'light' ? theme.colors.primary : theme.colors.textSecondary} />
              <View style={styles.themeOptionText}>
                <Text style={[styles.themeOptionTitle, { color: theme.colors.text }]}>Light</Text>
                <Text style={[styles.themeOptionSubtitle, { color: theme.colors.textSecondary }]}>
                  Always use light mode
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'dark' && { backgroundColor: theme.colors.primaryLight },
              ]}
              onPress={() => {
                setThemeMode('dark');
                setShowThemeModal(false);
              }}
            >
              <Moon size={24} color={themeMode === 'dark' ? theme.colors.primary : theme.colors.textSecondary} />
              <View style={styles.themeOptionText}>
                <Text style={[styles.themeOptionTitle, { color: theme.colors.text }]}>Dark</Text>
                <Text style={[styles.themeOptionSubtitle, { color: theme.colors.textSecondary }]}>
                  Always use dark mode
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'auto' && { backgroundColor: theme.colors.primaryLight },
              ]}
              onPress={() => {
                setThemeMode('auto');
                setShowThemeModal(false);
              }}
            >
              <Monitor size={24} color={themeMode === 'auto' ? theme.colors.primary : theme.colors.textSecondary} />
              <View style={styles.themeOptionText}>
                <Text style={[styles.themeOptionTitle, { color: theme.colors.text }]}>Auto</Text>
                <Text style={[styles.themeOptionSubtitle, { color: theme.colors.textSecondary }]}>
                  Match system settings
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <FeedbackModal visible={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 12,
    marginLeft: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  dangerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  themeModal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  themeModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  themeOptionText: {
    marginLeft: 16,
    flex: 1,
  },
  themeOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeOptionSubtitle: {
    fontSize: 14,
  },
});
