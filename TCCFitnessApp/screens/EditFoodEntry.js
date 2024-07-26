import React, { useState } from 'react';
import { Button, Text, TextInput, View, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import FoodEntryDetails from '../components/FoodEntryDetails';

import api from '../axiosConfig';
import { mealTypeItems } from '../utils/mealTypes';

const EditFoodEntry = ({ navigation, route }) => {
    const { userFood } = route.params;

    const [mealType, setMealType] = useState(userFood.meal_type);
    const [quantityInGrams, setQuantityInGrams] = useState(userFood.quantity_in_grams.toString());
    const [isMealTypeDropdownOpen, setIsMealTypeDropdownOpen] = useState(false);

    const handleSave = async () => {
        const body = {
            meal_type: mealType,
            quantity_in_grams: parseInt(quantityInGrams)
        }

        try {
            await api.put(`/user-foods/${userFood.id}`, body);
            navigation.goBack();
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/user-foods/${userFood.id}`);
            navigation.navigate("Home");
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleCancel = () => {
        navigation.goBack()
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        {userFood.food.name}
                    </Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.formLabel}>Tipo de refeição:</Text>
                    <DropDownPicker
                        open={isMealTypeDropdownOpen}
                        setOpen={setIsMealTypeDropdownOpen}
                        items={mealTypeItems}
                        value={mealType}
                        setValue={setMealType}
                        containerStyle={{ height: 40, marginBottom: 20 }}
                        style={styles.picker}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        zIndex={3000}
                        zIndexInverse={1000}
                    />
                    <Text style={styles.formLabel}>Quantidade em gramas consumida:</Text>
                    <TextInput
                        value={quantityInGrams}
                        onChangeText={setQuantityInGrams}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <FoodEntryDetails quantity={quantityInGrams} food={userFood.food} />
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