import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, StyleSheet, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { format } from 'date-fns';

import api from '../axiosConfig';
import { mealTypeItems } from '../utils/mealTypes';
import { CurrentDateContext } from '../contexts/CurrentDateContext';
import axios from 'axios';
import FoodEntryDetails from '../components/FoodEntryDetails';

const AddFoodEntry = ({ navigation: { goBack, navigate }, route: { params: { food } } }) => {
    const { name, kcal, carbohydrates, protein, lipids } = food;

    const { currentDate } = useContext(CurrentDateContext);

    const [mealType, setMealType] = useState(mealTypeItems[0].value);
    const [quantity, setQuantity] = useState("0");

    const [isMealTypeDropdownOpen, setIsMealTypeDropdownOpen] = useState(false);

    const handleAdd = async () => {
        const parsedQuantity = parseInt(quantity.replace(",", "."));

        const body = {
            meal_type: mealType,
            quantity_in_grams: parsedQuantity,
            consumed_at: format(currentDate, "yyyy-MM-dd"),
            food,
        };

        try {
            await api.post("/user-foods/", body);
            navigate("Home");
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response.status === 401) {
                    navigate("AuthLoading");
                }
                else {
                    console.error(error.response.data);
                }
            }
            else {
                console.error(error);
            }
        }
    };

    const handleBack = () => {
        goBack();
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{name}</Text>
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
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <FoodEntryDetails quantity={quantity} food={food} />
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleAdd}>
                        <Text style={styles.primaryButtonText}>
                            Adicionar
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
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