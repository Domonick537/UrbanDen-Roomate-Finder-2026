import { User, Match, SwipeAction } from '../types';
import { supabase } from './supabase';

export const calculateCompatibility = (user1: User, user2: User): number => {
  let score = 0;

  if (user1.preferences.genderPreference === 'any' || user2.preferences.genderPreference === 'any') {
    score += 20;
  } else if (
    user1.preferences.genderPreference === user2.gender &&
    user2.preferences.genderPreference === user1.gender
  ) {
    score += 20;
  }

  const user1Min = user1.preferences.budgetMin;
  const user1Max = user1.preferences.budgetMax;
  const user2Min = user2.preferences.budgetMin;
  const user2Max = user2.preferences.budgetMax;

  const overlapMin = Math.max(user1Min, user2Min);
  const overlapMax = Math.min(user1Max, user2Max);

  if (overlapMax >= overlapMin) {
    const overlapSize = overlapMax - overlapMin;
    const user1Range = user1Max - user1Min;
    const user2Range = user2Max - user2Min;
    const avgRange = (user1Range + user2Range) / 2;
    score += Math.round((overlapSize / avgRange) * 20);
  }

  if (user1.preferences.location.state === user2.preferences.location.state) {
    score += 5;
  }
  if (user1.preferences.location.city.toLowerCase() === user2.preferences.location.city.toLowerCase()) {
    score += 10;
  }

  if (
    user1.preferences.moveInDate === user2.preferences.moveInDate ||
    user1.preferences.moveInDate === 'flexible' ||
    user2.preferences.moveInDate === 'flexible'
  ) {
    score += 10;
  }

  if (
    user1.preferences.petPreference === user2.preferences.petPreference ||
    user1.preferences.petPreference === 'flexible' ||
    user2.preferences.petPreference === 'flexible'
  ) {
    score += 10;
  }

  if (
    user1.preferences.smokingPreference === user2.preferences.smokingPreference ||
    user1.preferences.smokingPreference === 'flexible' ||
    user2.preferences.smokingPreference === 'flexible'
  ) {
    score += 10;
  }

  if (
    user1.preferences.drinkingPreference === user2.preferences.drinkingPreference ||
    user1.preferences.drinkingPreference === 'flexible' ||
    user2.preferences.drinkingPreference === 'flexible'
  ) {
    score += 5;
  }

  if (
    user1.preferences.cleanliness === user2.preferences.cleanliness ||
    user1.preferences.cleanliness === 'flexible' ||
    user2.preferences.cleanliness === 'flexible'
  ) {
    score += 5;
  }

  if (
    user1.preferences.socialLevel === user2.preferences.socialLevel ||
    user1.preferences.socialLevel === 'flexible' ||
    user2.preferences.socialLevel === 'flexible'
  ) {
    score += 5;
  }

  return Math.min(100, Math.round(score));
};

