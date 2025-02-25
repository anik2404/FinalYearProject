import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import User from '../screens/User';
import UserDetails from '../screens/UserDetails';

const Stack = createNativeStackNavigator();

const UserStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserMain" component={User} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
    </Stack.Navigator>
  );
};

export default UserStack;
