import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, ActivityIndicator, StyleSheet, Pressable } from 'react-native';

import api from '../axiosConfig';

const FoodSearchResults = ({ navigation: { navigate } }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchFoodResults = async (query) => {
        setIsLoading(true);
        try {
            const response = await api.get(`/foods?name=${query}`);
            setResults(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (searchQuery) {
            fetchFoodResults(searchQuery);
        }
    }, [searchQuery]);

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search for food..."
                onChangeText={handleSearch}
                value={searchQuery}
            />
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(food) => food.id.toString()}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => navigate("AddFoodEntry", { food: item })}>
                            <View style={styles.item}>
                                <Text>{item.name}</Text>
                            </View>
                        </Pressable>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 42,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default FoodSearchResults;