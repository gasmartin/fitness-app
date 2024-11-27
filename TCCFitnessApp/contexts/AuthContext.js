import React, { createContext, useContext, useEffect, useState } from 'react';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../axiosConfig';
import { navigationRef } from '../NavigationService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        (async () => {
            const userData = await AsyncStorage.getItem('user');

            if (userData) {
                setUser(JSON.parse(userData));
                setIsAuthenticated(true); // Usuário autenticado
            }
            else {
                try {
                    const response = await api.get('/users/me', { headers: { 'Content-Type': 'application/json' } });
                    updateUser(response.data);
                    setIsAuthenticated(true); // Usuário autenticado
                }
                catch (err) {
                    console.error('Error while trying to get user info:', err);
                }
            }

            setLoading(false);
        })();
    }, []);

    const updateUser = async (userData) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        }
        catch (err) {
            console.error('Erro ao gravar no AsyncStorage:', err);
        }
    };

    const login = async (username, password) => {
        const authData = new URLSearchParams();
        authData.append("username", username);
        authData.append("password", password);

        const response = await api.post("/users/login", authData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { accessToken, refreshToken } = response.data;

        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);

        setIsAuthenticated(true); // Atualiza estado após login bem-sucedido

        navigationRef.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
            })
        );
    };

    const logout = async () => {
        await AsyncStorage.clear();
        setIsAuthenticated(false); // Atualiza estado após logout

        navigationRef.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }]
            })
        );
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, updateUser }}>
            { children }
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
