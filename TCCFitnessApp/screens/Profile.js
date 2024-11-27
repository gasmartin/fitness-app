import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, View } from 'react-native';

import api from '../axiosConfig';
import { useAuth } from '../contexts/AuthContext';

const Profile = ({ navigation }) => {
    const { logout, user, updateUser } = useAuth();

    const [weight, setWeight] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const formatToBrazilian = (value) => {
        const numericValue = value.replace(/[^0-9,]/g, '');
        return numericValue;
    };

    const parseWeight = (weight) => {
        return parseFloat(weight.replace(',', '.'));
    };

    const handleWeightChange = (text) => {
        const formattedWeight = formatToBrazilian(text);
        setWeight(formattedWeight);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const response = await api.put('/users/me', { weight: parseWeight(weight) }, { headers: { 'Content-Type': 'application/json' } });
            const updatedUser = response.data;
            updateUser(updatedUser);
            setWeight(updatedUser?.weight?.toFixed(1).replace('.', ',') || '');
        } catch (error) {
            console.log("Error saving:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            setWeight(user?.weight ? user.weight.toFixed(1).replace('.', ',') : '');
        }
    }, [user]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.editWeightForm}>
                    <Text style={styles.editWeightFormTitle}>
                        Meu peso atual é...
                    </Text>
                    <TextInput
                        style={styles.editWeightFormInput}
                        value={weight}
                        onChangeText={handleWeightChange}
                        keyboardType="numeric"
                        placeholder='Ex: 70,5'
                        editable={!isLoading}
                    />
                    <TouchableOpacity
                        style={[styles.saveButton, { opacity: user?.weight?.toFixed(1).replace('.', ',') === weight ? 0.5 : 1 }]}
                        onPress={handleSave}
                        disabled={user?.weight?.toFixed(1).replace('.', ',') === weight}
                    >
                        {isLoading ? (
                            <ActivityIndicator size='small' color='#FF6624' />
                        ) : (
                            <Text style={styles.saveButtonText}>
                                Salvar
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 42,
    },
    editWeightForm: {
        width: '100%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    editWeightFormTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 16,
    },
    editWeightFormInput: {
        padding: 10,
        borderRadius: 10,
        borderColor: 'gray',
        marginBottom: 10,
        fontSize: 16,
    },
    saveButton: {
        padding: 20,
        backgroundColor: '#FF6624',
        borderRadius: 10,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'capitalize',
        textAlign: 'center',
    },
    logoutButton: {
        padding: 20,
        backgroundColor: 'red',
        borderRadius: 10,
    },
    logoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'capitalize',
        textAlign: 'center',
    },
});

export default Profile;
