import React, { useEffect, useState } from 'react';
import { Keyboard, Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import api from '../axiosConfig';
import Button from './Button';
import { useAuth } from '../contexts/AuthContext';

const ExerciseLogModal = ({ visible, onClose, initialSelectedExerciseId, initialDuration, onSubmit, isEditing }) => {
    const { isAuthenticated } = useAuth();
    
    const [exercises, setExercises] = useState([]);
    const [isExerciseDropdownOpen, setIsExerciseDropdownOpen] = useState(false);

    const [selectedExercise, setSelectedExercise] = useState('');
    const [duration, setDuration] = useState(String(initialDuration || ''));

    useEffect(() => {
        if (!isAuthenticated) return;

        (async () => {
            try {
                const response = await api.get('/exercises/');
                setExercises(response.data);
            }
            catch (err) {
                console.error('Error while trying to get exercises:', err);
            }
        })();
    }, [isAuthenticated]);

    useEffect(() => {
        if (exercises.length > 0) {
            setSelectedExercise(initialSelectedExerciseId ? exercises.find((e) => e.id === initialSelectedExerciseId) : exercises[0]);
        }
    }, [exercises, initialSelectedExerciseId]);

    const exerciseDropdownItems = (
        exercises.length > 0 ? 
        exercises.map((e) => ({label: e.name, value: e})) 
        : []
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.title}>
                            {isEditing ? 'Editar Atividade Física' : 'Registrar Atividade Física'}
                        </Text>
                        <Text>Exercício:</Text>
                        <DropDownPicker 
                            open={isExerciseDropdownOpen}
                            setOpen={setIsExerciseDropdownOpen}
                            items={exerciseDropdownItems}
                            value={selectedExercise}
                            setValue={setSelectedExercise}
                        />
                        <Text>Duração em minutos:</Text>
                        <TextInput 
                            style={styles.input}
                            value={duration}
                            onChangeText={(e) => setDuration(e)}
                            keyboardType="numeric"
                        />
                        <Button 
                            title={isEditing ? "Salvar Alterações" : "Adicionar"}
                            onPress={() => onSubmit(selectedExercise.id, duration)}
                        />
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </Pressable>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        borderRadius: 4,
        width: '100%',
    },
    closeButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ExerciseLogModal;
