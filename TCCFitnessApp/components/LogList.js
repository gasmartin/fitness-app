import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const LogList = ({ 
    title, 
    data, 
    renderItem, 
    keyExtractor, 
    emptyMessage = 'Sem itens',
}) => {
    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}
            {data && data.length > 0 ? (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={styles.listContent}
                    scrollEnabled={false}
                />
            ) : (
                <Text style={styles.emptyMessage}>{emptyMessage}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    listContent: {
        paddingBottom: 8,
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: '#AAA',
        marginTop: 20,
    },
});

export default LogList;
