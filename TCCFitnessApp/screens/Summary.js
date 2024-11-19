import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';

const Summary = ({ navigation, route }) => {
    const goalCalories = route.params.goalCalories;
    const goalType = route.params.goalType;

    const handleLetsGo = async () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
            })
        );
    };

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