import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { View } from 'react-native';
import SplashScreenComponent from '../components/SplashScreen';
import ErrorBoundary from '../components/ErrorBoundary';
import {
  getCurrentUser,
  isOnboardingComplete,
  getAllUsers,
  addUser,
  getRoommateAgreements,
  addRoommateAgreement,
} from '../services/storage';
import { mockUsers, agreementTemplates } from '../services/mockData';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const router = useRouter();
  const [appReady, setAppReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    initializeApp();
  }, [fontsLoaded]);

  useEffect(() => {
    if (appReady && !showSplash) {
      setTimeout(async () => {
        await navigateToCorrectScreen();
        await SplashScreen.hideAsync();
      }, 100);
    }
  }, [appReady, showSplash]);


  const initializeApp = async () => {
    if (!fontsLoaded) return;

    await initializeMockData();

    const hasSeenSplash = await AsyncStorage.getItem('hasSeenSplash');
    const currentUser = await getCurrentUser();

    if (hasSeenSplash === 'true' && currentUser) {
      setShowSplash(false);
    } else {
      await AsyncStorage.removeItem('hasSeenSplash');
    }

    setAppReady(true);
  };

  const initializeMockData = async () => {
    // Mock users are not added to database - they exist only in mockData.ts
    // Real users will be created through the signup flow
  };

  const handleSplashFinish = async () => {
    await AsyncStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
    setTimeout(async () => {
      await navigateToCorrectScreen();
      await SplashScreen.hideAsync();
    }, 50);
  };

  const navigateToCorrectScreen = async () => {
    const user = await getCurrentUser();
    if (!user) {
      router.replace('/(auth)/welcome');
      return;
    }

    const onboardingDone = await isOnboardingComplete();
    if (!onboardingDone) {
      router.replace('/(auth)/onboarding');
      return;
    }

    router.replace('/(tabs)');
  };

  if (!appReady || !fontsLoaded) {
    return null;
  }

  if (showSplash) {
    return <SplashScreenComponent onFinish={handleSplashFinish} />;
  }

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ErrorBoundary>
  );
}
