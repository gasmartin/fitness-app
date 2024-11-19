import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';

const { height: windowHeight } = Dimensions.get('window');

const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color="#FF6624"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: windowHeight,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;