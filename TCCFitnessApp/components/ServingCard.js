import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ServingCard = ({ serving }) => {
    const navigation = useNavigation();
    const { kcal, food: { name } } = serving;

    const handlePress = () => {
        navigation.navigate("EditFoodEntry", { userFood: serving });
    };

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.container}>
                <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'space-around' }}>
                    <Text style={styles.foodName}>
                        {name}
                    </Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Text style={styles.consumedCalories}>
                        {kcal} kcal
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: 96,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 6,
        marginBottom: 8,
    },
    foodName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    foodDescription: {
        fontSize: 14,
        color: '#666',
    },
    consumedCalories: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ServingCard;