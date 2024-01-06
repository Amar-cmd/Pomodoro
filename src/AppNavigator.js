// AppNavigator.js
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PomodoroTimerScreen from './screens/PomodoroTimerScreen/pomodoroTimerScreen';
import PomodoroBreakScreen from './screens/PomodoroBreakScreen/pomodoroBreakScreen';
import SettingScreen from './screens/SettingScreen/SettingScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SettingScreen">
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
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
