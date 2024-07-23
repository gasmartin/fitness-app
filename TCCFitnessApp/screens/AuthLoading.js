import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';

import axios from 'axios';
import api from '../axiosConfig';
import { getToken, removeToken } from '../helpers/token';
import { UserContext } from '../contexts/UserContext';

const AuthLoading = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);

    const navigateToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: "Home" }]
            })
        );
    }

    const navigateToInitialForm = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: "InitialForm" }]
            })
        );
    }

    const navigateToLogin = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: "Login" }]
            })
        );
    }

    useEffect(() => {
        const checkToken = async () => {
            const token = await getToken();

            if (!token) {
                navigateToLogin();
                return;
            }

            try {
                await api.get("/users/check-token");
            }
            catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response.status === 401) {
                        await removeToken();
                        navigateToLogin();
                        return;
                    }
                }
            }

            try {
                const response = await api.get("/users/me");

                setUser(() => {
                    const { has_provided_info: hasProvidedInfo } = response.data;

                    if (hasProvidedInfo) {
                        navigateToHome();
                    }
                    else {
                        navigateToInitialForm();
                    }

                    return response.data
                });
            }
            catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response.status === 401) {
                        await removeToken();
                        navigateToLogin();
                    }
                }
                else {
                    console.error(error);
                }
            }
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