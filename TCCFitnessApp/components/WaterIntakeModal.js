import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

const WaterIntakeModal = ({ visible, onClose, onSave, initialValue, isEditing }) => {
  const [waterAmount, setWaterAmount] = useState(initialValue);

  React.useEffect(() => {
    setWaterAmount(initialValue);
  }, [initialValue]);

  const handleQuickAdd = (amount) => {
    setWaterAmount(String(amount));
    onSave(amount);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            {isEditing ? 'Editar Ingestão de Água' : 'Registrar Ingestão de Água'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Quantidade (ml)"
            keyboardType="numeric"
            value={waterAmount}
            onChangeText={setWaterAmount}
          />
          <View style={styles.quickButtons}>
            {[250, 500, 750].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickButton}
                onPress={() => handleQuickAdd(amount)}
              >
                <Text style={styles.quickButtonText}>{amount} ml</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button title="Salvar" onPress={() => onSave(Number(waterAmount))} />
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Escurece o fundo
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white', // Fundo branco do modal
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 5, // Para sombra no Android
    shadowColor: '#000', // Para sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginBottom: 20,
  },
  quickButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  quickButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  quickButtonText: { color: 'white', fontWeight: 'bold' },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  closeButtonText: { color: 'white', fontWeight: 'bold' },
});

export default WaterIntakeModal;
