import React, { useState } from 'react';
import { View, Text, TextInput, Button, Keyboard, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { format } from 'date-fns';
import api from '../axiosConfig';
import { MealTypes, mealTypeItems } from '../utils/mealTypes';

const AddFoodEntry = ({ navigation: { goBack, navigate }, route: { params: { food } } }) => {
    const { name, description, portions } = food;

    const [mealType, setMealType] = useState(mealTypeItems[0].value);
    const [portion, setPortion] = useState(portions && portions.length > 0 ? portions[0].id : null);
    const [quantity, setQuantity] = useState("1");

    const [isMealTypeDropdownOpen, setIsMealTypeDropdownOpen] = useState(false);
    const [isPortionDropdownOpen, setIsPortionDropdownOpen] = useState(false);

    const handleConfirm = async () => {
        const parsedQuantity = parseFloat(quantity.replace(",", "."));

        const body = {
            meal_type: mealType,
            quantity: parsedQuantity,
            consumed_at: format(new Date(), "yyyy-MM-dd"),
            user_id: 1,
            food_id: food.id,
            portion_id: portion,
        };

        console.log(body);

        const response = await api.post("/servings", body);

        if (response.status === 200) {
            navigate("DailyServings");
        }
        else {
            console.error(response);
        }
    };

    const handleCancel = () => {
        goBack();
    }

    console.log(mealTypeItems);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{name}</Text>
                    <Text style={styles.headerText}>{description}</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.formLabel}>Quantidade:</Text>
                    <TextInput
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <Text style={styles.formLabel}>Porção ou unidade:</Text>
                    <DropDownPicker
                        open={isPortionDropdownOpen}
                        setOpen={setIsPortionDropdownOpen}
                        items={portions.map((item) => ({ label: item.name, value: item.id }))}
                        value={portion}
                        setValue={setPortion}
                        containerStyle={{ height: 40, marginBottom: 20 }}
                        style={styles.picker}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        zIndex={3000}
                        zIndexInverse={1000}
                    />
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
                        zIndex={2000}
                        zIndexInverse={2000}
                    />
                </View>
                <View style={styles.footer}>
                    <Button title="Confirmar" onPress={handleConfirm} />
                    <Button title="Cancelar" onPress={handleCancel} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    body: {
        flex: 1,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 10,
    },
    formLabel: {
        marginVertical: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default AddFoodEntry;