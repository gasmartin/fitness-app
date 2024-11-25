import React, { useState } from 'react';
import { View } from 'react-native';

import ConfirmationModal from './ConfirmationModal';
import LogList from './LogList';
import LogCard from './LogCard';
import ExpandableButton from './ExpandableButton';

import api from '../axiosConfig';

const FoodConsumptionList = ({ meals, foodConsumptions, onRefresh }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const foodConsumptionsByMeal = meals.map((meal) => ({
        meal,
        consumptions: foodConsumptions.filter((fc) => fc.meal.id === meal.id)
    }));

    const confirmDelete = (item) => {
        setItemToDelete(item);
        setModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        await api.delete(`/food-consumptions/${itemToDelete.id}`, { headers: { 'Content-Type': 'application/json' } });
        setItemToDelete(null);
        setModalVisible(false);
        onRefresh();
    };

    const handleCancelDelete = () => {
        setItemToDelete(null);
        setModalVisible(false);
    };

    const renderFoodConsumptionCard = ({ item }) => {
        const startsWithName = item.food.description.startsWith(`${item.food.name}, `);

        const descriptionWithoutName = startsWithName
            ? item.food.description.slice(item.food.name.length + 2)
            : item.food.description;

        return (
            <LogCard
                icon='food'
                title={item.food.name}
                subtitle={descriptionWithoutName}
                extraInfo={`${item.calories} kcal`}
                onPress={() => console.log(`Edit Food Consumption ID: ${item.id}`)}
                iconColor='#FF6624'
                iconBackgroundColor='#FFE6D5'
                onDelete={() => confirmDelete(item)}
            />
        );
    };

    return (
        <>
            {foodConsumptionsByMeal.map(({ meal, consumptions }) => (
                <View key={meal.id} style={{ marginBottom: 24 }}>
                    <LogList
                        title={meal.name}
                        data={consumptions}
                        renderItem={renderFoodConsumptionCard}
                        keyExtractor={(item) => item.id}
                        emptyMessage={`Você ainda não registrou nenhum consumo de alimentos no ${meal.name}...`}
                    />
                    <ExpandableButton
                        title='Adicionar comida'
                        onPress={() => console.log(`Adicionar comida em ${meal.name}...`)}
                    />
                </View>
            ))}
            <ConfirmationModal
                visible={isModalVisible}
                message='Tem certeza que deseja excluir esse consumo de alimento?'
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </>
    );
};

export default FoodConsumptionList;
