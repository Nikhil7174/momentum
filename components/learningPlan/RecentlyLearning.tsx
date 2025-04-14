import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ResourceData } from "@/types/LearningPlanTypes";
import { getYoutubeVideoId } from "@/utils/videoUtils";

type RecentlyLearningProps = {
    lastViewedResource: ResourceData | null;
    onResourceClick: () => void;
    isDarkMode?: boolean;
};

export default function RecentlyLearning({
    lastViewedResource,
    onResourceClick,
    isDarkMode = false,
}: RecentlyLearningProps) {
    if (!lastViewedResource) {
        return null;
    }

    return (
        <>
            <View style={{
                padding: 16,
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderRadius: 12,
                marginHorizontal: 16,
                marginTop: 8
            }}>
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: isDarkMode ? '#ffffff' : '#1e293b'
                }}>
                    Recently learning
                </Text>

                <View style={{
                    width: '100%',
                    aspectRatio: 16 / 9,
                    position: 'relative',
                    marginTop: 16
                }}>
                    {lastViewedResource.type === "video" ? (
                        <Image
                            source={{
                                uri: `https://img.youtube.com/vi/${getYoutubeVideoId(
                                    lastViewedResource.url
                                )}/hqdefault.jpg`,
                            }}
                            resizeMode="cover"
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 16
                            }}
                        />
                    ) : (
                        <View style={{
                            width: '100%',
                            borderRadius: 16,
                            height: '100%',
                            backgroundColor: '#e5e7eb',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={{ fontSize: 60 }}>📄</Text>
                        </View>
                    )}
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={onResourceClick}
                    >
                        <View style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: 'rgba(139, 92, 246, 0.5)',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {lastViewedResource.type === "video" ? (
                                <Ionicons name="play-circle" size={24} color="white" />
                            ) : (
                                <Ionicons
                                    name="document-text-outline"
                                    size={24}
                                    color="white"
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}