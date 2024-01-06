import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StatusBar, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';

const PomodoroBreakScreen = ({navigation}) => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Using a ref to track the interval ID
  const intervalRef = useRef(null);

  // Function to start the timer
  const playTimer = () => {
    if (minutes === 0 && seconds === 0) {
      closeTimer();
    }
    setIsActive(true);
  };

  // Function to pause the timer
  const pauseTimer = () => {
    setIsActive(false);
  };

  const closeTimer = () => {
    setMinutes(5);
    setSeconds(0);
    // navigation.goBack();
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
          // Timer finished
          pauseTimer();
          return 0;
        } else {
          // Move to the next minute
          setMinutes(prevMinutes => prevMinutes - 1);
          return 59;
        }
      } else {
        // Decrement seconds
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
  }, [isActive]); // Only re-run the effect if isActive changes

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
