import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StatusBar, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {usePomodoro} from '../../context/PomodoroContext'; // Adjust the import path as necessary
import Toast from 'react-native-simple-toast'; // Make sure to install this package
import firestore from '@react-native-firebase/firestore';
import {useUser} from '../../context/UserContext';

import styles from './style';

const PomodoroBreakScreen = ({navigation}) => {
  const { settings } = usePomodoro();
  const {user} = useUser()
  const shortBreakTimer = settings.shortBreakTimer || {
    minutes: '5',
    seconds: '0',
  }; // Fallback to default if not found
  const isAutomaticBreakOn = settings.isAutomaticBreakOn || false;

  const [minutes, setMinutes] = useState(parseInt(shortBreakTimer.minutes));
  const [seconds, setSeconds] = useState(parseInt(shortBreakTimer.seconds));
  const [isActive, setIsActive] = useState(false);
  const [timerEnded, setTimerEnded] = useState(false);

  // Using a ref to track the interval ID
  const intervalRef = useRef(null);

  // Function to start the timer
  const playTimer = () => {
    if (minutes === 0 && seconds === 0) {
      closeTimer();
    } else {
      setIsActive(true);
    }
  };

  // Function to pause the timer
  const pauseTimer = () => {
    setIsActive(false);
  };

  const closeTimer = () => {
    setIsActive(false);
    setTimerEnded(true);
  };

  const updateBreakSession = () => {
    const currentUserId = user.uid
    const userRef = firestore().collection('users').doc(currentUserId);
    const breakDuration = parseInt(shortBreakTimer.minutes) * 60; // Convert minutes to seconds

    userRef.update({
      overallBreakTime: firestore.FieldValue.increment(breakDuration / 60), // Convert seconds to minutes
      overallBreakSessions: firestore.FieldValue.increment(1),
    });
  };

  const navigateToPomodoroTimer = () => {
    // Ensure the timer is not running
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
     Toast.show('Time To Study!', Toast.LONG);

    // Navigate back to the Pomodoro Timer screen
    navigation.reset({
      index: 0,
      routes: [{name: 'PomodoroTimer'}],
    });
  };

  // Update the timer every second
  const updateTimer = () => {
    setSeconds(prevSeconds => {
      if (prevSeconds === 0) {
        if (minutes === 0) {
          pauseTimer();
          setTimerEnded(true); // Set timerEnded to true when timer finishes
          updateBreakSession(); // Update Firestore only when the timer finishes naturally
          return 0;
        } else {
          setMinutes(prevMinutes => prevMinutes - 1);
          return 59;
        }
      } else {
        return prevSeconds - 1;
      }
    });
  };


  // Effect to handle the timer
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(updateTimer, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, seconds]);

  useEffect(() => {
    if (timerEnded) {
      navigateToPomodoroTimer();
    }
  }, [timerEnded, navigation]);

  useEffect(() => {
    // Automatically start the timer if isAutomaticBreakOn is true
    if (isAutomaticBreakOn) {
      playTimer();
    }
  }, [isAutomaticBreakOn]);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="white"
        barStyle="dark-content" // This makes the text and icons dark
      />
      <View style={styles.toolbar}>
        <Text style={styles.toolbarHeading}>Break Time</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.pomodoroInfo}>
          <Text style={styles.label}>Times Up!</Text>
        </View>
        <View style={styles.pomodoroTimerContainer}>
          <Text style={styles.minutes}>{String(minutes).padStart(2, '0')}</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.seconds}>{String(seconds).padStart(2, '0')}</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={pauseTimer}
            activeOpacity={0.8}
            disabled={!isActive}>
            <View style={!isActive ? styles.disabledButton : styles.pause}>
              <Ionicons
                name="pause"
                size={30}
                color={!isActive ? '#aaa' : '#FF6B6B'} // Grey out when disabled
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={closeTimer} activeOpacity={0.8}>
            <View style={styles.close}>
              <Ionicons
                name="close"
                size={30}
                color="#1F78B4" // Grey out when disabled
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={playTimer}
            activeOpacity={0.8}
            disabled={isActive}>
            <View style={isActive ? styles.disabledButton : styles.play}>
              <Ionicons
                name="play"
                size={30}
                color={isActive ? '#aaa' : '#00818E'} // Grey out when disabled
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PomodoroBreakScreen;
