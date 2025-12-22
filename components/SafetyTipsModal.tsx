import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { X, Shield, AlertTriangle, Users, MapPin, MessageSquare, Eye } from 'lucide-react-native';

interface SafetyTipsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SafetyTipsModal({ visible, onClose }: SafetyTipsModalProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Shield size={24} color="#059669" />
            <Text style={styles.title}>Safety Tips</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.intro}>
            <Text style={styles.introText}>
              Your safety is our priority. Follow these guidelines when meeting potential roommates.
            </Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Users size={24} color="#059669" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Meet in Public Places</Text>
              <Text style={styles.tipDescription}>
                Always meet potential roommates in busy, public locations like coffee shops or community centers during daylight hours.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <AlertTriangle size={24} color="#F59E0B" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Trust Your Instincts</Text>
              <Text style={styles.tipDescription}>
                If something feels off, don't ignore it. It's okay to walk away from any situation that makes you uncomfortable.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <MessageSquare size={24} color="#3B82F6" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Verify Identity</Text>
              <Text style={styles.tipDescription}>
                Before meeting, verify the person's identity through video calls and social media. Ask for references from previous roommates.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Eye size={24} color="#8B5CF6" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Tell Someone You Trust</Text>
              <Text style={styles.tipDescription}>
                Always let a friend or family member know where you're going, who you're meeting, and when you expect to return.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <MapPin size={24} color="#EC4899" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Visit the Property Safely</Text>
              <Text style={styles.tipDescription}>
                When viewing a property, bring a friend or family member. Never give money or sign anything without thoroughly reviewing documents.
              </Text>
            </View>
          </View>

          <View style={styles.warningBox}>
            <AlertTriangle size={20} color="#DC2626" />
            <Text style={styles.warningText}>
              Never share personal financial information, social security numbers, or bank details through the app or before verifying identity.
            </Text>
          </View>

          <View style={styles.reportSection}>
            <Text style={styles.reportTitle}>Report Suspicious Behavior</Text>
            <Text style={styles.reportText}>
              If someone makes you uncomfortable or violates our community guidelines, report them immediately. We take all reports seriously.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>I Understand</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  intro: {
    backgroundColor: '#ECFDF5',
    padding: 20,
    marginBottom: 20,
  },
  introText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#065F46',
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#991B1B',
  },
  reportSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  reportText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#6B7280',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
