import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Card = ({ children, title }) => {
    return (
        <View style={styles.card}>
            {title && <Text style={styles.cardTitle}>{title}</Text>}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        padding: 20,
        margin: 10,
    },
    cardTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 16,
    },
});

export default Card;