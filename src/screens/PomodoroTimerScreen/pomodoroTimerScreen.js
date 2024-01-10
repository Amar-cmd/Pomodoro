import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Modal,
  FlatList,
  Vibration,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';
import {usePomodoro} from '../../context/PomodoroContext'; // Adjust the import path as necessary
import Toast from 'react-native-simple-toast'; // Make sure to install this package
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../context/UserContext';

const handleLogout = () => {
  auth()
    .signOut()
    .then(() => {
      console.log('User signed out!');
      // Optionally: navigate the user to the login screen
    })
    .catch(error => {
      console.error('Logout error:', error);
      Toast.show('Logout failed. Please try again.', Toast.LONG);
    });
};

const OptionButton = ({onPress, iconName, text}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <View style={styles.optionContainer}>
        <Ionicons name={iconName} size={30} color="#00818E" />
        <Text style={styles.optionText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getCurrentDateFormatted = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};


const PomodoroTimerScreen = ({navigation}) => {
  const buttons = [
    {
      key: '1',
      text: 'Statistics',
      iconName: 'stats-chart',
      onPress: () => navigation.navigate('StatisticsScreen'),
    },
    {
      key: '2',
      text: 'Settings',
      iconName: 'settings',
      onPress: () => navigation.navigate('SettingScreen'),
    },
    {
      key: '3',
      text: 'Analytics',
      iconName: 'analytics',
      onPress: () => navigation.navigate('AnalyticsScreen'),
    },
    {
      key: '4',
      text: 'CAT Mock',
      iconName: 'book',
      onPress: () => navigation.navigate('CatMockScreen'),
    },
    {
      key: '5',
      text: 'Logout',
      iconName: 'log-out',
      onPress: handleLogout,
    },
    // {
    //   key: '6',
    //   text: 'Motivation',
    //   iconName: 'infinite',
    //   onPress: handleLogout,
    // },
    // Add more items as needed
  ];

  const {settings} = usePomodoro();
  const {user} = useUser();

  const currentUserId = user.uid;

  const {minutes: initialMinutes, seconds: initialSeconds} =
    settings.pomodoroTimer;

  const [minutes, setMinutes] = useState(parseInt(initialMinutes));
  const [seconds, setSeconds] = useState(parseInt(initialSeconds));

  const [isActive, setIsActive] = useState(false);
  const [rounds, setRounds] = useState(0); // State to track completed rounds
  const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [timerEnded, setTimerEnded] = useState(false); // New state to track if timer ended

  const currentLabel = settings.currentInputLabel || 'DI'; // Default to 'Label' if not set

  // Using a ref to track the interval ID
  const intervalRef = useRef(null);

  // Reset timer to initial state
  const resetTimer = () => {
    setMinutes(parseInt(initialMinutes));
    setSeconds(parseInt(initialSeconds));
  };

  // Effect to handle timer settings change
  useEffect(() => {
    if (!isActive) {
      setMinutes(parseInt(initialMinutes));
      setSeconds(parseInt(initialSeconds));
    }
  }, [initialMinutes, initialSeconds]);

  // Function to start the timer
  const playTimer = () => {
    if (minutes === 0 && seconds === 0) {
      resetTimer(); // Resets the timer if it's finished
    }
    setIsActive(true);
  };

  // Function to pause the timer
  const pauseTimer = () => {
    setIsActive(false);
  };

  // Function to toggle the modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Update the timer every second
  // Update the timer every second
  const updateTimer = () => {
    setSeconds(prevSeconds => {
      if (prevSeconds === 0) {
        if (minutes === 0) {
          // Timer finished
          pauseTimer();
          setRounds(prevRounds => prevRounds + 1); // Increase rounds by 1
          setTimerEnded(true); // Update state when timer ends instead of navigating
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
    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [isActive, seconds]);

  const getWeekRef = date => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    const weekNumber = Math.ceil(
      (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7,
    );
    return `${date.getFullYear()}-W${weekNumber}`;
  };


  //! Firestore functions
  const fetchSessionCount = async label => {
    const currentDate = getCurrentDateFormatted();
    const userId = user.uid; // Assuming 'user' is the currently logged-in user object

    try {
      const doc = await firestore()
        .collection('users')
        .doc(userId)
        .collection('aggregates')
        .doc('daily')
        .collection(currentDate)
        .doc(label)
        .get();

      if (doc.exists) {
        const data = doc.data();
        return data.session || 0; // Return the session count
      } else {
        return 0; // Return 0 if no data found
      }
    } catch (error) {
      console.error('Error fetching session data:', error);
      return 0; // Return 0 in case of error
    }
  };

  // Function to be called when a timer session ends
  const onTimerEnd = (label, type) => {
    if (settings.isVibrationOn) Vibration.vibrate(1000);
    const endTime = Date.now(); // End time is the current time
    const sessionDuration = initialMinutes * 60 * 1000; // Duration of the session in milliseconds

    // Define the userRef here within the function scope
    const userRef = firestore().collection('users').doc(currentUserId);

    // Only proceed if it's a work session
    if (type === 'work') {
      // Update the overall study time and sessions in the user's document
      userRef.update({
        overallStudyTime: firestore.FieldValue.increment(
          sessionDuration / 60000,
        ), // Convert ms to minutes
        overallStudySessions: firestore.FieldValue.increment(1),
      });

      // Define the path for the aggregates collection
      const today = new Date();
      const dateString = `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}`;
      const aggregatesRef = userRef
        .collection('aggregates')
        .doc('daily')
        .collection(dateString);

      const weekRef = getWeekRef(new Date());
      const weeklyAggregatesRef = userRef
        .collection('aggregates')
        .doc('weekly')
        .collection(weekRef);

      // Correct the monthly reference
      const monthRef = `${today.getFullYear()}-${today.getMonth() + 1}`;
      const monthlyAggregatesRef = userRef
        .collection('aggregates')
        .doc('monthly')
        .collection(monthRef);

      // Check if the label is one of the subjects for monthly aggregates
      if (['DI', 'LR', 'QA', 'VARC', 'TA'].includes(label)) {
        const monthlySubjectRef = monthlyAggregatesRef.doc(label);
        monthlySubjectRef.get().then(doc => {
          if (doc.exists) {
            // Update existing document
            monthlySubjectRef.update({
              session: firestore.FieldValue.increment(1),
              time: firestore.FieldValue.increment(sessionDuration / 60000), // Convert ms to minutes
            });
          } else {
            // Create a new document if it doesn't exist
            monthlySubjectRef.set({
              session: 1,
              time: sessionDuration / 60000, // Convert ms to minutes
            });
          }
        });
      }

      // Check if the label is one of the subjects for weekly aggregates
      if (['DI', 'LR', 'QA', 'VARC', 'TA'].includes(label)) {
        const weeklySubjectRef = weeklyAggregatesRef.doc(label);
        weeklySubjectRef.get().then(doc => {
          if (doc.exists) {
            // Update existing document
            weeklySubjectRef.update({
              session: firestore.FieldValue.increment(1),
              time: firestore.FieldValue.increment(sessionDuration / 60000), // Convert ms to minutes
            });
          } else {
            // Create a new document if it doesn't exist
            weeklySubjectRef.set({
              session: 1,
              time: sessionDuration / 60000, // Convert ms to minutes
            });
          }
        });
      }

      // Check if the label is one of the subjects
      if (['DI', 'LR', 'QA', 'VARC', 'TA'].includes(label)) {
        const subjectRef = aggregatesRef.doc(label);
        subjectRef.get().then(doc => {
          if (doc.exists) {
            // Update existing document
            subjectRef.update({
              session: firestore.FieldValue.increment(1),
              time: firestore.FieldValue.increment(sessionDuration / 60000), // Convert ms to minutes
            });
          } else {
            // Create a new document if it doesn't exist
            subjectRef.set({
              session: 1,
              time: sessionDuration / 60000, // Convert ms to minutes
            });
          }
        });
      }
    }

    // Add the session to the user's pomodoros subcollection
    const pomodoroRef = userRef.collection('pomodoros').doc();
    pomodoroRef.set({
      startTime: firestore.Timestamp.fromMillis(endTime - sessionDuration),
      endTime: firestore.Timestamp.fromMillis(endTime),
      label,
      type,
    });

    // Update the aggregates (daily, weekly, monthly)
    const totalTime = sessionDuration / 60000; // Convert from milliseconds to minutes
    updateAggregate('daily', totalTime, label, endTime - sessionDuration);
    updateAggregate('weekly', totalTime, label, endTime - sessionDuration);
    updateAggregate('monthly', totalTime, label, endTime - sessionDuration);
  };

  // Function to update daily, weekly, and monthly aggregates
  const updateAggregate = (aggregateType, time, label, startTime) => {
    const userRef = firestore().collection('users').doc(currentUserId);
    const date = new Date(startTime);
    let periodRef;

    switch (aggregateType) {
      case 'daily':
        periodRef = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;
        break;
      case 'weekly':
        const weekNumber = getWeekNumber(new Date(startTime));
        periodRef = `${date.getFullYear()}-W${weekNumber}`;
        break;
      case 'monthly':
        periodRef = `${date.getFullYear()}-${date.getMonth() + 1}`;
        break;
    }

    const aggregateRef = userRef
      .collection('aggregates')
      .doc(aggregateType)
      .collection(periodRef)
      .doc('summary');

    // Update or create the aggregate document
    aggregateRef.get().then(doc => {
      if (doc.exists) {
        // If document exists, increment totalSessions and totalTime and update labels
        aggregateRef.update({
          totalSessions: firestore.FieldValue.increment(1),
          totalTime: firestore.FieldValue.increment(time),
          [`labels.${label}`]: firestore.FieldValue.increment(time),
        });
      } else {
        // If document does not exist, set initial values
        aggregateRef.set({
          totalSessions: 1,
          totalTime: time,
          labels: {[label]: time},
        });
      }
    });
  };

  function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;

    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  useEffect(() => {
    if (timerEnded) {
      // Assuming 'work' as the type
      onTimerEnd(currentLabel, 'work');

      // Show a toast notification
      Toast.show('Break Time!', Toast.LONG);

      // Navigate to the PomodoroBreak screen
      navigation.navigate('PomodoroBreak');

      // Reset the state
      setTimerEnded(false);
    }
  }, [timerEnded, currentLabel, navigation]); // Dependencies array includes timerEnded, currentLabel, and navigation

  useEffect(() => {
    // Call this function whenever you need to update the rounds (e.g., on component mount or when label changes)
    const updateRounds = async () => {
      const sessionCount = await fetchSessionCount(currentLabel);
      setRounds(sessionCount);
    };

    updateRounds();
  }, [currentLabel]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.toolbar}>
        <TouchableOpacity onPress={toggleModal}>
          <View style={styles.toolbarIcon}>
            <Feather name="menu" size={30} color="#00818E" />
          </View>
        </TouchableOpacity>

        <Text style={styles.toolbarHeading}>Pomodoro Timer</Text>
        <Text></Text>
      </View>
      <View style={styles.body}>
        <View style={styles.pomodoroInfo}>
          <Text style={styles.label}>{currentLabel}</Text>
          <Text style={styles.rounds}>{rounds} Sessions</Text>
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

      {/* Modal Component */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={toggleModal} // Optional: Handle hardware back button on Android
      >
        <View style={styles.fullScreenModal}>
          <View style={styles.modalToolbar}>
            <TouchableOpacity
              onPress={toggleModal}
              style={styles.closeModalButton}>
              <Ionicons name="close" size={30} color="#00818E" />
            </TouchableOpacity>
            <Text style={styles.toolbarHeading}>Menu</Text>
            <Text style={{paddingHorizontal: 30}}></Text>
          </View>
          <FlatList
            data={buttons}
            renderItem={({item}) => (
              <OptionButton
                onPress={item.onPress}
                iconName={item.iconName}
                text={item.text}
              />
            )}
            keyExtractor={item => item.key}
            numColumns={2} // Set the number of columns
          />
        </View>
      </Modal>
    </View>
  );
};

export default PomodoroTimerScreen;
