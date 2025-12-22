import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { X, SlidersHorizontal } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';

export interface FilterOptions {
  genderPreference: 'any' | 'male' | 'female';
  petPreference: string;
  smokingPreference: string;
  minCompatibility: number;
}

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
}

export default function FiltersModal({
  visible,
  onClose,
  onApplyFilters,
  initialFilters,
}: FiltersModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      genderPreference: 'any',
      petPreference: 'any',
      smokingPreference: 'any',
      minCompatibility: 0,
    };
    setFilters(defaultFilters);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <SlidersHorizontal size={24} color="#111827" />
            <Text style={styles.title}>Filters</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gender Preference</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.genderPreference}
                onValueChange={(value) =>
                  setFilters({ ...filters, genderPreference: value })
                }
                style={styles.picker}
              >
                <Picker.Item label="Any" value="any" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pet Preference</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.petPreference}
                onValueChange={(value) =>
                  setFilters({ ...filters, petPreference: value })
                }
                style={styles.picker}
              >
                <Picker.Item label="Any" value="any" />
                <Picker.Item label="Love Pets" value="love-pets" />
                <Picker.Item label="No Pets" value="no-pets" />
                <Picker.Item label="Flexible" value="flexible" />
              </Picker>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Smoking Preference</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.smokingPreference}
                onValueChange={(value) =>
                  setFilters({ ...filters, smokingPreference: value })
                }
                style={styles.picker}
              >
                <Picker.Item label="Any" value="any" />
                <Picker.Item label="Non-smoker" value="non-smoker" />
                <Picker.Item label="Smoker" value="smoker" />
              </Picker>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minimum Compatibility</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.minCompatibility}
                onValueChange={(value) =>
                  setFilters({ ...filters, minCompatibility: value })
                }
                style={styles.picker}
              >
                <Picker.Item label="No minimum (0%)" value={0} />
                <Picker.Item label="50% or higher" value={50} />
                <Picker.Item label="60% or higher" value={60} />
                <Picker.Item label="70% or higher" value={70} />
                <Picker.Item label="80% or higher" value={80} />
              </Picker>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
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
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
