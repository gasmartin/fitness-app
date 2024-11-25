import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FAB } from 'react-native-paper';
import { format, addDays } from 'date-fns';

import api from '../axiosConfig';
import { CurrentDateContext } from '../contexts/CurrentDateContext';
import { useAuth } from '../contexts/AuthContext';
import DateSwitcher from '../components/DateSwitcher';
import CombinedProgress from '../components/CombinedProgress';
import AddActivityModal from '../components/AddActivityModal';
import WaterIntakeForm from '../components/WaterIntakeForm';
import ExerciseLogForm from '../components/ExerciseLogForm';
import WaterIntakeLogView from '../components/WaterIntakeLogView';

import FoodConsumptionList from '../components/FoodComsuptionList';
import WaterIntakeList from '../components/WaterIntakeList';
import ExerciseLogList from '../components/ExerciseLogList';

const DailyServings = ({ navigation, route }) => {
  const { currentDate, setCurrentDate } = useContext(CurrentDateContext);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const { user } = useAuth();

  const [meals, setMeals] = useState([]);

  const [totalCaloriesIntake, setTotalCaloriesIntake] = useState(0);
  const [totalWaterIntake, setTotalWaterIntake] = useState(0);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [foodConsumptions, setFoodConsumptions] = useState([]);
  const [waterIntakes, setWaterIntakes] = useState([]);
  const [exerciseLogs, setExerciseLogs] = useState([]);

  const [servingsByDate, setServingsByDate] = useState({});
  const [dashboardInfo, setDashboardInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [isWaterIntakeModalVisible, setIsWaterIntakeModalVisible] = useState(false);
  const [selectedWaterIntake, setSelectedWaterIntake] = useState(null);

  const [isExerciseLogModalVisible, setIsExerciseLogModalVisible] = useState(false);
  const [selectedExerciseLog, setSelectedExerciseLog] = useState(null);

  const formattedDate = format(currentDate, 'yyyy-MM-dd');

  const netCalories = totalCaloriesIntake - totalCaloriesBurned;
  
  const handleOpenWaterIntakeModal = (waterIntake = null) => {
    setSelectedWaterIntake(waterIntake);
    setIsWaterIntakeModalVisible(true);
  };

  const handleCloseWaterIntakeModal = () => {
    setIsWaterIntakeModalVisible(false);
    setSelectedWaterIntake(null);
  };

  const handleSaveWaterIntake = async (quantity) => {
    const data = {
      quantityInLiters: quantity / 100,
      intakeDate: formattedDate
    };

    const headers = {
      'Content-Type': 'application/json'
    };

    try {
      if (selectedWaterIntake) {
        await api.put(`/water-intakes/${selectedWaterIntake.id}`, data, { headers });
      }
      else {
        await api.post('/water-intakes/', data, { headers })
      }
    }
    catch (err) {
      console.error(`Error while trying to ${selectedWaterIntake ? 'update' : 'create'} water intake:`, err);
    }

    handleCloseWaterIntakeModal();
    getDailyOverview();
  };

  const handleOpenExerciseLogModal = (exerciseLog = null) => {
    setSelectedExerciseLog(exerciseLog);
    setIsExerciseLogModalVisible(true);
  };

  const handleCloseExerciseLogModal = () => {
    setIsExerciseLogModalVisible(false);
    setSelectedExerciseLog(null);
  };

  const handleSaveExerciseLogModal = async (exerciseId, durationInMinutes) => {
    const data = {
      exerciseId,
      durationInHours: parseFloat(durationInMinutes) / 60,
      practiceDate: formattedDate
    };

    console.log(data);

    const headers = {
      'Content-Type': 'application/json'
    };

    try {
      if (selectedExerciseLog) {
        await api.put(`/exercise-logs/${selectedExerciseLog.id}`, data, { headers });
      }
      else {
        await api.post('/exercise-logs/', data, { headers });
      }
    }
    catch (err) {
      console.error(`Error while trying to ${selectedExerciseLog ? 'update' : 'create'} exercise log:`, err);
    }

    handleCloseExerciseLogModal();
    getDailyOverview();
  };

  const getMeals = async () => {
    try {
      const response = await api.get('/users/me/meals', { headers: { 'Content-Type': 'application/json' } })
      setMeals(response.data);
    }
    catch (err) {
      console.error('Error while trying to get meals:', err);
    }
  };

  const getDailyOverview = async () => {
    try {
      const response = await api.get(`/users/me/daily-overview?date=${formattedDate}`);

      setTotalCaloriesIntake(response.data.totalCaloriesIntake);
      setTotalWaterIntake(response.data.totalWaterIntake);
      setTotalCaloriesBurned(response.data.totalCaloriesBurned);
      setFoodConsumptions(response.data.foodConsumptions);
      setExerciseLogs(response.data.exerciseLogs);
      setWaterIntakes(response.data.waterIntakes);
    }
    catch (err) {
      console.error('Error while trying to get daily overview:', err);
    }
  };

  useEffect(() => {
    getMeals();
    getDailyOverview();
  }, []);

  useEffect(() => {
    getDailyOverview();
  }, [currentDate]);

  useEffect(() => {
    if (selectedWaterIntake) {
      setIsWaterIntakeModalVisible(true);
    } else if (!isWaterIntakeModalVisible) {
      setSelectedWaterIntake(null);
    }
  }, [selectedWaterIntake, isWaterIntakeModalVisible]);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.shouldRefresh) {
        getDailyOverview();
        route.params.shouldRefresh = false;
      }
    }, [route.params?.shouldRefresh])
  );

  const changeDate = (days) => {
    setCurrentDate(addDays(currentDate, days));
  };

  return (
    <ScrollView style={styles.container}>
      <DateSwitcher date={formattedDate} onChangeDate={changeDate} />
      <CombinedProgress netCalories={netCalories} totalWaterIntake={totalWaterIntake} />
      <FoodConsumptionList
        meals={meals}
        foodConsumptions={foodConsumptions}
        onRefresh={getDailyOverview}
      />
      <WaterIntakeList
        waterIntakes={waterIntakes}
        onRefresh={getDailyOverview}
      />
      <ExerciseLogList
        exerciseLogs={exerciseLogs}
        onRefresh={getDailyOverview}
      />
      {/*
      {foodConsumptionsByMeal.map(([meal, fc_list], index) => (
        <View key={index}>
          <Text>{meal.name}</Text>
          {fc_list.map((fc) => (
            <TouchableOpacity key={fc.id} onPress={() => navigation.navigate("EditFoodEntry", { selectedMeal: meal, meals, foodConsumption: fc })}>
              <View>
                <Text>{fc.food.name}</Text>
                <Text>{fc.quantity} x {fc.servingSize.name}</Text>
              </View>
              <View>
                <Text>{fc.calories} kcal</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => navigation.navigate("FoodSearchResults", { currentDate: formattedDate, selectedMeal: meal, meals })}>
            <Text>Adicionar comida</Text>
          </TouchableOpacity>
        </View>
      ))}
      <View>
        <WaterIntakeLogView waterIntakes={waterIntakes} />
        <Text>Ingestão de Água</Text>
        {waterIntakes.map((wi) => (
          <TouchableOpacity key={wi.id} onPress={() => handleOpenWaterIntakeModal(wi)}>
            <Text>
              {wi.quantityInLiters * 100} ml
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => handleOpenWaterIntakeModal()}>
          <Text>Adicionar Ingestão de Água</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text>Exercícios e Atividades Físicas</Text>
        {exerciseLogs.map((el) => (
          <TouchableOpacity key={el.id} onPress={() => handleOpenExerciseLogModal(el)}>
            <Text>{el.exercise.name}</Text>
            <Text>{el.durationInHours * 60} min</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => handleOpenExerciseLogModal()}>
          <Text>Adicionar Exercício</Text>
        </TouchableOpacity>
      </View>
      <AddActivityModal
        title="Ingestão de Água"
        visible={isWaterIntakeModalVisible} 
        toggleModal={handleCloseWaterIntakeModal}
      >
        <WaterIntakeForm
          initialQuantity={selectedWaterIntake?.quantityInLiters * 100 || ''}
          onSubmit={handleSaveWaterIntake}
        />
      </AddActivityModal>
      <AddActivityModal
        title="Log de Exercício"
        visible={isExerciseLogModalVisible}
        toggleModal={handleCloseExerciseLogModal}
      >
        <ExerciseLogForm 
          initialSelectedExerciseId={selectedExerciseLog?.exerciseId || ''}
          initialDuration={selectedExerciseLog?.durationInHours * 60 || ''}
          onSubmit={handleSaveExerciseLogModal} 
        />
      </AddActivityModal>
      */}
      {/*
      <FAB
        style={styles.fab}
        icon="plus"
        color="#fff"
        size="medium"
        onPress={() => navigation.navigate("FoodSearchResults")}
      />
      <WaterIntakeModal 
        currentDate={formattedDate}
        visible={isWaterIntakeModalVisible} 
        toggleModal={() => setIsWaterIntakeModalVisible(!isWaterIntakeModalVisible)} 
      />
      */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  dateContainer: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 32,
  },
  dateInput: {
    flex: 8,
    padding: 8,
    borderColor: '#ccc',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    height: 48,
    marginHorizontal: 16,
    fontWeight: 'bold',
  },
  changeDateArrowButton: {
    flex: 1,
    backgroundColor: '#FF6624',
    borderRadius: 8,
    width: 48,
    height: 48,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeDateArrowButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 16,
    bottom: 32,
    backgroundColor: '#FF6624',
    borderRadius: 32,
  },
});

export default DailyServings;