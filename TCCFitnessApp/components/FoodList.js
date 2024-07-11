import React from 'react';
import { FlatList, StyleSheet } from 'react-native-gesture-handler';

import FoodCard from './FoodCard';

const FoodList = ({ foods }) => {
    return (
        <FlatList
            data={foods}
            keyExtractor={(food) => food.id.toString()}
            renderItem={({ food }) => (
                <FoodCard food={food} />
            )}
        />
    );
};

const styles = StyleSheet.create({
});

export default FoodList;