import React, { useState } from 'react';
import { View } from 'react-native';

import ConfirmationModal from './ConfirmationModal';
import LogList from './LogList';
import LogCard from './LogCard';
import ExpandableButton from './ExpandableButton';

import api from '../axiosConfig';

const WaterIntakeList = ({ waterIntakes, onRefresh }) => {
    const emptyMessage = 'Você ainda não registrou nenhum consumo de água!';

    const [isModalVisible, setModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

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
                title={`${item.quantityInLiters} L`}
                onPress={() => console.log(`Edit Water Intake ID: ${item.id}`)}
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
                onPress={() => console.log('Adicionar consumo de água...')}
            />
            <ConfirmationModal
                visible={isModalVisible}
                message='Tem certeza que deseja excluir essa ingestão de água?'
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </View>
    );
};

export default WaterIntakeList;
