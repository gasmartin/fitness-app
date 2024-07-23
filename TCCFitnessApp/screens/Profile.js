import React, { useContext, useState } from 'react';
import { Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, View } from 'react-native';

import api from '../axiosConfig';
import { removeToken } from '../helpers/token';
import { UserContext } from '../contexts/UserContext';

const Profile = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const [weight, setWeight] = useState(user.weight.toFixed(1).toString());

    const parseWeight = (weight) => {
        return parseFloat(weight.replace(',', '.')).toFixed(1);
    }

    const handleSave = async () => {
        try {
            const response = await api.put('/users/', { weight: parseWeight(weight) });
            setUser(response.data);
            setWeight(response.data.weight.toFixed(1).toString());
        }
        catch (error) {
            console.log("Error saving");
        }
    };

    const handleLogout = async () => {
        await removeToken();
        navigation.navigate("AuthLoading");
    };

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
                        onChangeText={setWeight}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity
                        style={[styles.saveButton, { opacity: user.weight == weight ? 0.5 : 1 }]}
                        onPress={handleSave}
                        disabled={user.weight == weight}
                    >
                        <Text style={styles.saveButtonText}>
                            Salvar
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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