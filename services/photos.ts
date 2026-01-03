import { supabase } from './supabase';
import * as ImagePicker from 'expo-image-picker';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_PHOTOS_PER_USER = 6;

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const validateImageFile = async (uri: string): Promise<{ valid: boolean; error?: string }> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    if (blob.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds 5MB limit. Your file is ${(blob.size / 1024 / 1024).toFixed(2)}MB.`
      };
    }

    if (!ALLOWED_MIME_TYPES.includes(blob.type)) {
      return {
        valid: false,
        error: `Invalid file type. Only JPEG, PNG, and WebP images are allowed.`
      };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Failed to validate image file.' };
  }
};

export const uploadPhoto = async (userId: string, uri: string): Promise<UploadResult> => {
  try {
    const validation = await validateImageFile(uri);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const response = await fetch(uri);
    const blob = await response.blob();
    const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, blob, {
        contentType: blob.type,
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error('Photo upload error:', error);
    return { success: false, error: 'Failed to upload photo. Please try again.' };
  }
};

export const deletePhoto = async (photoUrl: string): Promise<boolean> => {
  try {
    const path = photoUrl.split('/profile-photos/')[1];
    if (!path) return false;

    const { error } = await supabase.storage
      .from('profile-photos')
      .remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Photo delete error:', error);
    return false;
  }
};

export const updateProfilePhotos = async (userId: string, photos: string[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ photos })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Update profile photos error:', error);
    return false;
  }
};

export const pickImage = async (): Promise<string | null> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 5],
    quality: 0.8,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};

export const takePhoto = async (): Promise<string | null> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 5],
    quality: 0.8,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};

export const getPrimaryPhoto = (photos: string[], profilePicture?: string): string | null => {
  if (photos && photos.length > 0) {
    return photos[0];
  }
  return profilePicture || null;
};
