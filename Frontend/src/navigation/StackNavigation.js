import {useNavigation,DrawerActions} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import BottomTabNavigation from './BottomTabNavigation';
import RecipeDetailScreen from '../screens/RecipieDetailScreen';
import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';

const StackNavigation = () => {
    const Stack = createNativeStackNavigator();
    const navigation = useNavigation();
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen
          name="Home"
          component={BottomTabNavigation}
          options={{
            headerLeft: () => {
              return (
                <Icon
                  name="menu"
                  onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                  size={30}
                  color="#fff"
                />
              );
            },
          }}
        />
      </Stack.Navigator>
    );
};

export default StackNavigation;