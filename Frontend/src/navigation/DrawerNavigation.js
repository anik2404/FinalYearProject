import { createDrawerNavigator } from '@react-navigation/drawer';

const DrawerNavigation = () => {
    const Drawer = createDrawerNavigator();
    return (
      <Drawer.Navigator
        drawerContent={props => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Drawer.Screen name="Homepage" component={StackNav} />
        <Drawer.Screen name="Chatbot" component={AIChatbot} />
        <Drawer.Screen name="AddRecipie" component={AddRecipies} />
      </Drawer.Navigator>
    );
};
export default DrawerNavigation;