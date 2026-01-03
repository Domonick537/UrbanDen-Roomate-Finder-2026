import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, MapPin, Briefcase, Shield, Hop as Home, Calendar, Heart, Coffee, Wind, Sparkles, Users, User as UserIcon } from 'lucide-react-native';
import { supabase } from '../../../services/supabase';
import { User } from '../../../types';

const { width } = Dimensions.get('window');

export default function ViewProfileScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    if (!userId) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*, roommate_preferences(*)')
      .eq('id', userId)
      .single();

    if (!profile) return;

    const prefs = profile.roommate_preferences?.[0] || {};
    const loadedUser: User = {
      id: profile.id,
      firstName: profile.first_name,
      age: profile.age,
      gender: profile.gender,
      occupation: profile.occupation,
      bio: profile.bio,
      email: '',
      phone: profile.phone,
      photos: profile.photos || [],
      profilePicture: profile.photos?.[0],
      preferences: {
        genderPreference: prefs.gender_preference || 'any',
        ageMin: prefs.age_min || 18,
        ageMax: prefs.age_max || 65,
        budgetMin: prefs.budget_min || 500,
        budgetMax: prefs.budget_max || 2000,
        location: {
          city: prefs.city || '',
          state: prefs.state || '',
          neighborhood: prefs.neighborhood,
        },
        moveInDate: prefs.move_in_date || 'flexible',
        moveInDateSpecific: prefs.move_in_date_specific ? new Date(prefs.move_in_date_specific) : undefined,
        petPreference: prefs.pet_preference || 'flexible',
        smokingPreference: prefs.smoking_preference || 'flexible',
        drinkingPreference: prefs.drinking_preference || 'flexible',
        cleanliness: prefs.cleanliness || 'flexible',
        socialLevel: prefs.social_level || 'flexible',
      },
      isVerified: profile.is_verified,
      isEmailVerified: profile.is_email_verified,
      isPhoneVerified: profile.is_phone_verified,
      showReadReceipts: profile.show_read_receipts ?? true,
      createdAt: new Date(profile.created_at || Date.now()),
      lastActive: new Date(profile.last_active || Date.now()),
    };

    setUser(loadedUser);
  };

  const getPreferenceLabel = (key: string, value: string) => {
    const labels: Record<string, Record<string, string>> = {
      petPreference: {
        'love-pets': 'Love Pets',
        'no-pets': 'No Pets',
        'allergic': 'Allergic',
        'flexible': 'Flexible',
      },
      smokingPreference: {
        'smoker': 'Smoker',
        'non-smoker': 'Non-Smoker',
        'flexible': 'Flexible',
      },
      drinkingPreference: {
        'social-drinker': 'Social Drinker',
        'non-drinker': 'Non-Drinker',
        'flexible': 'Flexible',
      },
      cleanliness: {
        'very-clean': 'Very Clean',
        'clean': 'Clean',
        'flexible': 'Flexible',
      },
      socialLevel: {
        'very-social': 'Very Social',
        'sometimes': 'Sometimes Social',
        'quiet': 'Quiet',
        'flexible': 'Flexible',
      },
      moveInDate: {
        'urgent': 'Urgent',
        'flexible': 'Flexible',
        '2-3months': '2-3 Months',
        'other': 'Other',
      },
    };
    return labels[key]?.[value] || value;
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  const photos = user.photos.length > 0 ? user.photos : [user.profilePicture];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.photoContainer}>
          {photos[currentPhotoIndex] ? (
            <Image source={{ uri: photos[currentPhotoIndex] }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.placeholderPhoto]}>
              <UserIcon size={80} color="#9CA3AF" />
            </View>
          )}

          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent']}
            style={styles.photoGradient}
          />

          <View style={styles.photoHeader}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {photos.length > 1 && (
            <View style={styles.photoIndicators}>
              {photos.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.photoIndicator,
                    index === currentPhotoIndex && styles.photoIndicatorActive,
                  ]}
                  onPress={() => setCurrentPhotoIndex(index)}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.profileHeader}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {user.firstName}, {user.age}
              </Text>
              {user.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Shield size={20} color="#FFFFFF" />
                </View>
              )}
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
          </View>

          {user.bio && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bio}>{user.bio}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Looking For</Text>
            <View style={styles.preferenceCard}>
              <View style={styles.preferenceRow}>
                <Home size={20} color="#4F46E5" />
                <View style={styles.preferenceContent}>
                  <Text style={styles.preferenceLabel}>Budget</Text>
                  <Text style={styles.preferenceValue}>
                    ${user.preferences.budgetMin} - ${user.preferences.budgetMax}/month
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.preferenceCard}>
              <View style={styles.preferenceRow}>
                <Calendar size={20} color="#4F46E5" />
                <View style={styles.preferenceContent}>
                  <Text style={styles.preferenceLabel}>Move-in Date</Text>
                  <Text style={styles.preferenceValue}>
                    {getPreferenceLabel('moveInDate', user.preferences.moveInDate)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.preferenceCard}>
              <View style={styles.preferenceRow}>
                <MapPin size={20} color="#4F46E5" />
                <View style={styles.preferenceContent}>
                  <Text style={styles.preferenceLabel}>Preferred Location</Text>
                  <Text style={styles.preferenceValue}>
                    {user.preferences.location.neighborhood || user.preferences.location.city}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lifestyle</Text>

            <View style={styles.lifestyleGrid}>
              <View style={styles.lifestyleItem}>
                <Heart size={20} color="#4F46E5" />
                <Text style={styles.lifestyleLabel}>Pets</Text>
                <Text style={styles.lifestyleValue}>
                  {getPreferenceLabel('petPreference', user.preferences.petPreference)}
                </Text>
              </View>

              <View style={styles.lifestyleItem}>
                <Wind size={20} color="#4F46E5" />
                <Text style={styles.lifestyleLabel}>Smoking</Text>
                <Text style={styles.lifestyleValue}>
                  {getPreferenceLabel('smokingPreference', user.preferences.smokingPreference)}
                </Text>
              </View>

              <View style={styles.lifestyleItem}>
                <Coffee size={20} color="#4F46E5" />
                <Text style={styles.lifestyleLabel}>Drinking</Text>
                <Text style={styles.lifestyleValue}>
                  {getPreferenceLabel('drinkingPreference', user.preferences.drinkingPreference)}
                </Text>
              </View>

              <View style={styles.lifestyleItem}>
                <Sparkles size={20} color="#4F46E5" />
                <Text style={styles.lifestyleLabel}>Cleanliness</Text>
                <Text style={styles.lifestyleValue}>
                  {getPreferenceLabel('cleanliness', user.preferences.cleanliness)}
                </Text>
              </View>

              <View style={styles.lifestyleItem}>
                <Users size={20} color="#4F46E5" />
                <Text style={styles.lifestyleLabel}>Social</Text>
                <Text style={styles.lifestyleValue}>
                  {getPreferenceLabel('socialLevel', user.preferences.socialLevel)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    width: width,
    height: width * 1.2,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderPhoto: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  photoHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  photoIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  photoIndicatorActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  content: {
    padding: 24,
  },
  profileHeader: {
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 12,
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  preferenceCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preferenceContent: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  preferenceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  lifestyleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  lifestyleItem: {
    width: (width - 72) / 2,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  lifestyleLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  lifestyleValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
});
