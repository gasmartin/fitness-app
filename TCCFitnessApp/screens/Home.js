import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import DailyServings from './DailyServings';
import Profile from './Profile';

import api from '../axiosConfig';
import { useAuth } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();

const Home = ({ navigation }) => {
    const { updateUser } = useAuth();

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

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'DailyServings') {
                        iconName = 'restaurant';
                    } else if (route.name === 'Profile') {
                        iconName = 'person';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarLabel: ({ focused, color }) => {
                    let label;

                    if (route.name === 'DailyServings') {
                        label = 'Refeições';
                    } else if (route.name === 'Profile') {
                        label = 'Meu Perfil';
                    }

                    return <Text style={{ color }}>{label}</Text>;
                },
                headerShown: false,
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