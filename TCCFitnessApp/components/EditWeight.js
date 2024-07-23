import React, { useRef, useState } from 'react';
import { Button, Modal, Text, StyleSheet, View, TextInput } from 'react-native';

import api from '../axiosConfig';
import { getToken } from '../helpers/token';

export default EditWeight = ({ visible, onRequestClose, handleDismiss }) => {
    const [weight, setWeight] = useState();
    const weightRef = useRef(null);

    const handleSave = () => {
        let weight = weightRef.current.value;

        if (weight === "") {
            alert("Weight is required");
            return;
        }

        try {
            const weight = parseFloat(weightRef.current.value);
        }
        catch (error) {
            alert("Invalid weight");
        }
        

    };

    return (
        <Modal
            visible={visible} 
            onRequestClose={onRequestClose} 
            animationType="slide"
            transparent={true}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                        Edit Weight
                    </Text>
                    <TextInput
                        ref={weightRef}
                        onChangeText={(e) => weightRef.current.value = e}
                        placeholder="Weight"
                        keyboardType="numeric"
                        style={styles.textInput}
                    />
                    <Button title="Cancel" onPress={handleDismiss} />
                    <Button title="Salvar" onPress={handleSave} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
      },
      textInput: {
        width: 120,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
      }
});