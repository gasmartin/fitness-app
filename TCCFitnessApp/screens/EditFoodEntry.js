import React, { useState } from 'react';
import { Button, Text, TextInput, View, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import FoodEntryDetails from '../components/FoodEntryDetails';

import api from '../axiosConfig';
import { CommonActions } from '@react-navigation/native';

const EditFoodEntry = ({ navigation, route }) => {
    const { selectedMeal, meals, foodConsumption } = route.params;

    const [meal, setMeal] = useState(selectedMeal);
    const [isMealDropdownOpen, setIsMealDropdownOpen] = useState(false);

    const [servingSize, setServingSize] = useState(foodConsumption.servingSize);
    const [isServingSizeDropdownOpen, setIsServingSizeDropdownOpen] = useState(false);

    const [quantity, setQuantity] = useState(foodConsumption.quantity.toString());

    const handleSave = async () => {
        const data = {
            quantity,
            mealId: meal.id,
            servingSizeId: servingSize.id
        }

        try {
            await api.put(`/food-consumptions/${foodConsumption.id}`, data, { headers: { 'Content-Type': 'application/json' } });
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home', params: { shouldRefresh: true } }]
                })
            );
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/food-consumptions/${foodConsumption.id}`);
            navigation.goBack();
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleCancel = () => {
        navigation.goBack()
    };

    const servingSizeDropdownItems = [
        servingSize, ...foodConsumption.food.servingSizes.filter((ss) => ss.id != servingSize.id)
    ].map((ss) => ({label: ss.name, value: ss}));

    console.log(servingSizeDropdownItems);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        {foodConsumption.food.name}
                    </Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.formLabel}>Refeição:</Text>
                    <DropDownPicker
                        open={isMealDropdownOpen}
                        setOpen={setIsMealDropdownOpen}
                        value={meal}
                        items={meals.map((meal) => ({label: meal.name, value: meal}))}
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
                        value={servingSize}
                        items={servingSizeDropdownItems}
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
                    <Text style={styles.formLabel}>Quantidade:</Text>
                    <TextInput
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <FoodEntryDetails quantity={quantity} servingSize={servingSize} />
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
                        <Text style={styles.buttonText}>
                            Salvar
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonRemove} onPress={handleDelete}>
                        <Text style={styles.buttonText}>
                            Remover
                        </Text>
                    </TouchableOpacity>
                    <View>
                        <Button title="Cancelar" onPress={handleCancel} />
                    </View>
                    {/* <TouchableOpacity style={styles.buttonCancel} onPress={handleCancel}>
                        <Text style={styles.buttonText}>
                            Cancelar
                        </Text>
                    </TouchableOpacity> */}
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
        flex: 2,
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
        flex: 7,
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
        flex: 3,
        width: "100%",
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    buttonSave: {
        width: "100%",
        backgroundColor: "#FF6624",
        padding: 20,
        borderRadius: 10,
        marginVertical: "auto",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center",
        textTransform: "capitalize",
        fontWeight: "bold",
    },
    buttonRemove: {
        width: "100%",
        backgroundColor: "#FF0000",
        padding: 20,
        borderRadius: 10,
        marginVertical: "auto",
    },
    buttonCancel: {
        width: "100%",
        backgroundColor: "#B0BEC5",
        padding: 20,
        borderRadius: 10,
        marginVertical: "auto",
    },
});

export default EditFoodEntry;