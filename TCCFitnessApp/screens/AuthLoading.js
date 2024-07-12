import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';

import axios from 'axios';
import api from '../axiosConfig';
import { getToken } from '../helpers/token';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthLoading = ({ navigation }) => {
    useEffect(() => {
        const checkToken = async () => {
            const token = await getToken();
            if (token) {
                try {
                    const response = await api.get("/users/me", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const { has_provided_info: hasProvidedInfo } = response.data;
                    if (!hasProvidedInfo) {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [{ name: "InitialForm" }]
                            })
                        );
                        return;
                    }
                    else {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [{ name: "DailyServings" }]
                            })
                        );
                        return;
                    }
                }
                catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response.status === 401) {
                            await AsyncStorage.removeItem("access_token");
                            Alert.alert("Token inválido ou expirado! Faça login novamente.");
                        }
                    }
                    else {
                        console.error(error);
                    }
                }
            }
            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [{ name: "Login" }]
                })
            );
        };

        checkToken();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator animating={true} color="#FF6624" size="large" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 42,
    }
});

export default AuthLoading;