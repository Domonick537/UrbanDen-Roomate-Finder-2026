import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Briefcase, MapPin, DollarSign, Calendar, Shield, X, Heart, Home, User as UserIcon } from 'lucide-react-native';
import { getCurrentUser } from '../../services/storage';
import { getPotentialMatches, handleSwipe } from '../../services/matching';
import { User } from '../../types';
import MatchCelebration from '../../components/MatchCelebration';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { getCardWidth, getCardHeight, isDesktop, getMaxWidth } from '../../utils/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export default function DiscoverScreen() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<(User & { compatibility: number })[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedUser, setMatchedUser] = useState<(User & { compatibility: number}) | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const position = useRef(new Animated.ValueXY()).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.95, 1],
    extrapolate: 'clamp',
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setIsLoading(true);
    const user = await getCurrentUser();
    if (user) {
      setCurrentUser(user);
      const matches = await getPotentialMatches(user);
      setPotentialMatches(matches);
    }
    setIsLoading(false);
  };

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success') => {
    if (Platform.OS !== 'web') {
      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
      }
    }
  };

  const onSwipeComplete = async (direction: 'like' | 'pass') => {
    const currentCard = potentialMatches[currentIndex];
    if (!currentCard || !currentUser) return;

    triggerHaptic(direction === 'like' ? 'medium' : 'light');

    const match = await handleSwipe(currentUser.id, currentCard.id, direction);

    if (match) {
      triggerHaptic('success');
      setMatchedUser(currentCard);
      setShowMatchModal(true);
    } else if (direction === 'like') {
      showToast(`You liked ${currentCard.firstName}!`, 'info');
    }

    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(currentIndex + 1);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      triggerHaptic('light');
    },
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        Animated.spring(position, {
          toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy },
          useNativeDriver: false,
        }).start(() => onSwipeComplete('like'));
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        Animated.spring(position, {
          toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy },
          useNativeDriver: false,
        }).start(() => onSwipeComplete('pass'));
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const animateButton = (callback: () => void) => {
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.85,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    callback();
  };

  const handleLike = () => {
    triggerHaptic('medium');
    animateButton(() => {
      Animated.spring(position, {
        toValue: { x: SCREEN_WIDTH + 100, y: 0 },
        useNativeDriver: false,
      }).start(() => onSwipeComplete('like'));
    });
  };

  const handlePass = () => {
    triggerHaptic('light');
    animateButton(() => {
      Animated.spring(position, {
        toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
        useNativeDriver: false,
      }).start(() => onSwipeComplete('pass'));
    });
  };

  const handleMatchClose = () => {
    setShowMatchModal(false);
    setMatchedUser(null);
  };

  const handleMatchMessage = () => {
    setShowMatchModal(false);
    router.push('/(tabs)/matches');
    showToast('Start chatting with your new match!', 'success');
  };

  const renderCard = (user: User & { compatibility: number }, index: number) => {
    if (index < currentIndex) return null;
    if (index > currentIndex + 1) return null;

    const isCurrentCard = index === currentIndex;

    if (isCurrentCard) {
      return (
        <Animated.View
          key={user.id}
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate: rotation },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Animated.View style={[styles.likeOverlay, { opacity: likeOpacity }]}>
            <Text style={styles.overlayText}>LIKE</Text>
          </Animated.View>
          <Animated.View style={[styles.passOverlay, { opacity: passOpacity }]}>
            <Text style={styles.overlayText}>PASS</Text>
          </Animated.View>

          {user.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={styles.cardImage} />
          ) : (
            <View style={[styles.cardImage, styles.placeholderImage]}>
              <UserIcon size={80} color="#9CA3AF" />
            </View>
          )}

          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>
                  {user.firstName}, {user.age}
                </Text>
                {user.isVerified && <Shield size={20} color="#10B981" />}
              </View>
              <View style={styles.compatibilityBadge}>
                <Text style={styles.compatibilityText}>{user.compatibility}%</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Briefcase size={14} color="#6B7280" />
              <Text style={styles.infoText}>{user.occupation}</Text>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.infoText}>
                {user.preferences.location.city}, {user.preferences.location.state}
              </Text>
            </View>

            <Text style={styles.bio} numberOfLines={3}>
              {user.bio}
            </Text>

            <View style={styles.preferences}>
              <View style={styles.preferenceItem}>
                <DollarSign size={14} color="#6B7280" />
                <Text style={styles.preferenceText}>
                  ${user.preferences.budgetMin} - ${user.preferences.budgetMax}
                </Text>
              </View>
              <View style={styles.preferenceItem}>
                <Calendar size={14} color="#6B7280" />
                <Text style={styles.preferenceText}>
                  {user.preferences.moveInDate === 'urgent'
                    ? 'ASAP'
                    : user.preferences.moveInDate === '2-3months'
                    ? '2-3 months'
                    : 'Flexible'}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        key={user.id}
        style={[
          styles.card,
          styles.nextCard,
          {
            transform: [{ scale: nextCardScale }],
            opacity: nextCardOpacity,
          },
        ]}
      >
        {user.profilePicture ? (
          <Image source={{ uri: user.profilePicture }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.placeholderImage]}>
            <UserIcon size={80} color="#9CA3AF" />
          </View>
        )}
        <View style={styles.cardContent}>
          <Text style={styles.name}>
            {user.firstName}, {user.age}
          </Text>
        </View>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#F59E0B', '#F97316']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>Loading profiles...</Text>
        </LinearGradient>
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (currentIndex >= potentialMatches.length) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Home size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No more profiles!</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for new potential roommates in your area.
          </Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              triggerHaptic('medium');
              loadMatches();
            }}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const containerStyle = isDesktop()
    ? [styles.container, styles.desktopContainer]
    : styles.container;

  const contentWrapper = isDesktop()
    ? [styles.desktopWrapper]
    : null;

  return (
    <View style={containerStyle}>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />

      {matchedUser && (
        <MatchCelebration
          visible={showMatchModal}
          matchedUser={matchedUser}
          currentUserPhoto={currentUser.profilePicture}
          onClose={handleMatchClose}
          onMessage={handleMatchMessage}
        />
      )}

      <View style={contentWrapper}>
        <LinearGradient
          colors={['#4F46E5', '#6366F1']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>Find your perfect roommate</Text>
        </LinearGradient>

        <View style={styles.cardContainer}>
          {potentialMatches.map((user, index) => renderCard(user, index)).reverse()}
        </View>

        <View style={styles.actions}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.passButton}
              onPress={handlePass}
              activeOpacity={0.8}
            >
              <X size={32} color="#EF4444" />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.likeButton}
              onPress={handleLike}
              activeOpacity={0.8}
            >
              <Heart size={32} color="#10B981" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  desktopContainer: {
    alignItems: 'center',
  },
  desktopWrapper: {
    width: '100%',
    maxWidth: getMaxWidth(),
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
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: getCardWidth(),
    height: getCardHeight(),
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    position: 'absolute',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  nextCard: {
    top: 10,
  },
  cardImage: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  placeholderImage: {
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  compatibilityBadge: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  compatibilityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    lineHeight: 21,
    marginVertical: 12,
  },
  preferences: {
    flexDirection: 'row',
    gap: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  preferenceText: {
    fontSize: 12,
    color: '#6B7280',
  },
  likeOverlay: {
    position: 'absolute',
    top: 40,
    right: 40,
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  passOverlay: {
    position: 'absolute',
    top: 40,
    left: 40,
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  overlayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingVertical: 20,
  },
  passButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  likeButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
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
  refreshButton: {
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
  refreshButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
