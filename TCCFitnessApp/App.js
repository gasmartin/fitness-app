import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { CurrentDateProvider } from './contexts/CurrentDateContext';

import AuthLoading from './screens/AuthLoading';
import Login from './screens/Login';
import Register from './screens/Register';
import InitialForm from './screens/InitialForm';
import Summary from './screens/Summary';
import DailyServings from './screens/DailyServings';
import FoodSearchResults from './screens/FoodSearchResults';
import AddFoodEntry from './screens/AddFoodEntry';

const Stack = createStackNavigator();

const App = () => {
  return (
    <CurrentDateProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="AuthLoading" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AuthLoading" component={AuthLoading} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="InitialForm" component={InitialForm} />
          <Stack.Screen name="Summary" component={Summary} />
          <Stack.Screen name="DailyServings" component={DailyServings} />
          <Stack.Screen name="FoodSearchResults" component={FoodSearchResults} />
          <Stack.Screen name="AddFoodEntry" component={AddFoodEntry} />
        </Stack.Navigator>
      </NavigationContainer>
    </CurrentDateProvider>
  );
};

export default App;