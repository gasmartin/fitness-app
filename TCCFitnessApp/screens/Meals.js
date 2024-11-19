import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';

import api from '../axiosConfig';

const Meals = () => {
  const [meals, setMeals] = useState([]); // Estado para armazenar as refeições
  const [mealName, setMealName] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [editingMeal, setEditingMeal] = useState(null);

  const nameInputRef = useRef(null);
  const defaultTimeInputRef = useRef(null);

  const getMeals = async () => {
    try {
        const response = await api.get("/users/me/meals", { headers: { 'Content-Type': 'application/json' } });
        setMeals(response.data);
    }
    catch (err) {
        console.error("Error while trying to fetch meals from user:", err);
    }
  };

  const addMeal = async () => {
    const name = nameInputRef.current.value;
    const defaultTime = defaultTimeInputRef.current.value;

    console.log(name, defaultTime);

    if (!name || !defaultTime) {
        Alert.alert("Você precisa preencher o formulário todo antes de enviar.");
        return;
    }

    const timeRegex = /^\d{1,2}:\d{2}$/;

    if (!timeRegex.test(defaultTime)) {
        Alert.alert("O campo Horário da Refeição não está correto.");
        return;
    }

    try {
        await api.post("/meals/", { name, defaultTime }, { headers: { 'Content-Type': 'application/json' } });
        getMeals();
        nameInputRef.current.clear()
        defaultTimeInputRef.current.clear();
    }
    catch (err) {
        console.error("Error while trying to create meal:", err);
    }
  };

  useEffect(() => {
    getMeals();
  }, []);

  // Atualiza uma refeição existente
  const updateMeal = () => {
    if (mealName && mealTime && editingMeal) {
      setMeals(meals.map((meal) =>
        meal.id === editingMeal.id ? { ...meal, name: mealName, time: mealTime } : meal
      ));
      setMealName('');
      setMealTime('');
      setEditingMeal(null);
    } else {
      Alert.alert('Erro', 'Por favor, selecione uma refeição para atualizar.');
    }
  };

  // Exclui uma refeição
  const deleteMeal = async (id) => {
    try {
        await api.delete(`/meals/${id}`);
        getMeals();
    }
    catch (err) {
        console.error("Error while trying to delete meal:", err);
    }
  };

  const confirmDeleteMeal = (id) => {
    Alert.alert(
        "Confirmar Exclusão",
        "Tem certeza que deseja excluir esta refeição?",
        [
            {
                text: 'Cancelar',
                onPress: () => console.log('Exclusão cancelada'),
                style: 'cancel',
            },
            {
                text: 'Excluir',
                onPress: () => deleteMeal(id),
                style: 'destructive',
            },
        ],
        { cancelable: true }
    );
  };

  // Seleciona uma refeição para edição
  const selectMeal = (meal) => {
    setMealName(meal.name);
    setMealTime(meal.time);
    setEditingMeal(meal);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Refeições</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da Refeição"
        ref={nameInputRef}
        onChangeText={(e) => nameInputRef.current.value = e}
      />
      <TextInput
        style={styles.input}
        placeholder="Horário da Refeição (HH:MM)"
        ref={defaultTimeInputRef}
        onChangeText={(e) => defaultTimeInputRef.current.value = e}
      />

      <View style={styles.buttonContainer}>
        <Button title={editingMeal ? "Atualizar Refeição" : "Adicionar Refeição"} onPress={editingMeal ? updateMeal : addMeal} />
      </View>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <TouchableOpacity onPress={() => selectMeal(item)}>
              <Text style={styles.mealText}>{item.name} - {item.defaultTime}</Text>
            </TouchableOpacity>
            <Button title="Deletar" color="red" onPress={() => confirmDeleteMeal(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mealText: {
    fontSize: 18,
  },
});

export default Meals;