export const getPotentialMatches = async (currentUser: User): Promise<(User & { compatibility: number })[]> => {
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('*, roommate_preferences(*)')
    .neq('id', currentUser.id);

  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .or(`user_id_1.eq.${currentUser.id},user_id_2.eq.${currentUser.id}`);

  const { data: swipeActions } = await supabase
    .from('swipe_actions')
    .select('*')
    .eq('user_id', currentUser.id);

  const { data: blockedUsers } = await supabase
    .from('blocked_users')
    .select('blocked_id')
    .eq('blocker_id', currentUser.id);

  const { data: blockersOfMe } = await supabase
    .from('blocked_users')
    .select('blocker_id')
    .eq('blocked_id', currentUser.id);

  const matchedUserIds = new Set<string>();
  (matches || []).forEach(match => {
    if (match.user_id_1 === currentUser.id) matchedUserIds.add(match.user_id_2);
    if (match.user_id_2 === currentUser.id) matchedUserIds.add(match.user_id_1);
  });

  const swipedUserIds = new Set<string>();
  (swipeActions || []).forEach(action => swipedUserIds.add(action.target_user_id));

  const blockedIds = new Set<string>();
  (blockedUsers || []).forEach(b => blockedIds.add(b.blocked_id));
  (blockersOfMe || []).forEach(b => blockedIds.add(b.blocker_id));

  const convertProfile = (profile: any): User => {
    const prefs = profile.roommate_preferences?.[0] || {};
    return {
      id: profile.id,
      firstName: profile.first_name,
      age: profile.age,
      gender: profile.gender,
      occupation: profile.occupation,
      bio: profile.bio,
      email: profile.email || '',
      phone: profile.phone,
      photos: profile.photos || [],
      preferences: {
        genderPreference: prefs.gender_preference || 'any',
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
      isVerified: profile.is_verified,
      isEmailVerified: profile.is_email_verified,
      isPhoneVerified: profile.is_phone_verified,
      createdAt: new Date(profile.created_at || Date.now()),
      lastActive: new Date(profile.last_active || Date.now()),
    };
  };

  const potentialMatches = (allProfiles || [])
    .filter(profile =>
      !matchedUserIds.has(profile.id) &&
      !swipedUserIds.has(profile.id) &&
      !blockedIds.has(profile.id)
    )
    .map(profile => {
      const user = convertProfile(profile);
      return {
        ...user,
        compatibility: calculateCompatibility(currentUser, user),
      };
    })
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, 20);

  return potentialMatches;
};

export const handleSwipe = async (
  userId: string,
  targetUserId: string,
  action: 'like' | 'pass'
): Promise<Match | null> => {
  await supabase
    .from('swipe_actions')
    .insert({
      user_id: userId,
      target_user_id: targetUserId,
      action,
    });

  if (action === 'like') {
    const { data: reciprocalLike } = await supabase
      .from('swipe_actions')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('target_user_id', userId)
      .eq('action', 'like')
      .maybeSingle();

    if (reciprocalLike) {
      const { data: user1Profile } = await supabase
        .from('profiles')
        .select('*, roommate_preferences(*)')
        .eq('id', userId)
        .single();

      const { data: user2Profile } = await supabase
        .from('profiles')
        .select('*, roommate_preferences(*)')
        .eq('id', targetUserId)
        .single();

      if (user1Profile && user2Profile) {
        const convertProfile = (profile: any): User => {
          const prefs = profile.roommate_preferences?.[0] || {};
          return {
            id: profile.id,
            firstName: profile.first_name,
            age: profile.age,
            gender: profile.gender,
            occupation: profile.occupation,
            bio: profile.bio,
            email: profile.email || '',
            phone: profile.phone,
            photos: profile.photos || [],
            preferences: {
              genderPreference: prefs.gender_preference || 'any',
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
            isVerified: profile.is_verified,
            isEmailVerified: profile.is_email_verified,
            isPhoneVerified: profile.is_phone_verified,
            createdAt: new Date(profile.created_at || Date.now()),
            lastActive: new Date(profile.last_active || Date.now()),
          };
        };

        const user1 = convertProfile(user1Profile);
        const user2 = convertProfile(user2Profile);
        const compatibility = calculateCompatibility(user1, user2);

        const { data: newMatch } = await supabase
          .from('matches')
          .insert({
            user_id_1: userId,
            user_id_2: targetUserId,
            compatibility,
          })
          .select()
          .single();

        if (newMatch) {
          return {
            id: newMatch.id,
            userId1: newMatch.user_id_1,
            userId2: newMatch.user_id_2,
            createdAt: new Date(newMatch.created_at),
            compatibility: newMatch.compatibility,
          };
        }
      }
    }
  }

  return null;
};

export const getUserMatches = async (userId: string): Promise<Match[]> => {
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);

  return (matches || []).map(match => ({
    id: match.id,
    userId1: match.user_id_1,
    userId2: match.user_id_2,
    createdAt: new Date(match.created_at),
    compatibility: match.compatibility,
  }));
};
