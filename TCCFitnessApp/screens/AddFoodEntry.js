import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AddFoodEntry = ({ navigation, route: { params: { food } } }) => {
    console.log(food.portions);
    const [portion, setPortion] = useState(food.portions[0]);
    const [quantity, setQuantity] = useState("1");
    console.log(`Selected portion: ${portion.name}`);

    const handleValueChange = (itemValue) => setPortion(itemValue);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{food.name}</Text>
                <Text style={styles.headerText}>{food.description}</Text>
            </View>
            <View style={styles.body}>
                <Text>Quantity</Text>
                <TextInput
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <Text>Portion</Text>
                <Picker
                    selectedValue={portion}
                    onValueChange={handleValueChange}
                    style={styles.picker}
                    mode={"dropdown"}
                >
                    {food.portions.map((item, index) => <Picker.Item key={index} label={item.name} value={item} />)}
                </Picker>
                <Picker>
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                </Picker>
            </View>
            <View style={styles.footer}>
                <Button title="Confirmar" onPress={() => navigation.navigate("DailyServings")} />
                <Button title="Cancelar" onPress={() => navigation.goBack()} />
            </View>
        </View>
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
        marginBottom: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default AddFoodEntry;