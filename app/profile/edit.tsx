import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save } from 'lucide-react-native';
import { supabase } from '../../services/supabase';
import { Picker } from '@react-native-picker/picker';

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [occupation, setOccupation] = useState('');
  const [bio, setBio] = useState('');

  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [genderPreference, setGenderPreference] = useState('any');
  const [petPreference, setPetPreference] = useState('flexible');
  const [smokingPreference, setSmokingPreference] = useState('non-smoker');
  const [drinkingPreference, setDrinkingPreference] = useState('social-drinker');
  const [moveInDate, setMoveInDate] = useState('flexible');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'Not authenticated');
        router.back();
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const { data: preferences } = await supabase
        .from('roommate_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        setFirstName(profile.first_name || '');
        setAge(profile.age?.toString() || '');
        setGender(profile.gender || 'male');
        setOccupation(profile.occupation || '');
        setBio(profile.bio || '');
      }

      if (preferences) {
        setBudgetMin(preferences.budget_min?.toString() || '');
        setBudgetMax(preferences.budget_max?.toString() || '');
        setCity(preferences.location_city || '');
        setState(preferences.location_state || '');
        setGenderPreference(preferences.gender_preference || 'any');
        setPetPreference(preferences.pet_preference || 'flexible');
        setSmokingPreference(preferences.smoking_preference || 'non-smoker');
        setDrinkingPreference(preferences.drinking_preference || 'social-drinker');
        setMoveInDate(preferences.move_in_date || 'flexible');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!firstName || !age || !occupation || !bio) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!budgetMin || !budgetMax || !city || !state) {
      Alert.alert('Error', 'Please complete your preferences');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          age: parseInt(age),
          gender,
          occupation,
          bio,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      const { error: preferencesError } = await supabase
        .from('roommate_preferences')
        .update({
          budget_min: parseInt(budgetMin),
          budget_max: parseInt(budgetMax),
          location_city: city,
          location_state: state,
          gender_preference: genderPreference,
          pet_preference: petPreference,
          smoking_preference: smokingPreference,
          drinking_preference: drinkingPreference,
          move_in_date: moveInDate,
        })
        .eq('user_id', user.id);

      if (preferencesError) throw preferencesError;

      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#6366F1']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={styles.saveButton}
          >
            <Save size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age *</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={gender}
                onValueChange={setGender}
                style={styles.picker}
              >
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Non-binary" value="non-binary" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Occupation *</Text>
            <TextInput
              style={styles.input}
              value={occupation}
              onChangeText={setOccupation}
              placeholder="What do you do?"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Housing Preferences</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Budget Range *</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                value={budgetMin}
                onChangeText={setBudgetMin}
                placeholder="Min"
                keyboardType="numeric"
              />
              <Text style={styles.separator}>-</Text>
              <TextInput
                style={[styles.input, styles.halfInput]}
                value={budgetMax}
                onChangeText={setBudgetMax}
                placeholder="Max"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.flexInput]}
                value={city}
                onChangeText={setCity}
                placeholder="City"
              />
              <TextInput
                style={[styles.input, styles.stateInput]}
                value={state}
                onChangeText={setState}
                placeholder="State"
                maxLength={2}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender Preference</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={genderPreference}
                onValueChange={setGenderPreference}
                style={styles.picker}
              >
                <Picker.Item label="Any" value="any" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pet Preference</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={petPreference}
                onValueChange={setPetPreference}
                style={styles.picker}
              >
                <Picker.Item label="Love Pets" value="love-pets" />
                <Picker.Item label="Flexible" value="flexible" />
                <Picker.Item label="No Pets" value="no-pets" />
                <Picker.Item label="Allergic" value="allergic" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Smoking Preference</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={smokingPreference}
                onValueChange={setSmokingPreference}
                style={styles.picker}
              >
                <Picker.Item label="Non-smoker" value="non-smoker" />
                <Picker.Item label="Smoker" value="smoker" />
                <Picker.Item label="Flexible" value="flexible" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Drinking Preference</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={drinkingPreference}
                onValueChange={setDrinkingPreference}
                style={styles.picker}
              >
                <Picker.Item label="Non-drinker" value="non-drinker" />
                <Picker.Item label="Social Drinker" value="social-drinker" />
                <Picker.Item label="Regular Drinker" value="regular-drinker" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Move-in Timeline</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={moveInDate}
                onValueChange={setMoveInDate}
                style={styles.picker}
              >
                <Picker.Item label="ASAP" value="urgent" />
                <Picker.Item label="2-3 months" value="2-3months" />
                <Picker.Item label="Flexible" value="flexible" />
              </Picker>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.submitButtonText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 100,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  flexInput: {
    flex: 2,
  },
  stateInput: {
    flex: 1,
  },
  separator: {
    fontSize: 18,
    color: '#6B7280',
  },
  submitButton: {
    backgroundColor: '#059669',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
