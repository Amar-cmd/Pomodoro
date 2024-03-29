import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {PomodoroProvider} from './src/context/PomodoroContext';
import {UserProvider} from './src/context/UserContext';
import AppNavigator from './src/AppNavigator'; // Adjust the path as necessary

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <UserProvider>
      <PomodoroProvider>
        <NavigationContainer>
          <SafeAreaView style={{flex: 1}}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={backgroundStyle.backgroundColor}
            />
            <AppNavigator />
          </SafeAreaView>
        </NavigationContainer>
      </PomodoroProvider>
    </UserProvider>
  );
}

export default App;
