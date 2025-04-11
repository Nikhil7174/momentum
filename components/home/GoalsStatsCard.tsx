import React from 'react';
import { View, Text } from 'react-native';

interface Theme {
  text: string;
  subtext: string;
  card: string;
  primary: string;
  border: string;
  isDarkMode: boolean;
}

interface UserData {
  progress: number;
  timeCommitment: string;
  currentSkillLevel: string;
  desiredSkillLevel: string;
}

const GoalsStatsCard: React.FC<{ theme: Theme; userData: UserData }> = ({ theme, userData }) => {
  // Calculate days to goal based on progress and time commitment
  const calculateEstimatedTimeToGoal = () => {
    const progressPercentage = userData.progress / 100;
    const remainingPercentage = 1 - progressPercentage;
    
    // Rough estimation based on time commitment
    const hoursPerWeek = parseInt(userData.timeCommitment.split(' ')[0]) || 10;
    const totalWeeksEstimated = 12; // Baseline assumption for mastery
    const remainingWeeks = Math.ceil(totalWeeksEstimated * remainingPercentage);
    
    return remainingWeeks * 7; // days to goal
  };
  
  const daysToGoal = calculateEstimatedTimeToGoal();

  return (
    <View style={{ margin: 10, marginTop: 0 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>
        Your Goals & Stats
      </Text>
      <View style={{ 
        backgroundColor: theme.card, 
        borderRadius: 16, 
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.isDarkMode ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ color: theme.subtext, marginBottom: 4 }}>Current</Text>
            <View style={{ 
              backgroundColor: theme.isDarkMode ? '#374151' : '#f1f5f9', 
              paddingVertical: 6, 
              paddingHorizontal: 10, 
              borderRadius: 8,
              minWidth: 80,
              alignItems: 'center'
            }}>
              <Text style={{ color: theme.text, fontWeight: '500' }}>
                {userData.currentSkillLevel}
              </Text>
            </View>
          </View>
          
          <View style={{ 
            flex: 1, 
            flexDirection: 'row', 
            alignItems: 'center',
            justifyContent: 'center' 
          }}>
            <View style={{ height: 2, backgroundColor: theme.primary, flex: 1 }} />
            <View style={{ 
              width: 24, 
              height: 24, 
              borderRadius: 12, 
              backgroundColor: theme.primary,
              alignItems: 'center',
              justifyContent: 'center' 
            }}>
              <Text style={{ color: 'white', fontSize: 12 }}>→</Text>
            </View>
            <View style={{ height: 2, backgroundColor: theme.primary, flex: 1 }} />
          </View>
          
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ color: theme.subtext, marginBottom: 4 }}>Goal</Text>
            <View style={{ 
              backgroundColor: theme.isDarkMode ? '#374151' : '#f1f5f9', 
              paddingVertical: 6, 
              paddingHorizontal: 12, 
              borderRadius: 8,
              minWidth: 80,
              alignItems: 'center'
            }}>
              <Text style={{ color: theme.text, fontWeight: '500' }}>
                {userData.desiredSkillLevel}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          borderTopWidth: 1,
          borderTopColor: theme.border,
          paddingTop: 16
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme.text }}>
              {userData.timeCommitment}
            </Text>
            <Text style={{ color: theme.subtext, fontSize: 12 }}>Weekly Commitment</Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme.text }}>
              {daysToGoal}
            </Text>
            <Text style={{ color: theme.subtext, fontSize: 12 }}>Days to Goal</Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme.primary }}>
              {userData.progress}%
            </Text>
            <Text style={{ color: theme.subtext, fontSize: 12 }}>Progress</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default GoalsStatsCard;