// AppNavigator.js
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PomodoroTimerScreen from './screens/PomodoroTimerScreen/pomodoroTimerScreen';
import PomodoroBreakScreen from './screens/PomodoroBreakScreen/pomodoroBreakScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="PomodoroTimer">
      <Stack.Screen
        name="PomodoroTimer"
        component={PomodoroTimerScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PomodoroBreak"
        component={PomodoroBreakScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
