import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, Smile, User as UserIcon, CheckSquare, ChevronRight } from 'lucide-react-native';
import { getCurrentUser, getMessages, addMessage } from '../../services/storage';
import { getUserMatches } from '../../services/matching';
import { subscribeToMessages, markMessagesAsRead } from '../../services/realtime';
import { supabase } from '../../services/supabase';
import { User, Message, ICE_BREAKERS } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { getMatchChecklistStats, getChecklistTemplates } from '../../services/checklist';

export default function ChatScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [checklistStats, setChecklistStats] = useState<{ totalItems: number; completedItems: number; progressPercentage: number } | null>(null);
  const [showChecklistBanner, setShowChecklistBanner] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadChat();
  }, [matchId]);

  useEffect(() => {
    if (!matchId || !currentUser) return;

    const unsubscribe = subscribeToMessages(matchId, (newMessage) => {
      setMessages((prev) => {
        if (prev.some(m => m.id === newMessage.id)) {
          return prev;
        }
        return [...prev, newMessage];
      });

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    markMessagesAsRead(matchId, currentUser.id, currentUser.showReadReceipts);

    return () => {
      unsubscribe();
    };
  }, [matchId, currentUser]);

  const loadChat = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    setCurrentUser(user);

    const matches = await getUserMatches(user.id);
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const otherUserId = match.userId1 === user.id ? match.userId2 : match.userId1;

    const { data: otherProfile } = await supabase
      .from('profiles')
      .select('*, roommate_preferences(*)')
      .eq('id', otherUserId)
      .single();

    if (otherProfile) {
      const prefs = otherProfile.roommate_preferences?.[0] || {};
      const other: User = {
        id: otherProfile.id,
        firstName: otherProfile.first_name,
        age: otherProfile.age,
        gender: otherProfile.gender,
        occupation: otherProfile.occupation,
        bio: otherProfile.bio,
        email: '',
        phone: otherProfile.phone,
        photos: otherProfile.photos || [],
        profilePicture: otherProfile.photos?.[0],
        preferences: {
          genderPreference: prefs.gender_preference || 'any',
          ageMin: prefs.age_min || 18,
          ageMax: prefs.age_max || 65,
          budgetMin: prefs.budget_min || 500,
          budgetMax: prefs.budget_max || 2000,
          location: {
            city: prefs.location_city || '',
            state: prefs.location_state || '',
          },
          moveInDate: prefs.move_in_date || 'flexible',
          petPreference: prefs.pet_preference || 'flexible',
          smokingPreference: prefs.smoking_preference || 'flexible',
          drinkingPreference: prefs.drinking_preference || 'flexible',
          cleanliness: prefs.cleanliness || 'flexible',
          socialLevel: prefs.social_level || 'flexible',
        },
        isVerified: otherProfile.is_verified,
        isEmailVerified: otherProfile.is_email_verified,
        isPhoneVerified: otherProfile.is_phone_verified,
        showReadReceipts: otherProfile.show_read_receipts ?? true,
        createdAt: new Date(otherProfile.created_at || Date.now()),
        lastActive: new Date(otherProfile.last_active || Date.now()),
      };
      setOtherUser(other);
    }

    const chatMessages = await getMessages(matchId);
    setMessages(chatMessages);

    const stats = await getMatchChecklistStats(user.id, matchId);
    setChecklistStats(stats);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || !currentUser) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      matchId,
      senderId: currentUser.id,
      content: messageText,
      timestamp: new Date(),
      isRead: false,
    };

    await addMessage(newMessage);
    setMessages([...messages, newMessage]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === currentUser?.id;
    const showReadStatus = isMine && otherUser?.showReadReceipts && item.isRead;

    return (
      <View style={[styles.messageContainer, isMine ? styles.myMessage : styles.theirMessage]}>
        <View style={[styles.messageBubble, isMine ? [styles.myBubble, { backgroundColor: theme.colors.primary }] : [styles.theirBubble, { backgroundColor: theme.colors.card }]]}>
          <Text style={[styles.messageText, isMine ? styles.myText : [styles.theirText, { color: theme.colors.text }]]}>
            {item.content}
          </Text>
        </View>
        <View style={styles.messageFooter}>
          <Text style={[styles.timestamp, { color: theme.colors.textTertiary }]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {showReadStatus && (
            <Text style={[styles.readReceipt, { color: theme.colors.textTertiary }]}> • Read</Text>
          )}
        </View>
      </View>
    );
  };

  const renderIceBreaker = (iceBreaker: string, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.iceBreakerButton, { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primaryBorder }]}
      onPress={() => handleSend(iceBreaker)}
    >
      <Text style={[styles.iceBreakerText, { color: theme.colors.primary }]}>{iceBreaker}</Text>
    </TouchableOpacity>
  );

  if (!currentUser || !otherUser) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerCenter}
            onPress={() => router.push(`/profile/view/${otherUser.id}`)}
          >
            {otherUser.profilePicture ? (
              <Image source={{ uri: otherUser.profilePicture }} style={styles.headerImage} />
            ) : (
              <View style={[styles.headerImage, styles.placeholderImage, { backgroundColor: theme.colors.borderLight }]}>
                <UserIcon size={16} color={theme.colors.textTertiary} />
              </View>
            )}
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{otherUser.firstName}</Text>
          </TouchableOpacity>
          <View style={{ width: 24 }} />
        </View>

        {messages.length === 0 && (
          <View style={[styles.iceBreakersContainer, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
            <View style={styles.iceBreakersHeader}>
              <Smile size={20} color={theme.colors.primary} />
              <Text style={[styles.iceBreakersTitle, { color: theme.colors.primary }]}>Ice Breakers</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.iceBreakersScroll}
            >
              {ICE_BREAKERS.map((iceBreaker, index) => renderIceBreaker(iceBreaker, index))}
            </ScrollView>
          </View>
        )}

        {showChecklistBanner && (
          <TouchableOpacity
            style={[styles.checklistBanner, { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primaryBorder }]}
            onPress={() => {
              router.push({
                pathname: '/checklists',
                params: { matchId },
              });
            }}
          >
            <View style={styles.checklistBannerLeft}>
              <View style={[styles.checklistIconContainer, { backgroundColor: theme.colors.primary }]}>
                <CheckSquare size={20} color="#FFFFFF" />
              </View>
              <View style={styles.checklistBannerContent}>
                <Text style={[styles.checklistBannerTitle, { color: theme.colors.text }]}>
                  Safety Checklists for {otherUser?.firstName}
                </Text>
                <Text style={[styles.checklistBannerSubtitle, { color: theme.colors.textSecondary }]}>
                  {checklistStats?.totalItems === 0
                    ? 'Start your safety checklist before meeting'
                    : `${checklistStats?.completedItems || 0} of ${checklistStats?.totalItems || 0} items completed`}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        )}

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: inputText.trim() ? theme.colors.primary : theme.colors.borderLight }]}
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  placeholderImage: {
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  iceBreakersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iceBreakersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  iceBreakersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  iceBreakersScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  iceBreakerButton: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  iceBreakerText: {
    fontSize: 14,
    color: '#4F46E5',
  },
  checklistBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  checklistBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checklistIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checklistBannerContent: {
    flex: 1,
  },
  checklistBannerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  checklistBannerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  messagesContainer: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  theirMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myText: {
    color: '#FFFFFF',
  },
  theirText: {
    color: '#111827',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  readReceipt: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
});
