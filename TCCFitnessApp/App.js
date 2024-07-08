import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DailyServings from './screens/DailyServings';
import FoodSearchResults from './screens/FoodSearchResults';
import AddFoodEntry from './screens/AddFoodEntry';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DailyServings">
        <Stack.Screen name="DailyServings" component={DailyServings} />
        <Stack.Screen name="FoodSearchResults" component={FoodSearchResults} />      
        <Stack.Screen name="AddFoodEntry" component={AddFoodEntry} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;