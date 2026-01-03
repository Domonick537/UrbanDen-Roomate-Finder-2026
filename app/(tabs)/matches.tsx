import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { Search, MessageCircle, Shield, User as UserIcon } from 'lucide-react-native';
import { getCurrentUser, getMessages } from '../../services/storage';
import { getUserMatches } from '../../services/matching';
import { supabase } from '../../services/supabase';
import { User, Match, Message } from '../../types';

interface MatchWithDetails extends Match {
  user: User;
  lastMessage?: string;
  unreadCount: number;
}

export default function MatchesScreen() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadMatches();
    }, [])
  );

  const loadMatches = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    setCurrentUser(user);
    const allMatches = await getUserMatches(user.id);

    const userMatches = await Promise.all(
      allMatches.map(async match => {
        const matchedUserId = match.userId1 === user.id ? match.userId2 : match.userId1;

        const { data: matchedProfile } = await supabase
          .from('profiles')
          .select('*, roommate_preferences(*)')
          .eq('id', matchedUserId)
          .single();

        if (!matchedProfile) return null;

        const prefs = matchedProfile.roommate_preferences?.[0] || {};
        const matchedUser: User = {
          id: matchedProfile.id,
          firstName: matchedProfile.first_name,
          age: matchedProfile.age,
          gender: matchedProfile.gender,
          occupation: matchedProfile.occupation,
          bio: matchedProfile.bio,
          email: matchedProfile.email || '',
          phone: matchedProfile.phone,
          photos: matchedProfile.photos || [],
          profilePicture: matchedProfile.photos?.[0],
          preferences: {
            genderPreference: prefs.gender_preference || 'any',
            budgetMin: prefs.budget_min || 500,
            budgetMax: prefs.budget_max || 2000,
            location: {
              city: prefs.location_city || '',
              state: prefs.location_state || '',
            },
            moveInDate: prefs.move_in_date || 'flexible',
            petPreference: prefs.pet_preference || 'flexible',
            smokingPreference: prefs.smoking_preference || 'flexible',
            drinkingPreference: prefs.drinking_preference || 'flexible',
            cleanliness: prefs.cleanliness || 'flexible',
            socialLevel: prefs.social_level || 'flexible',
          },
          isVerified: matchedProfile.is_verified,
          isEmailVerified: matchedProfile.is_email_verified,
          isPhoneVerified: matchedProfile.is_phone_verified,
          showReadReceipts: matchedProfile.show_read_receipts ?? true,
          createdAt: new Date(matchedProfile.created_at || Date.now()),
          lastActive: new Date(matchedProfile.last_active || Date.now()),
        };

        const messages = await getMessages(match.id);
        const lastMessage = messages[messages.length - 1];

        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('match_id', match.id)
          .neq('sender_id', user.id)
          .eq('is_read', false);

        return {
          ...match,
          user: matchedUser,
          lastMessage: lastMessage?.content,
          unreadCount: count || 0,
        };
      })
    );

    const validMatches = userMatches.filter(m => m !== null) as MatchWithDetails[];

    validMatches.sort((a, b) => {
      const aTime = a.createdAt;
      const bTime = b.createdAt;
      return bTime.getTime() - aTime.getTime();
    });

    setMatches(validMatches);
  };

  const filteredMatches = matches.filter(match =>
    match.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.user.occupation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMatch = ({ item }: { item: MatchWithDetails }) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.matchImageContainer}>
        {item.user.profilePicture ? (
          <Image source={{ uri: item.user.profilePicture }} style={styles.matchImage} />
        ) : (
          <View style={[styles.matchImage, styles.placeholderImage]}>
            <UserIcon size={32} color="#9CA3AF" />
          </View>
        )}
        {item.user.isVerified && (
          <View style={styles.verifiedBadge}>
            <Shield size={16} color="#FFFFFF" />
          </View>
        )}
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>

      <View style={styles.matchContent}>
        <View style={styles.matchHeader}>
          <Text style={styles.matchName}>{item.user.firstName}</Text>
          <View style={styles.compatibilityBadge}>
            <Text style={styles.compatibilityText}>{item.compatibility}%</Text>
          </View>
        </View>
        <Text style={styles.matchLocation}>
          {item.user.preferences.location.city}, {item.user.preferences.location.state}
        </Text>
        <Text style={[styles.lastMessage, item.unreadCount > 0 && styles.unreadMessage]} numberOfLines={1}>
          {item.lastMessage || 'Start a conversation!'}
        </Text>
      </View>

      <MessageCircle size={20} color="#4F46E5" />
    </TouchableOpacity>
  );

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#6366F1']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Matches</Text>
        <Text style={styles.headerSubtitle}>{matches.length} connections</Text>
      </LinearGradient>

      {matches.length > 0 && (
        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search matches..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      )}

      {filteredMatches.length === 0 ? (
        <View style={styles.emptyState}>
          <MessageCircle size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptySubtitle}>
            Keep swiping to find your perfect roommate! When you both like each other, you'll see
            them here.
          </Text>
          <TouchableOpacity
            style={styles.discoverButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.discoverButtonText}>Start Discovering</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredMatches}
          renderItem={renderMatch}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  matchCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  matchImageContainer: {
    position: 'relative',
  },
  matchImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  placeholderImage: {
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 12,
    backgroundColor: '#10B981',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: 12,
    backgroundColor: '#EF4444',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  matchContent: {
    flex: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 8,
  },
  compatibilityBadge: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  compatibilityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  matchLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#111827',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  discoverButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  discoverButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
