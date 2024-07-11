import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ServingCard = ({ serving }) => {
    const { consumed_calories, food: { name, description } } = serving;

    return (
        <View style={styles.container}>
            <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'space-around' }}>
                <Text style={styles.foodName}>
                    { name }
                </Text>
                <Text style={styles.foodDescription}>
                    { description }
                </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Text style={styles.consumedCalories}>
                    { consumed_calories } kcal
                </Text>
            </View>
        </View>
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