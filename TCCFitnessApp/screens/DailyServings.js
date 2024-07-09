import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import { FAB } from 'react-native-paper';
import { format, addDays } from 'date-fns';
import api from '../axiosConfig';
import { getMealTypeTranslation } from '../utils/mealTypes';
import { useFocusEffect } from '@react-navigation/native';

const DailyServings = ({ navigation: { navigate } }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [servingsByDate, setServingsByDate] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const formattedDate = format(currentDate, 'yyyy-MM-dd');

  const changeDate = (days) => {
    setCurrentDate(addDays(currentDate, days));
  };

  const fetchServings = async () => {
    setIsLoading(true);
    try {
      // Fetch servings data from an API
      const response = await api.get(`/users/1/servings?day=${formattedDate}`);
      setServingsByDate({
        ...servingsByDate,
        [formattedDate]: response.data,
      });
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (!servingsByDate[formattedDate]) {
      fetchServings();
    }
  }, [currentDate]);

  useFocusEffect(
    React.useCallback(() => {
      fetchServings();
    }, [])
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Button title="←" onPress={() => changeDate(-1)} />
        <TextInput style={styles.dateInput} value={format(currentDate, 'yyyy-MM-dd')} editable={false} />
        <Button title="→" onPress={() => changeDate(1)} />
      </View>
      <FlatList
        data={servingsByDate[formattedDate]}
        keyExtractor={(item) => item.mealType}
        renderItem={({ item }) => (
          <View style={styles.mealContainer}>
            <Text style={styles.mealType}>{getMealTypeTranslation(item.mealType)}</Text>
            {item.servings.map((serving, index) => (
              <View key={index} style={styles.serving}>
                <Text style={styles.servingName}>{serving.food.name}</Text>
                <Text style={styles.servingDescription}>{serving.food.description}</Text>
                <Text style={styles.servingCalories}>{serving.consumed_calories} kcal</Text>
              </View>
            ))}
          </View>
        )}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigate("FoodSearchResults")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateInput: {
    marginHorizontal: 8,
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    minWidth: 100,
  },
  mealContainer: {
    marginBottom: 16,
  },
  mealType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  serving: {
    marginBottom: 8,
  },
  servingName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  servingDescription: {
    fontSize: 14,
    color: '#555',
  },
  servingCalories: {
    fontSize: 14,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 16,
    bottom: 32,
  },
});

export default DailyServings;