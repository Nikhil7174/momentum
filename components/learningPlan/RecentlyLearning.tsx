import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ResourceData } from "@/types/LearningPlanTypes";
import { getYoutubeVideoId } from "@/utils/videoUtils";

type RecentlyLearningProps = {
    lastViewedResource: ResourceData | null;
    onResourceClick: () => void;
};

export default function RecentlyLearning({
    lastViewedResource,
    onResourceClick,
}: RecentlyLearningProps) {
    if (!lastViewedResource) {
        return null;
    }

    return (
        <>

            <View className="p-4 bg-white dark:bg-slate-800 rounded-xl mx-4 mt-2">
                <Text className="text-2xl font-bold text-slate-800 dark:text-white">
                    Recently learning
                </Text>

                <View className="w-full aspect-video relative mt-4">
                    {lastViewedResource.type === "video" ? (
                        <Image
                            source={{
                                uri: `https://img.youtube.com/vi/${getYoutubeVideoId(
                                    lastViewedResource.url
                                )}/hqdefault.jpg`,
                            }}
                            resizeMode="cover"
                            className="w-full h-full"
                        />
                    ) : (
                        <View className="w-full h-full bg-gray-200 items-center justify-center">
                            <Text className="text-6xl">📄</Text>
                        </View>
                    )}
                    <TouchableOpacity
                        className="absolute inset-0 flex items-center justify-center"
                        onPress={onResourceClick}
                    >
                        <View className="w-12 h-12 rounded-full bg-[#8b5cf6] bg-opacity-50 flex items-center justify-center">
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
