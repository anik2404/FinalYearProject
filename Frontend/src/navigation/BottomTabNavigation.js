import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AIChatbot from '../screens/AIChatbot';
import AddRecipies from '../screens/AddRecipies';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import 'react-native-gesture-handler';
import UserStack from './UserStack';
import HomeStack from './HomeStack';

const BottomTabNavigation = () => {
    const Tab=createBottomTabNavigator();
    return(
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel:false,
          headerShown:false,
          tabBarStyle:{
            position:"absolute",
            bottom:0,
            right:0,
            left:0,
            elevation:0,
            height:hp(7),
            backgroundColor:'white'
          }
        }}
      >
        <Tab.Screen
          name="TabBarHome"
          component={HomeStack}
          options={{
            tabBarIcon: ({focused})=>{
              return(
                <Icon name='home' size={hp(3)} color={focused?'orange':'black'}/>
              )
            }
          }}
        />
        <Tab.Screen
          name="AIChatbot"
          component={AIChatbot}
          options={{
            tabBarIcon: ({focused})=>{
              return(
                <Icon1 name='wechat' size={hp(3)} color={focused?'orange':'black'}/>
              )
            }
          }}
        />
        <Tab.Screen
          name="AddRecipies"
          component={AddRecipies}
          options={{
            tabBarIcon: ({focused})=>{
              return(
                <Icon2 name='upload' size={hp(3)} color={focused?'orange':'black'}/>
              )
            }
          }}
        />
        <Tab.Screen
          name="User"
          component={UserStack}
          options={{
            tabBarIcon: ({focused})=>{
              return(
                <Icon1 name='user' size={hp(3.5)}  color={focused?'orange':'black'}/>
              )
            }
          }}
        />
      </Tab.Navigator>
    )
};

export default BottomTabNavigation;