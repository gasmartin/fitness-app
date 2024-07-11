import React from 'react';
import { StyleSheet, View } from 'react-native';

const ServingForm = ({ serving, handleSubmit }) => {
    const [ quantity, setQuantity ] = useState(serving.quantity || "1");
    const [ portionId, setPortionId ] = useState(serving.portion || null);

    return (
        <View>

        </View>
    );
};

export default ServingForm;