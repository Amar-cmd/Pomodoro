import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PomodoroTimerScreen from './screens/PomodoroTimerScreen/pomodoroTimerScreen';
import PomodoroBreakScreen from './screens/PomodoroBreakScreen/pomodoroBreakScreen';
import SettingScreen from './screens/SettingScreen/SettingScreen';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import auth from '@react-native-firebase/auth';
import CatMockScreen from './screens/CatMockScreen/CatMockScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Listen for authentication state to change.
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle the user state change
  function onAuthStateChanged(user) {
    setIsSignedIn(!!user); // true if user is logged in, false otherwise
  }

  return (
    <Stack.Navigator>
      {isSignedIn ? (
        // Stack for logged in users
        <>
          <Stack.Screen
            name="CatMockScreen"
            component={CatMockScreen}
            options={{headerShown: false}}
          />
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

          {/* Add more screens for logged in user here */}
        </>
      ) : (
        // Stack for logged out users
        <>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
          {/* Add more screens for logged out user here */}
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
