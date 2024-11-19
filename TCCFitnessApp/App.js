import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { CurrentDateProvider } from './contexts/CurrentDateContext';
import { UserProvider } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';
import { navigationRef } from './NavigationService';

import AuthLoading from './screens/AuthLoading';
import Login from './screens/Login';
import Register from './screens/Register';
import InitialForm from './screens/InitialForm';
import Summary from './screens/Summary';
import Home from './screens/Home';
import FoodSearchResults from './screens/FoodSearchResults';
import AddFoodEntry from './screens/AddFoodEntry';
import EditFoodEntry from './screens/EditFoodEntry';
import Meals from './screens/Meals';

const Stack = createStackNavigator();

const App = () => {
  return (
    <UserProvider>
      <CurrentDateProvider>
        <AuthProvider>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
              {
                //<Stack.Screen name="AuthLoading" component={AuthLoading} /> 
              }
              <Stack.Screen name='Login' component={Login} />
              <Stack.Screen name='Register' component={Register} />
              <Stack.Screen name='Home' component={Home} />
              <Stack.Screen name='InitialForm' component={InitialForm} />
              <Stack.Screen name='Summary' component={Summary} />
              <Stack.Screen name='Meals' component={Meals} />
              <Stack.Screen name="FoodSearchResults" component={FoodSearchResults} />
              <Stack.Screen name="AddFoodEntry" component={AddFoodEntry} />
              <Stack.Screen name="EditFoodEntry" component={EditFoodEntry} />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </CurrentDateProvider>
    </UserProvider>
  );
};

export default App;