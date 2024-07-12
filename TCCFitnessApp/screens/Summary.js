import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import api from '../axiosConfig';
import { getToken } from '../helpers/token';

const Summary = ({ navigation, route }) => {
    const {
        gender,
        age,
        height,
        weight,
        activityLevel,
        goalType
    } = route.params.userInfo;

    const [goalCalories, setGoalCalories] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const calculateCalories = async () => {            
            setIsLoading(true);

            const token = await getToken();

            try {
                const response = await api.get(`/get-goal-calories-preview?gender=${gender}&age=${age}&height=${height}&weight=${weight}&activity_level=${activityLevel}&goal_type=${goalType}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                setGoalCalories(response.data.goal_calories);
            }
            catch (error) {
                console.error(error);
            }

            setIsLoading(false);
        };

        calculateCalories();
    }, []);

    const handleLetsGo = async () => {
        setIsLoading(true);

        const body = {
            gender,
            age,
            height,
            weight,
            activity_level: activityLevel,
            goal_type: goalType
        };

        const token = await getToken();

        try {
            await api.put("/users/me", body, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "DailyServings" }],
                })
            );
        }
        catch (error) {
            console.error(error);
        }

        setIsLoading(false);
    };

    const handleBack = () => {
        navigation.navigate("InitialForm");
    }

    const getGoalText = () => {
        if (goalType === "lose_weight") {
            return "Perder peso";
        }
        else if (goalType === "maintain_weight") {
            return "Manter peso";
        }
        else {
            return "Ganhar peso";
        }
    };

    const goalText = getGoalText();

    if (isLoading) {
        return (
            <ActivityIndicator size="large" color="#0000ff" />
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.summaryContainer}>
                <Text style={styles.text}>
                    De acordo com as informações fornecidas, você vai precisar ingerir...
                </Text>
                <Text style={styles.goalCaloriesText}>
                    {goalCalories} kcal
                </Text>
                <Text style={styles.text}>
                    Para alcançar seu objetivo de...{"\n"}
                    <Text style={styles.goalTypeText}>
                        { goalText }
                    </Text>
                </Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleLetsGo}>
                    <Text style={styles.primaryButtonText}>
                        Vamos lá
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
                    <Text style={styles.secondaryButtonText}>
                        Voltar
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 42,
    },
    summaryContainer: {
        height: '82%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    text: {
        fontSize: 28,
        fontWeight: 'bold',
        lineHeight: 40,
    },
    goalCaloriesText: {
        fontSize: 80,
        fontWeight: 'bold',
    },
    goalTypeText: {
        color: '#FF6624',
        textTransform: 'lowercase',
    },
    buttonsContainer: {
        flex: 1,
        width: "100%",
        height: '18%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    primaryButton: {
        width: "100%",
        backgroundColor: "#FF6624",
        padding: 20,
        borderRadius: 10,
        marginVertical: "auto",
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center",
        textTransform: "capitalize",
        fontWeight: "bold",
    },
    secondaryButton: {
        width: "100%",
        backgroundColor: "#B0BEC5",
        padding: 20,
        borderRadius: 10,
        marginVertical: "auto",
    },
    secondaryButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center",
        textTransform: "capitalize",
        fontWeight: "bold",
    }
});

export default Summary;