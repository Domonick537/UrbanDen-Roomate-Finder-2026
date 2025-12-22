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

export default function PrivacyPolicyScreen() {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <Text style={styles.headerSubtitle}>Last updated: December 2024</Text>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.intro}>
          <Text style={styles.introText}>
            At UrbanDen, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our roommate matching service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.subheading}>Personal Information</Text>
          <Text style={styles.paragraph}>We collect information you provide directly to us, including:</Text>
          <Text style={styles.bulletPoint}>• Name, age, and gender</Text>
          <Text style={styles.bulletPoint}>• Email address and password</Text>
          <Text style={styles.bulletPoint}>• Profile photos</Text>
          <Text style={styles.bulletPoint}>• Occupation and bio</Text>
          <Text style={styles.bulletPoint}>• Housing preferences (budget, location, lifestyle)</Text>
          <Text style={styles.bulletPoint}>• Messages and communications with other users</Text>

          <Text style={[styles.subheading, styles.marginTop]}>Usage Information</Text>
          <Text style={styles.paragraph}>We automatically collect certain information, including:</Text>
          <Text style={styles.bulletPoint}>• Device information and identifiers</Text>
          <Text style={styles.bulletPoint}>• IP address and location data</Text>
          <Text style={styles.bulletPoint}>• App usage statistics and preferences</Text>
          <Text style={styles.bulletPoint}>• Interaction data (swipes, matches, messages)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>We use your information to:</Text>
          <Text style={styles.bulletPoint}>• Create and manage your account</Text>
          <Text style={styles.bulletPoint}>• Match you with compatible roommates</Text>
          <Text style={styles.bulletPoint}>• Facilitate communication between users</Text>
          <Text style={styles.bulletPoint}>• Improve our matching algorithm</Text>
          <Text style={styles.bulletPoint}>• Send you notifications and updates</Text>
          <Text style={styles.bulletPoint}>• Prevent fraud and ensure platform safety</Text>
          <Text style={styles.bulletPoint}>• Comply with legal obligations</Text>
          <Text style={styles.bulletPoint}>• Analyze usage patterns to improve our service</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Information Sharing</Text>
          <Text style={styles.paragraph}>We share your information in the following situations:</Text>

          <Text style={styles.subheading}>With Other Users</Text>
          <Text style={styles.paragraph}>
            Your profile information, photos, and preferences are visible to other users for matching purposes. You control what information you include in your profile.
          </Text>

          <Text style={[styles.subheading, styles.marginTop]}>Service Providers</Text>
          <Text style={styles.paragraph}>
            We may share your information with third-party service providers who perform services on our behalf, such as hosting, analytics, and customer support.
          </Text>

          <Text style={[styles.subheading, styles.marginTop]}>Legal Requirements</Text>
          <Text style={styles.paragraph}>
            We may disclose your information if required by law or in response to valid requests by public authorities.
          </Text>

          <Text style={[styles.subheading, styles.marginTop]}>Business Transfers</Text>
          <Text style={styles.paragraph}>
            In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </Text>
          <Text style={styles.paragraph}>
            We use industry-standard encryption for data transmission and storage, secure authentication protocols, and regular security audits to maintain the safety of your information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your information for as long as your account is active or as needed to provide you services. If you delete your account, we will delete or anonymize your personal information within 30 days, except where we need to retain it for legal or legitimate business purposes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Your Rights and Choices</Text>
          <Text style={styles.paragraph}>You have the right to:</Text>
          <Text style={styles.bulletPoint}>• Access and update your personal information</Text>
          <Text style={styles.bulletPoint}>• Delete your account and associated data</Text>
          <Text style={styles.bulletPoint}>• Export your data in a portable format</Text>
          <Text style={styles.bulletPoint}>• Opt out of marketing communications</Text>
          <Text style={styles.bulletPoint}>• Control your privacy settings and profile visibility</Text>
          <Text style={styles.bulletPoint}>• Block or report other users</Text>
          <Text style={styles.paragraph}>
            To exercise these rights, please contact us at privacy@urbanden.com or use the in-app settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            UrbanDen is not intended for users under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will delete such information immediately.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. International Data Transfers</Text>
          <Text style={styles.paragraph}>
            Your information may be transferred to and maintained on servers located outside of your jurisdiction, where data protection laws may differ. By using UrbanDen, you consent to such transfers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Third-Party Links</Text>
          <Text style={styles.paragraph}>
            Our service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of UrbanDen constitutes acceptance of the updated policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. California Privacy Rights</Text>
          <Text style={styles.paragraph}>
            California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected, the right to delete personal information, and the right to opt-out of the sale of personal information. We do not sell your personal information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. GDPR Compliance</Text>
          <Text style={styles.paragraph}>
            For users in the European Economic Area, we comply with the General Data Protection Regulation (GDPR). You have rights including access, rectification, erasure, data portability, and the right to lodge a complaint with a supervisory authority.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>Email: privacy@urbanden.com</Text>
          <Text style={styles.contactInfo}>Address: UrbanDen Inc., Privacy Office</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using UrbanDen, you acknowledge that you have read and understood this Privacy Policy and agree to the collection, use, and disclosure of your information as described herein.
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
  intro: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  introText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
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
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  marginTop: {
    marginTop: 16,
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
  contactInfo: {
    fontSize: 14,
    lineHeight: 22,
    color: '#059669',
    marginLeft: 16,
    marginTop: 4,
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
