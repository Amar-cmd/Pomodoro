import React, { useState, useEffect } from 'react';
import {ActivityIndicator, View} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PomodoroTimerScreen from './screens/PomodoroTimerScreen/pomodoroTimerScreen';
import PomodoroBreakScreen from './screens/PomodoroBreakScreen/pomodoroBreakScreen';
import SettingScreen from './screens/SettingScreen/SettingScreen';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import CatMockScreen from './screens/CatMockScreen/CatMockScreen';
import AnalyticsScreen from './screens/AnalyticsScreen/AnalyticsScreen';
import {useUser} from './context/UserContext';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {setUser} = useUser(); // Use the setUser function from context

  // Fetch user data from Firestore
  const fetchUserData = async userID => {
    try {
      const userRef = firestore().collection('users').doc(userID);
      const doc = await userRef.get();
      if (doc.exists) {
        return doc.data();
      } else {
        console.log('No such user!');
        return null;
      }
    } catch (error) {
      console.error("Error fetching user's data:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true); 
    // Listen for authentication state to change.
    const subscriber = auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        // Fetch and set user data if authenticated
        const userData = await fetchUserData(firebaseUser.uid);
        setUser(userData); // Set user data globally
        setIsSignedIn(true);
      } else {
        // Reset user data and sign-in status if not authenticated
        setUser(null);
        setIsSignedIn(false);
      }
      setIsLoading(false); 
    });
    return subscriber; // unsubscribe on unmount
  }, []);

   if (isLoading) {
     // Display a loading indicator while checking authentication state
     return (
       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
         <ActivityIndicator size="large" color='#00818E'/>
       </View>
     );
   }
  
  return (
    <Stack.Navigator>
      {isSignedIn ? (
        // Stack for logged in users
        <>
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
          <Stack.Screen
            name="CatMockScreen"
            component={CatMockScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AnalyticsScreen"
            component={AnalyticsScreen}
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
