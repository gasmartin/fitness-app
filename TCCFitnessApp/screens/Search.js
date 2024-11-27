import React, { useState } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

import SearchResultCard from '../components/SearchResultCard';

import api from '../axiosConfig';

const Search = ({ navigation, route }) => {
    const { currentDate, selectedMeal, meals } = route.params;

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const handleSearch = (query) => {
        setSearchQuery(query);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const newTimeout = setTimeout(async () => {
            if (query.trim() === '') {
                setFilteredResults([]);
            } else {
                try {
                    const response = await api.get(`/foods/?q=${query}`);
                    setFilteredResults(response.data);
                }
                catch (err) {
                    console.error('Error fetching search results:', err);
                    setFilteredResults([]);
                }
            }
        }, 200);

        setDebounceTimeout(newTimeout);
    };

    const renderSearchResultCard = ({ item }) => {
        const startsWithName = item.description.startsWith(`${item.name}, `);

        const descriptionWithoutName = startsWithName
            ? item.description.slice(item.name.length + 2)
            : item.description;

        return (
            <SearchResultCard
                name={item.name}
                description={descriptionWithoutName}
                onPress={() =>
                    navigation.navigate('AddFoodEntry', {
                        currentDate,
                        selectedMeal,
                        meals,
                        foodId: item.id
                    })}
            />
        );
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Pesquisar alimentos..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <FlatList
                    data={filteredResults}
                    keyExtractor={(item) => item.id}
                    renderItem={renderSearchResultCard}
                    ListEmptyComponent={
                        searchQuery
                            ? <View style={styles.emptyContainer}><Text>Nenhum alimento encontrado.</Text></View>
                            : null
                    }
                />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
    },
    textInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
});

export default Search;
