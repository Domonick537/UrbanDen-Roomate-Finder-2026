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
} from 'lucide-react-native';
import { clearAllData, setCurrentUser, getCurrentUser, updateUser } from '../../services/storage';
import { exportUserData, deleteUserAccount } from '../../services/dataExport';
import { supabase } from '../../services/supabase';
import { User } from '../../types';

export default function SettingsScreen() {
  const router = useRouter();
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  useEffect(() => {
    loadUserSettings();
  }, []);

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={['#4F46E5', '#6366F1']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your preferences</Text>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <UserIcon size={20} color="#4F46E5" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Edit Profile</Text>
            <Text style={styles.settingSubtitle}>Update your personal information</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push('/profile/verification')}
        >
          <View style={styles.settingIcon}>
            <Shield size={20} color="#4F46E5" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Identity Verification</Text>
            <Text style={styles.settingSubtitle}>Verify your identity for safety</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push('/profile/agreements')}
        >
          <View style={styles.settingIcon}>
            <FileText size={20} color="#4F46E5" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Roommate Agreements</Text>
            <Text style={styles.settingSubtitle}>View and manage agreement templates</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PRIVACY & SECURITY</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Bell size={20} color="#4F46E5" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingSubtitle}>
              Receive notifications about matches and messages
            </Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
            thumbColor={pushNotifications ? '#4F46E5' : '#9CA3AF'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Eye size={20} color="#4F46E5" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Read Receipts</Text>
            <Text style={styles.settingSubtitle}>Let others know when you've read their messages</Text>
          </View>
          <Switch
            value={readReceipts}
            onValueChange={handleToggleReadReceipts}
            trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
            thumbColor={readReceipts ? '#4F46E5' : '#9CA3AF'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Shield size={20} color="#4F46E5" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Location Services</Text>
            <Text style={styles.settingSubtitle}>Allow location access for better matches</Text>
          </View>
          <Switch
            value={locationServices}
            onValueChange={setLocationServices}
            trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
            thumbColor={locationServices ? '#4F46E5' : '#9CA3AF'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATA & PRIVACY</Text>

        <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
          <View style={styles.settingIcon}>
            <Download size={20} color="#4F46E5" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Export Data</Text>
            <Text style={styles.settingSubtitle}>Download your personal data</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push('/(auth)/terms')}
        >
          <View style={styles.settingIcon}>
            <FileText size={20} color="#4F46E5" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Terms of Service</Text>
            <Text style={styles.settingSubtitle}>Review our terms of service</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push('/(auth)/privacy')}
        >
          <View style={styles.settingIcon}>
            <Shield size={20} color="#4F46E5" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Privacy Policy</Text>
            <Text style={styles.settingSubtitle}>Review our privacy policy</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SUPPORT</Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() =>
            Alert.alert('Help & Support', 'Contact support at help@urbanden.com')
          }
        >
          <View style={styles.settingIcon}>
            <HelpCircle size={20} color="#4F46E5" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Help & Support</Text>
            <Text style={styles.settingSubtitle}>Get help with using UrbanDen</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT ACTIONS</Text>

        <TouchableOpacity style={styles.dangerItem} onPress={handleSignOut}>
          <View style={styles.dangerIcon}>
            <LogOut size={20} color="#EF4444" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.dangerTitle}>Sign Out</Text>
            <Text style={styles.settingSubtitle}>Sign out of your account</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
          <View style={styles.dangerIcon}>
            <Trash2 size={20} color="#EF4444" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.dangerTitle}>Delete Account</Text>
            <Text style={styles.settingSubtitle}>
              Permanently delete your account and data
            </Text>
          </View>
        </TouchableOpacity>
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
    color: '#EF4444',
    marginBottom: 4,
  },
});
