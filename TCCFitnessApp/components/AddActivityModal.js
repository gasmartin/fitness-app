import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AddActivityModal = ({ title, visible, toggleModal, children }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={toggleModal}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                onPress={toggleModal}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        { title }
                    </Text>
                    <View style={styles.modalBody}>
                        { children }
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 20,
    },
    modalBody: {
        padding: 16,
    },
});

export default AddActivityModal;