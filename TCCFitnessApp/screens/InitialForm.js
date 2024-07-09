import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const InitialForm = ({ navigation: { replace } }) => {
    const ageInputRef = useRef(null);
    const heightInputRef = useRef(null);
    const weightInputRef = useRef(null);
    const activityLevelInputRef = useRef(null);
    const goalTypeInputRef = useRef(null);

    const [isActivityLevelDropdownOpen, setIsActivityLevelDropdownOpen] = useState(false);
    const [isGoalTypeDropdownOpen, setIsGoalTypeDropdownOpen] = useState(false);

    const handleContinue = () => {
        console.log(ageInputRef.current.value);
        return ;
        let parsedHeight = parseFloat(height.replace(",", "."));

        if (parsedHeight < 10.0) {
            parsedHeight *= 100.0;
        }

        parsedHeight = parseInt(parsedHeight);

        const userInfo = {
            age: parseInt(age),
            height: parsedHeight,
            weight: parseFloat(weight),
            activityLevel,
            goalType,
        };

        console.log(userInfo);

        replace("Summary", { userInfo });
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
                            maxLength={3}
                            ref={weightInputRef}
                            onChangeText={(e) => weightInputRef.current.value = e}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.formLabel}>
                            Nível de atividade física
                        </Text>
                        <DropDownPicker
                            open={isActivityLevelDropdownOpen}
                            setOpen={setIsActivityLevelDropdownOpen}
                            items={[
                                { label: "Sedentário", value: "sedentary" },
                                { label: "Levemente ativo (1 ~ 3 vezes por semana)", value: "lightly_active" },
                                { label: "Moderadamente ativo (3 ~ 5 vezes por semana)", value: "moderately_active" },
                                { label: "Muito ativo (6 ~ 7 vezes por semana)", value: "very_active" },
                                { label: "Extremamente ativo (trabalho árduo, treino de 2 vezes por dia)", value: "extremely_active"}
                            ]}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.formLabel}>
                            Meu objetivo é...
                        </Text>
                        <DropDownPicker
                            open={isGoalTypeDropdownOpen}
                            setOpen={setIsGoalTypeDropdownOpen}
                            items={[
                                { label: "Perder peso", value: "lose_weight" },
                                { label: "Manter peso", value: "maintain_weight" },
                                { label: "Ganhar peso", value: "gain_weight" },
                            ]}
                        />
                    </View>
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
        height: '20%',
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
        height: '80%',
        padding: 10,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
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