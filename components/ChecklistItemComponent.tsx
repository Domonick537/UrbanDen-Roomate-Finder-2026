import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { CheckCircle2, Circle, ChevronDown, Calendar, X } from 'lucide-react-native';
import { ChecklistItemWithProgress } from '../services/checklist';

interface ChecklistItemComponentProps {
  item: ChecklistItemWithProgress;
  onUpdate: (isCompleted: boolean, selectedValue?: string, notes?: string) => void;
}

export default function ChecklistItemComponent({
  item,
  onUpdate,
}: ChecklistItemComponentProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [localNotes, setLocalNotes] = useState(item.progress?.notes || '');
  const [localValue, setLocalValue] = useState(
    item.progress?.selected_value || ''
  );

  const isCompleted = item.progress?.is_completed || false;

  const handleCheckboxToggle = () => {
    onUpdate(!isCompleted);
  };

  const handleDropdownSelect = (value: string) => {
    setLocalValue(value);
    onUpdate(true, value, localNotes);
    setShowDropdown(false);
  };

  const handleSaveNotes = () => {
    onUpdate(isCompleted, localValue || undefined, localNotes);
    setShowNotesModal(false);
  };

  const handleDateChange = (date: string) => {
    setLocalValue(date);
    onUpdate(true, date, localNotes);
  };

  const renderInput = () => {
    switch (item.input_type) {
      case 'checkbox':
        return (
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={handleCheckboxToggle}
          >
            {isCompleted ? (
              <CheckCircle2 size={24} color="#059669" />
            ) : (
              <Circle size={24} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        );

      case 'dropdown':
        return (
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={[
                styles.dropdownButton,
                isCompleted && styles.dropdownButtonCompleted,
              ]}
              onPress={() => setShowDropdown(true)}
            >
              <Text
                style={[
                  styles.dropdownButtonText,
                  !localValue && styles.dropdownButtonTextPlaceholder,
                ]}
              >
                {localValue || 'Select option...'}
              </Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>

            <Modal
              visible={showDropdown}
              transparent
              animationType="fade"
              onRequestClose={() => setShowDropdown(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowDropdown(false)}
              >
                <View style={styles.dropdownModal}>
                  <View style={styles.dropdownHeader}>
                    <Text style={styles.dropdownTitle}>{item.title}</Text>
                    <TouchableOpacity onPress={() => setShowDropdown(false)}>
                      <X size={24} color="#111827" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={styles.dropdownList}>
                    {item.dropdown_options?.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownOption,
                          localValue === option && styles.dropdownOptionSelected,
                        ]}
                        onPress={() => handleDropdownSelect(option)}
                      >
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            localValue === option &&
                              styles.dropdownOptionTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                        {localValue === option && (
                          <CheckCircle2 size={20} color="#059669" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        );

      case 'text':
        return (
          <TextInput
            style={styles.textInput}
            value={localValue}
            onChangeText={(text) => {
              setLocalValue(text);
              onUpdate(!!text, text, localNotes);
            }}
            placeholder="Enter text..."
            placeholderTextColor="#9CA3AF"
          />
        );

      case 'date':
        return (
          <TextInput
            style={styles.textInput}
            value={localValue}
            onChangeText={handleDateChange}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9CA3AF"
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>{renderInput()}</View>
      </View>

      {item.input_type !== 'checkbox' && (
        <TouchableOpacity
          style={styles.notesButton}
          onPress={() => setShowNotesModal(true)}
        >
          <Text style={styles.notesButtonText}>
            {localNotes ? 'Edit notes' : 'Add notes'}
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showNotesModal}
        animationType="slide"
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View style={styles.notesModal}>
          <View style={styles.notesHeader}>
            <Text style={styles.notesTitle}>Notes</Text>
            <TouchableOpacity onPress={() => setShowNotesModal(false)}>
              <X size={24} color="#111827" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.notesInput}
            value={localNotes}
            onChangeText={setLocalNotes}
            placeholder="Add any notes or details..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveNotes}>
            <Text style={styles.saveButtonText}>Save Notes</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  titleCompleted: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  inputContainer: {
    marginLeft: 'auto',
  },
  checkboxContainer: {
    padding: 4,
  },
  dropdownWrapper: {
    minWidth: 150,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  dropdownButtonCompleted: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  dropdownButtonTextPlaceholder: {
    color: '#9CA3AF',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    minWidth: 150,
  },
  notesButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  notesButtonText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  dropdownList: {
    maxHeight: 400,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownOptionSelected: {
    backgroundColor: '#ECFDF5',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  dropdownOptionTextSelected: {
    color: '#059669',
    fontWeight: '600',
  },
  notesModal: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  notesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 150,
  },
  saveButton: {
    backgroundColor: '#059669',
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
