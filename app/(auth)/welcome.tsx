import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Users, Shield, MessageCircle, MapPin } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const [windowLights, setWindowLights] = useState([true, true, true, true, true, true]);

  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    const lightInterval = setInterval(() => {
      setWindowLights(prev =>
        prev.map(() => Math.random() > 0.3)
      );
    }, 1500);

    return () => clearInterval(lightInterval);
  }, []);

  const handleLogoPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    Animated.parallel([
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          tension: 100,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    setWindowLights(prev => prev.map(() => Math.random() > 0.5));
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5deg', '5deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.logoSection}>
        <TouchableOpacity
          onPress={handleLogoPress}
          activeOpacity={0.9}
          style={styles.logoTouchable}
        >
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [
                  { translateY: floatAnim },
                  { scale: Animated.multiply(scaleAnim, pulseAnim) },
                  { rotate: rotation },
                ],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.logoGlow,
                {
                  opacity: glowOpacity,
                },
              ]}
            />
            <View style={styles.logo}>
              <View style={styles.building}>
                <View style={styles.windowRow}>
                  <Animated.View
                    style={[
                      styles.window,
                      !windowLights[0] && styles.windowOff,
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.window,
                      !windowLights[1] && styles.windowOff,
                    ]}
                  />
                </View>
                <View style={styles.windowRow}>
                  <Animated.View
                    style={[
                      styles.window,
                      !windowLights[2] && styles.windowOff,
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.window,
                      !windowLights[3] && styles.windowOff,
                    ]}
                  />
                </View>
                <View style={styles.windowRow}>
                  <Animated.View
                    style={[
                      styles.window,
                      !windowLights[4] && styles.windowOff,
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.window,
                      !windowLights[5] && styles.windowOff,
                    ]}
                  />
                </View>
              </View>
              <View style={styles.letterD} />
            </View>
          </Animated.View>
        </TouchableOpacity>

        <Animated.Text
          style={[
            styles.appName,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          UrbanDen
        </Animated.Text>
        <Text style={styles.tagline}>Find Your Perfect Roommate</Text>
        <Text style={styles.subtitle}>where comfortability meets compatibility</Text>
        <Text style={styles.tapHint}>Tap the logo!</Text>
      </View>

      <View style={styles.features}>
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Users size={24} color="#4F46E5" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Smart Matching</Text>
            <Text style={styles.featureDescription}>
              Algorithm-based compatibility scoring
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Shield size={24} color="#4F46E5" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Verified Profiles</Text>
            <Text style={styles.featureDescription}>
              Identity verification for safety
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <MessageCircle size={24} color="#4F46E5" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Safe Messaging</Text>
            <Text style={styles.featureDescription}>Secure chat system</Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <MapPin size={24} color="#4F46E5" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Location-Based</Text>
            <Text style={styles.featureDescription}>US & Canada coverage</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            router.push('/(auth)/signup');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            router.push('/(auth)/login');
          }}
        >
          <Text style={styles.secondaryButtonText}>
            Already have an account? Sign In
          </Text>
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
    padding: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoTouchable: {
    marginBottom: 16,
  },
  logoContainer: {
    position: 'relative',
  },
  logoGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    backgroundColor: '#4F46E5',
    borderRadius: 80,
    opacity: 0.3,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  building: {
    width: 60,
    height: 100,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'space-around',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  windowRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  window: {
    width: 12,
    height: 12,
    backgroundColor: '#FCD34D',
    borderRadius: 2,
    shadowColor: '#FCD34D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  windowOff: {
    backgroundColor: '#6366F1',
    shadowOpacity: 0,
  },
  letterD: {
    width: 50,
    height: 60,
    backgroundColor: '#4F46E5',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    marginLeft: -10,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  tapHint: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  features: {
    marginBottom: 40,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#EEF2FF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  actions: {
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#4F46E5',
    textAlign: 'center',
  },
});
