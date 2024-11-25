import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ExpandableButton = ({
    title,
    onPress,
    backgroundColor = '#FF6624',
    textColor = '#FFF',
    iconColor = '#FFF',
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.content}>
                <MaterialCommunityIcons 
                    name='plus' 
                    size={20} 
                    color={iconColor} 
                    style={styles.icon} 
                />
                <Text style={[styles.buttonText, { color: textColor }]}>
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '80%', // Expande o botão para 100% do espaço disponível
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        alignSelf: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ExpandableButton;