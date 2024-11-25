import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Button from './Button';

const DateSwitcher = ({ date, onChangeDate }) => {
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <Button
        title="←"
        onPress={() => onChangeDate(-1)}
        style={styles.button}
        textStyle={styles.buttonText}
      />
      <View style={styles.spacer} />
      <View style={styles.dateViewer}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </View>
      <View style={styles.spacer} />
      <Button
        title="→"
        onPress={() => onChangeDate(1)}
        style={styles.button}
        textStyle={styles.buttonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5', // Fundo suave
    padding: 10,
    borderRadius: 10, // Borda arredondada
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
  },
  spacer: {
    width: 10, // Espaçamento entre os elementos
  },
  dateViewer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff', // Fundo branco para destaque
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#2196F3', // Azul vibrante para os botões
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DateSwitcher;
