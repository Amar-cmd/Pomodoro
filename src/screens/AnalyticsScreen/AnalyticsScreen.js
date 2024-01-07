import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useUser} from '../../context/UserContext'
import styles from './style';

const SessionInfo = ({heading, score}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
};

const AnalyticsScreen = ({navigation}) => {
  const {user} = useUser();
  const currentUser = user; // Get the currently signed-in user

  const [todaySessions, setTodaySessions] = useState('00');
  const [todayTime, setTodayTime] = useState('00:00:00');

  const goBack = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'PomodoroTimer'}],
    });
  }
  useEffect(() => {
    if (currentUser) {
      const today = new Date();
      const dateString = `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}`;

      // Reference to the user's daily aggregate document for today
      const dailyRef = firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('aggregates')
        .doc('daily')
        .collection(dateString)
        .doc('summary');

      // Fetch the data
      dailyRef
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            console.log(data);
            setTodaySessions(data.totalSessions.toString()); // Update total sessions
            setTodayTime(formatTime(data.totalTime)); // Update total time with formatting
          } else {
            // Handle case where there is no data for today
            console.log('No data for today');
          }
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
        });
    }
  }, []);

  // Function to format time in HH:MM
  function formatTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    console.log(totalMinutes);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={goBack}>
          <View style={styles.toolbarIcon}>
            <Ionicons name="chevron-back-outline" size={30} color="#00818E" />
          </View>
        </TouchableOpacity>
        <Text style={styles.toolbarHeading}>Analytics</Text>
        <Text></Text>
      </View>
      <SessionInfo heading="Today's Sessions" score={todaySessions} />
      <SessionInfo heading="Today's Time" score={todayTime} />
    </View>
  );
};


export default AnalyticsScreen;
