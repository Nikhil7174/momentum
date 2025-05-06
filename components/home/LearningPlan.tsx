import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { iThemeUtils } from '@/types/ColorThemetypes';

interface Week {
  id: string;
  name: string;
  completed: boolean;
}

interface ThemeProps {
  text: string;
  card: string;
  background: string;
  primary: string;
  success: string;
  successLight: string;
  inactive: string;
  accent: string;
  border: string;
  isDarkMode: boolean;
}

interface LearningPlanProps {
  theme: iThemeUtils;
  weeks: Week[];
  toggleWeekCompletion: (id: string) => void;
}

const LearningPlan: React.FC<LearningPlanProps> = ({ theme, weeks, toggleWeekCompletion }) => {
  const completedCount = weeks.filter(week => week.completed).length;
  const allComplete = completedCount === weeks.length;

  const isWeekAvailable = (index: number) => {
    if (index === 0) return true;

    for (let i = 0; i < index; i++) {
      if (!weeks[i].completed) return false;
    }

    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>
        Your Learning Plan
      </Text>

      <View style={[styles.card, {
        backgroundColor: theme.card,
        shadowColor: "#000",
        shadowOpacity: theme.isDarkMode ? 0.3 : 0.1,
      }]}>
        {allComplete && (
          <View style={[styles.completeBanner]}>
            <MaterialCommunityIcons name="trophy" size={20} color={theme.success} />
            <Text style={[styles.completeText, { color: theme.success }]}>
              Congratulations! All weeks completed
            </Text>
          </View>
        )}

        {weeks.map((week, index) => {
          const available = isWeekAvailable(index);

          return (
            <TouchableOpacity
              key={week.id}
              style={[
                styles.weekRow,
                {
                  borderBottomWidth: index < weeks.length - 1 ? 1 : 0,
                  borderBottomColor: theme.border,
                  opacity: available ? 1 : 0.5
                }
              ]}
              onPress={() => {
                if (available) toggleWeekCompletion(week.id);
              }}
              disabled={!available}
            >
              <View style={styles.weekInfo}>
                <Text style={[
                  styles.weekName,
                  {
                    color: week.completed ? theme.inactive : theme.text,
                    textDecorationLine: week.completed ? 'line-through' : 'none'
                  }
                ]}>
                  {week.name}
                </Text>

                {week.completed ? (
                  <Text style={[styles.completedText, { color: theme.success }]}>
                    Completed
                  </Text>
                ) : !available ? (
                  <Text style={[styles.lockedText, { color: theme.inactive }]}>
                    Complete previous weeks first
                  </Text>
                ) : null}
              </View>

              <View style={[
                styles.statusIndicator,
                {
                  backgroundColor: week.completed ? theme.success :
                    available ? theme.inactive : theme.border,
                }
              ]}>
                {week.completed ? (
                  <MaterialCommunityIcons name="check" size={16} color="white" />
                ) : !available ? (
                  <MaterialCommunityIcons name="lock" size={16} color="white" />
                ) : (
                  <Text style={styles.weekNumber}>
                    {index + 1}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    borderRadius: 16,
    padding: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  completeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  completeText: {
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  weekInfo: {
    flex: 1,
  },
  weekName: {
    fontSize: 16,
    fontWeight: '500',
  },
  completedText: {
    fontSize: 12,
    marginTop: 2,
  },
  lockedText: {
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
  },
  statusIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekNumber: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LearningPlan;