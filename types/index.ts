export interface User {
  id: string;
  firstName: string;
  age: number;
  gender: 'male' | 'female' | 'non-binary';
  occupation: string;
  profilePicture?: string;
  bio: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  showReadReceipts: boolean;
  createdAt: Date;
  lastActive: Date;
  preferences: RoommatePreferences;
  photos: string[];
}

export interface RoommatePreferences {
  genderPreference: 'male' | 'female' | 'any';
  ageMin: number;
  ageMax: number;
  budgetMin: number;
  budgetMax: number;
  location: {
    state: string;
    city: string;
    neighborhood?: string;
  };
  moveInDate: 'urgent' | 'flexible' | '2-3months' | 'other';
  moveInDateSpecific?: Date;
  petPreference: 'love-pets' | 'no-pets' | 'allergic' | 'flexible';
  smokingPreference: 'smoker' | 'non-smoker' | 'flexible';
  drinkingPreference: 'social-drinker' | 'non-drinker' | 'flexible';
  cleanliness: 'very-clean' | 'clean' | 'flexible';
  socialLevel: 'very-social' | 'sometimes' | 'quiet' | 'flexible';
}

export interface Match {
  id: string;
  userId1: string;
  userId2: string;
  createdAt: Date;
  lastMessageAt?: Date;
  compatibility: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface SwipeAction {
  userId: string;
  targetUserId: string;
  action: 'like' | 'pass';
  timestamp: Date;
}

export interface VerificationDocument {
  id: string;
  userId: string;
  type: 'government-id';
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface RoommateAgreement {
  id: string;
  title: string;
  content: string;
  isTemplate: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ICE_BREAKERS = [
  "Hi! Are you still looking for a roommate?",
  "Hey! I saw we matched - tell me a bit about yourself!",
  "Hi there! What's your ideal living situation?",
  "Hey! Love your profile - are you flexible with move-in dates?",
  "Hi! What's the most important thing you look for in a roommate?",
  "Hey! Are you open to a video call to chat more?",
  "Hi! What area are you looking to live in?",
  "Hey! Tell me about your lifestyle - are you more social or quiet?"
];
