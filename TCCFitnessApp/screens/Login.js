import React, { useRef } from 'react';
import {
    Alert,
    Keyboard,
    StyleSheet,
    Text,
    TextInput, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
    View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

import Button from '../components/Button';

const Login = ({ navigation }) => {
    const emailInput = useRef(null);
    const passwordInput = useRef(null);

    const { login } = useAuth();

    const handleLogin = async () => {
        const username = emailInput.current.value;
        const password = passwordInput.current.value;

        if (!username || !password) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            await login(username, password);
        }
        catch (err) {
            console.error("Error while trying to login:", err);
            if (err.response.status === 401) {
                Alert.alert("Usuário ou senha incorretos!");
            }
        }
    };

    const handleRegister = () => {
        navigation.navigate("Register");
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        Login
                    </Text>
                </View>
                <View style={styles.form}>
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
                </View>
                <View style={styles.action}>
                    <Button title="Fazer login" onPress={handleLogin} />
                    <TouchableOpacity>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }} onPress={handleRegister}>
                            Ainda não possui uma conta?{" "}
                            <Text style={{ color: '#FF6624' }}>
                                Cadastre-se agora!
                            </Text>
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
        flex: 3,
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

export default Login;