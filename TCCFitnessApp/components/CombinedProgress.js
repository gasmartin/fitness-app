import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper'; // Biblioteca para barra de progresso
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/AuthContext';

const ProgressCard = ({ icon, color, title, progress }) => {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons name={icon} size={36} color={color} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <ProgressBar progress={progress} color={color} style={styles.progressBar} />
        <Text style={styles.percentage}>{Math.round(progress * 100)}%</Text>
      </View>
    </View>
  );
};

const CombinedProgress = ({ netCalories, totalWaterIntake }) => {
  const { user } = useAuth();

  if (!user || !user.weight || !user.goalCalories) {
    return <Text>Carregando informações do usuário...</Text>;
  }

  const caloriesProgress = Math.max(0, Math.min(1, parseFloat((netCalories / user.goalCalories || 0).toFixed(2))));
  const waterProgress = Math.min(1, totalWaterIntake / (user.weight * 35));

  return (
    <View style={styles.container}>
      <ProgressCard
        icon="fire"
        color="#FF5722"
        title="Calorias"
        progress={caloriesProgress}
      />
      <ProgressCard
        icon="water"
        color="#2196F3"
        title="Água"
        progress={waterProgress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
  },
  textContainer: {
    marginTop: 10,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressBar: {
    marginVertical: 10,
    height: 8,
    borderRadius: 4,
  },
  percentage: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
});

export default CombinedProgress;
