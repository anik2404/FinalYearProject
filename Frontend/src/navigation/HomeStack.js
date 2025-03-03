import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecipieDescription from '../components/RecipieDescription';
import HomeScreen from '../screens/HomeScreen';
import RecipeDetailScreen from '../screens/RecipieDetailScreen';


const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeMain" component={HomeScreen} />
        <Stack.Screen name="RecipieDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
