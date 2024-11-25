import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ConfirmationModal = ({
    visible,
    message,
    onConfirm,
    onCancel
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true} // Fundo parcialmente visível
            visible={visible}
            onRequestClose={onCancel} // Fecha o modal ao pressionar "voltar" no Android
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                            <Text style={styles.confirmButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escurecido
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 24,
        alignItems: 'center',
    },
    message: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#ddd',
        alignItems: 'center',
        marginRight: 10,
    },
    confirmButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#FF0000',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    confirmButtonText: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default ConfirmationModal;
