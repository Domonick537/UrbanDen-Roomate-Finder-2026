import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { supabase } from '../../services/supabase';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthText } from '../../utils/passwordValidation';

export default function ResetPasswordConfirmScreen() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'fair' | 'good' | 'strong'>('weak');

  useEffect(() => {
    if (newPassword) {
      const validation = validatePassword(newPassword);
      setPasswordStrength(validation.strength);
    }
  }, [newPassword]);

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      showToast(validation.errors.join('\n'), 'error');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Password updated successfully!', 'success');
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 2000);
      }
    } catch (error) {
      showToast('An unexpected error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
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

        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Please enter your new password below
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            {newPassword.length > 0 && (
              <View style={styles.strengthContainer}>
                <Text style={styles.strengthLabel}>Password Strength: </Text>
                <Text style={[styles.strengthText, { color: getPasswordStrengthColor(passwordStrength) }]}>
                  {getPasswordStrengthText(passwordStrength)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.updateButton, loading && styles.updateButtonDisabled]}
            onPress={handleUpdatePassword}
            disabled={loading}
          >
            <Text style={styles.updateButtonText}>
              {loading ? 'Updating...' : 'Update Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={toast.visible}
          onHide={hideToast}
        />
      )}
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
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24,
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
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  strengthLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  strengthText: {
    fontSize: 14,
    fontWeight: '600',
  },
  updateButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
