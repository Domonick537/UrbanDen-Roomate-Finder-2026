import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Camera,
  Shield,
  Briefcase,
  MapPin,
  Edit,
  FileText,
  User as UserIcon,
} from 'lucide-react-native';
import { getCurrentUser } from '../../services/storage';
import { User } from '../../types';
import PhotoUploadModal from '../../components/PhotoUploadModal';
import { supabase } from '../../services/supabase';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [userPhotos, setUserPhotos] = useState<string[]>([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (profile) {
        const photos = profile.photos || [];
        setUserPhotos(photos);
        setUser({
          ...currentUser,
          profilePicture: photos[0] || currentUser.profilePicture,
        });
      } else {
        setUser(currentUser);
      }
    }
  };

  const handlePhotosUpdated = async (photos: string[]) => {
    setUserPhotos(photos);
    if (user) {
      setUser({
        ...user,
        profilePicture: photos[0] || user.profilePicture,
      });
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={['#4F46E5', '#6366F1']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your roommate profile</Text>
      </LinearGradient>

      <View style={styles.profileCard}>
        <View style={styles.imageContainer}>
          {user.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.placeholderImage]}>
              <UserIcon size={48} color="#9CA3AF" />
            </View>
          )}
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => setShowPhotoModal(true)}
          >
            <Camera size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {user.firstName}, {user.age}
          </Text>
          {user.isVerified && <Shield size={28} color="#10B981" />}
        </View>

        <View style={styles.infoRow}>
          <Briefcase size={16} color="#6B7280" />
          <Text style={styles.infoText}>{user.occupation}</Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.infoText}>
            {user.preferences.location.city}, {user.preferences.location.state}
          </Text>
        </View>

        <Text style={styles.bio}>{user.bio}</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/profile/edit')}
        >
          <Edit size={18} color="#FFFFFF" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verification Status</Text>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push('/profile/verification')}
        >
          <View style={styles.settingIcon}>
            <Shield size={20} color={user.isVerified ? '#10B981' : '#6B7280'} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Identity Verification</Text>
            <Text
              style={[
                styles.settingSubtitle,
                user.isVerified ? styles.verifiedText : styles.notVerifiedText,
              ]}
            >
              {user.isVerified ? 'Verified' : 'Not Verified'}
            </Text>
          </View>
          {!user.isVerified && (
            <TouchableOpacity style={styles.verifyButton}>
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Roommate Preferences</Text>
        <View style={styles.preferenceCard}>
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Gender Preference</Text>
            <Text style={styles.preferenceValue}>
              {user.preferences.genderPreference === 'any'
                ? 'Any'
                : user.preferences.genderPreference.charAt(0).toUpperCase() +
                  user.preferences.genderPreference.slice(1)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Budget Range</Text>
            <Text style={styles.preferenceValue}>
              ${user.preferences.budgetMin} - ${user.preferences.budgetMax}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Move-in Timeline</Text>
            <Text style={styles.preferenceValue}>
              {user.preferences.moveInDate === 'urgent'
                ? 'ASAP'
                : user.preferences.moveInDate === '2-3months'
                ? '2-3 months'
                : 'Flexible'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Pet Preference</Text>
            <Text style={styles.preferenceValue}>
              {user.preferences.petPreference === 'love-pets'
                ? 'Love pets'
                : user.preferences.petPreference === 'no-pets'
                ? 'No pets'
                : user.preferences.petPreference === 'allergic'
                ? 'Allergic'
                : 'Flexible'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Lifestyle</Text>
            <Text style={styles.preferenceValue}>
              {user.preferences.smokingPreference === 'non-smoker'
                ? 'Non-smoker'
                : 'Smoker'}{' '}
              •{' '}
              {user.preferences.drinkingPreference === 'social-drinker'
                ? 'Social drinker'
                : user.preferences.drinkingPreference === 'non-drinker'
                ? 'Non-drinker'
                : 'Flexible'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/profile/agreements')}
        >
          <View style={styles.actionIcon}>
            <FileText size={24} color="#4F46E5" />
          </View>
          <Text style={styles.actionText}>Roommate Agreements</Text>
        </TouchableOpacity>
      </View>

      {user && (
        <PhotoUploadModal
          visible={showPhotoModal}
          onClose={() => setShowPhotoModal(false)}
          userId={user.id}
          currentPhotos={userPhotos}
          onPhotosUpdated={handlePhotosUpdated}
        />
      )}
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    marginTop: -20,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  bio: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 21,
    marginVertical: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
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
  },
  verifiedText: {
    color: '#10B981',
  },
  notVerifiedText: {
    color: '#EF4444',
  },
  verifyButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  preferenceCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  preferenceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
