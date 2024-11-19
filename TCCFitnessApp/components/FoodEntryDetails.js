import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Card from './Card';

const FoodEntryDetails = ({ quantity, servingSize }) => {
    const calories = parseInt(servingSize.calories * quantity);
    const carbohydrates = parseInt(servingSize.carbohydrates * quantity);
    const proteins = parseInt(servingSize.proteins * quantity);
    const lipids = parseInt(servingSize.lipids * quantity);

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
                    {proteins} g
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