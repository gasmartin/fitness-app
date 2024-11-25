import React, { useState } from 'react';
import { View } from 'react-native';

import ConfirmationModal from './ConfirmationModal';
import LogList from './LogList';
import LogCard from './LogCard';
import ExpandableButton from './ExpandableButton';

import api from '../axiosConfig';

const ExerciseLogList = ({ exerciseLogs }) => {
    const emptyMessage = 'Você ainda não registrou nenhuma atividade física!';

    const [isModalVisible, setModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

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

    const renderExerciseLogCard = ({ item }) => {
        return (
            <LogCard
                icon='heart-pulse'
                title={item.exercise.name}
                subtitle={`${item.durationInHours}h`}
                extraInfo={`${item.caloriesBurned} kcal`}
                onPress={() => console.log(`Edit Exercise Log ID: ${item.id}`)}
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
                onPress={() => console.log('Adicionar atividade física...')}
            />
            <ConfirmationModal
                visible={isModalVisible}
                message='Tem certeza que deseja excluir essa atividade?'
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </View>
    );
};

export default ExerciseLogList;
