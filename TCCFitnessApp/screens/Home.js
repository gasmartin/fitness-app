import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DailyServings from './DailyServings';
import Profile from './Profile';

import api from '../axiosConfig';
import { useAuth } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();

const Home = ({ navigation }) => {
    const { user, updateUser } = useAuth();

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get(`/users/me`);
                await updateUser(response.data);

                const { hasPhysiologyInformation } = response.data;

                if (!hasPhysiologyInformation) {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'InitialForm' }]
                        })
                    );
                }
            }
            catch (err) {
                console.log(err);
            }
        })();
    }, []);

    if (!user) {
        return null; // Retorna nada enquanto os dados do usuário são carregados
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                    let iconName;

                    if (route.name === 'DailyServings') {
                        iconName = 'food';
                    } else if (route.name === 'Profile') {
                        iconName = 'account';
                    }

                    return (
                        <MaterialCommunityIcons
                            name={iconName}
                            size={24}
                            color={color}
                        />
                    );
                },
                tabBarLabel: ({ color }) => {
                    let label;

                    if (route.name === 'DailyServings') {
                        label = 'Refeições';
                    } else if (route.name === 'Profile') {
                        label = 'Meu Perfil';
                    }

                    return <Text style={{ color }}>{label}</Text>;
                },
                headerShown: false,
                tabBarStyle: {
                    height: 50, // Reduz a altura total da TabBar
                    paddingBottom: 0, // Reduz o espaço interno inferior
                    paddingTop: 0,
                },
                tabBarActiveTintColor: '#FF6624',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="DailyServings" component={DailyServings} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
};

export default Home;