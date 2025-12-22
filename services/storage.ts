import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { User, Match, Message, SwipeAction } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'current_user_id',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  USER_AGREEMENTS_ACCEPTED: 'user_agreements_accepted',
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (!profile) return null;

    const { data: preferences } = await supabase
      .from('roommate_preferences')
      .select('*')
      .eq('user_id', profile.id)
      .maybeSingle();

    if (!preferences) return null;

    return {
      id: profile.id,
      firstName: profile.first_name,
      age: profile.age,
      gender: profile.gender,
      occupation: profile.occupation,
      profilePicture: profile.profile_picture,
      bio: profile.bio,
      email: authUser.email || '',
      phone: profile.phone,
      isVerified: profile.is_verified,
      isEmailVerified: profile.is_email_verified,
      isPhoneVerified: profile.is_phone_verified,
      createdAt: new Date(profile.created_at),
      lastActive: new Date(profile.last_active),
      photos: profile.photos || [],
      preferences: {
        genderPreference: preferences.gender_preference,
        budgetMin: preferences.budget_min,
        budgetMax: preferences.budget_max,
        location: {
          state: preferences.state,
          city: preferences.city,
          neighborhood: preferences.neighborhood,
        },
        moveInDate: preferences.move_in_date,
        moveInDateSpecific: preferences.move_in_date_specific ? new Date(preferences.move_in_date_specific) : undefined,
        petPreference: preferences.pet_preference,
        smokingPreference: preferences.smoking_preference,
        drinkingPreference: preferences.drinking_preference,
        cleanliness: preferences.cleanliness,
        socialLevel: preferences.social_level,
      },
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const setCurrentUser = async (user: User | null): Promise<void> => {
  try {
    if (user) {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  } catch (error) {
    console.error('Error setting current user:', error);
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*, roommate_preferences(*)');

    if (!profiles) return [];

    return profiles
      .filter(profile => profile.roommate_preferences && profile.roommate_preferences.length > 0)
      .map((profile: any) => {
        const prefs = profile.roommate_preferences[0];
        return {
          id: profile.id,
          firstName: profile.first_name,
          age: profile.age,
          gender: profile.gender,
          occupation: profile.occupation,
          profilePicture: profile.profile_picture,
          bio: profile.bio,
          email: '',
          phone: profile.phone,
          isVerified: profile.is_verified,
          isEmailVerified: profile.is_email_verified,
          isPhoneVerified: profile.is_phone_verified,
          createdAt: new Date(profile.created_at),
          lastActive: new Date(profile.last_active),
          photos: profile.photos || [],
          preferences: {
            genderPreference: prefs.gender_preference,
            budgetMin: prefs.budget_min,
            budgetMax: prefs.budget_max,
            location: {
              state: prefs.state,
              city: prefs.city,
              neighborhood: prefs.neighborhood,
            },
            moveInDate: prefs.move_in_date,
            moveInDateSpecific: prefs.move_in_date_specific ? new Date(prefs.move_in_date_specific) : undefined,
            petPreference: prefs.pet_preference,
            smokingPreference: prefs.smoking_preference,
            drinkingPreference: prefs.drinking_preference,
            cleanliness: prefs.cleanliness,
            socialLevel: prefs.social_level,
          },
        };
      });
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

export const addUser = async (user: User): Promise<void> => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        first_name: user.firstName,
        age: user.age,
        gender: user.gender,
        occupation: user.occupation,
        profile_picture: user.profilePicture,
        bio: user.bio,
        phone: user.phone,
        is_verified: user.isVerified,
        is_email_verified: user.isEmailVerified,
        is_phone_verified: user.isPhoneVerified,
        photos: user.photos,
      })
      .select()
      .single();

    if (profileError) throw profileError;

    const { error: prefsError } = await supabase
      .from('roommate_preferences')
      .insert({
        user_id: user.id,
        gender_preference: user.preferences.genderPreference,
        budget_min: user.preferences.budgetMin,
        budget_max: user.preferences.budgetMax,
        state: user.preferences.location.state,
        city: user.preferences.location.city,
        neighborhood: user.preferences.location.neighborhood,
        move_in_date: user.preferences.moveInDate,
        move_in_date_specific: user.preferences.moveInDateSpecific,
        pet_preference: user.preferences.petPreference,
        smoking_preference: user.preferences.smokingPreference,
        drinking_preference: user.preferences.drinkingPreference,
        cleanliness: user.preferences.cleanliness,
        social_level: user.preferences.socialLevel,
      });

    if (prefsError) throw prefsError;
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

export const updateUser = async (user: User): Promise<void> => {
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: user.firstName,
        age: user.age,
        gender: user.gender,
        occupation: user.occupation,
        profile_picture: user.profilePicture,
        bio: user.bio,
        phone: user.phone,
        is_verified: user.isVerified,
        is_email_verified: user.isEmailVerified,
        is_phone_verified: user.isPhoneVerified,
        photos: user.photos,
        last_active: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('Profile update error:', profileError);
      throw new Error(`Failed to update profile: ${profileError.message}`);
    }

    const { error: prefsError } = await supabase
      .from('roommate_preferences')
      .update({
        gender_preference: user.preferences.genderPreference,
        budget_min: user.preferences.budgetMin,
        budget_max: user.preferences.budgetMax,
        state: user.preferences.location.state,
        city: user.preferences.location.city,
        neighborhood: user.preferences.location.neighborhood,
        move_in_date: user.preferences.moveInDate,
        move_in_date_specific: user.preferences.moveInDateSpecific,
        pet_preference: user.preferences.petPreference,
        smoking_preference: user.preferences.smokingPreference,
        drinking_preference: user.preferences.drinkingPreference,
        cleanliness: user.preferences.cleanliness,
        social_level: user.preferences.socialLevel,
      })
      .eq('user_id', user.id);

    if (prefsError) {
      console.error('Preferences update error:', prefsError);
      throw new Error(`Failed to update preferences: ${prefsError.message}`);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const getSwipeActions = async (): Promise<SwipeAction[]> => {
  try {
    const { data } = await supabase
      .from('swipe_actions')
      .select('*');

    if (!data) return [];

    return data.map((action: any) => ({
      userId: action.user_id,
      targetUserId: action.target_user_id,
      action: action.action,
      timestamp: new Date(action.created_at),
    }));
  } catch (error) {
    console.error('Error getting swipe actions:', error);
    return [];
  }
};

export const addSwipeAction = async (action: SwipeAction): Promise<void> => {
  try {
    await supabase
      .from('swipe_actions')
      .insert({
        user_id: action.userId,
        target_user_id: action.targetUserId,
        action: action.action,
      });
  } catch (error) {
    console.error('Error adding swipe action:', error);
  }
};

export const getMatches = async (): Promise<Match[]> => {
  try {
    const { data } = await supabase
      .from('matches')
      .select('*');

    if (!data) return [];

    return data.map((match: any) => ({
      id: match.id,
      userId1: match.user_id_1,
      userId2: match.user_id_2,
      createdAt: new Date(match.created_at),
      lastMessageAt: match.last_message_at ? new Date(match.last_message_at) : undefined,
      compatibility: match.compatibility,
    }));
  } catch (error) {
    console.error('Error getting matches:', error);
    return [];
  }
};

export const addMatch = async (match: Match): Promise<void> => {
  try {
    await supabase
      .from('matches')
      .insert({
        id: match.id,
        user_id_1: match.userId1,
        user_id_2: match.userId2,
        compatibility: match.compatibility,
      });
  } catch (error) {
    console.error('Error adding match:', error);
  }
};

export const updateMatch = async (matchId: string, updates: Partial<Match>): Promise<void> => {
  try {
    const updateData: any = {};
    if (updates.lastMessageAt) {
      updateData.last_message_at = updates.lastMessageAt.toISOString();
    }
    if (updates.compatibility !== undefined) {
      updateData.compatibility = updates.compatibility;
    }

    await supabase
      .from('matches')
      .update(updateData)
      .eq('id', matchId);
  } catch (error) {
    console.error('Error updating match:', error);
  }
};

export const getMessages = async (matchId?: string): Promise<Message[]> => {
  try {
    let query = supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (matchId) {
      query = query.eq('match_id', matchId);
    }

    const { data } = await query;

    if (!data) return [];

    return data.map((msg: any) => ({
      id: msg.id,
      matchId: msg.match_id,
      senderId: msg.sender_id,
      content: msg.content,
      timestamp: new Date(msg.created_at),
      isRead: msg.is_read,
    }));
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

export const addMessage = async (message: Message): Promise<void> => {
  try {
    await supabase
      .from('messages')
      .insert({
        id: message.id,
        match_id: message.matchId,
        sender_id: message.senderId,
        content: message.content,
        is_read: message.isRead,
      });

    await updateMatch(message.matchId, { lastMessageAt: message.timestamp });
  } catch (error) {
    console.error('Error adding message:', error);
  }
};

export const sendMessage = async (matchId: string, senderId: string, content: string): Promise<void> => {
  const message: Message = {
    id: crypto.randomUUID(),
    matchId,
    senderId,
    content,
    timestamp: new Date(),
    isRead: false,
  };
  await addMessage(message);
};

export const isOnboardingComplete = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

export const setOnboardingComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
  } catch (error) {
    console.error('Error setting onboarding complete:', error);
  }
};

export const areUserAgreementsAccepted = async (userId: string): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('user_agreements')
      .select('terms_accepted, privacy_accepted')
      .eq('user_id', userId)
      .maybeSingle();

    return data?.terms_accepted && data?.privacy_accepted;
  } catch (error) {
    console.error('Error checking user agreements:', error);
    return false;
  }
};

export const setUserAgreementsAccepted = async (userId: string): Promise<void> => {
  try {
    await supabase
      .from('user_agreements')
      .upsert({
        user_id: userId,
        terms_accepted: true,
        privacy_accepted: true,
        accepted_at: new Date().toISOString(),
      });
  } catch (error) {
    console.error('Error setting user agreements accepted:', error);
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};

export const getRoommateAgreements = async (): Promise<any[]> => {
  try {
    const stored = await AsyncStorage.getItem('roommate_agreements');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting agreements:', error);
    return [];
  }
};

export const addRoommateAgreement = async (agreement: any): Promise<void> => {
  try {
    const agreements = await getRoommateAgreements();
    agreements.push(agreement);
    await AsyncStorage.setItem('roommate_agreements', JSON.stringify(agreements));
  } catch (error) {
    console.error('Error adding agreement:', error);
  }
};

export const updateRoommateAgreement = async (id: string, updates: any): Promise<void> => {
  try {
    const agreements = await getRoommateAgreements();
    const index = agreements.findIndex(a => a.id === id);
    if (index !== -1) {
      agreements[index] = { ...agreements[index], ...updates, updatedAt: new Date() };
      await AsyncStorage.setItem('roommate_agreements', JSON.stringify(agreements));
    }
  } catch (error) {
    console.error('Error updating agreement:', error);
  }
};

export const deleteRoommateAgreement = async (id: string): Promise<void> => {
  try {
    const agreements = await getRoommateAgreements();
    const filtered = agreements.filter(a => a.id !== id);
    await AsyncStorage.setItem('roommate_agreements', JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting agreement:', error);
  }
};

export const getVerificationDocuments = async (): Promise<any[]> => {
  return [];
};

export const addVerificationDocument = async (doc: any): Promise<void> => {
  console.log('Verification documents not yet implemented in database');
};
