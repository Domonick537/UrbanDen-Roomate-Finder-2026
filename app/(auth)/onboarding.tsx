import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../services/supabase';
import { setOnboardingComplete } from '../../services/storage';
import { getCountries, getStatesForCountry, getCitiesForState, getNeighborhoodsForCity } from '../../services/locationData';

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'non-binary'>('male');

  const [profilePicture, setProfilePicture] = useState<string | undefined>();
  const [occupation, setOccupation] = useState('');
  const [bio, setBio] = useState('');

  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [cityId, setCityId] = useState('');
  const [customState, setCustomState] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  const countries = getCountries();
  const states = country ? getStatesForCountry(country) : [];
  const cities = state ? getCitiesForState(state) : [];
  const neighborhoods = state && cityId ? getNeighborhoodsForCity(state, cityId) : [];

  const [genderPreference, setGenderPreference] = useState<'male' | 'female' | 'any'>('any');
  const [budgetRange, setBudgetRange] = useState('');
  const [budgetMin, setBudgetMin] = useState('500');
  const [budgetMax, setBudgetMax] = useState('2000');
  const [moveInDate, setMoveInDate] = useState<'urgent' | 'flexible' | '2-3months' | 'other'>('flexible');

  const [petPreference, setPetPreference] = useState<'love-pets' | 'no-pets' | 'allergic' | 'flexible'>('flexible');
  const [smokingPreference, setSmokingPreference] = useState<'smoker' | 'non-smoker' | 'flexible'>('non-smoker');
  const [drinkingPreference, setDrinkingPreference] = useState<'social-drinker' | 'non-drinker' | 'flexible'>('flexible');
  const [cleanliness, setCleanliness] = useState<'very-clean' | 'clean' | 'flexible'>('clean');
  const [socialLevel, setSocialLevel] = useState<'very-social' | 'sometimes' | 'quiet' | 'flexible'>('sometimes');

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!firstName || !age || !gender) {
        Alert.alert('Required', 'Please fill in all fields');
        return;
      }
      if (parseInt(age) < 18) {
        Alert.alert('Age Requirement', 'You must be at least 18 years old');
        return;
      }
    }

    if (currentStep === 1) {
      if (!occupation || !bio) {
        Alert.alert('Required', 'Please fill in all fields');
        return;
      }
    }

    if (currentStep === 2) {
      if (!country) {
        Alert.alert('Required', 'Please select your country');
        return;
      }
      if (country !== 'OTHER' && !state) {
        Alert.alert('Required', 'Please select your state/province');
        return;
      }
      if (country === 'OTHER' && !customState) {
        Alert.alert('Required', 'Please enter your state/province');
        return;
      }
      if (state === 'OTHER' && !customState) {
        Alert.alert('Required', 'Please enter your state/province');
        return;
      }
      if (state !== 'OTHER' && country !== 'OTHER' && !cityId) {
        Alert.alert('Required', 'Please select your city');
        return;
      }
      if (cityId === 'other' && !customCity) {
        Alert.alert('Required', 'Please enter your city');
        return;
      }
      if (country === 'OTHER' && !customCity) {
        Alert.alert('Required', 'Please enter your city');
        return;
      }
    }

    if (currentStep === 3) {
      if (!budgetRange) {
        Alert.alert('Required', 'Please select a budget range');
        return;
      }
      if (budgetRange === 'other') {
        if (!budgetMin || !budgetMax) {
          Alert.alert('Required', 'Please enter your budget range');
          return;
        }
        if (parseInt(budgetMin) >= parseInt(budgetMax)) {
          Alert.alert('Invalid Budget', 'Minimum budget must be less than maximum budget');
          return;
        }
      }
    }

    if (currentStep === 4) {
      handleComplete();
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleBack = async () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      await supabase.auth.signOut();
      router.replace('/(auth)/signup');
    }
  };

  const handleComplete = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        Alert.alert('Error', 'User not found. Please try signing in again.');
        return;
      }

      const selectedCity = cities.find(c => c.id === cityId);
      const finalState = (country === 'OTHER' || state === 'OTHER') ? customState : states.find(s => s.code === state)?.name || '';
      const finalCity = (country === 'OTHER' || cityId === 'other') ? customCity : selectedCity?.name || '';

      let finalBudgetMin = 500;
      let finalBudgetMax = 2000;

      if (budgetRange === 'other') {
        finalBudgetMin = parseInt(budgetMin);
        finalBudgetMax = parseInt(budgetMax);
      } else if (budgetRange) {
        const [min, max] = budgetRange.split('-');
        finalBudgetMin = parseInt(min);
        finalBudgetMax = max === 'plus' ? 999999 : parseInt(max);
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          age: parseInt(age),
          gender,
          occupation,
          bio,
          profile_picture: profilePicture,
        })
        .eq('id', authUser.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        Alert.alert('Error', 'Failed to update profile. Please try again.');
        return;
      }

      const { error: preferencesError } = await supabase
        .from('roommate_preferences')
        .upsert({
          user_id: authUser.id,
          gender_preference: genderPreference,
          budget_min: finalBudgetMin,
          budget_max: finalBudgetMax,
          state: finalState,
          city: finalCity,
          neighborhood,
          move_in_date: moveInDate,
          pet_preference: petPreference,
          smoking_preference: smokingPreference,
          drinking_preference: drinkingPreference,
          cleanliness,
          social_level: socialLevel,
        });

      if (preferencesError) {
        console.error('Preferences update error:', preferencesError);
        Alert.alert('Error', 'Failed to save preferences. Please try again.');
        return;
      }

      await setOnboardingComplete();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Error', 'Failed to complete setup. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Basic Info</Text>
            <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    gender === 'male' && styles.optionButtonActive,
                  ]}
                  onPress={() => setGender('male')}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      gender === 'male' && styles.optionButtonTextActive,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    gender === 'female' && styles.optionButtonActive,
                  ]}
                  onPress={() => setGender('female')}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      gender === 'female' && styles.optionButtonTextActive,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    gender === 'non-binary' && styles.optionButtonActive,
                  ]}
                  onPress={() => setGender('non-binary')}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      gender === 'non-binary' && styles.optionButtonTextActive,
                    ]}
                  >
                    Non-binary
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Profile Creation</Text>
            <Text style={styles.stepSubtitle}>Share more about yourself</Text>

            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.profileImage} />
              ) : (
                <>
                  <Camera size={32} color="#6B7280" />
                  <Text style={styles.photoButtonText}>Add Photo</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Occupation</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your occupation"
                value={occupation}
                onChangeText={setOccupation}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell potential roommates about yourself..."
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Location</Text>
            <Text style={styles.stepSubtitle}>Where are you looking?</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Country</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={country}
                  onValueChange={(value) => {
                    setCountry(value);
                    setState('');
                    setCityId('');
                    setNeighborhood('');
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a country" value="" />
                  {countries.map((c) => (
                    <Picker.Item key={c.code} label={c.name} value={c.code} />
                  ))}
                </Picker>
              </View>
            </View>

            {country === 'OTHER' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>State/Province</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your state/province"
                    value={customState}
                    onChangeText={setCustomState}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your city"
                    value={customCity}
                    onChangeText={setCustomCity}
                  />
                </View>
              </>
            )}

            {country !== 'OTHER' && country !== '' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>State/Province</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={state}
                      onValueChange={(value) => {
                        setState(value);
                        setCityId('');
                        setNeighborhood('');
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select a state/province" value="" />
                      {states.map((s) => (
                        <Picker.Item key={s.code} label={s.name} value={s.code} />
                      ))}
                    </Picker>
                  </View>
                </View>

                {state === 'OTHER' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Specify State/Province</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your state/province"
                      value={customState}
                      onChangeText={setCustomState}
                    />
                  </View>
                )}

                {state !== 'OTHER' && state !== '' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>City</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={cityId}
                        onValueChange={(value) => {
                          setCityId(value);
                          setNeighborhood('');
                        }}
                        style={styles.picker}
                        enabled={cities.length > 0}
                      >
                        <Picker.Item label={cities.length > 0 ? "Select a city" : "Select state first"} value="" />
                        {cities.map((c) => (
                          <Picker.Item key={c.id} label={c.name} value={c.id} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                )}

                {cityId === 'other' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Specify City</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your city"
                      value={customCity}
                      onChangeText={setCustomCity}
                    />
                  </View>
                )}

                {state === 'OTHER' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>City</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your city"
                      value={customCity}
                      onChangeText={setCustomCity}
                    />
                  </View>
                )}
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Neighborhood (Optional)</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={neighborhood}
                  onValueChange={(value) => setNeighborhood(value)}
                  style={styles.picker}
                  enabled={neighborhoods.length > 0}
                >
                  <Picker.Item label={neighborhoods.length > 0 ? "Select a neighborhood" : "Select city first"} value="" />
                  {neighborhoods.map((n) => (
                    <Picker.Item key={n} label={n} value={n} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Roommate Preferences</Text>
            <Text style={styles.stepSubtitle}>What are you looking for?</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender Preference</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    genderPreference === 'male' && styles.optionButtonActive,
                  ]}
                  onPress={() => setGenderPreference('male')}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      genderPreference === 'male' && styles.optionButtonTextActive,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    genderPreference === 'female' && styles.optionButtonActive,
                  ]}
                  onPress={() => setGenderPreference('female')}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      genderPreference === 'female' && styles.optionButtonTextActive,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    genderPreference === 'any' && styles.optionButtonActive,
                  ]}
                  onPress={() => setGenderPreference('any')}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      genderPreference === 'any' && styles.optionButtonTextActive,
                    ]}
                  >
                    Any
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Budget Range (Monthly)</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={budgetRange}
                  onValueChange={(value) => setBudgetRange(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a budget range" value="" />
                  <Picker.Item label="$500 - $800" value="500-800" />
                  <Picker.Item label="$800 - $1200" value="800-1200" />
                  <Picker.Item label="$1200 - $1600" value="1200-1600" />
                  <Picker.Item label="$1600 - $2000" value="1600-2000" />
                  <Picker.Item label="$2000 - $2500" value="2000-2500" />
                  <Picker.Item label="$2500 - $3000" value="2500-3000" />
                  <Picker.Item label="$3000 - $4000" value="3000-4000" />
                  <Picker.Item label="$4000+" value="4000-plus" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>
            </View>

            {budgetRange === 'other' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Custom Budget Range</Text>
                <View style={styles.budgetRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sublabel}>Min</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="500"
                      value={budgetMin}
                      onChangeText={setBudgetMin}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ width: 16 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sublabel}>Max</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="2000"
                      value={budgetMax}
                      onChangeText={setBudgetMax}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Move-in Timeline</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={moveInDate}
                  onValueChange={(value) => setMoveInDate(value as any)}
                  style={styles.picker}
                >
                  <Picker.Item label="Urgently seeking" value="urgent" />
                  <Picker.Item label="Flexible" value="flexible" />
                  <Picker.Item label="Next 2-3 months" value="2-3months" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Lifestyle Preferences</Text>
            <Text style={styles.stepSubtitle}>Help us find your best match</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pet Preference</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={petPreference}
                  onValueChange={(value) => setPetPreference(value as any)}
                  style={styles.picker}
                >
                  <Picker.Item label="Love pets" value="love-pets" />
                  <Picker.Item label="No pets" value="no-pets" />
                  <Picker.Item label="Allergic to pets" value="allergic" />
                  <Picker.Item label="Flexible" value="flexible" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Smoking</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={smokingPreference}
                  onValueChange={(value) => setSmokingPreference(value as any)}
                  style={styles.picker}
                >
                  <Picker.Item label="Non-smoker" value="non-smoker" />
                  <Picker.Item label="Smoker" value="smoker" />
                  <Picker.Item label="Flexible" value="flexible" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Drinking</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={drinkingPreference}
                  onValueChange={(value) => setDrinkingPreference(value as any)}
                  style={styles.picker}
                >
                  <Picker.Item label="Social drinker" value="social-drinker" />
                  <Picker.Item label="Non-drinker" value="non-drinker" />
                  <Picker.Item label="Flexible" value="flexible" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cleanliness</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={cleanliness}
                  onValueChange={(value) => setCleanliness(value as any)}
                  style={styles.picker}
                >
                  <Picker.Item label="Very clean" value="very-clean" />
                  <Picker.Item label="Clean" value="clean" />
                  <Picker.Item label="Flexible" value="flexible" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Social Level</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={socialLevel}
                  onValueChange={(value) => setSocialLevel(value as any)}
                  style={styles.picker}
                >
                  <Picker.Item label="Very social" value="very-social" />
                  <Picker.Item label="Sometimes social" value="sometimes" />
                  <Picker.Item label="Quiet/private" value="quiet" />
                  <Picker.Item label="Flexible" value="flexible" />
                </Picker>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{currentStep + 1} of 5</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${((currentStep + 1) / 5) * 100}%` },
            ]}
          />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStep()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentStep === 4 ? 'Complete' : 'Next'}
            </Text>
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#059669',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    paddingVertical: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
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
  sublabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
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
    height: 100,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  optionButtonActive: {
    borderColor: '#059669',
    backgroundColor: '#059669',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  optionButtonTextActive: {
    color: '#FFFFFF',
  },
  photoButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
  },
  photoButtonText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
  budgetRow: {
    flexDirection: 'row',
  },
  footer: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  nextButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
