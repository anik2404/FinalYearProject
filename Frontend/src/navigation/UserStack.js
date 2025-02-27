import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import User from '../screens/User';
import UserDetails from '../screens/UserDetails';
import Signup from '../screens/Signup';
import ForgotPass from '../screens/ForgotPass';
import ResetPass from '../screens/ResetPass';


const Stack = createNativeStackNavigator();

const UserStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserMain" component={User} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={ForgotPass} />
      <Stack.Screen name="ResetPassword" component={ResetPass} />
    </Stack.Navigator>
  );
};

export default UserStack;
