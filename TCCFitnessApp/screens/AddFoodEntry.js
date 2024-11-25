import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, StyleSheet, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { CommonActions } from '@react-navigation/native';

import api from '../axiosConfig';
import FoodEntryDetails from '../components/FoodEntryDetails';
import Loader from '../components/Loader';

const AddFoodEntry = ({ navigation, route }) => {
    const { currentDate, foodId, selectedMeal, meals } = route.params;

    const [food, setFood] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [meal, setMeal] = useState(selectedMeal);
    const [isMealDropdownOpen, setIsMealDropdownOpen] = useState(false);

    const [servingSize, setServingSize] = useState(food?.servingSizes[0] || null);
    const [isServingSizeDropdownOpen, setIsServingSizeDropdownOpen] = useState(false);

    const [quantity, setQuantity] = useState("0");

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get(`/foods/${foodId}`, { headers: { 'Content-Type': 'application/json' } });
                console.log(response.data);
                setFood(response.data);
                setServingSize(response.data.servingSizes[0]);
                setIsLoading(false);
            }
            catch (err) {
                console.error('Error while trying to get food:', err);
            }
        })();
    }, []);

    const convertToNumber = (input) => {
        return parseFloat(parseFloat(input.replace(',', '.')).toFixed(1));
    }

    const handleAdd = async () => {
        const data = {
            quantity: convertToNumber(quantity),
            consumptionDate: currentDate,
            foodId: food.id,
            mealId: meal.id,
            servingSizeId: servingSize.id
        };

        console.log(data);

        try {
            await api.post('/food-consumptions/', data, { headers: { 'Content-Type': 'application/json' } })
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home', params: { shouldRefresh: true } }]
                })
            );
        }
        catch (err) {
            console.error('Error while trying to create food consumption:', err);
        }
    };

    if (isLoading) {
        return <Loader />
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{food.name}</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.formLabel}>Refeição:</Text>
                    <DropDownPicker
                        open={isMealDropdownOpen}
                        setOpen={setIsMealDropdownOpen}
                        items={meals.map((meal) => ({label: meal.name, value: meal}))}
                        value={meal}
                        setValue={setMeal}
                        containerStyle={{ height: 40, marginBottom: 20 }}
                        style={styles.picker}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        zIndex={4000}
                        zIndexInverse={1000}
                    />
                    <Text style={styles.formLabel}>Porção:</Text>
                    <DropDownPicker
                        open={isServingSizeDropdownOpen}
                        setOpen={setIsServingSizeDropdownOpen}
                        items={food.servingSizes.map((ss) => ({label: ss.name, value: ss}))}
                        value={servingSize}
                        setValue={setServingSize}
                        containerStyle={{ height: 40, marginBottom: 20 }}
                        style={styles.picker}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        zIndex={3000}
                        zIndexInverse={1000}
                    />
                    <Text style={styles.formLabel}>Quantidade da porção:</Text>
                    <TextInput
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <FoodEntryDetails quantity={quantity} servingSize={servingSize} />
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleAdd}>
                        <Text style={styles.primaryButtonText}>
                            Adicionar
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.secondaryButtonText}>
                            Voltar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 42,
    },
    header: {
        padding: 32,
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    headerSummary: {
        fontSize: 18,
        color: '#666',
    },
    body: {
        flex: 3,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        borderColor: 'gray',
    },
    input: {
        height: 50,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 10,
        borderRadius: 5,
    },
    formLabel: {
        marginVertical: 10,
        fontWeight: 'bold',
        fontSize: 18,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    buttonsContainer: {
        flex: 1,
        width: "100%",
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    primaryButton: {
        width: "100%",
        backgroundColor: "#FF6624",
        padding: 20,
        borderRadius: 10,
        marginVertical: "auto",
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center",
        textTransform: "capitalize",
        fontWeight: "bold",
    },
    secondaryButton: {
        width: "100%",
        backgroundColor: "#B0BEC5",
        padding: 20,
        borderRadius: 10,
        marginVertical: "auto",
    },
    secondaryButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center",
        textTransform: "capitalize",
        fontWeight: "bold",
    }
});

export default AddFoodEntry;