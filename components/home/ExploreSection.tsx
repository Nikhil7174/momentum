import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface Theme {
  text: string;
  primary: string;
  secondary: string;
  isDarkMode: boolean;
}

const ExploreSection: React.FC<{ theme: Theme }> = ({ theme }) => {
  const router = useRouter();

  return (
    <View style={{ margin: 10, marginTop: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>
        Explore Learning
      </Text>

      {/* Practice Techniques Card with gradient */}
      <View
        style={{
          borderRadius: 16,
          marginBottom: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: theme.isDarkMode ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: 3,
          overflow: 'hidden', // Ensures gradient stays within rounded corners
        }}>
        <LinearGradient
          colors={['#4062FF', '#5B76FF', '#7B8FFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => router.push('/learning')}
            style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, marginBottom: 4 }}>
              Practice Techniques
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ color: 'white', fontSize: 14 }}>
                Start learning
              </Text>
              <View style={{
                marginLeft: 8,
                backgroundColor: 'white',
                width: 20,
                height: 20,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ color: '#5B76FF', fontWeight: 'bold', fontSize: 12 }}>→</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Right side with icons and blur effect */}
          <View style={{ flexDirection: 'row' }}>
            <BlurView intensity={20} tint="light" style={{
              borderRadius: 12,
              overflow: 'hidden',
              marginRight: 4
            }}>
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: 8,
              }}>
                <Text style={{ fontSize: 20 }}>📊</Text>
              </View>
            </BlurView>

            <BlurView intensity={20} tint="light" style={{
              borderRadius: 12,
              overflow: 'hidden',
            }}>
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: 8
              }}>
                <Text style={{ fontSize: 20 }}>📝</Text>
              </View>
            </BlurView>
          </View>
        </LinearGradient>
      </View>

      {/* Learning Resources Card with gradient */}
      <View
        style={{
          borderRadius: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: theme.isDarkMode ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: 3,
          overflow: 'hidden', // Ensures gradient stays within rounded corners
        }}>
        <LinearGradient
          colors={['#6A3EB1', '#7E57C2', '#9575CD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => router.push('/learning')}
            style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, marginBottom: 4 }}>
              Learning Resources
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ color: 'white', fontSize: 14 }}>
                Start learning
              </Text>
              <View style={{
                marginLeft: 8,
                backgroundColor: 'white',
                width: 20,
                height: 20,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ color: '#7E57C2', fontWeight: 'bold', fontSize: 12 }}>→</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Right side with icons and blur effect */}
          <View style={{ flexDirection: 'row' }}>
            <BlurView intensity={20} tint="light" style={{
              borderRadius: 12,
              overflow: 'hidden',
              marginRight: 4
            }}>
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: 8,
              }}>
                <Text style={{ fontSize: 20 }}>📚</Text>
              </View>
            </BlurView>

            <BlurView intensity={20} tint="light" style={{
              borderRadius: 12,
              overflow: 'hidden',
            }}>
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: 8
              }}>
                <Text style={{ fontSize: 20 }}>🎓</Text>
              </View>
            </BlurView>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

export default ExploreSection;