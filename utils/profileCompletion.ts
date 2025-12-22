import { User } from '../types';

export interface ProfileCompletionStatus {
  overall: number;
  steps: {
    basicInfo: boolean;
    profilePhoto: boolean;
    bio: boolean;
    preferences: boolean;
    verification: boolean;
  };
  missing: string[];
}

export const checkProfileCompletion = (user: User): ProfileCompletionStatus => {
  const steps = {
    basicInfo: !!(user.firstName && user.age && user.gender && user.occupation),
    profilePhoto: !!(user.profilePicture),
    bio: !!(user.bio && user.bio.length >= 50),
    preferences: !!(
      user.preferences.location?.city &&
      user.preferences.location?.state &&
      user.preferences.budgetMin &&
      user.preferences.budgetMax
    ),
    verification: user.isVerified || false,
  };

  const missing: string[] = [];
  if (!steps.basicInfo) missing.push('Complete basic information');
  if (!steps.profilePhoto) missing.push('Add a profile photo');
  if (!steps.bio) missing.push('Write a bio (at least 50 characters)');
  if (!steps.preferences) missing.push('Set your roommate preferences');
  if (!steps.verification) missing.push('Verify your identity (optional)');

  const completedSteps = Object.values(steps).filter(Boolean).length;
  const totalSteps = Object.keys(steps).length;
  const overall = Math.round((completedSteps / totalSteps) * 100);

  return {
    overall,
    steps,
    missing,
  };
};

export const getProfileCompletionMessage = (completion: ProfileCompletionStatus): string => {
  if (completion.overall === 100) {
    return 'Your profile is complete!';
  } else if (completion.overall >= 80) {
    return 'Almost there! Just a few more steps.';
  } else if (completion.overall >= 50) {
    return 'Your profile is halfway there!';
  } else {
    return 'Complete your profile to find better matches.';
  }
};
