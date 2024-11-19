import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const Button = ({ title, onPress, type = 'primary' }) => {
    return (
        <TouchableOpacity 
            style={[styles.button, type === 'primary' ? styles.primary : styles.secondary]}
            onPress={onPress}
        >
            <Text style={type === 'primary' ? styles.primaryText : styles.secondaryText}>
                { title }
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        backgroundColor: '#FF6624',
    },
    secondary: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#007BFF',
    },
    primaryText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    secondaryText: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
});

export default Button;