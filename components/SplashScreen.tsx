import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;
  const buildingScale = useRef(new Animated.Value(0.8)).current;
  const [windowLights, setWindowLights] = useState([true, true, true, true, true, true]);

  useEffect(() => {
    const lightInterval = setInterval(() => {
      setWindowLights(prev =>
        prev.map(() => Math.random() > 0.3)
      );
    }, 1500);

    return () => clearInterval(lightInterval);
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(buildingScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 500,
        delay: 3000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(onFinish, 100);
    });
  }, []);

  const rotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '0deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      <Animated.View
        style={{
          transform: [{ scale: logoScale }, { rotate: rotation }],
          opacity: logoOpacity,
        }}
      >
        <View style={styles.logo}>
          <Animated.View style={[styles.building, { transform: [{ scale: buildingScale }] }]}>
            <View style={styles.windowRow}>
              <View style={[styles.window, !windowLights[0] && styles.windowOff]} />
              <View style={[styles.window, !windowLights[1] && styles.windowOff]} />
            </View>
            <View style={styles.windowRow}>
              <View style={[styles.window, !windowLights[2] && styles.windowOff]} />
              <View style={[styles.window, !windowLights[3] && styles.windowOff]} />
            </View>
            <View style={styles.windowRow}>
              <View style={[styles.window, !windowLights[4] && styles.windowOff]} />
              <View style={[styles.window, !windowLights[5] && styles.windowOff]} />
            </View>
          </Animated.View>
          <View style={styles.letterD} />
        </View>
      </Animated.View>
      <Animated.Text
        style={[
          styles.appName,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }]
          }
        ]}
      >
        UrbanDen
      </Animated.Text>
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }]
          }
        ]}
      >
        Find Your Perfect Roommate
      </Animated.Text>
      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }]
          }
        ]}
      >
        where comfortability meets compatibility
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1B4B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  building: {
    width: 70,
    height: 110,
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    padding: 12,
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
    width: 14,
    height: 14,
    backgroundColor: '#FCD34D',
    borderRadius: 3,
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
    width: 55,
    height: 70,
    backgroundColor: '#4F46E5',
    borderTopRightRadius: 35,
    borderBottomRightRadius: 35,
    marginLeft: -12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 30,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: '#C4B5FD',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
  },
  subtitle: {
    fontSize: 13,
    color: '#A78BFA',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
});
