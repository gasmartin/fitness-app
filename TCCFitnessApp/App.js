import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { CurrentDateProvider } from './contexts/CurrentDateContext';
import { UserProvider } from './contexts/UserContext';

import AuthLoading from './screens/AuthLoading';
import Login from './screens/Login';
import Register from './screens/Register';
import InitialForm from './screens/InitialForm';
import Summary from './screens/Summary';
import Home from './screens/Home';
import FoodSearchResults from './screens/FoodSearchResults';
import AddFoodEntry from './screens/AddFoodEntry';
import EditFoodEntry from './screens/EditFoodEntry';

const Stack = createStackNavigator();

const App = () => {
  return (
    <UserProvider>
      <CurrentDateProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="AuthLoading" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AuthLoading" component={AuthLoading} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="InitialForm" component={InitialForm} />
            <Stack.Screen name="Summary" component={Summary} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="FoodSearchResults" component={FoodSearchResults} />
            <Stack.Screen name="AddFoodEntry" component={AddFoodEntry} />
            <Stack.Screen name="EditFoodEntry" component={EditFoodEntry} />
          </Stack.Navigator>
        </NavigationContainer>
      </CurrentDateProvider>
    </UserProvider>
  );
};

export default App;