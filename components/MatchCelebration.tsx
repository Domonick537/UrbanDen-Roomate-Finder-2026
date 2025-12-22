import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Sparkles, MessageCircle, X } from 'lucide-react-native';
import { User } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MatchCelebrationProps {
  visible: boolean;
  matchedUser: User & { compatibility: number };
  currentUserPhoto?: string;
  onClose: () => void;
  onMessage: () => void;
}

export default function MatchCelebration({
  visible,
  matchedUser,
  currentUserPhoto,
  onClose,
  onMessage,
}: MatchCelebrationProps) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(heartScale, {
          toValue: 1,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0);
      opacity.setValue(0);
      heartScale.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <X size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
        <View style={styles.sparklesContainer}>
          <Sparkles size={32} color="#FFD700" style={styles.sparkle1} />
          <Sparkles size={24} color="#FFD700" style={styles.sparkle2} />
          <Sparkles size={28} color="#FFD700" style={styles.sparkle3} />
        </View>

        <Text style={styles.title}>It's a Match!</Text>

        <View style={styles.photosContainer}>
          {currentUserPhoto ? (
            <Image source={{ uri: currentUserPhoto }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.placeholderPhoto]} />
          )}

          <Animated.View
            style={[
              styles.heartContainer,
              { transform: [{ scale: heartScale }] },
            ]}
          >
            <Text style={styles.heartEmoji}>💕</Text>
          </Animated.View>

          {matchedUser.profilePicture ? (
            <Image source={{ uri: matchedUser.profilePicture }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.placeholderPhoto]} />
          )}
        </View>

        <Text style={styles.matchName}>{matchedUser.firstName}</Text>
        <View style={styles.compatibilityBadge}>
          <Text style={styles.compatibilityText}>{matchedUser.compatibility}% Compatible</Text>
        </View>

        <Text style={styles.subtitle}>
          You and {matchedUser.firstName} have liked each other!
        </Text>

        <TouchableOpacity style={styles.messageButton} onPress={onMessage}>
          <MessageCircle size={20} color="#FFFFFF" />
          <Text style={styles.messageButtonText}>Send a Message</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.keepSwipingButton} onPress={onClose}>
          <Text style={styles.keepSwipingText}>Keep Swiping</Text>
        </TouchableOpacity>
      </Animated.View>

      {[...Array(20)].map((_, i) => (
        <Confetti key={i} index={i} />
      ))}
    </Animated.View>
  );
}

function Confetti({ index }: { index: number }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const startX = Math.random() * SCREEN_WIDTH;
    const endX = startX + (Math.random() - 0.5) * 200;

    translateX.setValue(startX);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 2000 + Math.random() * 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: endX,
        duration: 2000 + Math.random() * 1000,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: Math.random() * 360,
        duration: 2000 + Math.random() * 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const colors = ['#FFD700', '#FF69B4', '#4F46E5', '#10B981', '#F59E0B', '#EF4444'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          backgroundColor: color,
          transform: [
            { translateX },
            { translateY },
            { rotate: rotate.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) },
          ],
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: SCREEN_WIDTH - 48,
    maxWidth: 400,
  },
  sparklesContainer: {
    position: 'relative',
    width: 100,
    height: 60,
    marginBottom: 8,
  },
  sparkle1: {
    position: 'absolute',
    top: 0,
    left: 35,
  },
  sparkle2: {
    position: 'absolute',
    top: 15,
    left: 10,
  },
  sparkle3: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 24,
  },
  photosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  placeholderPhoto: {
    backgroundColor: '#E5E7EB',
  },
  heartContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -15,
    zIndex: 10,
  },
  heartEmoji: {
    fontSize: 48,
  },
  matchName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  compatibilityBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  compatibilityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 12,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  keepSwipingButton: {
    paddingVertical: 12,
  },
  keepSwipingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
