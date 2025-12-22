import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#059669', '#10B981']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <Text style={styles.headerSubtitle}>Last updated: December 2024</Text>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using UrbanDen, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.paragraph}>
            UrbanDen is a roommate matching platform that connects individuals seeking shared housing arrangements. We provide a platform for users to create profiles, discover potential roommates, and communicate with matches.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Eligibility</Text>
          <Text style={styles.paragraph}>
            You must be at least 18 years of age to use UrbanDen. By using our service, you represent and warrant that you meet this age requirement and have the legal capacity to enter into this agreement.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. User Responsibilities</Text>
          <Text style={styles.paragraph}>You agree to:</Text>
          <Text style={styles.bulletPoint}>• Provide accurate and truthful information in your profile</Text>
          <Text style={styles.bulletPoint}>• Maintain the confidentiality of your account credentials</Text>
          <Text style={styles.bulletPoint}>• Not impersonate any person or entity</Text>
          <Text style={styles.bulletPoint}>• Not engage in harassment, discrimination, or abusive behavior</Text>
          <Text style={styles.bulletPoint}>• Not use the service for any illegal purposes</Text>
          <Text style={styles.bulletPoint}>• Report any suspicious or inappropriate behavior</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Content and Conduct</Text>
          <Text style={styles.paragraph}>
            You are solely responsible for the content you post on UrbanDen. You grant us a non-exclusive, royalty-free license to use, reproduce, and display your content for the purpose of providing our services. We reserve the right to remove any content that violates these terms or is deemed inappropriate.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Verification and Safety</Text>
          <Text style={styles.paragraph}>
            While we offer optional identity verification features, UrbanDen does not conduct background checks on users. You are responsible for conducting your own due diligence before entering into any housing arrangement. We strongly recommend meeting potential roommates in public places and verifying their identity.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Disclaimer of Warranties</Text>
          <Text style={styles.paragraph}>
            UrbanDen is provided "as is" without warranties of any kind. We do not guarantee the accuracy of user-provided information or the success of any roommate matching. We are not responsible for any disputes, damages, or losses arising from interactions between users.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            To the maximum extent permitted by law, UrbanDen shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service. Our total liability shall not exceed the amount you paid us in the past 12 months.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Housing Discrimination</Text>
          <Text style={styles.paragraph}>
            Users must comply with all applicable fair housing laws. UrbanDen prohibits discrimination based on race, color, religion, national origin, sex, familial status, or disability. Preference settings must be used responsibly and within legal boundaries.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Account Termination</Text>
          <Text style={styles.paragraph}>
            We reserve the right to suspend or terminate your account at any time for violating these terms or engaging in behavior we deem harmful to our community. You may delete your account at any time through the app settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Modifications to Service</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify or discontinue UrbanDen at any time without notice. We may also update these Terms of Service periodically. Continued use of the service constitutes acceptance of the modified terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which UrbanDen operates, without regard to its conflict of law provisions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Contact Information</Text>
          <Text style={styles.paragraph}>
            For questions about these Terms of Service, please contact us at support@urbanden.com
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using UrbanDen, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </Text>
        </View>
      </ScrollView>
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
  backButton: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    marginLeft: 16,
    marginBottom: 4,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
