import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FAB } from 'react-native-paper';
import { format, addDays } from 'date-fns';

import axios from 'axios';
import api from '../axiosConfig';
import { CurrentDateContext } from '../contexts/CurrentDateContext';
import Dashboard from '../components/Dashboard';
import ServingList from '../components/ServingList';


const DailyServings = ({ navigation }) => {
  const { currentDate, setCurrentDate } = useContext(CurrentDateContext);

  const [servingsByDate, setServingsByDate] = useState({});
  const [dashboardInfo, setDashboardInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const formattedDate = format(currentDate, 'yyyy-MM-dd');

  const changeDate = (days) => {
    setCurrentDate(addDays(currentDate, days));
  };

  const fetchDashboardInfo = async () => {
    try {
      const response = await api.get(`/dashboard-info?day=${formattedDate}`);
      const { consumed_calories: consumedCalories, goal_calories: goalCalories } = response.data;
      setDashboardInfo({ consumedCalories, goalCalories });
    }
    catch (error) {
      console.error(error);
    }
  };

  const fetchServings = async (useLoading = true) => {
    useLoading && setIsLoading(true);
    try {
      // Fetch servings data from an API
      const response = await api.get(`/user-foods/?day=${formattedDate}`);
      setServingsByDate({
        ...servingsByDate,
        [formattedDate]: response.data,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response.status === 404) {
          setServingsByDate({
            ...servingsByDate,
            [formattedDate]: [],
          });
        }
        else if (error.response.status === 401) {
          navigation.navigate("AuthLoading");
        }
      }
      else {
        console.error(error);
      }
    }
    useLoading && setIsLoading(false);
  }

  useEffect(() => {
    fetchDashboardInfo();
    if (!servingsByDate[formattedDate]) {
      fetchServings();
    }
  }, [currentDate]);

  useFocusEffect(
    React.useCallback(() => {
      fetchDashboardInfo();
      // FIXME: Everytime the currentDate is changed, the fetchServings is called
      fetchServings();  
    }, [currentDate])
  );

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <TouchableOpacity style={styles.changeDateArrowButton} onPress={() => changeDate(-1)}>
          <Text style={styles.changeDateArrowButtonText}>
            ←
          </Text>
        </TouchableOpacity>
        <TextInput style={styles.dateInput} value={format(currentDate, 'dd/MM')} editable={false} />
        <TouchableOpacity style={styles.changeDateArrowButton} onPress={() => changeDate(1)}>
          <Text style={styles.changeDateArrowButtonText}>
            →
          </Text>
        </TouchableOpacity>
      </View>
      <Dashboard dashboardInfo={dashboardInfo} />
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF6624" />
        </View>
      ) : <ServingList servings={servingsByDate[formattedDate]} refreshServings={fetchServings} />}
      <FAB
        style={styles.fab}
        icon="plus"
        color="#fff"
        size="medium"
        onPress={() => navigation.navigate("FoodSearchResults")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 42,
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