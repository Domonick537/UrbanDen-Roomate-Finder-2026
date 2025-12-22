import { supabase } from './supabase';
import * as ImagePicker from 'expo-image-picker';

export const uploadPhoto = async (userId: string, uri: string): Promise<string | null> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileExt = uri.split('.').pop() || 'jpg';
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, blob, {
        contentType: `image/${fileExt}`,
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Photo upload error:', error);
    return null;
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
