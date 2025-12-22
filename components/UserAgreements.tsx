import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Square, CheckSquare, X } from 'lucide-react-native';
import { setUserAgreementsAccepted } from '../services/storage';

interface UserAgreementsProps {
  onAccept: () => void;
  onDecline?: () => void;
}

export default function UserAgreements({ onAccept, onDecline }: UserAgreementsProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleContinue = async () => {
    if (!termsAccepted || !privacyAccepted) {
      Alert.alert('Required', 'Please accept both Terms of Service and Privacy Policy to continue.');
      return;
    }
    await setUserAgreementsAccepted();
    onAccept();
  };

  return (
    <View style={styles.container}>
      {onDecline && (
        <TouchableOpacity style={styles.closeButton} onPress={onDecline}>
          <X size={24} color="#6B7280" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>Welcome to UrbanDen</Text>
      <Text style={styles.subtitle}>Please review and accept our policies</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Terms of Service</Text>
        <ScrollView style={styles.documentContainer}>
          <Text style={styles.documentText}>
            {`1. Account Requirements
- You must be at least 18 years old
- Provide accurate information
- Maintain account security

2. User Conduct
- Be respectful and honest
- No harassment or discrimination
- Report suspicious activity

3. Content Ownership
- You own your content
- Grant us license to display content
- Don't post copyrighted material

4. Safety Guidelines
- Meet in public places
- Trust your instincts
- Report unsafe behavior

5. Verification
- Identity verification is optional
- We don't guarantee accuracy
- Use at your own discretion

6. Liability
- Use app at your own risk
- We're not responsible for roommate disputes
- No guarantee of finding a roommate

7. Termination
- We can suspend accounts
- You can delete your account
- Data retention per privacy policy`}
          </Text>
        </ScrollView>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setTermsAccepted(!termsAccepted)}
        >
          {termsAccepted ? (
            <CheckSquare size={24} color="#4F46E5" />
          ) : (
            <Square size={24} color="#6B7280" />
          )}
          <Text style={styles.checkboxLabel}>I accept the Terms of Service</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy Policy</Text>
        <ScrollView style={styles.documentContainer}>
          <Text style={styles.documentText}>
            {`1. Information Collection
- Profile information
- Location data
- Usage patterns
- Communications

2. Information Usage
- Match compatibility
- Improve services
- Communication
- Safety and security

3. Information Sharing
- With matched users
- Law enforcement if required
- Service providers
- Never sold to third parties

4. Data Security
- Encryption in transit
- Secure storage
- Regular security audits
- Breach notification

5. Your Rights (GDPR/CCPA)
- Access your data
- Request deletion
- Correct inaccuracies
- Export your data

6. Data Retention
- Active accounts: indefinitely
- Deleted accounts: 30 days
- Backups: 90 days
- Legal requirements may apply

7. Cookies
- Essential cookies only
- Analytics cookies (optional)
- No advertising cookies
- Manage in settings`}
          </Text>
        </ScrollView>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setPrivacyAccepted(!privacyAccepted)}
        >
          {privacyAccepted ? (
            <CheckSquare size={24} color="#4F46E5" />
          ) : (
            <Square size={24} color="#6B7280" />
          )}
          <Text style={styles.checkboxLabel}>I accept the Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          (!termsAccepted || !privacyAccepted) && styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!termsAccepted || !privacyAccepted}
      >
        <Text style={styles.continueButtonText}>Accept & Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginTop: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  documentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    maxHeight: 200,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  documentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  continueButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
