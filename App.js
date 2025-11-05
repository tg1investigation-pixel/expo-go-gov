import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './services/AuthContext';


import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import PeopleSearchScreen from './screens/PeopleSearchScreen';
import VehicleSearchScreen from './screens/VehicleSearchScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import DetailScreen from './screens/DetailScreen';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2d3561" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Investigation Unit Search' }}
            />
            <Stack.Screen 
              name="PeopleSearch" 
              component={PeopleSearchScreen}
              options={{ title: 'People Search' }}
            />
            <Stack.Screen 
              name="VehicleSearch" 
              component={VehicleSearchScreen}
              options={{ title: 'Vehicle Search' }}
            />
            <Stack.Screen 
              name="SearchResults" 
              component={SearchResultsScreen}
              options={{ title: 'Search Results' }}
            />
            <Stack.Screen 
              name="Detail" 
              component={DetailScreen}
              options={{ title: 'Record Details' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
});
