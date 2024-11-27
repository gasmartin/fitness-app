import React, { useState } from 'react';
import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { CommonActions } from '@react-navigation/native';

import FoodEntryDetails from '../components/FoodEntryDetails';

import api from '../axiosConfig';

const EditFoodEntry = ({ navigation, route }) => {
    const { meals, foodConsumption } = route.params;

    const [meal, setMeal] = useState(meals.find((meal) => meal.id === foodConsumption.meal.id));
    const [isMealDropdownOpen, setIsMealDropdownOpen] = useState(false);

    const [servingSize, setServingSize] = useState(foodConsumption.servingSize);
    const [isServingSizeDropdownOpen, setIsServingSizeDropdownOpen] = useState(false);

    // Inicializa a quantidade com o formato brasileiro
    const [quantity, setQuantity] = useState(foodConsumption.quantity.toString().replace('.', ','));

    const formatToBR = (input) => {
        // Remove caracteres inválidos e garante apenas números e vírgula
        let validatedInput = input.replace(/[^0-9,]/g, '');
        // Garante que apenas uma vírgula seja usada como separador decimal
        validatedInput = validatedInput.replace(/,/g, (match, offset) => (offset === validatedInput.indexOf(',') ? ',' : ''));
        return validatedInput;
    };

    const convertToNumber = (input) => {
        // Substitui vírgula por ponto para conversão numérica
        const formattedInput = input.replace(',', '.');
        return parseFloat(formattedInput) || 0; // Retorna 0 se a entrada for inválida
    };

    const handleSave = async () => {
        const data = {
            quantity: convertToNumber(quantity), // Envia o valor no formato numérico para o backend
            mealId: meal.id,
            servingSizeId: servingSize.id
        };

        try {
            await api.put(`/food-consumptions/${foodConsumption.id}`, data, { headers: { 'Content-Type': 'application/json' } });
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home', params: { shouldRefresh: true } }]
                })
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    const servingSizeDropdownItems = [
        servingSize,
        ...foodConsumption.food.servingSizes.filter((ss) => ss.id !== servingSize.id),
    ].map((ss) => ({ label: ss.name, value: ss }));

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{foodConsumption.food.name}</Text>
                    <Text style={styles.headerSummary}>{foodConsumption.food.description}</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.formLabel}>Refeição:</Text>
                    <DropDownPicker
                        open={isMealDropdownOpen}
                        setOpen={setIsMealDropdownOpen}
                        items={meals.map((meal) => ({ label: meal.name, value: meal }))}
                        value={meal}
                        setValue={setMeal}
                        containerStyle={{ height: 40, marginBottom: 20 }}
                        style={styles.picker}
                        zIndex={4000}
                        zIndexInverse={1000}
                    />
                    <Text style={styles.formLabel}>Porção:</Text>
                    <DropDownPicker
                        open={isServingSizeDropdownOpen}
                        setOpen={setIsServingSizeDropdownOpen}
                        items={servingSizeDropdownItems}
                        value={servingSize}
                        setValue={setServingSize}
                        containerStyle={{ height: 40, marginBottom: 20 }}
                        style={styles.picker}
                        zIndex={3000}
                        zIndexInverse={1000}
                    />
                    <Text style={styles.formLabel}>Quantidade da porção:</Text>
                    <TextInput
                        value={quantity}
                        onChangeText={(text) => setQuantity(formatToBR(text))}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <FoodEntryDetails quantity={convertToNumber(quantity)} servingSize={servingSize} />
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
                        <Text style={styles.primaryButtonText}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton} onPress={handleCancel}>
                        <Text style={styles.secondaryButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        padding: 20,
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 18,
    },
    headerSummary: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    body: {
        flex: 1,
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
    buttonsContainer: {
        width: "100%",
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    primaryButton: {
        width: "100%",
        backgroundColor: "#FF6624",
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
    secondaryButton: {
        width: "100%",
        backgroundColor: "#B0BEC5",
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
    },
    secondaryButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
});

export default EditFoodEntry;
