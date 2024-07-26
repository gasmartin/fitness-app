import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Card from './Card';

const FoodEntryDetails = ({ food, quantity }) => {
    const calories = parseInt(food.kcal * (quantity / 100));
    const carbohydrates = parseInt(food.carbohydrates * (quantity / 100));
    const protein = parseInt(food.protein * (quantity / 100));
    const lipids = parseInt(food.lipids * (quantity / 100));

    return (
        <View style={styles.container}>
            <Card title="Esta porção do alimento irá proporcionar os seguintes nutrientes">
                <Text style={styles.labelTextContainer}>
                    <Text style={styles.labelText}>
                        Calorias: {" "}
                    </Text>
                    {calories} kcal
                </Text>
                <Text style={styles.labelTextContainer}>
                    <Text style={styles.labelText}>
                        Carboidratos: {" "}
                    </Text>
                    {carbohydrates} g
                </Text>
                <Text style={styles.labelTextContainer}>
                    <Text style={styles.labelText}>
                        Proteínas: {" "}
                    </Text>
                    {protein} g
                </Text>
                <Text style={styles.labelTextContainer}>
                    <Text style={styles.labelText}>
                        Lipídios: {" "}
                    </Text>
                    {lipids} g
                </Text>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: "auto",
    },
    labelTextContainer: {
        marginBottom: 8,
    },
    labelText: {
        fontWeight: 'bold',
    },
});

export default FoodEntryDetails;