import { iThemeUtils } from '@/types/ColorThemetypes';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface week {
  id: string;
  name: string;
  completed: boolean;
}

interface LearningPlanProps {
  theme: iThemeUtils;
  weeks: week[];
  toggleweekCompletion: (id: string) => void;
}

const LearningPlan: React.FC<LearningPlanProps> = ({ theme, weeks, toggleweekCompletion }) => {
  return (
    <View style={{ margin: 10, marginTop: 0 }}>
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
        {weeks.map((week, index) => (
          <TouchableOpacity 
            key={week.id}
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              paddingVertical: 12,
              paddingHorizontal: 8,
              borderBottomWidth: index < weeks.length - 1 ? 1 : 0,
              borderBottomColor: theme.border
            }}
            onPress={() => toggleweekCompletion(week.id)}
          >
            <Text style={{ 
              fontSize: 16, 
              color: week.completed ? theme.inactive : theme.text,
              textDecorationLine: week.completed ? 'line-through' : 'none'
            }}>
              {week.name}
            </Text>
            <View style={{ 
              width: 24, 
              height: 24, 
              borderRadius: 12, 
              backgroundColor: week.completed ? theme.success : theme.inactive,
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              {week.completed && (
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