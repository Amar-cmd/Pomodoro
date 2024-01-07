import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, View, Alert} from 'react-native';
import styles from './style';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Cell = ({cellHeading, time}) => {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellHeading}>{cellHeading}</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.textValue}>{time}</Text>
      </View>
    </View>
  );
};

const CatMockScreen = () => {
  // Assuming 1 minute for each section for demonstration
  const initialVarcTime = 1; // Update to 60 for a full minute
  const initialDilrTime = 1; // Update to 60 for a full minute
  const initialQaTime = 1; // Update to 60 for a full minute

  const [varcTime, setVarcTime] = useState(initialVarcTime);
  const [dilrTime, setDilrTime] = useState(initialDilrTime);
  const [qaTime, setQaTime] = useState(initialQaTime);
  const [activeTimer, setActiveTimer] = useState(null);
  const [alertShown, setAlertShown] = useState(false); // New state to track if alert has been shown

  const resetTimers = () => {
    setVarcTime(initialVarcTime);
    setDilrTime(initialDilrTime);
    setQaTime(initialQaTime);
    setActiveTimer(null); // Reset the active timer
    setAlertShown(false); // Reset the alert shown state
  };

  const startPress = () => {
    Alert.alert(
      'PLEDGE!',
      'I will not interrupt myself for next 2 hours at any cost.',
      [
        {
          text: 'Confirm',
          onPress: () => {
            resetTimers(); // Reset timers to original time before starting
            setActiveTimer('varc'); // Start VARC timer
          },
        },
      ],
    );
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };

  useEffect(() => {
    let interval = null;

    if (activeTimer === 'varc' && varcTime > 0) {
      interval = setInterval(() => {
        setVarcTime(varcTime - 1);
      }, 1000);
    } else if (activeTimer === 'dilr' && dilrTime > 0) {
      interval = setInterval(() => {
        setDilrTime(dilrTime - 1);
      }, 1000);
    } else if (activeTimer === 'qa' && qaTime > 0) {
      interval = setInterval(() => {
        setQaTime(qaTime - 1);
      }, 1000);
    } else {
      clearInterval(interval);

      if (activeTimer === 'varc') setActiveTimer('dilr');
      else if (activeTimer === 'dilr') setActiveTimer('qa');
      else if (activeTimer === 'qa' && !alertShown) {
        setAlertShown(true); // Set alert as shown
        Alert.alert('Time is up!', 'All sections are complete.', [
          {text: 'OK', onPress: resetTimers}, // Reset timers when acknowledged
        ]);
      }
    }

    return () => clearInterval(interval);
  }, [activeTimer, varcTime, dilrTime, qaTime, alertShown]);

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        {!activeTimer ? (
          <View style={styles.toolbarIcon}>
            <Ionicons name="chevron-back-outline" size={30} color="#00818E" />
          </View>
        ) : (
          <View style={styles.toolbarIcon}>
            <Text style={styles.toolbarHeading}></Text>
          </View>
        )}

        <Text style={styles.toolbarHeading}>CAT MOCK MODE</Text>
        <Text style={styles.toolbarHeading}></Text>
      </View>

      <View style={styles.timerContainer}>
        <Cell cellHeading="VARC" time={formatTime(varcTime)} />
        <Cell cellHeading="DILR" time={formatTime(dilrTime)} />
        <Cell cellHeading="QA" time={formatTime(qaTime)} />
      </View>

      {!activeTimer && (
        <View style={styles.start}>
          <TouchableOpacity onPress={startPress}>
            <Text style={styles.startButton}>START</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CatMockScreen;
