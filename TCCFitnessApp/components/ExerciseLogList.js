import React, { useState } from 'react';
import { View } from 'react-native';

import ConfirmationModal from './ConfirmationModal';
import LogList from './LogList';
import LogCard from './LogCard';
import ExpandableButton from './ExpandableButton';
import ExerciseLogModal from './ExerciseLogModal';

import api from '../axiosConfig';

const ExerciseLogList = ({ currentDate, exerciseLogs, onRefresh }) => {
    const emptyMessage = 'Você ainda não registrou nenhuma atividade física!';

    const [isModalVisible, setModalVisible] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToEdit, setItemToEdit] = useState(null);

    const confirmDelete = (item) => {
        setItemToDelete(item);
        setModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        await api.delete(`/exercise-logs/${itemToDelete.id}`, { headers: { 'Content-Type': 'application/json' } });
        setItemToDelete(null);
        setModalVisible(false);
        onRefresh();
    };

    const handleCancelDelete = () => {
        setItemToDelete(null);
        setModalVisible(false);
    };

    const handleEditExerciseLog = (item) => {
        setItemToEdit(item);
        setIsEditing(true);
        setIsFormVisible(true);
    };

    const handleAddExerciseLog = () => {
        setItemToEdit(null);
        setIsEditing(false);
        setIsFormVisible(true);
    };

    const handleSubmitForm = async (exerciseId, duration) => {
        const data = { 
            exerciseId, 
            durationInHours: parseInt(duration) / 60,
            practiceDate: currentDate
        };

        try {
            if (isEditing) {
                await api.put(`/exercise-logs/${itemToEdit.id}`, data);
            } else {
                await api.post('/exercise-logs/', data);
            }
        } catch (err) {
            console.error('Error while saving exercise log:', err);
        }

        setIsFormVisible(false);
        onRefresh();
    };

    const renderExerciseLogCard = ({ item }) => {
        return (
            <LogCard
                icon='heart-pulse'
                title={item.exercise.name}
                subtitle={`${item.durationInHours.toFixed(1)}h`}
                extraInfo={`${item.caloriesBurned} kcal`}
                onPress={() => handleEditExerciseLog(item)}
                iconColor='#FF5722'
                iconBackgroundColor='#FFD8C2'
                onDelete={() => confirmDelete(item)}
            />
        );
    };

    return (
        <View style={{ marginBottom: 24 }}>
            <LogList
                title='Atividades Físicas'
                data={exerciseLogs}
                renderItem={renderExerciseLogCard}
                keyExtractor={(item) => item.id}
                emptyMessage={emptyMessage}
            />
            <ExpandableButton
                title='Adicionar atividade'
                onPress={handleAddExerciseLog}
            />
            <ConfirmationModal
                visible={isModalVisible}
                message='Tem certeza que deseja excluir essa atividade?'
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
            <ExerciseLogModal
                visible={isFormVisible}
                onClose={() => setIsFormVisible(false)}
                initialSelectedExerciseId={itemToEdit?.exercise.id || ''}
                initialDuration={itemToEdit?.duration || ''}
                onSubmit={handleSubmitForm}
                isEditing={isEditing}
            />
        </View>
    );
};

export default ExerciseLogList;
