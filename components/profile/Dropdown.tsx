import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { createTheme } from '@/utils/themeUtils';

export interface Option {
  id: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  selectedValue: string;
  onSelect: (id: string) => void;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  isOpen: boolean;
  onToggle: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select...',
  containerStyle,
  textStyle,
  dropdownStyle,
  isOpen,
  onToggle
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = createTheme(isDarkMode);

  const getLabel = () => {
    const found = options.find(opt => opt.id === selectedValue);
    return found ? found.label : placeholder;
  };

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      <TouchableOpacity
        onPress={onToggle}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isDarkMode ? theme.card : '#f2f2f2',
          borderRadius: 8,
          padding: 12,
        }}
      >
        <Text style={[{ color: isDarkMode ? '#fff' : '#333', fontSize: 16 }, textStyle]}>
          {getLabel()}
        </Text>
        <AntDesign name={isOpen ? 'up' : 'down'} size={16} color={isDarkMode ? '#ccc' : '#808080'} />
      </TouchableOpacity>
      {isOpen && (
        <View
          style={[
            {
              marginTop: 4,
              borderRadius: 8,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: isDarkMode ? '#3A3A3C' : '#ccc',
              backgroundColor: isDarkMode ? theme.card : '#f2f2f2',
            },
            dropdownStyle,
          ]}
        >
          {options.map(option => (
            <TouchableOpacity
              key={option.id}
              onPress={() => {
                onSelect(option.id);
                onToggle(); // Close dropdown after selection
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: isDarkMode ? '#101826' : '#ccc',
                backgroundColor:
                  selectedValue === option.id
                    ? (isDarkMode ? '#131d2e' : '#e6f0ff')
                    : undefined,
              }}
            >
              <Text
                style={[
                  {
                    fontSize: 16,
                    color:
                      selectedValue === option.id
                        ? '#3B82F6'
                        : isDarkMode
                        ? '#fff'
                        : '#333',
                  },
                ]}
              >
                {option.label}
              </Text>
              {selectedValue === option.id && (
                <AntDesign name="check" size={16} color="#3B82F6" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default Dropdown;