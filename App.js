import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './components/Home';
import ProjectDetails from './components/ProjectDetails';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown:false}}
          name="Home"
          component={Home}
        />
        <Stack.Screen name="Project Details" component={ProjectDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;