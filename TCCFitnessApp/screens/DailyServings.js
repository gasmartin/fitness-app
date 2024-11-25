import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FAB } from 'react-native-paper';
import { format, addDays } from 'date-fns';

import api from '../axiosConfig';
import { CurrentDateContext } from '../contexts/CurrentDateContext';
import DateSwitcher from '../components/DateSwitcher';
import CombinedProgress from '../components/CombinedProgress';

import FoodConsumptionList from '../components/FoodComsuptionList';
import WaterIntakeList from '../components/WaterIntakeList';
import ExerciseLogList from '../components/ExerciseLogList';

const DailyServings = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { currentDate, setCurrentDate } = useContext(CurrentDateContext);

  const [meals, setMeals] = useState([]);

  const [totalCaloriesIntake, setTotalCaloriesIntake] = useState(0);
  const [totalWaterIntake, setTotalWaterIntake] = useState(0);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [foodConsumptions, setFoodConsumptions] = useState([]);
  const [waterIntakes, setWaterIntakes] = useState([]);
  const [exerciseLogs, setExerciseLogs] = useState([]);

  const [isWaterIntakeModalVisible, setIsWaterIntakeModalVisible] = useState(false);
  const [selectedWaterIntake, setSelectedWaterIntake] = useState(null);

  const formattedDate = format(currentDate, 'yyyy-MM-dd');

  const netCalories = totalCaloriesIntake - totalCaloriesBurned;

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

  const handleVerifyAction = () => {
    console.log('Verify action triggered!');
    // Add your verification logic here
  };

  return (
    <>
      <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getDailyOverview} tintColor='#FF6624' />}>
        <DateSwitcher date={currentDate} onChangeDate={changeDate} />
        <CombinedProgress netCalories={netCalories} totalWaterIntake={totalWaterIntake} />
        <FoodConsumptionList
          currentDate={formattedDate}
          meals={meals}
          foodConsumptions={foodConsumptions}
          onRefresh={getDailyOverview}
        />
        <WaterIntakeList
          currentDate={formattedDate}
          waterIntakes={waterIntakes}
          onRefresh={getDailyOverview}
        />
        <ExerciseLogList
          currentDate={formattedDate}
          exerciseLogs={exerciseLogs}
          onRefresh={getDailyOverview}
        />
      </ScrollView>
      <FAB
        style={styles.fab}
        icon='playlist-check'
        color='#FFF'
        onPress={handleVerifyAction}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 32,
    backgroundColor: '#FF6624',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DailyServings;