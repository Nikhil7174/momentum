import React, { useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    withTiming,
    Easing,
    useAnimatedProps
} from 'react-native-reanimated';
import { Svg, Path } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { iThemeUtils } from '@/types/ColorThemetypes';

interface Week {
    id: string;
    name: string;
    completed: boolean;
}

interface LearningPathProps {
    theme: iThemeUtils;
    weeks: Week[];
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const PATH_PADDING = 60;
const NODE_SIZE = 35;

const LearningPath: React.FC<LearningPathProps> = ({ theme, weeks }) => {
    // Animation values for each week node
    const nodeAnimations = weeks.map(() => useSharedValue(0));
    const progressAnimation = useSharedValue(0);
    const rocketPosition = useSharedValue(0);
    const rocketRotation = useSharedValue(0);
    const rocketScale = useSharedValue(1);

    const completedCount = weeks.filter(week => week.completed).length;

    useEffect(() => {
        const targetPosition = completedCount < weeks.length ? completedCount : weeks.length;

        weeks.forEach((week, index) => {
            nodeAnimations[index].value = withSpring(week.completed ? 1 : 0, {
                damping: 12,
                stiffness: 90,
            });
        });

        progressAnimation.value = withTiming(completedCount / (weeks.length), {
            duration: 800,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });

        rocketPosition.value = withTiming(targetPosition, {
            duration: 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });

        rocketRotation.value = withTiming(targetPosition % 2 === 0 ? 0 : 180, {
            duration: 800,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });

        rocketScale.value = withSpring(
            completedCount === weeks.length ? 1.5 : 1,
            { damping: 10, stiffness: 100 }
        );
    }, [weeks, completedCount]);

    const generatePathData = () => {
        const pathPoints = [];
        const totalNodes = weeks.length + 1;
        const segmentHeight = (CARD_WIDTH - 2 * PATH_PADDING) / (totalNodes - 1);

        for (let i = 0; i < totalNodes; i++) {
            const y = CARD_WIDTH - PATH_PADDING - i * segmentHeight;
            const x = i % 2 === 0 ? PATH_PADDING : CARD_WIDTH - PATH_PADDING;
            pathPoints.push({ x, y });
        }

        let pathData = `M ${pathPoints[0].x},${pathPoints[0].y}`;
        for (let i = 1; i < pathPoints.length; i++) {
            const prevPoint = pathPoints[i - 1];
            const currentPoint = pathPoints[i];
            const cp1x = prevPoint.x;
            const cp1y = (prevPoint.y + currentPoint.y) / 2;
            const cp2x = currentPoint.x;
            const cp2y = (prevPoint.y + currentPoint.y) / 2;
            pathData += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${currentPoint.x},${currentPoint.y}`;
        }

        return { pathData, pathPoints };
    };

    const { pathData, pathPoints } = generatePathData();

    // Node animation styles
    const getNodeAnimatedStyle = (index: number) => {
        return useAnimatedStyle(() => {
            const scale = interpolate(
                nodeAnimations[index].value,
                [0, 1],
                [1, 1.2]
            );

            return {
                transform: [{ scale }],
                backgroundColor: weeks[index].completed ? '#FF9500' : theme.inactive
            };
        });
    };

    const rocketAnimatedStyle = useAnimatedStyle(() => {
        const position = rocketPosition.value;
        const pointIndex = Math.floor(position);
        const fraction = position - pointIndex;

        if (pointIndex >= pathPoints.length - 1) {
            return {
                transform: [
                    { translateX: pathPoints[pathPoints.length - 1].x - 24 },
                    { translateY: pathPoints[pathPoints.length - 1].y - 24 },
                    {
                        rotate: `${completedCount === weeks.length ? 0 : rocketRotation.value}deg`
                    },
                    { scale: rocketScale.value }
                ],
                opacity: 1
            };
        }

        // Interpolate between two path points
        const currentPoint = pathPoints[pointIndex];
        const nextPoint = pathPoints[pointIndex + 1];

        const x = currentPoint.x + (nextPoint.x - currentPoint.x) * fraction;
        const y = currentPoint.y + (nextPoint.y - currentPoint.y) * fraction;

        return {
            transform: [
                { translateX: x - 24 },
                { translateY: y - 24 },
                {
                    rotate: `${completedCount === weeks.length ? 0 : rocketRotation.value}deg`
                },
                { scale: rocketScale.value }
            ],
            opacity: 1
        };
    });

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.text }]}>
                Your Learning Path
            </Text>

            <View style={[styles.card, {
                backgroundColor: theme.card,
                shadowColor: "#000",
                shadowOpacity: theme.isDarkMode ? 0.3 : 0.1,
            }]}>
                <Svg width={CARD_WIDTH} height={CARD_WIDTH}>
                    <Path
                        d={pathData}
                        stroke={theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                        strokeWidth={8}
                        strokeLinecap="round"
                        fill="none"
                    />

                    <AnimatedProgressPath
                        pathData={pathData}
                        progressAnimation={progressAnimation}
                        theme={theme}
                    />
                </Svg>

                {weeks.map((week, index) => {
                    const point = pathPoints[index];
                    const isRocketHere = index === completedCount && completedCount !== weeks.length;

                    return (
                        <View
                            key={week.id}
                            style={[
                                styles.nodeContainer,
                                {
                                    left: point.x - NODE_SIZE / 2,
                                    top: point.y - NODE_SIZE / 2,
                                },
                            ]}
                        >
                            <Animated.View style={[styles.node, getNodeAnimatedStyle(index)]}>
                                {week.completed ? (
                                    <MaterialCommunityIcons name="star" size={18} color="white" />
                                ) : !isRocketHere && (
                                    <Text style={styles.weekNumber}>{index + 1}</Text>
                                )}
                            </Animated.View>
                        </View>
                    );
                })}


                {pathPoints[weeks.length] && (
                    <View
                        key="final"
                        style={[
                            styles.nodeContainer,
                            {
                                left: pathPoints[weeks.length].x - NODE_SIZE / 2,
                                top: pathPoints[weeks.length].y - NODE_SIZE / 2,
                            },
                        ]}
                    >
                        {completedCount !== weeks.length && (
                            <MaterialCommunityIcons name="flag" size={38} color={theme.inactive} />
                        )}
                    </View>
                )}

                {/* Animated Rocket */}
                <Animated.View style={[styles.rocketContainer, rocketAnimatedStyle]}>
                    {completedCount === weeks.length ? (
                        <MaterialCommunityIcons
                            name="trophy"
                            size={38}
                            color={theme.accent}
                        />
                    ) : (
                        <MaterialCommunityIcons
                            name="rocket"
                            size={30}
                            color={theme.primary}
                        />
                    )}
                </Animated.View>
            </View>
        </View>
    );
};

const AnimatedProgressPath = ({ pathData, progressAnimation, theme }: any) => {
    const animatedProps = useAnimatedProps(() => {
        return {
            strokeDasharray: '1000',
            strokeDashoffset: interpolate(
                progressAnimation.value,
                [0, 1],
                [1000, 0]
            ),
        };
    });

    return (
        <Animated.View style={[StyleSheet.absoluteFill]}>
            <Svg width="100%" height="100%">
                <Path
                    d={pathData}
                    stroke={theme.primary}
                    strokeWidth={8}
                    strokeLinecap="round"
                    fill="none"
                />
            </Svg>
        </Animated.View>
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
        padding: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        height: CARD_WIDTH,
        position: 'relative',
        marginTop: 10
    },
    nodeContainer: {
        position: 'absolute',
        width: NODE_SIZE,
        height: NODE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    node: {
        width: NODE_SIZE,
        height: NODE_SIZE,
        borderRadius: NODE_SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weekNumber: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    labelContainer: {
        position: 'absolute',
        top: NODE_SIZE + 4,
    },
    weekLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    rocketContainer: {
        position: 'absolute',
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
    },
});

export default LearningPath;

