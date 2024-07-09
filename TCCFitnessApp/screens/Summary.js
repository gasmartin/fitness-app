import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Summary = ({ navigation: { replace } }) => {
    const handleLetsGo = () => {
        replace("DailyServings");
    };

    const handleBack = () => {
        replace("InitialForm");
    }

    return (
        <View style={styles.container}>
            <View style={styles.summaryContainer}>
                <Text>
                    De acordo com as informações fornecidas, você vai precisar ingerir...
                </Text>
                <Text>
                    {/* Aqui vai a meta de calorias do usuário */} kcal
                </Text>
                <Text>
                    Para alcançar seu objetivo de...
                    {/* Aqui vai o objetivo do usuário */}
                </Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity>
                    <Text>Vamos lá</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Voltar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryContainer: {
        height: '80%',
    },
    text: {
        marginTop: 20,
        marginBottom: 20,
    },
    goalCaloriesText: {
        fontSize: 64,
        fontWeight: 'bold',
    },
    goalTypeText: {
        color: '#FF6624',
        fontSize: 24,
    },
    buttonsContainer: {

    }
});

export default Summary;