import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const WaterIntakeLogView = ({ waterIntakes }) => {
    const convertToMililiters = (amount) => amount * 100;

    const renderCard = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => console.log('Trigger Edit Water Modal...')}>
            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons 
                        name="water" 
                        size={36} 
                        color="#1565c0" 
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.amount}>
                        {convertToMililiters(item.quantityInLiters)} ml
                    </Text>
                    <Text style={styles.time}>
                        {item.time} oi
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                Ingestão de Água
            </Text>
            <FlatList 
                data={waterIntakes}
                renderItem={renderCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                scrollEnabled={false}
            />
            <Button title="Add More Water" onPress={() => { console.log('Trigger Add Water Modal...') }} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    list: { paddingBottom: 20 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    iconContainer: { 
        width: 60, 
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: { flex: 1 },
    amount: { fontSize: 18, fontWeight: 'bold', color: '#1565C0' },
    time: { fontSize: 14, color: '#607D8B', marginTop: 5 },
});

export default WaterIntakeLogView;
