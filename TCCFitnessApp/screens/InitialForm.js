import React, { useRef, useState } from 'react';
import { CommonActions } from '@react-navigation/native';
import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

import api from '../axiosConfig';

const InitialForm = ({ navigation }) => {
    const ageInputRef = useRef(null);
    const heightInputRef = useRef(null);
    const weightInputRef = useRef(null);

    const [gender, setGender] = useState("M");
    const [activityLevel, setActivityLevel] = useState("sedentary");
    const [goalType, setGoalType] = useState("lose_weight");

    const [isActivityLevelDropdownOpen, setIsActivityLevelDropdownOpen] = useState(false);
    const [isGoalTypeDropdownOpen, setIsGoalTypeDropdownOpen] = useState(false);

    const parseWeight = (weight) => {
        let normalized = weight.replace(',', '.');
        normalized = normalized.replace(/(\..*?)\./g, '$1');
        return parseFloat(normalized);
    };

    const handleContinue = async () => {
        const age = ageInputRef.current.value;
        const height = heightInputRef.current.value;
        const weight = weightInputRef.current.value;

        if (!gender || !age || !height || !weight) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        let parsedHeight = parseFloat(height.replace(",", "."));

        if (parsedHeight < 10.0) {
            parsedHeight *= 100.0;
        }

        parsedHeight = parseInt(parsedHeight);

        const userInfo = {
            gender,
            age: parseInt(age),
            height: parsedHeight,
            weight: parseWeight(weight),
            activityLevel,
            goalType,
        };

        try {
            const response = await api.put(`/users/me`, { ...userInfo });

            const { goalCalories, goalType } = response.data;

            navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Summary', params: { goalCalories, goalType } }] }));
        }
        catch (err) {
            console.log(err);
        }

        navigate("Summary", { userInfo });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        Para começarmos,{"\n"}fale um pouco sobre você
                    </Text>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.formLabel}>
                        Gênero
                    </Text>
                    <View style={styles.radioButtonGroup}>
                        <View style={styles.radioButtonContainer}>
                            <RadioButton
                                value="M"
                                status={gender === "M" ? "checked" : "unchecked"}
                                onPress={() => setGender("M")}
                                color="#FF6624"
                            />
                            <Text style={styles.radioButtonLabel}>
                                Masculino
                            </Text>
                        </View>
                        <View style={styles.radioButtonContainer}>
                            <RadioButton
                                value="F"
                                status={gender === "F" ? "checked" : "unchecked"}
                                onPress={() => setGender("F")}
                                color="#FF6624"
                            />
                            <Text style={styles.radioButtonLabel}>
                                Feminino
                            </Text>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.formLabel}>
                            Idade
                        </Text>
                        <TextInput
                            style={styles.smallInput}
                            keyboardType="numeric"
                            placeholder="Ex: 25"
                            maxLength={3}
                            ref={ageInputRef}
                            onChangeText={(e) => ageInputRef.current.value = e}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.formLabel}>
                            Altura
                        </Text>
                        <TextInput
                            style={styles.smallInput}
                            keyboardType="numeric"
                            placeholder="cm"
                            maxLength={3}
                            ref={heightInputRef}
                            onChangeText={(e) => heightInputRef.current.value = e}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.formLabel}>
                            Peso
                        </Text>
                        <TextInput
                            style={styles.smallInput}
                            keyboardType="numeric"
                            placeholder="kg"
                            maxLength={5}
                            ref={weightInputRef}
                            onChangeText={(e) => weightInputRef.current.value = e}
                        />
                    </View>
                    <View style={[styles.inputContainer, { zIndex: isActivityLevelDropdownOpen ? 3000 : 1000 }]}>
                        <Text style={styles.formLabel}>
                            Nível de atividade física
                        </Text>
                        <DropDownPicker
                            open={isActivityLevelDropdownOpen}
                            setOpen={setIsActivityLevelDropdownOpen}
                            value={activityLevel}
                            setValue={setActivityLevel}
                            items={[
                                { label: "Sedentário", value: "sedentary" },
                                { label: "Levemente ativo (1 ~ 3 vezes por semana)", value: "lightly_active" },
                                { label: "Moderadamente ativo (3 ~ 5 vezes por semana)", value: "moderately_active" },
                                { label: "Muito ativo (6 ~ 7 vezes por semana)", value: "very_active" },
                                { label: "Extremamente ativo (trabalho árduo, treino de 2 vezes por dia)", value: "extremely_active" }
                            ]}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />
                    </View>
                    <View style={[styles.inputContainer, { zIndex: isGoalTypeDropdownOpen ? 3000 : 1000 }]}>
                        <Text style={styles.formLabel}>
                            Meu objetivo é...
                        </Text>
                        <DropDownPicker
                            open={isGoalTypeDropdownOpen}
                            setOpen={setIsGoalTypeDropdownOpen}
                            value={goalType}
                            setValue={setGoalType}
                            items={[
                                { label: "Perder peso", value: "lose_weight" },
                                { label: "Manter peso", value: "maintain_weight" },
                                { label: "Ganhar peso", value: "gain_weight" },
                            ]}
                            style={styles.dropdown}
                        />
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleContinue}
                    >
                        <Text style={styles.primaryButtonText}>Continuar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 48,
    },
    header: {
        width: '100%',
        height: '18%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        lineHeight: 50,
    },
    formContainer: {
        width: '100%',
        flex: 1,
        padding: 10,
    },
    radioButtonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    radioButtonLabel: {
        marginLeft: 8,
        fontSize: 16,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 12,
    },
    formLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    smallInput: {
        width: '20%',
        height: 50,
        padding: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
    },
    dropdownContainer: {
        zIndex: 3000,
    },
    dropdown: {
        height: 50,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        borderColor: '#E0E0E0',
    },
    buttonContainer: {
        width: "100%",
        height: "10%",
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
});

export default InitialForm;