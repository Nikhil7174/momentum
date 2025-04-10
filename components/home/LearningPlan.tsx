import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Theme {
  text: string;
  card: string;
  isDarkMode: boolean;
  border: string;
  inactive: string;
  success: string;
}

interface Technique {
  id: string;
  name: string;
  completed: boolean;
}

interface LearningPlanProps {
  theme: Theme;
  techniques: Technique[];
  toggleTechniqueCompletion: (id: string) => void;
}

const LearningPlan: React.FC<LearningPlanProps> = ({ theme, techniques, toggleTechniqueCompletion }) => {
  return (
    <View style={{ margin: 16, marginTop: 0 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>
        Your Learning Plan
      </Text>
      <View style={{ 
        backgroundColor: theme.card, 
        borderRadius: 16, 
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.isDarkMode ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3
      }}>
        {techniques.map((technique, index) => (
          <TouchableOpacity 
            key={technique.id}
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              paddingVertical: 12,
              paddingHorizontal: 8,
              borderBottomWidth: index < techniques.length - 1 ? 1 : 0,
              borderBottomColor: theme.border
            }}
            onPress={() => toggleTechniqueCompletion(technique.id)}
          >
            <Text style={{ 
              fontSize: 16, 
              color: technique.completed ? theme.inactive : theme.text,
              textDecorationLine: technique.completed ? 'line-through' : 'none'
            }}>
              {technique.name}
            </Text>
            <View style={{ 
              width: 24, 
              height: 24, 
              borderRadius: 12, 
              backgroundColor: technique.completed ? theme.success : theme.inactive,
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              {technique.completed && (
                <Text style={{ color: 'white', fontSize: 14 }}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default LearningPlan;