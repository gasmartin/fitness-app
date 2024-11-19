import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

const WaterIntakeForm = ({ initialQuantity, onSubmit }) => {
  const [quantity, setQuantity] = useState(String(initialQuantity));

  const handleAddQuantity = (delta) => {
    const newQuantity = parseInt(quantity || 0, 10) + delta;
    setQuantity(newQuantity > 0 ? String(newQuantity) : '0');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Button title="-100 ml" onPress={() => handleAddQuantity(-100)} />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Enter quantity in ml"
          />
          <Button title="+100 ml" onPress={() => handleAddQuantity(100)} />
        </View>
        <Button
          title={initialQuantity ? 'Edit' : 'Add'}
          onPress={() => onSubmit(Number(quantity))}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 10,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 100,
    textAlign: 'center',
  },
});

export default WaterIntakeForm;