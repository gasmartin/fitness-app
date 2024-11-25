import React, { useState } from 'react';
import { View } from 'react-native';

import ConfirmationModal from './ConfirmationModal';
import LogList from './LogList';
import LogCard from './LogCard';
import ExpandableButton from './ExpandableButton';

import api from '../axiosConfig';
import WaterIntakeModal from './WaterIntakeModal';

const WaterIntakeList = ({ currentDate, waterIntakes, onRefresh }) => {
    const emptyMessage = 'Você ainda não registrou nenhum consumo de água!';

    const [isModalVisible, setModalVisible] = useState(false);
    const [isWaterIntakeModalVisible, setIsWaterIntakeModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToEdit, setItemToEdit] = useState(null);

    const handleSaveWaterIntake = async (amount) => {
        const data = {
            quantityInMililiters: parseInt(amount),
            intakeDate: currentDate,
        };

        try {
            if (itemToEdit) {
                await api.put(`/water-intakes/${itemToEdit.id}`, data, { headers: { 'Content-Type': 'application/json' } });
            } else {
                await api.post('/water-intakes/', data, { headers: { 'Content-Type': 'application/json' } });
            }
        } catch (err) {
            console.error('Error while saving water intake:', err);
        }

        setItemToEdit(null);
        setIsWaterIntakeModalVisible(false);
        onRefresh();
    };

    const handleEditWaterIntake = (item) => {
        setItemToEdit(item);
        setIsWaterIntakeModalVisible(true);
    };

    const confirmDelete = (item) => {
        setItemToDelete(item);
        setModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        await api.delete(`/water-intakes/${itemToDelete.id}`, { headers: { 'Content-Type': 'application/json' } });
        setItemToDelete(null);
        setModalVisible(false);
        onRefresh();
    };

    const handleCancelDelete = () => {
        setItemToDelete(null);
        setModalVisible(false);
    };

    const renderWaterCard = ({ item }) => {
        return (
            <LogCard
                icon='water'
                title={`${item.quantityInMililiters} ml`}
                onPress={() => handleEditWaterIntake(item)}
                iconColor='#1565C0'
                iconBackgroundColor='#E3F2FD'
                onDelete={() => confirmDelete(item)}
            />
        );
    };

    return (
        <View style={{ marginBottom: 24 }}>
            <LogList
                title='Ingestão de Água'
                data={waterIntakes}
                renderItem={renderWaterCard}
                keyExtractor={(item) => item.id}
                emptyMessage={emptyMessage}
            />
            <ExpandableButton
                title='Adicionar água'
                onPress={() => setIsWaterIntakeModalVisible(true)}
            />
            <ConfirmationModal
                visible={isModalVisible}
                message='Tem certeza que deseja excluir essa ingestão de água?'
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
            <WaterIntakeModal 
                visible={isWaterIntakeModalVisible}
                onClose={() => {
                    setIsWaterIntakeModalVisible(false);
                    setItemToEdit(null);
                }}
                onSave={handleSaveWaterIntake}
                initialValue={itemToEdit?.quantityInMililiters || ''}
                isEditing={!!itemToEdit}
            />
        </View>
    );
};

export default WaterIntakeList;
