import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import api from '../axiosConfig';
import Button from './Button';

const ExerciseLogForm = ({ initialSelectedExerciseId, initialDuration, onSubmit }) => {
    const [exercises, setExercises] = useState([]);
    const [isExerciseDropdownOpen, setIsExerciseDropdownOpen] = useState(false);

    const [selectedExercise, setSelectedExercise] = useState('');
    const [duration, setDuration] = useState(String(initialDuration));

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get('/exercises/');
                setExercises(response.data);
            }
            catch (err) {
                console.error('Error while trying to get exercises:', err);
            }
        })();
    }, []);

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
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
                    value={duration}
                    onChangeText={(e) => setDuration(e)}
                />
                <Button title="Adicionar" onPress={() => onSubmit(selectedExercise.id, duration)} />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#fff',
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
    },
    picker: {
      height: 50,
      marginBottom: 16,
      borderColor: '#ccc',
      borderWidth: 1,
    },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 16,
      paddingHorizontal: 8,
      borderRadius: 4,
    },
  });

export default ExerciseLogForm;