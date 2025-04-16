import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

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
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select...',
  containerStyle,
  textStyle,
  dropdownStyle,
}) => {
  const [open, setOpen] = useState(false);

  const getLabel = () => {
    const found = options.find(opt => opt.id === selectedValue);
    return found ? found.label : placeholder;
  };

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      <TouchableOpacity
        onPress={() => setOpen(prev => !prev)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f2f2f2',
          borderRadius: 8,
          padding: 12,
        }}
      >
        <Text style={[{ color: '#333', fontSize: 16 }, textStyle]}>{getLabel()}</Text>
        <AntDesign name={open ? 'up' : 'down'} size={16} color="#808080" />
      </TouchableOpacity>
      {open && (
        <View
          style={[
            {
              marginTop: 4,
              borderRadius: 8,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#ccc',
            },
            dropdownStyle,
          ]}
        >
          {options.map(option => (
            <TouchableOpacity
              key={option.id}
              onPress={() => {
                onSelect(option.id);
                setOpen(false);
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 12,
                backgroundColor: selectedValue === option.id ? '#e6f0ff' : '#f2f2f2',
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
              }}
            >
              <Text style={{ color: selectedValue === option.id ? '#3B82F6' : '#333', fontSize: 16 }}>
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