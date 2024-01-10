import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  TextInput,
  StatusBar,
  TouchableWithoutFeedback,
  Vibration,
} from 'react-native';
import styles from './style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../context/UserContext';
import { usePomodoro } from '../../context/PomodoroContext';
import Toast from 'react-native-simple-toast';

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

const CatMockScreen = ({navigation}) => {
  const {user} = useUser();
  const {settings} = usePomodoro();
  const initialVarcTime = 1;
  const initialDilrTime = 1;
  const initialQaTime = 1;

  const [varcTime, setVarcTime] = useState(initialVarcTime);
  const [dilrTime, setDilrTime] = useState(initialDilrTime);
  const [qaTime, setQaTime] = useState(initialQaTime);
  const [activeTimer, setActiveTimer] = useState(null);
  const [alertShown, setAlertShown] = useState(false); // New state to track if alert has been shown
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const resetTimers = () => {
    setVarcTime(initialVarcTime);
    setDilrTime(initialDilrTime);
    setQaTime(initialQaTime);
    setActiveTimer(null); // Reset the active timer
    setAlertShown(false); // Reset the alert shown state
  };

  const storeMarks = () => {
    // Check if inputValue is a valid number
    if (!isNaN(inputValue)) {
      const mark = parseInt(inputValue);
      // Update Firestore document
      firestore()
        .collection('users')
        .doc(user.uid) // Use the UID of the logged in user
        .update({
          marks: firestore.FieldValue.arrayUnion(mark),
        })
        .then(() => {
          Toast.show('Marks updated successfully', Toast.SHORT);
        })
        .catch(error => {
          Alert.alert('Error updating marks', error);
        });
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid number');
    }
  };

  const handleMarksEnterPress = () => {
    storeMarks();
    setCustomAlertVisible(false); // Hide the modal
  };

  const showCustomModal = () => {
    setCustomAlertVisible(true);
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

  const goBack = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'PomodoroTimer'}],
    });
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
        if (settings.isVibrationOn) Vibration.vibrate(1000);
        Alert.alert('Time is up!', 'All sections are complete.', [
          {text: 'OK', onPress: resetTimers}, // Reset timers when acknowledged
        ]);
      }
    }

    return () => clearInterval(interval);
  }, [activeTimer, varcTime, dilrTime, qaTime, alertShown]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.toolbar}>
        {!activeTimer ? (
          <TouchableOpacity onPress={goBack} activeOpacity={0.8}>
            <View style={styles.toolbarIcon}>
              <Ionicons name="chevron-back-outline" size={30} color="#00818E" />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.toolbarIcon}>
            <Text style={styles.toolbarHeading}></Text>
          </View>
        )}

        <Text style={styles.toolbarHeading}>CAT MOCK MODE</Text>
        <TouchableOpacity onPress={showCustomModal} activeOpacity={0.8}>
          <View style={styles.toolbarIcon}>
            <MaterialCommunityIcons
              name="scoreboard-outline"
              size={30}
              color="#00818E"
            />
          </View>
        </TouchableOpacity>
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={customAlertVisible}
        onRequestClose={() => {
          setCustomAlertVisible(false);
        }}>
        <TouchableWithoutFeedback onPress={() => setCustomAlertVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Enter Marks Scored.</Text>
              <TextInput
                style={styles.input}
                onChangeText={setInputValue}
                value={inputValue}
                keyboardType="numeric"
                maxLength={3}
              />
              <TouchableOpacity
                onPress={handleMarksEnterPress}
                disabled={inputValue.trim() === ''}>
                <Text
                  style={[
                    inputValue.trim() === ''
                      ? styles.disabledButton
                      : styles.okButtonText,
                  ]}>
                  ENTER
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default CatMockScreen;
