import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const FoodEntryDetails = ({ food, quantity }) => {
    const calories = parseInt(food.kcal * (quantity / 100));
    const carbohydrates = parseInt(food.carbohydrates * (quantity / 100));
    const protein = parseInt(food.protein * (quantity / 100));
    const lipids = parseInt(food.lipids * (quantity / 100));

    return (
        <View>
            <Text>Esta porção de comida te proporcionará as seguintes quantidades:</Text>
            <Text>Calorias: {calories}</Text>
            <Text>Carboidratos: {carbohydrates}</Text>
            <Text>Proteínas: {protein}</Text>
            <Text>Lipídios/gordura: {lipids}</Text>
        </View>
    );
};

export default FoodEntryDetails;