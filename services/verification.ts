import { supabase } from './supabase';
import { VerificationDocument } from '../types';

export const getPendingVerifications = async (): Promise<any[]> => {
  try {
    const { data } = await supabase
      .from('pending_verifications')
      .select('*');

    if (!data) return [];
    return data;
  } catch (error) {
    console.error('Error getting pending verifications:', error);
    return [];
  }
};

export const approveVerification = async (documentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('approve_verification', {
      document_id: documentId,
    });

    if (error) {
      console.error('Error approving verification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error approving verification:', error);
    return false;
  }
};

export const rejectVerification = async (
  documentId: string,
  reason: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('reject_verification', {
      document_id: documentId,
      reason: reason,
    });

    if (error) {
      console.error('Error rejecting verification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error rejecting verification:', error);
    return false;
  }
};

export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('admin_roles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    return !!data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const getVerificationDocumentUrl = async (filePath: string): Promise<string | null> => {
  try {
    const { data } = supabase.storage
      .from('verification-documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error getting document URL:', error);
    return null;
  }
};
