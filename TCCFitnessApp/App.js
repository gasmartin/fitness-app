import * as React from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CurrentDateProvider } from './contexts/CurrentDateContext';
import { AuthProvider } from './contexts/AuthContext';
import { navigationRef } from './NavigationService';

import Login from './screens/Login';
import Register from './screens/Register';
import InitialForm from './screens/InitialForm';
import Search from './screens/Search';
import Summary from './screens/Summary';
import Home from './screens/Home';
import FoodSearchResults from './screens/FoodSearchResults';
import AddFoodEntry from './screens/AddFoodEntry';
import EditFoodEntry from './screens/EditFoodEntry';
import Meals from './screens/Meals';

enableScreens();

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
        <CurrentDateProvider>
          <AuthProvider>
            <StatusBar barStyle='dark-content' backgroundColor='#FFFFFF' translucent={true} />
            <SafeAreaView style={styles.safeArea}>
              <NavigationContainer ref={navigationRef}>
                <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
                  <Stack.Screen name='Login' component={Login} />
                  <Stack.Screen name='Register' component={Register} />
                  <Stack.Screen name='Home' component={Home} />
                  <Stack.Screen name='InitialForm' component={InitialForm} />
                  <Stack.Screen name='Summary' component={Summary} />
                  <Stack.Screen name='Meals' component={Meals} />
                  <Stack.Screen name="FoodSearchResults" component={FoodSearchResults} />
                  <Stack.Screen name='Search' component={Search} />
                  <Stack.Screen name="AddFoodEntry" component={AddFoodEntry} />
                  <Stack.Screen name="EditFoodEntry" component={EditFoodEntry} />
                </Stack.Navigator>
              </NavigationContainer>
            </SafeAreaView>
          </AuthProvider>
        </CurrentDateProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fundo branco para o restante do app
  },
});

export default App;