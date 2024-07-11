import React from 'react';
import { StyleSheet, View } from 'react-native';

const FoodCard = ({ food }) => {
    return (
        <View style={styles.container}>
            <Text>{food.name}</Text>
            <Text>{food.description}</Text>
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
});

export default FoodCard;