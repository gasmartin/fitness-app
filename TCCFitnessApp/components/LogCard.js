import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LogCard = ({ icon, title, subtitle, extraInfo, onPress, iconColor, iconBackgroundColor, onDelete }) => {    
    const renderRightActions = () => {
        return (
            <TouchableWithoutFeedback onPress={onDelete}>
                <View style={styles.deleteButton}>
                    <MaterialCommunityIcons name="trash-can" size={24} color="#FFF" />
                </View>
            </TouchableWithoutFeedback>
        );
    };

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={styles.card}>
                    <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
                        <MaterialCommunityIcons name={icon} size={36} color={iconColor} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{title}</Text>
                        {subtitle && <Text style={styles.subtitle} numberOfLines={2} ellipsizeMode='tail'>
                            {subtitle}
                        </Text>}
                    </View>
                    {extraInfo && (
                        <View style={styles.extraInfoContainer}>
                            <Text style={styles.extraInfo}>{extraInfo}</Text>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d3d3d3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#607d8b',
    },
    extraInfoContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginLeft: 10,
    },
    extraInfo: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#FF0000', // Fundo vermelho
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        borderRadius: 8,
        marginVertical: 10,
    },
});

export default LogCard;
