import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { getMealTypeTranslation } from '../utils/mealTypes';
import ServingCard from '../components/ServingCard';

const ServingList = ({ servings, refreshServings }) => {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // Fetch servings data from an API
        await refreshServings(false);
        setRefreshing(false);
    }, []);

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={servings}
            keyExtractor={(item) => item.mealType}
            renderItem={({ item }) => (
                <View>
                    <Text style={styles.mealType}>{getMealTypeTranslation(item.mealType)}</Text>
                    {item.userFoods.length > 0 ? item.userFoods.map((serving, index) => (
                        <ServingCard key={index} serving={serving} />
                    )) : (
                        <View style={{height: 36, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                                Você não comeu nada aqui.
                            </Text>
                        </View>
                    )}
                </View>
            )}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#FF6624"
                />
            }
        />
    );
};

const styles = StyleSheet.create({
    mealType: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        padding: 8,
    },
    serving: {
        marginBottom: 8,
    },
    servingName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    servingDescription: {
        fontSize: 14,
        color: '#555',
    },
    servingCalories: {
        fontSize: 14,
        color: '#999',
    },
});

export default ServingList;