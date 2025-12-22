import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Square, CheckSquare } from 'lucide-react-native';
import { supabase } from '../../services/supabase';
import { setUserAgreementsAccepted } from '../../services/storage';
import UserAgreements from '../../components/UserAgreements';

export default function SignupScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAgreements, setShowAgreements] = useState(false);

  const handleSignup = async () => {
    if (!firstName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      setShowAgreements(true);
      return;
    }

    await createAccount();
  };

  const handleAgreementsAccept = async () => {
    setTermsAccepted(true);
    setShowAgreements(false);
    await createAccount();
  };

  const createAccount = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
          },
        },
      });

      if (authError) {
        Alert.alert('Error', authError.message);
        return;
      }

      if (!authData.user) {
        Alert.alert('Error', 'Failed to create account. Please try again.');
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          first_name: firstName,
          age: 0,
          gender: 'male',
          occupation: '',
          bio: '',
          is_verified: false,
          is_email_verified: authData.user.email_confirmed_at !== null,
          is_phone_verified: false,
          photos: [],
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      await setUserAgreementsAccepted(authData.user.id);

      if (authData.user.email_confirmed_at) {
        router.replace('/(auth)/onboarding');
      } else {
        Alert.alert(
          'Verify Your Email',
          'We sent a verification link to your email. Please check your inbox and verify your email before logging in.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/login'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.termsSection}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              {termsAccepted ? (
                <CheckSquare size={24} color="#059669" />
              ) : (
                <Square size={24} color="#6B7280" />
              )}
              <Text style={styles.checkboxLabel}>
                I accept the{' '}
                <Text
                  style={styles.linkText}
                  onPress={() => setShowAgreements(true)}
                >
                  Terms & Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignup}>
            <Text style={styles.signUpButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.signInText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showAgreements}
        animationType="slide"
        onRequestClose={() => setShowAgreements(false)}
      >
        <UserAgreements
          onAccept={handleAgreementsAccept}
          onDecline={() => setShowAgreements(false)}
        />
      </Modal>
    </KeyboardAvoidingView>
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
  backButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  termsSection: {
    marginBottom: 24,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  linkText: {
    color: '#059669',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  signUpButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  signInText: {
    fontSize: 16,
    color: '#059669',
    textAlign: 'center',
  },
});
