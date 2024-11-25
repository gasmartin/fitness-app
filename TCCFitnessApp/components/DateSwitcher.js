import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Button from './Button';

const DateSwitcher = ({ date, onChangeDate }) => {
  // Formata a data para o formato dd/mm/yyyy
  const formatDate = (date) => {
    const formattedDate = new Date(date);
    const day = String(formattedDate.getDate()).padStart(2, '0');
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const year = formattedDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      {/* Botão para a data anterior */}
      <Button
        title="←"
        onPress={() => onChangeDate(-1)}
        style={styles.button}
        textStyle={styles.buttonText}
      />
      
      {/* Espaço entre o botão esquerdo e a data */}
      <View style={styles.spacer} />

      {/* Visualizador da data */}
      <View style={styles.dateViewer}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </View>

      {/* Espaço entre a data e o botão direito */}
      <View style={styles.spacer} />

      {/* Botão para a próxima data */}
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
