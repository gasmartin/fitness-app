import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Button from './Button';

const DateSwitcher = ({ date, onChangeDate }) => {
  return (
    <View style={styles.container}>
      <Button title="←" onPress={() => onChangeDate(-1)} />
      <View style={styles.dateViewer}>
        <Text style={styles.dateText}>{ date }</Text>
      </View>
      <Button title="→" onPress={() => onChangeDate(1)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateViewer: {
    flex: 4,
    justifyContent: 'space-between',
    alignItems: 'center', 
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DateSwitcher;