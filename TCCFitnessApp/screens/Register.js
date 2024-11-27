import React, { useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import api from '../axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

const Register = ({ navigation }) => {
    const nameInput = useRef(null);
    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    const passwordConfirmationInput = useRef(null);

    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        const name = nameInput.current.value;
        const email = emailInput.current.value;
        const password = passwordInput.current.value;
        const passwordConfirmation = passwordConfirmationInput.current.value;

        if (!name || !email || !password || !passwordConfirmation) {
            alert("Preencha todos os campos!");
            return;
        }

        if (password != passwordConfirmation) {
            alert("As senhas não coincidem!");
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post("/users/", {
                name,
                email,
                password,
            });
            const { accessToken, refreshToken } = response.data;

            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);

            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Home" }],
                })
            );
        }
        catch (error) {
            console.error(error);
        }

        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator animating={true} color="#FF6624" size="large" />
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        Cadastro de Usuário
                    </Text>
                </View>
                <View style={styles.form}>
                    <View style={styles.formInputContainer}>
                        <Text style={styles.formLabel}>
                            Nome
                        </Text>
                        <TextInput
                            inputMode="text"
                            style={styles.formInputText}
                            placeholder="Digite seu nome"
                            autoCapitalize="words"
                            ref={nameInput}
                            onChangeText={(e) => nameInput.current.value = e}
                        />
                    </View>
                    <View style={styles.formInputContainer}>
                        <Text style={styles.formLabel}>
                            E-mail
                        </Text>
                        <TextInput
                            inputMode="email"
                            style={styles.formInputText}
                            placeholder="Digite seu email"
                            autoCapitalize="none"
                            ref={emailInput}
                            onChangeText={(e) => emailInput.current.value = e}
                        />
                    </View>
                    <View style={styles.formInputContainer}>
                        <Text style={styles.formLabel}>
                            Senha
                        </Text>
                        <TextInput
                            inputMode="text"
                            secureTextEntry={true}
                            style={styles.formInputText}
                            placeholder="Digite sua senha"
                            ref={passwordInput}
                            onChangeText={(e) => passwordInput.current.value = e}
                        />
                    </View>
                    <View style={styles.formInputContainer}>
                        <Text style={styles.formLabel}>
                            Confirmação de Senha
                        </Text>
                        <TextInput
                            inputMode="text"
                            secureTextEntry={true}
                            style={styles.formInputText}
                            placeholder="Digite sua senha novamente"
                            ref={passwordConfirmationInput}
                            onChangeText={(e) => passwordConfirmationInput.current.value = e}
                        />
                    </View>
                </View>
                <View style={styles.action}>
                    <TouchableOpacity
                        onPress={handleRegister}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>
                            Cadastrar
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 42
    },
    header: {
        width: '100%',
        flex: 2,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    form: {
        padding: 16,
        width: '100%',
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formInputContainer: {
        width: '100%',
        marginBottom: 24,
    },
    formLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    formInputText: {
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 10,
        marginTop: 10,
    },
    action: {
        flex: 2,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '100%',
        backgroundColor: '#FF6624',
        marginBottom: 48,
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'capitalize',
    }
});

export default Register;